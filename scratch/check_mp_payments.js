const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
let token = 'APP_USR-1324350483582570-110115-b0202a72deaa5be6126027a0dc68aa33-3258566705';
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    if (line.startsWith('MERCADOPAGO_ACCESS_TOKEN=')) {
      token = line.split('=')[1].trim().replace(/^["']|["']$/g, '');
      break;
    }
  }
}

async function run() {
  const res = await fetch('https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10', {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  const data = await res.json();
  console.log('Total payments found:', data.paging?.total);
  (data.results || []).forEach(p => {
    console.log('=== PAYMENT ===');
    console.log('ID:', p.id);
    console.log('Date:', p.date_created);
    console.log('Status:', p.status, p.status_detail);
    console.log('Amount:', p.transaction_amount);
    console.log('Payer Email:', p.payer?.email);
    console.log('Payer Name:', p.payer?.first_name, p.payer?.last_name);
    console.log('Payer ID:', p.payer?.id);
    console.log('Payer identification:', JSON.stringify(p.payer?.identification));
    console.log('External ref:', p.external_reference);
    console.log('Metadata:', JSON.stringify(p.metadata));
  });
}

run().catch(console.error);
