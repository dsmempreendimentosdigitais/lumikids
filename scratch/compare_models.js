const fs = require('fs');
const path = require('path');

async function compareModels() {
  const promptText = 'Vibrant and modern 2D children book illustration of young Queen Esther in royal Persian gardens, wearing an elegant modest pastel robe, gentle kind smile, blooming roses and palm trees, warm golden sunlight, crisp clean outlines, vivid colors, Disney Pixar animation aesthetic, highly detailed background, masterpiece, no sketch lines, no deformities, no blurry details';
  
  // 1. Cloudflare Worker
  console.log('1. Generating with Cloudflare Worker...');
  try {
    const res = await fetch('https://lumikids-image-api.lumikidsapp.workers.dev', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer lumikids_segredo_12345',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: promptText })
    });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync('public/sample_cf_worker.jpg', buf);
      console.log('-> CF Worker SUCCESS! Saved public/sample_cf_worker.jpg, bytes:', buf.length);
    } else {
      console.log('-> CF Worker error status:', res.status);
    }
  } catch (e) {
    console.error('-> CF Worker failed:', e.message);
  }

  // 2. Pollinations FLUX
  console.log('2. Generating with Pollinations FLUX...');
  try {
    const fluxUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?model=flux&nologo=true&seed=123`;
    const res = await fetch(fluxUrl, { signal: AbortSignal.timeout(20000) });
    if (res.ok) {
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync('public/sample_pollinations_flux.jpg', buf);
      console.log('-> Pollinations FLUX SUCCESS! Saved public/sample_pollinations_flux.jpg, bytes:', buf.length);
    } else {
      console.log('-> Pollinations FLUX error status:', res.status);
    }
  } catch (e) {
    console.error('-> Pollinations FLUX failed:', e.message);
  }
}

compareModels();
