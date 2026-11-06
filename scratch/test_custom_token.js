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
  const uid = 'y0Dkh21R0DM8HuWP69BlsAh1aFD2';
  const token = await admin.auth().createCustomToken(uid);
  console.log('Custom token generated successfully, length:', token.length);
}

run().catch(console.error);
