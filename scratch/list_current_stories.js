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

async function check() {
  const doc = await admin.firestore().collection('stories').doc('JgvOgCBnCdtk3tE86SpK').get();
  const data = doc.data();
  console.log('Doc keys:', Object.keys(data));
  console.log('Title:', data.title);
  console.log('Category:', data.category);
  console.log('coverImageUrl:', data.coverImageUrl);
  console.log('content keys:', Object.keys(data.content || {}));
  if (data.content?.paragraphs) {
    console.log('content.paragraphs length:', data.content.paragraphs.length);
    console.log('First paragraph:', data.content.paragraphs[0]);
  } else {
    console.log('content:', JSON.stringify(data.content, null, 2).slice(0, 500));
  }
  process.exit(0);
}
check().catch(console.error);
