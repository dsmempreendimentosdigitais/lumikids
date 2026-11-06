const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

const envPath = path.resolve('.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const t = line.trim();
    if (t && !t.startsWith('#') && t.includes('=')) {
      const idx = t.indexOf('=');
      const k = t.slice(0, idx).trim();
      let v = t.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[k] = v.replace(/\\n/g, '\n');
    }
  });
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY
  })
});

async function run() {
  const email = 'samuel.mc85@gmail.com';
  console.log('Checking Auth user for:', email);
  try {
    const user = await admin.auth().getUserByEmail(email);
    console.log('Found Auth user:', user.uid, user.email, user.displayName);
    const doc = await admin.firestore().collection('users').doc(user.uid).get();
    console.log('Firestore user doc exists:', doc.exists);
    if (doc.exists) {
      console.log('Firestore data:', JSON.stringify(doc.data(), null, 2));
    }
  } catch (err) {
    console.log('Auth check error:', err.message);
  }

  // Also check if any firestore doc has email == email
  const snap = await admin.firestore().collection('users').where('email', '==', email).get();
  console.log('Firestore users where email == samuel.mc85@gmail.com:', snap.size);
  snap.forEach(d => console.log(d.id, d.data()));
}

run().catch(console.error);
