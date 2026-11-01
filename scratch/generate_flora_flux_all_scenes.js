const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const FloraModule = require('@flora-ai/flora');
const Flora = FloraModule.default || FloraModule;

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let projectId = '', clientEmail = '', privateKey = '', floraKey = '';
envConfig.split('\n').forEach(line => {
  const t = line.trim();
  if (t && !t.startsWith('#') && t.includes('=')) {
    const idx = t.indexOf('=');
    const k = t.slice(0, idx).trim();
    let v = t.slice(idx + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (k === 'NEXT_PUBLIC_FIREBASE_PROJECT_ID') projectId = v;
    if (k === 'FIREBASE_CLIENT_EMAIL') clientEmail = v;
    if (k === 'FIREBASE_PRIVATE_KEY') privateKey = v.replace(/\\n/g, '\n');
    if (k === 'FLORA_AI_API_KEY') floraKey = v;
  }
});

admin.initializeApp({
  credential: admin.credential.cert({ projectId, clientEmail, privateKey })
});
const db = admin.firestore();
const flora = new Flora({ apiKey: floraKey });

function cleanText(t) {
  return (t || '').replace(/[*_#~`"']/g, '').replace(/\s+/g, ' ').trim().slice(0, 160);
}

function buildPuffinRockPrompt(scene) {
  const desc = scene.imagePrompt || cleanText(scene.text);
  return `Charming 2D children storybook illustration in the visual style of Puffin Rock, ${desc}, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and sage green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text`;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function runBatchScenesFloraFlux() {
  console.log('🌸 [Flora.ai - FLUX 2 Turbo] Iniciando geração de cenas em estilo Puffin Rock...\n');

  const workspacesRes = await flora.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await flora.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;

  console.log(`Workspace: ${workspaceId} | Projeto: ${projectId}`);

  const snap = await db.collection('stories').get();
  const stories = [];
  snap.forEach(d => stories.push({ id: d.id, ...d.data() }));

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (let sIdx = 0; sIdx < stories.length; sIdx++) {
    const story = stories[sIdx];
    const paragraphs = story.content?.paragraphs || [];
    const storyDir = path.join(process.cwd(), 'public', 'stories', story.id);

    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    console.log(`\n======================================================`);
    console.log(`[História ${sIdx + 1}/${stories.length}] "${story.title}" (${paragraphs.length} cenas)`);

    let storyNeedsUpdate = false;

    for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
      const p = paragraphs[pIdx];
      const sceneFileName = `scene-${pIdx}.jpg`;
      const scenePath = path.join(storyDir, sceneFileName);
      const sceneUrl = `/stories/${story.id}/${sceneFileName}`;

      // Se já existe e tem tamanho válido gerado por este padrão
      if (fs.existsSync(scenePath) && fs.statSync(scenePath).size > 10000 && p.imageGeneratedFloraFlux) {
        totalSkipped++;
        continue;
      }

      const prompt = buildPuffinRockPrompt(p);
      console.log(`  -> [Cena ${pIdx + 1}/${paragraphs.length}] Gerando FLUX 2 Turbo na Flora...`);

      try {
        const generation = await flora.generations.create({
          workspace_id: workspaceId,
          project_id: projectId,
          type: 'image',
          model: 't2i-flux-2-turbo',
          prompt,
          aspect_ratio: '16:9'
        });

        const runId = generation.run_id || generation.id;

        let outputUrl = null;
        for (let attempt = 0; attempt < 25; attempt++) {
          await new Promise(r => setTimeout(r, 2000));
          const res = await flora.generations.retrieve(runId);
          if (res.status === 'completed' || res.status === 'succeeded') {
            outputUrl = res.outputs?.[0]?.url || res.output_url;
            break;
          }
          if (res.status === 'failed' || res.status === 'error') {
            throw new Error(`Erro retornado pelo Flora: ${res.error_message || res.error}`);
          }
        }

        if (!outputUrl) throw new Error('Timeout');

        const bytes = await downloadImage(outputUrl, scenePath);
        console.log(`     💾 Salva: ${sceneUrl} (${bytes} bytes)`);

        p.imageUrl = sceneUrl;
        p.imageGeneratedFloraFlux = true;
        storyNeedsUpdate = true;
        totalGenerated++;

        // Intervalo suave
        await new Promise(r => setTimeout(r, 300));
      } catch (err) {
        console.error(`     ❌ Erro cena ${pIdx + 1}:`, err.message);
        totalErrors++;
      }
    }

    if (storyNeedsUpdate) {
      await db.collection('stories').doc(story.id).update({
        'content.paragraphs': paragraphs,
        imagesPreGenerated: true,
        updatedAt: new Date()
      });
      console.log(`  ✨ Firestore atualizado com sucesso!`);
    }
  }

  console.log('\n======================================================');
  console.log('🎉 [PROCESSO DE CENAS CONCLUÍDO!]');
  console.log(`Cenas geradas no Flora: ${totalGenerated}`);
  console.log(`Cenas puladas: ${totalSkipped}`);
  console.log(`Erros: ${totalErrors}`);
}

runBatchScenesFloraFlux().then(() => process.exit(0)).catch(err => {
  console.error('Erro geral:', err);
  process.exit(1);
});
