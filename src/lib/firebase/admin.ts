import * as admin from 'firebase-admin';

function initFirebaseAdmin() {
  if (admin.apps.length > 0) return;

  // Se não houver as variáveis (ex: durante o build da Vercel), ignora a inicialização para não quebrar o build
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Remove \n from private key just in case it's misformatted
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    
    // Ignora propriedades com valor undefined no Firestore (ex: bibleReference)
    admin.firestore().settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// Inicializa imediatamente se possível
initFirebaseAdmin();

// Exportamos Proxies para atrasar a chamada `admin.firestore()` até o momento exato em que a API é usada.
// Isso evita que o Next.js quebre durante a compilação estática (`npm run build`) caso as variáveis de ambiente ainda não existam.
export const adminAuth = new Proxy({}, {
  get: (_, prop) => {
    initFirebaseAdmin();
    return (admin.auth() as any)[prop];
  }
}) as admin.auth.Auth;

export const adminDb = new Proxy({}, {
  get: (_, prop) => {
    initFirebaseAdmin();
    return (admin.firestore() as any)[prop];
  }
}) as admin.firestore.Firestore;

export const adminStorage = new Proxy({}, {
  get: (_, prop) => {
    initFirebaseAdmin();
    return (admin.storage() as any)[prop];
  }
}) as admin.storage.Storage;
