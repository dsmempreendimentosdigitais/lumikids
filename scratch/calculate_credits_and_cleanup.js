const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const FloraModule = require('@flora-ai/flora');
const Flora = FloraModule.default || FloraModule;

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let projectId = '', clientEmail = '', privateKey = '', floraKey = '';
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
    if (k === 'FLORA_AI_API_KEY') floraKey = v;
  }
});

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey })
});
const db = admin.firestore();
const flora = new Flora({ apiKey: floraKey });

async function analyze() {
  console.log('--- 1. CONSULTANDO CONTA FLORA.AI ---');
  try {
    const workspaces = await flora.workspaces.list();
    console.log('Workspaces:', JSON.stringify(workspaces, null, 2));
  } catch (e) {
    console.error('Erro ao consultar workspace flora:', e.message);
  }

  try {
    const models = await flora.models.list();
    const nanoModel = models?.models?.find(m => m.model_id === 't2i-elote-gateway');
    console.log('Modelo Nano Banana 2.1:', {
      model_id: nanoModel?.model_id,
      name: nanoModel?.name,
      estimated_credits: nanoModel?.estimated_credits,
      estimated_cost_usd: nanoModel?.estimated_cost_usd
    });
  } catch (e) {
    console.error('Erro modelo flora:', e.message);
  }

  console.log('\n--- 2. ANALISANDO TODAS AS HISTÓRIAS NO FIRESTORE ---');
  const snap = await db.collection('stories').get();
  let totalStories = snap.size;
  let totalScenes = 0;
  let storiesList = [];

  snap.forEach(doc => {
    const data = doc.data();
    const scenes = data.content?.paragraphs?.length || 0;
    // Cada história precisa de 1 imagem por cena + 1 imagem para a capa = scenes + 1
    const imagesNeeded = scenes + 1;
    totalScenes += scenes;
    storiesList.push({
      id: doc.id,
      title: data.title,
      category: data.category,
      scenes: scenes,
      imagesNeeded: imagesNeeded
    });
  });

  const totalImages = totalScenes + totalStories;
  const creditsPerImage = 58;
  const usdPerImage = 0.0522;

  const totalCreditsNeeded = totalImages * creditsPerImage;
  const totalUsdNeeded = totalImages * usdPerImage;

  console.log(`Total de histórias: ${totalStories}`);
  console.log(`Total de cenas: ${totalScenes}`);
  console.log(`Total de capas: ${totalStories}`);
  console.log(`TOTAL DE IMAGENS A GERAR: ${totalImages}`);
  console.log(`\nCUSTO ESTIMADO:`);
  console.log(`- Créditos por imagem: ${creditsPerImage} créditos`);
  console.log(`- Total de créditos necessários: ${totalCreditsNeeded.toLocaleString()} créditos`);
  console.log(`- Custo estimado em USD: $${totalUsdNeeded.toFixed(2)} USD (R$ ${(totalUsdNeeded * 5.75).toFixed(2)})`);

  // Se gerarmos apenas 1 imagem por história (capa) ou cenas resumidas:
  console.log(`\nCenários alternativos:`);
  console.log(`- Apenas as 60 Capas: ${totalStories * creditsPerImage} créditos ($${(totalStories * usdPerImage).toFixed(2)} USD)`);
  
  return {
    totalStories,
    totalScenes,
    totalImages,
    creditsPerImage,
    totalCreditsNeeded,
    totalUsdNeeded
  };
}

analyze().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
