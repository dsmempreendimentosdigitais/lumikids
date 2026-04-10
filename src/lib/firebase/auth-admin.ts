import { adminAuth } from './admin';

export async function verifyFirebaseToken(token: string) {
  if (!token) {
    throw new Error('Token não fornecido');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    throw new Error('Token inválido ou expirado');
  }
}
