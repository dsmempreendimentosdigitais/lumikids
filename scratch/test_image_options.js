const fs = require('fs');
const path = require('path');

async function testWorker() {
  const workerUrl = 'https://lumikids-image-api.lumikidsapp.workers.dev';
  const apiKey = 'lumikids_segredo_12345';
  
  // Prompt para uma cena de história infantil
  const prompt = 'Pixar and Disney 2D storybook illustration, cute friendly young David holding a small wooden harp in a green biblical meadow with sheep, warm golden hour lighting, clean outlines, vibrant soft colors, high detail, masterpiece, 8k resolution, children book art, no defects';
  
  console.log('Generating via Cloudflare Worker...');
  try {
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    console.log('Worker status:', res.status);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync('public/test_worker_sample.jpg', buffer);
      console.log('Saved public/test_worker_sample.jpg, size:', buffer.length);
    }
  } catch (e) {
    console.error('Worker error:', e.message);
  }

  // Pollinations Flux
  console.log('Generating via Pollinations Flux...');
  try {
    const pUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&nologo=true&seed=42`;
    const res = await fetch(pUrl);
    console.log('Pollinations status:', res.status);
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync('public/test_pollinations_sample.jpg', buffer);
      console.log('Saved public/test_pollinations_sample.jpg, size:', buffer.length);
    }
  } catch (e) {
    console.error('Pollinations error:', e.message);
  }
}

testWorker();
