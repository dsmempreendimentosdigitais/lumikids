import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id') || searchParams.get('data.id');

    const body = await req.json().catch(() => ({}));
    const paymentId = id || body?.data?.id || body?.id;

    if (!paymentId) {
      return NextResponse.json({ received: true, status: 'ignored_no_id' }, { status: 200 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-1324350483582570-110115-b0202a72deaa5be6126027a0dc68aa33-3258566705';

    // Consulta os detalhes reais do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken.trim()}`
      }
    });

    if (!mpRes.ok) {
      console.error('Falha ao consultar pagamento no Mercado Pago:', mpRes.status);
      return NextResponse.json({ received: true, status: 'fetch_failed' }, { status: 200 });
    }

    const payment = await mpRes.json();
    console.log(`Mercado Pago status: ${payment.status} | ref: ${payment.external_reference} | val: ${payment.transaction_amount} | email: ${payment.payer?.email}`);

    // Se o pagamento foi aprovado (seja PIX ou Cartão de Crédito)
    if (payment.status === 'approved') {
      let uid = payment.external_reference || payment.metadata?.user_id;
      const planId = payment.metadata?.plan_id || 'yearly';
      const payerEmail = payment.payer?.email?.toLowerCase().trim();
      const payerName = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(' ').trim();

      // Se não havia uid ou era 'anonymous', localiza ou cria o usuário pelo e-mail do pagador
      if ((!uid || uid === 'anonymous') && payerEmail) {
        try {
          const existingUser = await adminAuth.getUserByEmail(payerEmail);
          uid = existingUser.uid;
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found') {
            const newUser = await adminAuth.createUser({
              email: payerEmail,
              displayName: payerName || 'Assinante Contos & Virtudes',
              emailVerified: true
            });
            uid = newUser.uid;
            console.log(`✨ Novo usuário criado automaticamente no Firebase Auth: ${payerEmail} (${uid})`);
          } else {
            console.error('Erro ao buscar usuário por e-mail no Auth:', authErr);
          }
        }
      }

      if (uid && uid !== 'anonymous') {
        const expiresAt = new Date();
        if (planId === 'yearly') {
          expiresAt.setFullYear(expiresAt.getFullYear() + 1);
        } else {
          expiresAt.setMonth(expiresAt.getMonth() + 1);
        }

        const userPayload: any = {
          plan: 'premium2',
          planType: planId,
          planStatus: 'active',
          planExpiresAt: expiresAt,
          lastPaymentId: String(paymentId),
          paymentProvider: 'mercadopago',
          updatedAt: new Date()
        };

        if (payerEmail) userPayload.email = payerEmail;
        if (payerName) userPayload.displayName = payerName;

        await adminDb.collection('users').doc(uid).set(userPayload, { merge: true });

        console.log(`🎉 Assinatura ativada com sucesso para usuário ${uid} (${payerEmail || 'sem email'})!`);
      }
    }

    return NextResponse.json({ received: true, status: 'ok' }, { status: 200 });
  } catch (error: any) {
    console.error('Erro no processamento do webhook Mercado Pago:', error);
    // Sempre retornar 200 para o Mercado Pago não reenviar infinitamente em caso de erro interno
    return NextResponse.json({ received: true, error: error.message }, { status: 200 });
  }
}
