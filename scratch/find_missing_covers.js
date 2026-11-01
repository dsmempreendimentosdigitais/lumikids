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

async function check() {
  const snap = await db.collection('stories').get();
  console.log(`Verificando capas das ${snap.size} histórias...`);
  const missing = [];
  snap.forEach(d => {
    const p = path.join(process.cwd(), 'public', 'stories', d.id, 'cover.jpg');
    if (!fs.existsSync(p)) {
      missing.push({ id: d.id, title: d.data().title, category: d.data().category });
      console.log(`❌ FALTANDO: [${d.id}] "${d.data().title}" (${d.data().category})`);
    }
  });
  console.log(`Total faltando: ${missing.length}`);
  return missing;
}

check().then(() => process.exit(0)).catch(console.error);
