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
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const auth = admin.auth();
const db = admin.firestore();

async function run() {
  console.log('=== UPDATE PASSWORDS & ACCOUNTS ===');

  // 1. List all auth users and update passwords to 123456
  const list = await auth.listUsers(100);
  for (const userRecord of list.users) {
    const hasPasswordProvider = userRecord.providerData.some(p => p.providerId === 'password');
    if (hasPasswordProvider || userRecord.email?.includes('@')) {
      try {
        await auth.updateUser(userRecord.uid, { password: '123456' });
        console.log(`✅ Senha redefinida para '123456': ${userRecord.email} (${userRecord.uid})`);
      } catch (err) {
        console.warn(`⚠️ Não foi possível redefinir a senha de ${userRecord.email}: ${err.message}`);
      }
    }
  }

  // 2. Garantir que samuel.mc85@gmail.com está como usuário gratuito (plan: 'free')
  try {
    const samuelRecord = await auth.getUserByEmail('samuel.mc85@gmail.com');
    await db.collection('users').doc(samuelRecord.uid).set({
      email: 'samuel.mc85@gmail.com',
      plan: 'free',
      updatedAt: new Date()
    }, { merge: true });
    console.log('✅ Usuário samuel.mc85@gmail.com mantido como GRATUITO (plan: free).');
  } catch (err) {
    console.warn('⚠️ Erro ao atualizar samuel.mc85@gmail.com:', err.message);
  }

  // 3. Criar ou atualizar conta premium para naiarajmv@gmail.com com senha '123456'
  try {
    let naiaraRecord;
    try {
      naiaraRecord = await auth.getUserByEmail('naiarajmv@gmail.com');
      await auth.updateUser(naiaraRecord.uid, { password: '123456' });
      console.log('✅ Usuário naiarajmv@gmail.com já existia no Auth. Senha atualizada para 123456.');
    } catch (e) {
      naiaraRecord = await auth.createUser({
        email: 'naiarajmv@gmail.com',
        password: '123456',
        displayName: 'Naiara',
        emailVerified: true
      });
      console.log('✨ Nova conta Auth criada com sucesso para naiarajmv@gmail.com (UID: ' + naiaraRecord.uid + ')');
    }

    // Salvar/atualizar documento Firestore com plano premium2
    await db.collection('users').doc(naiaraRecord.uid).set({
      id: naiaraRecord.uid,
      email: 'naiarajmv@gmail.com',
      name: 'Naiara',
      displayName: 'Naiara',
      plan: 'premium2',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });

    console.log('👑 Conta naiarajmv@gmail.com configurada com sucesso com PLANO PREMIUM (premium2)!');
  } catch (err) {
    console.error('❌ Erro ao criar/atualizar conta naiarajmv@gmail.com:', err);
  }

  console.log('\n=== TAREFA CONCLUÍDA ===');
}

run().then(() => process.exit(0)).catch(err => { console.error(err); process.exit(1); });
