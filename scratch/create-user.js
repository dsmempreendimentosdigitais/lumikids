const admin = require('firebase-admin');
const fs = require('fs');

// Read .env.local manually
const env = fs.readFileSync('.env.local', 'utf8');
const getEnvVal = (name) => {
  const match = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/['"]/g, '').replace(/\\n/g, '\n');
};

const projectId = getEnvVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
const clientEmail = getEnvVal('FIREBASE_CLIENT_EMAIL');
const privateKey = getEnvVal('FIREBASE_PRIVATE_KEY');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis de ambiente no .env.local!");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId,
    clientEmail,
    privateKey,
  })
});

const auth = admin.auth();
const db = admin.firestore();

const email = 'lumikids@lumikids.app';
const password = 'lumi123';
const displayName = 'Lumikids';

async function run() {
  let userRecord;
  try {
    userRecord = await auth.getUserByEmail(email);
    console.log('Usuário já existe no Auth. Atualizando senha...');
    await auth.updateUser(userRecord.uid, {
      password: password,
      displayName: displayName
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log('Usuário não existe no Auth. Criando...');
      userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: displayName,
        emailVerified: true
      });
    } else {
      throw error;
    }
  }

  console.log(`Usuário Auth com ID: ${userRecord.uid}`);

  // Create Firestore document with Premium access
  const userRef = db.collection('users').doc(userRecord.uid);
  await userRef.set({
    email: email,
    displayName: displayName,
    plan: 'premium2',
    updatedAt: new Date(),
    aiUsage: {
      weekCount: 0,
      monthCount: 0,
      lastResetAt: new Date()
    }
  }, { merge: true });

  console.log('Documento Firestore configurado com plano PREMIUM2 (acesso total)!');
  process.exit(0);
}

run().catch(err => {
  console.error('Erro ao executar script:', err);
  process.exit(1);
});
