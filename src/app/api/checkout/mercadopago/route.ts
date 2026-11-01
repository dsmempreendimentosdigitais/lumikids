import { NextRequest, NextResponse } from 'next/server';
import { SUBSCRIPTION_PLANS } from '@/config/plans';

export async function POST(req: NextRequest) {
  try {
    const { planId = 'yearly', userId, userEmail, userName } = await req.json();

    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://lumikids.app';

    // Se o usuário ainda não adicionou o Access Token no arquivo .env.local
    if (!accessToken) {
      return NextResponse.json({
        isConfigured: false,
        plan,
        message: 'Credencial MERCADOPAGO_ACCESS_TOKEN ainda não configurada no servidor.'
      });
    }

    // Chamada oficial à API de Preferências do Mercado Pago
    const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken.trim()}`
      },
      body: JSON.stringify({
        items: [
          {
            id: plan.id,
            title: `Lumikids - ${plan.name} (${plan.billingPeriod === 'yearly' ? 'Anual' : 'Mensal'})`,
            description: plan.description,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: Number(plan.priceTotal.toFixed(2))
          }
        ],
        payer: {
          email: userEmail || 'cliente@lumikids.app',
          name: userName || 'Assinante Lumikids'
        },
        back_urls: {
          success: `${origin}/app/progresso?payment=success&plan=${plan.id}`,
          failure: `${origin}/app/planos?payment=failure`,
          pending: `${origin}/app/progresso?payment=pending&plan=${plan.id}`
        },
        auto_return: 'approved',
        notification_url: `${origin}/api/webhooks/mercadopago`,
        statement_descriptor: 'LUMIKIDS',
        external_reference: userId || 'anonymous',
        metadata: {
          plan_id: plan.id,
          user_id: userId
        }
      })
    });

    if (!mpResponse.ok) {
      const errData = await mpResponse.text();
      console.error('Erro na API Mercado Pago:', mpResponse.status, errData);
      return NextResponse.json({
        error: 'Falha ao gerar preferência no Mercado Pago',
        details: errData
      }, { status: 502 });
    }

    const mpData = await mpResponse.json();

    return NextResponse.json({
      isConfigured: true,
      preferenceId: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point
    });

  } catch (error: any) {
    console.error('Erro no checkout Mercado Pago:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
