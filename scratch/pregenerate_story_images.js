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

const STORY_ID = '396iy19bfOCQBuTK0aGe'; // A Coragem da Rainha Ester
const OUT_DIR = path.join(process.cwd(), 'public', 'stories', STORY_ID);
const ARTIFACT_DIR = 'C:/Users/Samuel/.gemini/antigravity/brain/0a29f114-17ae-4916-be38-0b2fbd9d80ed';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

async function fetchImageBuffer(basePrompt, seed) {
  const enhancedPrompt = `Masterpiece modern 2D children storybook illustration, vibrant clean digital art, Disney Pixar animation aesthetic, ${basePrompt}, sharp crisp outlines, rich warm colors, clean lighting, beautiful expressive character faces, highly detailed background, polished finish, 8k resolution, no sketches, no unfinished lines, no messy watercolor bleed, no deformities`;

  // 1. Tentar Cloudflare Worker
  try {
    const res = await fetch('https://lumikids-image-api.lumikidsapp.workers.dev', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer lumikids_segredo_12345',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: enhancedPrompt }),
      signal: AbortSignal.timeout(12000)
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 5000) return buf;
    }
  } catch (e) {
    console.warn('   Cloudflare Worker aviso:', e.message);
  }

  // 2. Fallback Pollinations FLUX
  try {
    const encoded = encodeURIComponent(enhancedPrompt);
    const fluxUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux&nologo=true&seed=${seed}`;
    const res = await fetch(fluxUrl, { signal: AbortSignal.timeout(18000) });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length > 5000) return buf;
    }
  } catch (e) {
    console.warn('   Pollinations FLUX aviso:', e.message);
  }

  throw new Error('Falha ao gerar imagem para o prompt: ' + basePrompt.slice(0, 50));
}

async function pregenerateStoryImages() {
  console.log(`\n🎨 [Pré-geração] Iniciando geração e armazenamento de imagens para a história: ${STORY_ID}\n`);

  const docRef = db.collection('stories').doc(STORY_ID);
  const docSnap = await docRef.get();
  if (!docSnap.exists) {
    throw new Error('História não encontrada: ' + STORY_ID);
  }

  const story = docSnap.data();
  console.log(`Título: "${story.title}" (${story.category}) - ${story.content.paragraphs.length} cenas\n`);

  const paragraphs = [...story.content.paragraphs];

  // 1. Capa
  console.log('[Capa] Gerando capa da história...');
  const coverPrompt = `Cover illustration for children book titled 'The Courage of Queen Esther', showing young beautiful Queen Esther in a magnificent Persian palace balcony overlooking ancient Susa at sunset, holding a royal scepter, sparkling crown, warm gentle expression`;
  const coverFileName = 'cover.jpg';
  const coverFilePath = path.join(OUT_DIR, coverFileName);

  let coverBuf;
  if (!fs.existsSync(coverFilePath)) {
    coverBuf = await fetchImageBuffer(coverPrompt, 777);
    fs.writeFileSync(coverFilePath, coverBuf);
    console.log(` -> Capa salva com sucesso em: /stories/${STORY_ID}/${coverFileName} (${coverBuf.length} bytes)`);
  } else {
    coverBuf = fs.readFileSync(coverFilePath);
    console.log(` -> Capa já existe em: /stories/${STORY_ID}/${coverFileName}`);
  }

  // Copia capa para artifact dir
  fs.copyFileSync(coverFilePath, path.join(ARTIFACT_DIR, `ester_cover.jpg`));

  // 2. Cenas
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const sceneFileName = `scene-${i}.jpg`;
    const sceneFilePath = path.join(OUT_DIR, sceneFileName);
    const sceneUrl = `/stories/${STORY_ID}/${sceneFileName}`;

    console.log(`[Cena ${i + 1}/${paragraphs.length}] Gerando imagem...`);

    let sceneBuf;
    if (!fs.existsSync(sceneFilePath)) {
      sceneBuf = await fetchImageBuffer(p.imagePrompt || p.text.slice(0, 150), 2000 + i);
      fs.writeFileSync(sceneFilePath, sceneBuf);
      console.log(`   Salva em: ${sceneUrl} (${sceneBuf.length} bytes)`);
      // Pequeno intervalo
      await new Promise(r => setTimeout(r, 600));
    } else {
      sceneBuf = fs.readFileSync(sceneFilePath);
      console.log(`   Já existe em: ${sceneUrl}`);
    }

    // Copia primeiras cenas para os artifacts para preview do usuário
    if (i < 6) {
      fs.copyFileSync(sceneFilePath, path.join(ARTIFACT_DIR, `ester_scene_${i}.jpg`));
    }

    // Atualiza parágrafo
    p.imageUrl = sceneUrl;
  }

  // 3. Atualizar Firestore com as URLs locais definitivas
  const finalCoverUrl = `/stories/${STORY_ID}/${coverFileName}`;
  await docRef.update({
    'content.paragraphs': paragraphs,
    coverImageUrl: finalCoverUrl,
    nanoBananaImageUrl: finalCoverUrl,
    imagesPreGenerated: true,
    updatedAt: new Date()
  });

  console.log('\n======================================================');
  console.log(`🎉 [Concluído!] Todas as ${paragraphs.length} imagens + capa foram salvas localmente!`);
  console.log(`Caminho local: public/stories/${STORY_ID}/`);
  console.log(`Firestore atualizado com URLs locais instantâneas.`);
}

pregenerateStoryImages().then(() => process.exit(0)).catch(err => {
  console.error('Erro:', err);
  process.exit(1);
});
