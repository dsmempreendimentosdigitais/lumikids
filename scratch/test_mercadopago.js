const fs = require('fs');

async function testMercadoPago() {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const match = envContent.match(/MERCADOPAGO_ACCESS_TOKEN=["']?([^"'\r\n]+)/);
  const token = match ? match[1].trim() : '';

  console.log('Testing Mercado Pago Access Token:', token.slice(0, 20) + '...');

  const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      items: [
        {
          id: 'yearly',
          title: 'Lumikids - Plano Anual',
          description: '1 ano de acesso completo a todas as histórias',
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 238.80
        }
      ],
      payer: {
        email: 'teste@lumikids.app',
        name: 'Assinante Teste'
      },
      back_urls: {
        success: 'https://lumikids.app/app/progresso?payment=success',
        failure: 'https://lumikids.app/app/planos?payment=failure',
        pending: 'https://lumikids.app/app/progresso?payment=pending'
      },
      auto_return: 'approved'
    })
  });

  console.log('Response Status:', res.status);
  const data = await res.json();
  if (res.ok) {
    console.log('🎉 SUCESSO! Preferência de checkout criada no Mercado Pago:');
    console.log('Preference ID:', data.id);
    console.log('Init Point (Link do Checkout):', data.init_point);
    console.log('Sandbox Init Point:', data.sandbox_init_point);
  } else {
    console.error('Erro retornado pelo Mercado Pago:', data);
  }
}

testMercadoPago();
