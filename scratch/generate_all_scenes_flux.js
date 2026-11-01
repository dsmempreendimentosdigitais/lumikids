const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let projectId = '', clientEmail = '', privateKey = '';
envConfig.split('\n').forEach(line => {
  const t = line.trim();
  if (t && !t.startsWith('#') && t.includes('=')) {
    const idx = t.indexOf('=');
    const k = t.slice(0, idx).trim();
    let v = t.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') projectId = v;
    if (k === 'FIREBASE_CLIENT_EMAIL') clientEmail = v;
    if (k === 'FIREBASE_PRIVATE_KEY') privateKey = v.replace(/\\n/g, '\n');
  }
});

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey })
});
const db = admin.firestore();

function cleanSceneText(text) {
  return (text || '')
    .replace(/[*_#~`"']/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180);
}

function buildPuffinRockScenePrompt(scene, storyTitle, category) {
  const baseDesc = scene.imagePrompt || cleanSceneText(scene.text);
  return `Charming 2D children storybook illustration in the visual style of Puffin Rock, ${baseDesc}, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and sage green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text`;
}

async function fetchFluxImage(prompt, seed) {
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?model=flux&nologo=true&seed=${seed}`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(28000) });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 5000) return buf;
      }
    } catch (e) {
      console.warn(`   Tentativa ${attempt} falhou: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error('Falha ao gerar imagem FLUX após 3 tentativas');
}

async function generateAllScenes() {
  console.log('🌿 [FLUX Gratuito - Puffin Rock] Iniciando pré-geração de todas as cenas internas...\n');

  const snap = await db.collection('stories').get();
  const stories = [];
  snap.forEach(d => stories.push({ id: d.id, ...d.data() }));

  console.log(`Total de histórias para processar: ${stories.length}\n`);

  let totalImagesGenerated = 0;
  let totalImagesSkipped = 0;
  let totalErrors = 0;

  for (let sIdx = 0; sIdx < stories.length; sIdx++) {
    const story = stories[sIdx];
    const paragraphs = story.content?.paragraphs || [];
    const storyDir = path.join(process.cwd(), 'public', 'stories', story.id);

    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    console.log(`\n======================================================`);
    console.log(`[História ${sIdx + 1}/${stories.length}] "${story.title}" (${paragraphs.length} cenas)`);

    let storyUpdated = false;
    const seedBase = 3000 + (sIdx * 40);

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const p = paragraphs[pIdx];
      const sceneFileName = `scene-${pIdx}.jpg`;
      const scenePath = path.join(storyDir, sceneFileName);
      const sceneUrl = `/stories/${story.id}/${sceneFileName}`;

      if (fs.existsSync(scenePath) && fs.statSync(scenePath).size > 5000) {
        // Já existe
        if (p.imageUrl !== sceneUrl) {
          p.imageUrl = sceneUrl;
          storyUpdated = true;
        }
        totalImagesSkipped++;
        continue;
      }

      const prompt = buildPuffinRockScenePrompt(p, story.title, story.category);
      console.log(`  -> [Cena ${pIdx + 1}/${paragraphs.length}] Gerando via FLUX...`);

      try {
        const seed = seedBase + pIdx;
        const buf = await fetchFluxImage(prompt, seed);
        fs.writeFileSync(scenePath, buf);
        console.log(`     💾 Salva: ${sceneUrl} (${buf.length} bytes)`);

        p.imageUrl = sceneUrl;
        storyUpdated = true;
        totalImagesGenerated++;

        // Pequeno intervalo entre requisições
        await new Promise(r => setTimeout(r, 600));
      } catch (err) {
        console.error(`     ❌ Erro na cena ${pIdx + 1}:`, err.message);
        totalErrors++;
      }
    }

    if (storyUpdated) {
      await db.collection('stories').doc(story.id).update({
        'content.paragraphs': paragraphs,
        imagesPreGenerated: true,
        updatedAt: new Date()
      });
      console.log(`  ✨ Firestore atualizado com as novas URLs das cenas!`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 [CONCLUÍDO COM SUCESSO!]');
  console.log(`Imagens geradas: ${totalImagesGenerated}`);
  console.log(`Imagens puladas (já existiam): ${totalImagesSkipped}`);
  console.log(`Erros: ${totalErrors}`);
}

generateAllScenes().then(() => process.exit(0)).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
