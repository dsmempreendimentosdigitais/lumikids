const fs = require('fs');

async function testWorkerPuffin() {
  const prompt = 'Charming 2D children storybook illustration in the visual style of Puffin Rock, brave young Queen Esther walking in an ancient Persian palace garden with blooming jasmine and gentle olive trees, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and sage green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text';

  const workerUrl = 'https://lumikids-image-api.lumikidsapp.workers.dev';
  const apiKey = 'lumikids_segredo_12345';

  console.log('Testing Cloudflare Worker with Puffin Rock prompt...');
  const start = Date.now();
  const res = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  const time = ((Date.now() - start) / 1000).toFixed(1);
  console.log('Worker Status:', res.status, `(${time}s)`);
  if (res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync('public/test_worker_puffin.jpg', buf);
    console.log('Saved public/test_worker_puffin.jpg, size:', buf.length);
  }
}

testWorkerPuffin().catch(console.error);
