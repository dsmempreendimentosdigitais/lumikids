const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let apiKey = '', projectId = '', clientEmail = '', privateKey = '';
envConfig.split('\n').forEach(line => {
  const t = line.trim();
  if (t && !t.startsWith('#') && t.includes('=')) {
    const idx = t.indexOf('=');
    const k = t.slice(0, idx).trim();
    let v = t.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k === 'GEMINI_API_KEY') apiKey = v;
    if (k === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') projectId = v;
    if (k === 'FIREBASE_CLIENT_EMAIL') clientEmail = v;
    if (k === 'FIREBASE_PRIVATE_KEY') privateKey = v.replace(/\\n/g, '\n');
  }
});

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey })
});
const db = admin.firestore();

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite'
];

async function generateCompleteStory(story) {
  const categoryGuidance = {
    'mitologia-grega': 'Ambientação clássica na Grécia Antiga, heroísmo clássico, respeito aos mestres, superação e sabedoria sem elementos sombrios.',
    'biblia-kids': 'Reverência sagrada, fé inabalável, misericórdia, detalhes históricos e culturais da época bíblica, amor a Deus e ao próximo.',
    'mulheres-fortes': 'Riqueza e precisão histórica (Brasil Colonial/Imperial, Egito Antigo, China, Europa), valorizando a coragem, perseverança e inteligência real.',
    'biografias-historicas': 'Detalhes inspiradores da infância real, superação de adversidades, amor aos livros, humildade, legado para a humanidade.',
    'inventores-genios': 'Curiosidade científica, experimentos fascinantes, tentativas e erros, perseverança e invenções reais.',
    'contos-de-herois': 'Narrativa clássica com animais sábios e amigos, diálogos expressivos e moral profunda (estilo Esopo e La Fontaine).',
    'virtudes-em-acao': 'Situações práticas do cotidiano e sabedoria milenar, empatia, bondade, honestidade, amor em família.',
    'natureza-animais': 'Beleza exuberante dos biomas (Pantanal, Amazônia, Cerrado), respeito aos animais e preservação da natureza.'
  }[story.category] || 'Narrativa infantil edificante, rica e calorosa.';

  const prompt = `Você é um consagrado escritor de literatura infantojuvenil clássica e virtuosa (como C.S. Lewis e Monteiro Lobato).
Sua missão é escrever a versão COMPLETA, PROFUNDA E EMOCIONANTE da seguinte história para pais e filhos lerem juntos:

TÍTULO: "${story.title}"
CATEGORIA: ${story.category}
VALOR MORAL: ${story.value || 'virtude e sabedoria'}
DIRETRIZES DA CATEGORIA: ${categoryGuidance}

REQUISITOS OBRIGATÓRIOS:
1. EXTENSÃO E RITMO: A história DEVE ter entre 14 e 18 cenas substanciais (extensão total entre 850 e 1.250 palavras). A leitura completa DEVE durar entre 6 e 9 minutos (nunca menos de 5 minutos!).
2. ESTRUTURA DE CADA CENA: Cada cena deve ser um parágrafo envolvente de 3 a 5 frases ricas (cerca de 300 a 450 caracteres), com descrições sensoriais de ambientes, diálogos carinhosos e reflexões morais inspiradoras.
3. PROIBIÇÃO ABSOLUTA: É ESTRITAMENTE PROIBIDO usar palavras como "magia", "mágico", "mundo mágico", "encantado", feitiçarias ou qualquer conotação esotérica. Use conceitos de SABEDORIA, FÉ, CORAGEM, AMOR, DEDICAÇÃO e BONDADE.
4. PROMPTS DE ILUSTRAÇÃO: Para cada cena, escreva um "imagePrompt" em inglês detalhando o momento para uma ilustração 2D aconchegante no estilo de Puffin Rock (16:9 widescreen, animais ou personagens expressivos, texturas de gouache, cores terrosas e suaves).

RETORNE EXCLUSIVAMENTE UM OBJETO JSON VÁLIDO:
{
  "scenes": [
    {
      "text": "Texto completo e caloroso da cena...",
      "imagePrompt": "Detailed scene description in English for Puffin Rock 2D storybook illustration..."
    }
  ]
}`;

  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 65000);

        const res = await fetch(url, {
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

        clearTimeout(timeout);

        if (!res.ok) {
          const t = await res.text();
          throw new Error(`[${model}] HTTP ${res.status}: ${t.slice(0, 100)}`);
        }

        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!raw) throw new Error('Resposta vazia');

        const parsed = JSON.parse(raw);
        if (!parsed.scenes || !Array.isArray(parsed.scenes) || parsed.scenes.length < 12) {
          throw new Error(`Número insuficiente de cenas: ${parsed.scenes?.length}`);
        }

        return parsed.scenes;
      } catch (err) {
        console.warn(`[${model}] Tentativa ${attempt} falhou: ${err.message}`);
        await new Promise(r => setTimeout(r, 1200));
      }
    }
  }

  throw new Error(`Falha em todos os modelos para: "${story.title}"`);
}

async function expandAllShortStories() {
  console.log('📖 [Expansão de Histórias] Iniciando aprofundamento das histórias curtas no Firestore...\n');

  const snap = await db.collection('stories').get();
  const allStories = [];
  snap.forEach(d => allStories.push({ id: d.id, ...d.data() }));

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < allStories.length; i++) {
    const story = allStories[i];
    const currentWords = (story.content?.text || '').split(/\s+/).filter(Boolean).length;
    const currentScenes = story.content?.paragraphs?.length || 0;

    // Já é completa? (>= 12 cenas e >= 700 palavras)
    if (currentScenes >= 12 && currentWords >= 700) {
      console.log(`[${i + 1}/${allStories.length}] ⏭️  Pulando "${story.title}" (Já possui ${currentScenes} cenas e ${currentWords} palavras)`);
      skipped++;
      continue;
    }

    console.log(`\n[${i + 1}/${allStories.length}] ✍️  Expandindo "${story.title}" (${story.category}) | Atual: ${currentScenes} cenas, ${currentWords} palavras...`);

    try {
      const richScenes = await generateCompleteStory(story);

      const paragraphs = richScenes.map((scene, idx) => ({
        index: idx,
        text: scene.text.trim(),
        startTime: idx * 6000,
        endTime: (idx + 1) * 6000,
        isHighlight: idx % 3 === 0,
        imagePrompt: scene.imagePrompt,
        imageUrl: story.content?.paragraphs?.[idx]?.imageUrl || `/stories/${story.id}/scene-${idx}.jpg`
      }));

      const fullText = richScenes.map(s => s.text.trim()).join('\n\n');
      const totalWords = fullText.split(/\s+/).filter(Boolean).length;
      const durationMinutes = Math.max(6, Math.round(totalWords / 125));

      await db.collection('stories').doc(story.id).update({
        'content.text': fullText,
        'content.paragraphs': paragraphs,
        durationMinutes,
        updatedAt: new Date()
      });

      updated++;
      console.log(`   ✨ Concluída! Nova versão: ${paragraphs.length} cenas | ${totalWords} palavras | ~${durationMinutes} min de leitura.`);

      await new Promise(r => setTimeout(r, 600));
    } catch (err) {
      console.error(`   ❌ Falha ao expandir "${story.title}":`, err.message);
      errors++;
    }
  }

  console.log('\n======================================================');
  console.log('🎉 [Expansão de Histórias] FINALIZADA!');
  console.log(`Histórias expandidas: ${updated}`);
  console.log(`Histórias já completas: ${skipped}`);
  console.log(`Erros: ${errors}`);
}

expandAllShortStories().then(() => process.exit(0)).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
