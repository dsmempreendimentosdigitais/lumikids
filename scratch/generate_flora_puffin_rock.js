const fs = require('fs');
const path = require('path');
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
const ARTIFACT_DIR = 'C:/Users/Samuel/.gemini/antigravity/brain/0a29f114-17ae-4916-be38-0b2fbd9d80ed';

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function runPuffinRockStyle() {
  console.log('🌸 [Flora.ai] Gerando Estilo Puffin Rock (Cartoon Saloon / Natureza Lúdica)...');

  const workspacesRes = await client.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await client.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;

  const prompt = 'Charming 2D illustration in the visual style of Puffin Rock, cute adorable little animals walking together on a sandy grassy path in nature, a friendly little otter, a cute small bird and a tiny rabbit, gentle stippled gouache texture, soft earthy pastel color palette, warm sand and moss green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, no 3D, no realism';

  const generation = await client.generations.create({
    workspace_id: workspaceId,
    project_id: projectId,
    type: 'image',
    prompt,
    aspect_ratio: '16:9'
  });

  const runId = generation.run_id || generation.id;
  console.log(`Run ID: ${runId}`);

  let outputUrl = null;
  for (let attempt = 0; attempt < 35; attempt++) {
    await new Promise(r => setTimeout(r, 3000));
    const result = await client.generations.retrieve(runId);
    console.log(`[${attempt + 1}] Status: ${result.status}`);

    if (result.status === 'completed' || result.status === 'succeeded') {
      outputUrl = result.outputs?.[0]?.url || result.output_url;
      break;
    }
    if (result.status === 'failed' || result.status === 'error') {
      throw new Error(`Erro na geração: ${result.error_message || result.error}`);
    }
  }

  if (!outputUrl) throw new Error('Timeout ao gerar imagem Puffin Rock');

  const localPublicPath = path.join(process.cwd(), 'public', 'flora_style_puffin_rock.png');
  const artifactPath = path.join(ARTIFACT_DIR, 'flora_style_puffin_rock.png');

  const bytes = await downloadImage(outputUrl, localPublicPath);
  fs.copyFileSync(localPublicPath, artifactPath);
  console.log(`🎉 SUCESSO! Salvo localmente em public/flora_style_puffin_rock.png (${bytes} bytes)`);
}

runPuffinRockStyle().then(() => process.exit(0)).catch(err => {
  console.error('Falha:', err);
  process.exit(1);
});
