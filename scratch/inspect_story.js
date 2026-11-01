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

async function inspect(id) {
  const doc = await db.collection('stories').doc(id).get();
  const d = doc.data();
  console.log('=== HISTÓRIA SELECIONADA ===');
  console.log('ID:', doc.id);
  console.log('Título:', d.title);
  console.log('Categoria:', d.category);
  console.log('Total Cenas:', d.content?.paragraphs?.length);
  console.log('Palavras:', (d.content?.text || '').split(/\s+/).filter(Boolean).length);
  console.log('Primeiras 3 cenas:');
  d.content?.paragraphs?.slice(0, 3).forEach((p, idx) => {
    console.log(`\n[Cena ${idx + 1}]`);
    console.log('Texto:', p.text);
    console.log('Prompt:', p.imagePrompt);
  });
}

inspect('396iy19bfOCQBuTK0aGe').then(() => process.exit(0)).catch(console.error);
