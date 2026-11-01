const fs = require('fs');
const FloraModule = require('@flora-ai/flora');
const Flora = FloraModule.default || FloraModule;

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let apiKey = '';
envConfig.split('\n').forEach(line => {
  if (line.startsWith('FLORA_AI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/['"]/g, '');
  }
});

const client = new Flora({ apiKey });

async function testFloraFlux() {
  console.log('Testing Flora FLUX 2 Turbo (9 credits)...');
  const workspacesRes = await client.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await client.projects.list({ workspace_id: workspaceId });
  const projectId = projectsPage?.data?.[0]?.project_id || projectsPage?.projects?.[0]?.project_id;

  const prompt = 'Charming 2D children storybook illustration in the visual style of Puffin Rock, brave young Queen Esther walking in an ancient Persian palace garden with blooming jasmine and gentle olive trees, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and sage green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text';

  const start = Date.now();
  const generation = await client.generations.create({
    workspace_id: workspaceId,
    project_id: projectId,
    type: 'image',
    model: 't2i-flux-2-turbo',
    prompt,
    aspect_ratio: '16:9'
  });
  console.log('Gen response:', generation);
  const runId = generation.run_id || generation.id;

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const res = await client.generations.retrieve(runId);
    console.log(`[${i+1}] Status:`, res.status);
    if (res.status === 'completed' || res.status === 'succeeded') {
      const url = res.outputs?.[0]?.url || res.output_url;
      console.log('FLUX Turbo SUCCESS URL:', url, 'Time:', ((Date.now() - start)/1000).toFixed(1) + 's');
      const imgRes = await fetch(url);
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync('public/test_flora_flux_turbo.png', buf);
      console.log('Saved public/test_flora_flux_turbo.png, bytes:', buf.length);
      return;
    }
    if (res.status === 'failed' || res.status === 'error') {
      console.error('Failed:', res.error_message || res.error);
      return;
    }
  }
}

testFloraFlux().catch(console.error);
