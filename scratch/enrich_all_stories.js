const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8');
let apiKey = '';
let projectId = '';
let clientEmail = '';
let privateKey = '';

envConfig.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (key === 'GEMINI_API_KEY') apiKey = value;
    if (key === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') projectId = value;
    if (key === 'FIREBASE_CLIENT_EMAIL') clientEmail = value;
    if (key === 'FIREBASE_PRIVATE_KEY') privateKey = value.replace(/\\n/g, '\n');
  }
});

const admin = require('firebase-admin');
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = admin.firestore();

function generate2DImageUrl(promptText, seed) {
  const cleanPrompt = promptText.replace(/[*_#~`"']/g, '').trim();
  const encoded = encodeURIComponent(cleanPrompt);
  return `/api/ai/image?prompt=${encoded}&seed=${seed}`;
}

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite'
];

async function generateRichStoryFromGemini(storyData) {
  const categoryGuidance = {
    'mitologia-grega': 'Ambientação clássica na Grécia Antiga, linguagem épica porém calorosa para crianças, respeito, superação do orgulho e sabedoria.',
    'biblia-kids': 'Reverência sagrada, fé inabalável, misericórdia, detalhes históricos e culturais da época bíblica, amor a Deus e ao próximo.',
    'mulheres-fortes': 'Precisão e riqueza histórica da época (Antigo Egito, China Antiga, Brasil Colonial/Imperial, Europa Vitoriana), valorizando a coragem, perseverança e inteligência.',
    'biografias-historicas': 'Detalhes inspiradores da infância, superação de adversidades reais, amor ao conhecimento, humildade e legado generoso.',
    'inventores-genios': 'Curiosidade científica, experimentos fascinantes, tentativas e erros, perseverança e o desejo de melhorar a vida da humanidade.',
    'contos-de-herois': 'Narrativa clássica encantadora no estilo Hans Christian Andersen e Esopo, animais sábios, diálogos expressivos e moral profunda.',
    'virtudes-em-acao': 'Situações práticas do cotidiano infantil e de sabedoria ancestral, inteligência emocional, gentileza, paciência e honestidade.',
    'natureza-animais': 'Beleza exuberante dos biomas (Pantanal, Amazônia, oceanos), respeito à vida animal, curiosidades biológicas e preservação ambiental.'
  }[storyData.category] || 'Narrativa infantil rica, detalhada, moral e poética.';

  const prompt = `Você é um consagrado escritor de literatura infantojuvenil clássica (como C.S. Lewis, Hans Christian Andersen e Monteiro Lobato).
Sua missão é escrever a versão COMPLETA, DETALHADA E PROFUNDA da seguinte história para crianças e pais lerem juntos:

TÍTULO: "${storyData.title}"
CATEGORIA: ${storyData.category}
VALOR MORAL: ${storyData.value || 'virtude e sabedoria'}
DIRETRIZES DA CATEGORIA: ${categoryGuidance}

REQUISITOS OBRIGATÓRIOS:
1. EXTENSÃO E RIQUEZA: A história DEVE ter entre 16 e 22 cenas detalhadas (extensão total entre 1.100 e 1.600 palavras).
2. CADA CENA: Deve ser um parágrafo substancial de 3 a 5 frases ricas (cerca de 350 a 500 caracteres), contendo descrições sensoriais dos ambientes (cores, sons, cheiros), diálogos envolventes com emoção e reflexões morais edificantes.
3. RITMO DE LEITURA: A leitura completa deve durar cerca de 8 a 12 minutos, proporcionando uma experiência imersiva e inesquecível para pais e filhos na hora de dormir ou estudar.
4. PROMPTS DE ILUSTRAÇÃO: Para cada cena, escreva um "imagePrompt" em inglês detalhando uma ilustração em estilo 2D storybook clássico (iluminação suave, personagens expressivos e cativantes, cores acolhedoras).

RETORNE EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO no seguinte formato:
{
  "scenes": [
    {
      "text": "Texto completo e detalhado da cena...",
      "imagePrompt": "Detailed 2D storybook illustration prompt in English..."
    }
  ]
}`;

  for (const model of CANDIDATE_MODELS) {
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 70000);

        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7
            }
          })
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`Modelo ${model} retornou status ${res.status}: ${errText.slice(0, 150)}`);
        }

        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('Resposta vazia do modelo');

        const parsed = JSON.parse(rawText);
        if (!parsed.scenes || !Array.isArray(parsed.scenes) || parsed.scenes.length < 10) {
          throw new Error(`Número insuficiente de cenas retornado: ${parsed.scenes?.length}`);
        }

        return parsed.scenes;
      } catch (err) {
        console.warn(`[${model}] Tentativa ${attempt} falhou: ${err.message}`);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  throw new Error(`Todos os modelos falharam para a história "${storyData.title}"`);
}

