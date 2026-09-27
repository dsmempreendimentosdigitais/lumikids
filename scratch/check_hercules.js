const fs = require('fs');
const path = require('path');

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
  });
}

async function check() {
  const snap = await admin.firestore().collection('stories').where('title', '==', 'Os 12 Trabalhos de Hércules e a Força da Virtude').get();
  if (snap.empty) {
    console.log('Story not found.');
    return;
  }
  const data = snap.docs[0].data();
  console.log('Title:', data.title);
  console.log('Total Paragraphs:', data.content.paragraphs.length);
  data.content.paragraphs.forEach((p, i) => {
    console.log(`Page ${i + 1}: ${p.text.slice(0, 50)}...`);
    console.log(`   Image URL: ${p.imageUrl ? p.imageUrl.slice(0, 75) + '...' : 'MISSING!'}`);
  });
}

check().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
