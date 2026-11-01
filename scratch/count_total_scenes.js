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
  let totalScenes = 0;
  snap.forEach(d => {
    totalScenes += (d.data().content?.paragraphs?.length || 0);
  });
  console.log(`Total de cenas em todas as ${snap.size} histórias expandidas: ${totalScenes}`);
}

run().then(() => process.exit(0)).catch(console.error);
