const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
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
  });
}

async function analyze() {
  const snapshot = await admin.firestore().collection('stories').get();
  let totalWords = 0;
  let count = 0;
  snapshot.forEach(doc => {
    const d = doc.data();
    const text = d.content?.text || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    totalWords += words;
    count++;
    console.log(`${d.title}: ${words} palavras | ${d.content?.paragraphs?.length || 0} cenas`);
  });
  console.log(`\nTotal de histórias: ${count}`);
  console.log(`Média de palavras: ${Math.round(totalWords / count)} palavras por história.`);
  process.exit(0);
}
analyze().catch(console.error);
