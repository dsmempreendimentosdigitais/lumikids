import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { sendWelcomeAccessEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { paymentId, email, password } = await req.json();

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-1324350483582570-110115-b0202a72deaa5be6126027a0dc68aa33-3258566705';

    let targetPayment: any = null;

    // 1. Se informou paymentId direto
    if (paymentId) {
      const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: { 'Authorization': `Bearer ${accessToken.trim()}` }
      });
      if (mpRes.ok) {
        const p = await mpRes.json();
        if (p.status === 'approved') {
          targetPayment = p;
        }
      }
    }

    // 2. Se não achou por paymentId mas informou email, busca nos pagamentos recentes do Mercado Pago
    if (!targetPayment && email) {
      const cleanEmail = email.toLowerCase().trim();
      const searchRes = await fetch(`https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=20`, {
        headers: { 'Authorization': `Bearer ${accessToken.trim()}` }
      });
      if (searchRes.ok) {
        const data = await searchRes.json();
        const found = (data.results || []).find((p: any) => 
          p.status === 'approved' && p.payer?.email?.toLowerCase().trim() === cleanEmail
        );
        if (found) {
          targetPayment = found;
        }
      }
    }

    // 3. Se identificou o pagamento aprovado no Mercado Pago
    if (targetPayment) {
      const payerEmail = targetPayment.payer?.email?.toLowerCase().trim();
      const payerName = [targetPayment.payer?.first_name, targetPayment.payer?.last_name].filter(Boolean).join(' ').trim() || 'Assinante Contos & Virtudes';
      const planId = targetPayment.metadata?.plan_id || 'yearly';

      if (!payerEmail) {
        // Dispara e-mail profissional com dados de compra e login
      sendWelcomeAccessEmail({
        email: payerEmail,
        name: payerName,
        planName: planId === 'yearly' ? 'Plano Anual' : 'Plano Mensal',
        planAmount: planId === 'yearly' ? 'R$ 199,90' : 'R$ 29,90',
        password: password || undefined,
        paymentId: String(targetPayment.id)
      }).catch(e => console.error('[claim-access] Erro ao enviar email:', e));

      return NextResponse.json({ error: 'E-mail do pagador não encontrado no comprovante.' }, { status: 400 });
      }

      // Localiza ou cria o usuário no Firebase Auth
      let userRecord: any;
      try {
        userRecord = await adminAuth.getUserByEmail(payerEmail);
      } catch (authErr: any) {
        if (authErr.code === 'auth/user-not-found') {
          userRecord = await adminAuth.createUser({
            email: payerEmail,
            displayName: payerName,
            emailVerified: true
          });
        } else {
          throw authErr;
        }
      }

      // Se o usuário digitou uma nova senha, atualiza no Firebase Auth
      if (password && password.length >= 6) {
        await adminAuth.updateUser(userRecord.uid, { password });
      }

      // Atualiza Firestore para Premium ativo
      const expiresAt = new Date();
      if (planId === 'yearly') {
        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
      } else {
        expiresAt.setMonth(expiresAt.getMonth() + 1);
      }

      await adminDb.collection('users').doc(userRecord.uid).set({
        plan: 'premium2',
        planType: planId,
        planStatus: 'active',
        planExpiresAt: expiresAt,
        email: payerEmail,
        displayName: payerName,
        lastPaymentId: String(targetPayment.id),
        paymentProvider: 'mercadopago',
        updatedAt: new Date()
      }, { merge: true });

      // Gera Custom Token para login imediato no navegador sem pedir credenciais novamente
      const customToken = await adminAuth.createCustomToken(userRecord.uid);

      // Dispara e-mail profissional com dados de compra e login
      sendWelcomeAccessEmail({
        email: payerEmail,
        name: payerName,
        planName: planId === 'yearly' ? 'Plano Anual' : 'Plano Mensal',
        planAmount: planId === 'yearly' ? 'R$ 199,90' : 'R$ 29,90',
        password: password || undefined,
        paymentId: String(targetPayment.id)
      }).catch(e => console.error('[claim-access] Erro ao enviar email:', e));

      return NextResponse.json({
        success: true,
        email: payerEmail,
        displayName: payerName,
        plan: planId,
        token: customToken,
        hasPasswordSet: !!password
      });
    }

    // 4. Se não achou no Mercado Pago, verifica se o usuário já tem conta ativa no Firestore
    if (email) {
      const cleanEmail = email.toLowerCase().trim();
      try {
        const user = await adminAuth.getUserByEmail(cleanEmail);
        const userDoc = await adminDb.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data()?.plan === 'premium2') {
          if (password && password.length >= 6) {
            await adminAuth.updateUser(user.uid, { password });
          }
          const token = await adminAuth.createCustomToken(user.uid);
          // Dispara e-mail profissional com dados de compra e login
          sendWelcomeAccessEmail({
            email: cleanEmail,
            name: user.displayName || 'Assinante',
            planName: userDoc.data()?.planType === 'yearly' ? 'Plano Anual' : 'Plano Mensal',
            planAmount: userDoc.data()?.planType === 'yearly' ? 'R$ 199,90' : 'R$ 29,90',
            password: password || undefined
          }).catch(e => console.error('[claim-access] Erro ao enviar email:', e));

          return NextResponse.json({
            success: true,
            email: cleanEmail,
            plan: userDoc.data()?.planType || 'monthly',
            token
          });
        }
      } catch (err) {}
    }

    return NextResponse.json({ 
      error: 'Nenhum pagamento aprovado foi localizado para estes dados. Verifique o e-mail digitado ou aguarde a compensação bancária.' 
    }, { status: 404 });

  } catch (error: any) {
    console.error('Erro em claim-access:', error);
    return NextResponse.json({ error: error.message || 'Erro interno ao processar acesso' }, { status: 500 });
  }
}
