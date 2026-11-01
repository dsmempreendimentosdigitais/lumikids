const fs = require('fs');

async function checkStory() {
  const content = fs.readFileSync('.env.local', 'utf8');
  const lines = content.split('\n');
  const getVal = (k) => {
    const l = lines.find(x => x.startsWith(k + '='));
    return l ? l.replace(k + '=', '').trim().replace(/^['"]|['"]$/g, '') : '';
  };

  const { initializeApp } = require('firebase/app');
  const { getFirestore, collection, getDocs, limit, query } = require('firebase/firestore');

  const firebaseConfig = {
    apiKey: getVal('NEXT_PUBLIC_FIREBASE_API_KEY'),
    authDomain: getVal('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
    projectId: getVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
    storageBucket: getVal('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getVal('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getVal('NEXT_PUBLIC_FIREBASE_APP_ID'),
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const q = query(collection(db, 'stories'), limit(1));
  const snap = await getDocs(q);
  snap.forEach(d => {
    console.log('ID:', d.id);
    const data = d.data();
    console.log('Fields:', Object.keys(data));
    console.log('Title:', data.title);
    console.log('Paragraphs count:', data.content?.paragraphs?.length);
    console.log('Has translations?:', !!data.translations);
  });
  process.exit(0);
}
checkStory();
