import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyFirebaseToken } from '@/lib/firebase/auth-admin';

// Middleware / helper para verificar se quem chama é admin
async function checkAdminStatus(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    throw new Error('Não autorizado (sem token)');
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = await verifyFirebaseToken(token);
  const uid = decoded.uid;

  // Verificar na collection users se tem role === 'admin'
  const userDoc = await adminDb.collection('users').doc(uid).get();
  if (!userDoc.exists) {
    throw new Error('Usuário não encontrado');
  }

  const userData = userDoc.data();
  if (userData?.role !== 'admin') {
    throw new Error('Acesso negado (não é admin)');
  }

  return { uid, userData };
}

export async function GET(req: NextRequest) {
  try {
    await checkAdminStatus(req);

    // Buscar todos os usuários (limitado a 100 para simplificar)
    const snapshot = await adminDb.collection('users')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
      
    const users = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await checkAdminStatus(req);
    
    const body = await req.json();
    const { targetUid, plan, role } = body;

    if (!targetUid) {
      return NextResponse.json({ error: 'targetUid é obrigatório' }, { status: 400 });
    }

    const updates: any = {
      updatedAt: new Date()
    };
    if (plan) updates.plan = plan;
    if (role !== undefined) updates.role = role;

    await adminDb.collection('users').doc(targetUid).set(updates, { merge: true });

    return NextResponse.json({ success: true, updates });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
