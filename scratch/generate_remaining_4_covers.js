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

const targets = [
  {
    id: 'ICNz1Up7mrt40XJ97epN',
    title: 'A Bela e a Fera',
    prompt: 'Charming 2D children storybook cover illustration in the visual style of Puffin Rock, a sweet kind young girl in a yellow dress reading a storybook to a big gentle fluffy friendly woodland creature by a warm stone fireplace, gentle stippled gouache textures, soft earthy pastel colors, warm cozy fairytale library, award winning 2D animation aesthetic, 16:9 widescreen, no 3D, no realism, no text'
  },
  {
    id: 'RgmSbtZMMRjcbUXKzpgF',
    title: 'Mulan e a Honra da Família',
    prompt: 'Charming 2D children storybook cover illustration in the visual style of Puffin Rock, a brave young girl in traditional Asian robe holding a bamboo staff under delicate blooming pink cherry blossom trees, ancient pavilion in soft distance, gentle stippled gouache textures, soft earthy pastel palette, 16:9 widescreen, no 3D, no realism, no text'
  },
  {
    id: 'V17IZTxhislJZbnAXLy6',
    title: 'Albert Schweitzer e o Respeito pela Vida',
    prompt: 'Charming 2D children storybook cover illustration in the visual style of Puffin Rock, a kind caring doctor with a gentle smile sitting on a wooden bench in a peaceful tropical garden caring for a little bird, lush green palm leaves, warm sunset glow, gentle stippled gouache textures, soft earthy pastel colors, 16:9 widescreen, no 3D, no realism, no text'
  },
  {
    id: 'WllmoDP8PP2i55bXOWAq',
    title: 'Arrumando o Quarto',
    prompt: 'Charming 2D children storybook cover illustration in the visual style of Puffin Rock, two sweet cheerful children happily organizing wooden toys, storybooks and a cute teddy bear into neat woven baskets in a cozy warm bedroom, soft morning sunbeam, gentle stippled gouache textures, soft pastel colors, 16:9 widescreen, no 3D, no realism, no text'
  }
];

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function run() {
  const workspacesRes = await flora.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await flora.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;

  for (const t of targets) {
    console.log(`\n🎨 Gerando capa para: "${t.title}" (${t.id})...`);
    const storyDir = path.join(process.cwd(), 'public', 'stories', t.id);
    const coverPath = path.join(storyDir, 'cover.jpg');
    const coverUrl = `/stories/${t.id}/cover.jpg`;

    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    const generation = await flora.generations.create({
      workspace_id: workspaceId,
      project_id: projectId,
      type: 'image',
      prompt: t.prompt,
      aspect_ratio: '16:9'
    });

    const runId = generation.run_id || generation.id;
    console.log(`   Run ID: ${runId}`);

    let outputUrl = null;
    for (let attempt = 0; attempt < 35; attempt++) {
      await new Promise(r => setTimeout(r, 3000));
      const result = await flora.generations.retrieve(runId);
      if (result.status === 'completed' || result.status === 'succeeded') {
        outputUrl = result.outputs?.[0]?.url || result.output_url;
        break;
      }
      if (result.status === 'failed' || result.status === 'error') {
        throw new Error(`Erro retornado pelo Flora: ${result.error_message || result.error}`);
      }
    }

    if (!outputUrl) throw new Error('Timeout');

    const bytes = await downloadImage(outputUrl, coverPath);
    console.log(`   💾 Salva em: ${coverUrl} (${bytes} bytes)`);

    await db.collection('stories').doc(t.id).update({
      coverImageUrl: coverUrl,
      nanoBananaImageUrl: coverUrl,
      coverGeneratedFlora: true,
      updatedAt: new Date()
    });
    console.log(`   ✨ Capa vinculada no Firestore!`);
  }

  console.log('\n🎉 Todas as 4 capas restantes foram geradas com sucesso!');
}

run().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
