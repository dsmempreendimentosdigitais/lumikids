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
  let missing = [];
  let total = 0;

  snap.forEach(d => {
    const paras = d.data().content?.paragraphs || [];
    total += paras.length;
    paras.forEach((p, idx) => {
      const pth = path.join(process.cwd(), 'public', 'stories', d.id, `scene-${idx}.jpg`);
      if (!fs.existsSync(pth) || fs.statSync(pth).size < 10000) {
        missing.push({ storyId: d.id, title: d.data().title, index: idx, p });
      }
    });
  });

  console.log(`Total de cenas em todo o banco: ${total}`);
  console.log(`Cenas salvas e perfeitas no disco: ${total - missing.length}`);
  console.log(`Cenas faltando / com erro temporário: ${missing.length}`);
  return missing;
}

check().then(() => process.exit(0)).catch(console.error);
