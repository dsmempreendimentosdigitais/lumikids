const fs = require('fs');
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

async function run() {
  const snap = await db.collection('stories').get();
  let completeCount = 0;
  let shortCount = 0;

  console.log(`--- ANÁLISE DE EXTENSÃO DAS HISTÓRIAS (Total: ${snap.size}) ---`);
  snap.forEach(d => {
    const data = d.data();
    const words = (data.content?.text || '').split(/\s+/).filter(Boolean).length;
    const scenes = data.content?.paragraphs?.length || 0;
    const isComplete = scenes >= 12 && words >= 700;
    if (isComplete) {
      completeCount++;
      console.log(`✅ COMPLETA: "${data.title}" -> ${scenes} cenas | ${words} palavras (~${Math.round(words/125)} min)`);
    } else {
      shortCount++;
      console.log(`⚠️ CURTA:    "${data.title}" -> ${scenes} cenas | ${words} palavras (~${Math.max(1, Math.round(words/125))} min)`);
    }
  });

  console.log(`\nResumo:`);
  console.log(`- Histórias já completas (>= 12 cenas e >= 700 palavras): ${completeCount}`);
  console.log(`- Histórias curtas que precisam ser expandidas: ${shortCount}`);
}

run().then(() => process.exit(0)).catch(console.error);
