const fs = require('fs');
const path = require('path');

// Carrega .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.replace(/\\n/g, '\n');
    }
  });
}

const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

const db = admin.firestore();

function buildPrompt(childName, ageGroup, storyTitleOrScene, characterAppearance) {
  const stylePrompt = '3D Paw Patrol Pixar CGI animation style, 3D digital cartoon render, rich detailed scenery, high contrast, vivid saturated colors, bright sunny daylight, cinematic glowing highlights, crisp clean 3D character design, highly expressive 3D animated character, Octane Render, masterpiece animation';
  const rawScene = (storyTitleOrScene || '').replace(/[*_#~`"']/g, '').trim().slice(0, 180);
  const charTag = `${childName}, cute animated 7 year old boy with short brown hair, fair skin, wearing simple Greek tunic`;
  return `3D animated Paw Patrol Pixar style scene full of life, Character appearance: ${charTag}, Scene action: ${rawScene}, ${stylePrompt}, cheerful vibrant background, clear sky, no text, no watermark`;
}

async function generateImage(childName, ageGroup, scenePrompt, index) {
  const cleanPrompt = buildPrompt(childName, ageGroup, scenePrompt, '');
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const seed = 777 + (index * 43);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux-3d&enhance=false`;
  return imageUrl;
}

async function generateHerculesImages() {
  console.log('[Hercules Test] Buscando história de Hércules no Firestore...');
  const snap = await db.collection('stories').where('title', '==', 'Os 12 Trabalhos de Hércules e a Força da Virtude').get();
  
  if (snap.empty) {
    console.error('História de Hércules não encontrada.');
    return;
  }

  const doc = snap.docs[0];
  const storyData = doc.data();

  console.log(`[Hercules Test] Encontrada história: ID ${doc.id}`);
  console.log(`[Hercules Test] Gerando imagens para as ${storyData.content.paragraphs.length} páginas de Hércules...`);

  const updatedParagraphs = [];
  for (let idx = 0; idx < storyData.content.paragraphs.length; idx++) {
    const p = storyData.content.paragraphs[idx];
    console.log(`[Hercules Test] Gerando imagem para página ${idx + 1}...`);
    const imgUrl = await generateImage('Hércules', '5-7', p.imagePrompt || p.text, idx);
    console.log(`[Hercules Test] ✅ Imagem da página ${idx + 1} gerada: ${imgUrl.slice(0, 70)}...`);
    updatedParagraphs.push({
      ...p,
      imageUrl: imgUrl
    });
  }

  const coverUrl = updatedParagraphs[0].imageUrl;

  await doc.ref.update({
    'content.paragraphs': updatedParagraphs,
    coverImageUrl: coverUrl,
    nanoBananaImageUrl: coverUrl
  });

  console.log(`\n🎉 [Hercules Test] Sucesso! Todas as imagens de Hércules foram geradas e salvas no Firestore!`);
  console.log(`ID da História para visualização no app: ${doc.id}`);
}

generateHerculesImages().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
