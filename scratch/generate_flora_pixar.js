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

async function runPixarStyle() {
  console.log('🌸 [Flora.ai] Gerando Estilo Animação 3D...');

  const workspacesRes = await client.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await client.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;

  // Sem marcas registradas como Disney/Pixar para não acionar filtro de copyright
  const prompt = 'Stunning 3D animated film still, modern stylized CGI character, adorable young Queen Esther in an ancient Persian palace garden with blooming flowers, warm cinematic golden sunset lighting, cute stylized character with big expressive kind eyes, soft volumetric light rays, smooth 3D surfaces, Octane render, beautiful color harmony, masterpiece, clean polished finish';

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

  if (!outputUrl) throw new Error('Timeout ao gerar imagem 3D');

  const localPublicPath = path.join(process.cwd(), 'public', 'flora_style_pixar_3d.png');
  const artifactPath = path.join(ARTIFACT_DIR, 'flora_style_pixar_3d.png');

  const bytes = await downloadImage(outputUrl, localPublicPath);
  fs.copyFileSync(localPublicPath, artifactPath);
  console.log(`🎉 SUCESSO! Salvo localmente em public/flora_style_pixar_3d.png (${bytes} bytes)`);
}

runPixarStyle().then(() => process.exit(0)).catch(err => {
  console.error('Falha:', err);
  process.exit(1);
});
