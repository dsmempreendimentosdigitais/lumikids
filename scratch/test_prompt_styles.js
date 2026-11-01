const fs = require('fs');

async function testPrompts() {
  const workerUrl = 'https://lumikids-image-api.lumikidsapp.workers.dev';
  const apiKey = 'lumikids_segredo_12345';

  const testPrompts = [
    {
      name: 'v1_pixar_disney_clean',
      prompt: 'High quality modern 2D animated storybook illustration of young Queen Esther standing in the Persian palace courtyard with colorful blooming jasmine flowers, warm sunset lighting, Disney Pixar animation style, crisp clean outlines, vibrant solid colors, clear facial features, intricate Persian architecture in background, beautiful cinematic composition, masterpiece, 8k resolution, children book art, sharp focus, no sketches, no unfinished lines, no watercolor bleeding, no deformities'
    },
    {
      name: 'v2_modern_storybook_defined',
      prompt: 'A vibrant modern 2D children book illustration of a brave little prince looking at a majestic starry night sky with a brass telescope, whimsical fairytale aesthetic, clean bold lines, rich saturation, gouache matte finish, highly detailed, sharp edges, cute expressive face, professional picture book illustration, perfect anatomy, ultra clean, award winning storybook'
    }
  ];

  for (const t of testPrompts) {
    console.log(`Generating ${t.name}...`);
    try {
      const res = await fetch(workerUrl, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: t.prompt })
      });
      console.log(`Status ${t.name}:`, res.status);
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(`public/${t.name}.jpg`, buf);
        console.log(`Saved public/${t.name}.jpg (${buf.length} bytes)`);
      }
    } catch (e) {
      console.error(`Error ${t.name}:`, e.message);
    }
  }
}

testPrompts();
