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

async function runFloraGeneration() {
  console.log('🌸 [Flora.ai] Iniciando geração dos 2 estilos solicitados...');

  const workspacesRes = await client.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  if (!workspaceId) throw new Error('Nenhum workspace encontrado no Flora');

  const projectsPage = await client.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;
  if (!projectId) throw new Error('Nenhum projeto encontrado no Flora');

  console.log(`Workspace: ${workspaceId} | Projeto: ${projectId}`);

  const generationsToRun = [
    {
      id: 'flora_style_bible_app',
      title: 'Estilo Anexo (Bible App for Kids - 2D Flat Vector)',
      prompt: 'Charming 2D flat vector children storybook illustration in the exact visual style of Bible App for Kids, young Queen Esther walking in a blooming Persian garden with cute friendly animals (a little green turtle and a bird), soft green rolling grass, round fruit trees, clear sky, cheerful bright pastel colors, clean distinct outlines, cute cartoon character design, paper cutout texture, simple joyful aesthetic, high quality, award winning children illustration, clean composition, no 3D rendering, no realism, no messy lines, no defects',
      aspect_ratio: '16:9'
    },
    {
      id: 'flora_style_pixar_3d',
      title: 'Estilo Animações Pixar (3D Digital Animation)',
      prompt: 'Stunning 3D animated movie still in Disney Pixar 3D animation style, adorable young Queen Esther in an ancient Persian palace garden with blooming jasmine, warm cinematic golden sunlight, cute stylized character with big expressive eyes and gentle smile, soft volumetric light rays, rich 3D depth of field, Octane render 3D, Pixar character design, beautiful color harmony, masterpiece, clean polished 3D finish, no flat 2D lines, no defects',
      aspect_ratio: '16:9'
    }
  ];

  for (const gen of generationsToRun) {
    console.log(`\n🎨 Gerando: ${gen.title}...`);
    const generation = await client.generations.create({
      workspace_id: workspaceId,
      project_id: projectId,
      type: 'image',
      prompt: gen.prompt,
      aspect_ratio: gen.aspect_ratio
    });

    const runId = generation.run_id || generation.id;
    console.log(`   Run ID: ${runId} (estimado: ${generation.estimated_seconds || 40}s)`);

    let outputUrl = null;
    for (let attempt = 0; attempt < 35; attempt++) {
      await new Promise(r => setTimeout(r, 3000));
      const result = await client.generations.retrieve(runId);
      console.log(`   [${attempt + 1}] Status: ${result.status}`);

      if (result.status === 'completed' || result.status === 'succeeded') {
        outputUrl = result.outputs?.[0]?.url || result.output_url;
        break;
      }
      if (result.status === 'failed' || result.status === 'error') {
        throw new Error(`Erro na geração ${gen.id}: ${result.error_message || result.error}`);
      }
    }

    if (!outputUrl) {
      throw new Error(`Timeout ao gerar ${gen.id}`);
    }

    console.log(`   ✨ Concluído! Baixando de: ${outputUrl}`);
    const localPublicPath = path.join(process.cwd(), 'public', `${gen.id}.png`);
    const artifactPath = path.join(ARTIFACT_DIR, `${gen.id}.png`);

    const bytes = await downloadImage(outputUrl, localPublicPath);
    fs.copyFileSync(localPublicPath, artifactPath);
    console.log(`   💾 Salvo localmente em public/${gen.id}.png e artefatos (${bytes} bytes)`);
  }

  console.log('\n======================================================');
  console.log('🎉 Todas as gerações do Flora.ai foram concluídas e salvas com sucesso!');
}

runFloraGeneration().then(() => process.exit(0)).catch(err => {
  console.error('Falha geral:', err);
  process.exit(1);
});
