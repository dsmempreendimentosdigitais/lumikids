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
async function listStories() {
  const snap = await db.collection('stories').get();
  console.log(`Total de histórias: ${snap.size}`);
  snap.forEach(d => {
    const data = d.data();
    const words = (data.content?.text || '').split(/\s+/).filter(Boolean).length;
    const scenes = data.content?.paragraphs?.length || 0;
    console.log(`ID: ${d.id} | ${data.title} | ${data.category} | ${scenes} cenas | ${words} palavras`);
  });
}
listStories().then(() => process.exit(0)).catch(console.error);
