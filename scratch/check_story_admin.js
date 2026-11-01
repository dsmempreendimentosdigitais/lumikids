const fs = require('fs');
const admin = require('firebase-admin');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const getVal = (k) => {
  const l = lines.find(x => x.startsWith(k + '='));
  return l ? l.replace(k + '=', '').trim().replace(/^['"]|['"]$/g, '') : '';
};

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: getVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    clientEmail: getVal('FIREBASE_CLIENT_EMAIL'),
    privateKey: getVal('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
  }),
});

async function checkStory() {
  const db = admin.firestore();
  const snap = await db.collection('stories').limit(2).get();
  snap.forEach(d => {
    console.log('ID:', d.id);
    const data = d.data();
    console.log('Title:', data.title);
    console.log('Paragraphs count:', data.content?.paragraphs?.length);
    console.log('Translations field exists?:', !!data.translations);
    if (data.translations) {
      console.log('Languages translated:', Object.keys(data.translations));
    }
  });
  process.exit(0);
}
checkStory();
