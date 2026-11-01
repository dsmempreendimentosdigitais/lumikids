const fs = require('fs');
const admin = require('firebase-admin');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const getVal = (k) => {
  const l = lines.find(x => x.startsWith(k + '='));
  return l ? l.replace(k + '=', '').trim().replace(/^['"]|['"]$/g, '') : '';
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      clientEmail: getVal('FIREBASE_CLIENT_EMAIL'),
      privateKey: getVal('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  });
}

async function countStories() {
  const db = admin.firestore();
  const snap = await db.collection('stories').get();
  console.log(`Total stories in DB: ${snap.size}`);
  let totalParagraphs = 0;
  snap.forEach(d => {
    const data = d.data();
    totalParagraphs += data.content?.paragraphs?.length || 0;
  });
  console.log(`Total paragraphs across all stories: ${totalParagraphs}`);
  process.exit(0);
}
countStories();
