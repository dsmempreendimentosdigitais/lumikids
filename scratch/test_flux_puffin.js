const fs = require('fs');

async function testFluxPuffin() {
  const prompt = 'Charming 2D children storybook illustration in the visual style of Puffin Rock, brave young Queen Esther walking in an ancient Persian palace garden with blooming jasmine and gentle olive trees, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and sage green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text';
  
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?model=flux&nologo=true&seed=42`;
  
  console.log('Testing FLUX free endpoint...');
  const start = Date.now();
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const time = ((Date.now() - start) / 1000).toFixed(1);
  
  console.log('Status:', res.status, `(${time}s)`);
  if (res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync('public/test_flux_puffin.jpg', buf);
    console.log('Saved public/test_flux_puffin.jpg, size:', buf.length);
  }
}

testFluxPuffin().catch(console.error);