async function enrichAllStories() {
  console.log('\n📖 [Enriquecimento Literário] Iniciando revisão e expansão de histórias no Firestore...\n');

  const snapshot = await db.collection('stories').get();
  const allDocs = [];
  snapshot.forEach(doc => allDocs.push({ id: doc.id, ...doc.data() }));

  console.log(`Total de histórias encontradas no banco: ${allDocs.length}`);

  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allDocs.length; i++) {
    const story = allDocs[i];
    const currentWords = (story.content?.text || '').split(/\s+/).filter(Boolean).length;
    const currentScenes = story.content?.paragraphs?.length || 0;

    // Se a história já tem 16+ cenas e 900+ palavras, consideramos completa
    if (currentScenes >= 16 && currentWords >= 900) {
      console.log(`[${i + 1}/${allDocs.length}] ⏭️  Pulando "${story.title}" (Já possui ${currentWords} palavras e ${currentScenes} cenas)`);
      skippedCount++;
      continue;
    }

    console.log(`\n[${i + 1}/${allDocs.length}] ✍️  Enriquecendo "${story.title}" (${story.category}) | Atual: ${currentWords} palavras, ${currentScenes} cenas...`);

    try {
      const richScenes = await generateRichStoryFromGemini(story);

      const seedBase = 1000 + (i * 30);
      const formattedParagraphs = richScenes.map((scene, idx) => {
        const imgUrl = generate2DImageUrl(scene.imagePrompt, seedBase + idx);
        return {
          index: idx,
          text: scene.text.trim(),
          startTime: idx * 6000,
          endTime: (idx + 1) * 6000,
          isHighlight: idx % 3 === 0,
          imagePrompt: scene.imagePrompt,
          imageUrl: imgUrl
        };
      });

      const fullText = richScenes.map(s => s.text.trim()).join('\n\n');
      const totalWords = fullText.split(/\s+/).filter(Boolean).length;
      const durationMinutes = Math.max(8, Math.round(totalWords / 125));
      const coverUrl = formattedParagraphs[0]?.imageUrl || story.coverImageUrl;

      await db.collection('stories').doc(story.id).update({
        'content.text': fullText,
        'content.paragraphs': formattedParagraphs,
        durationMinutes,
        coverImageUrl: coverUrl,
        nanoBananaImageUrl: coverUrl,
        updatedAt: new Date()
      });

      updatedCount++;
      console.log(`   ✨ Concluída! Nova versão: ${totalWords} palavras, ${formattedParagraphs.length} cenas, ~${durationMinutes} min de leitura.`);
      
      // Intervalo de 800ms
      await new Promise(r => setTimeout(r, 800));
    } catch (err) {
      console.error(`   ❌ Falha ao processar "${story.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n======================================================');
  console.log('🎉 [Enriquecimento Literário] PROCESSO FINALIZADO!');
  console.log(`Histórias atualizadas e aprofundadas: ${updatedCount}`);
  console.log(`Histórias mantidas (já completas): ${skippedCount}`);
  console.log(`Erros: ${errorCount}`);

  // Panorama final
  const finalSnapshot = await db.collection('stories').get();
  let finalWords = 0;
  finalSnapshot.forEach(doc => {
    const t = doc.data().content?.text || '';
    finalWords += t.split(/\s+/).filter(Boolean).length;
  });
  console.log(`\n📚 Média final após expansão: ~${Math.round(finalWords / finalSnapshot.size)} palavras por história (antes era 228)!`);
}

enrichAllStories().then(() => process.exit(0)).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
