
const admin = require('firebase-admin');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function createAdmin() {
  const email = 'admin@lumikids.app';
  const password = 'lumikids123';
  const displayName = 'admin';

  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(email);
    console.log('Usuário já existe no Auth. Atualizando a senha...');
    userRecord = await admin.auth().updateUser(userRecord.uid, { password, displayName });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });
      console.log('Usuário criado no Auth com sucesso.');
    } else {
      throw error;
    }
  }

  const db = admin.firestore();
  await db.collection('users').doc(userRecord.uid).set({
    email,
    displayName,
    plan: 'premium2',
    role: 'admin',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log('Documento Firestore atualizado para role: admin, plan: premium2');
  process.exit(0);
}

createAdmin().catch(console.error);
