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

function buildPuffinRockPrompt(story) {
  const title = story.title || 'História Infantil';
  const category = story.category || 'infantil';

  const descriptions = {
    'A Coragem da Rainha Ester': 'young brave Queen Esther in an ancient Persian palace garden with blooming jasmine and gentle olive trees, holding a delicate golden scepter, looking with love and courage',
    'Davi e o Gigante Golias': 'brave young shepherd boy David in a lush green valley with rolling hills, holding a smooth stone and wooden sling, sheep grazing peacefully nearby',
    'A Arca de Noé': 'large friendly wooden ark resting on gentle green rolling hills, a beautiful soft rainbow above, cute pairs of animals (giraffes, elephants, doves) walking happily',
    'Moisés e a Travessia do Mar Vermelho': 'young Moses standing with a wooden staff beside parted gentle blue ocean waters showing safe sandy path, colorful seashells, warm golden sunlight',
    'Daniel na Cova dos Leões': 'peaceful biblical scene of young faithful Daniel sitting serenely among friendly, gentle sleeping lions under soft golden rays of heavenly light',
    'Jonas e o Grande Peixe': 'gentle friendly big whale smiling in turquoise waters with little Jonah waving safely near a blooming tropical shore',
    'A Sabedoria do Rei Salomão': 'wise young king Solomon sitting on a warm wooden throne in a sunlit ancient palace, surrounded by books and peaceful friendly doves',
    'José do Egito e o Poder do Perdão': 'young Joseph wearing a colorful beautiful tunic, standing in a golden wheat field with ancient pyramids in distant soft haze',
    'O Bom Samaritano e o Amor ao Próximo': 'heartwarming scene of a kind traveler helping a friend on a scenic winding country path surrounded by wildflowers and friendly donkey',
    'Rute e a Amizade Fiel': 'two kind devoted friends Ruth and Naomi walking together through golden barley fields at peaceful sunset',
    'Davi e a Harpa da Paz': 'young shepherd boy David playing a small wooden harp under a large shady fig tree with gentle birds listening',
    'Galileu Galilei e os Mistérios do Céu': 'curious young Galileo looking through a vintage brass telescope at a starry night sky with gentle crescent moon and constellations',
    'Thomas Edison e as Mil Tentativas da Lâmpada': 'young Edison in a cozy workshop smiling happily as a warm glowing vintage incandescent bulb illuminates a cozy wooden table',
    'Nikola Tesla e a Energia das Estrelas': 'young Tesla in a scenic meadow watching glowing fireflies and gentle harmless purple sparks of starry night electricity',
    'Alexander Graham Bell e a Voz à Distância': 'young Bell listening with wonder to a classic vintage telephone horn with acoustic sound waves depicted as cute musical notes',
    'Louis Pasteur e a Vitória contra o Invisível': 'young Pasteur in a sunlit laboratory looking through a brass microscope surrounded by healthy blooming green plants',
    'Santos Dumont e o Avião': 'young Santos Dumont joyfully flying a small friendly vintage 14-bis airplane over sunny green rolling hills of Paris with the Eiffel tower in soft distance',
    'Mahatma Gandhi e a Força da Paz': 'serene young Gandhi walking barefoot along a peaceful Indian path surrounded by blooming lotus flowers and gentle flying white doves',
    'Leonardo da Vinci e a Curiosidade Infinita': 'young Leonardo sketching flying birds and mechanical wings in an open Tuscan field with warm olive trees',
    'Machado de Assis, o Menino das Letras': 'young boy reading a large magical book in cozy historical Rio de Janeiro with old cobblestone streets and friendly cats',
    'Abraham Lincoln e a Lâmpada da Honestidade': 'young Lincoln reading by warm candlelight in a cozy wooden log cabin in a quiet forest',
    'Albert Schweitzer e o Respeito pela Vida': 'kind young doctor tending gently to a little wounded forest animal surrounded by lush peaceful nature',
    'Dom Pedro II e o Reino dos Livros': 'young Emperor Pedro II surrounded by towering cozy wooden bookshelves and friendly globes in a grand sunlit library',
    'São Luís IX': 'kind young royal king sitting under a grand oak tree giving bread and listening gently to townsfolk with castle in background',
    'Perseu e o Escudo de Bronze': 'young hero Perseus holding a polished shining bronze shield reflecting a gentle starry sky, peaceful Greek landscape with olive trees',
    'O Voo de Ícaro e a Prudência': 'young Icarus wearing feathered wings gliding safely and serenely in a soft sunny sky with fluffy clouds over a blue Aegean sea',
    'Os 12 Trabalhos de Hércules': 'strong friendly young Hercules helping woodland animals lift a fallen log in a blooming ancient Greek valley',
    'Atalanta, a Corredora Invencível': 'fast energetic young heroine Atalanta running joyfully like the wind through an enchanted Greek forest with deer',
    'Perseu e o Pégaso Alado': 'young hero gently petting the soft muzzle of a magnificent friendly winged horse Pegasus on a green mountain peak',
    'O Toque de Midas e a Verdadeira Riqueza': 'king Midas happily hugging his smiling little daughter in a garden of blooming real red roses, valuing love over gold',
    'Jasão e os Argonautas': 'friendly ancient wooden sailing galley ship Argo gliding smoothly through calm turquoise seas past whimsical islands',
    'Teseu e o Fio de Ariadne': 'young hero Theseus holding a golden glowing thread navigating a scenic peaceful labyrinth garden with stone statues',
    'A Bela e a Fera': 'kind young Belle reading a fairytale book to a big gentle friendly fluffy Beast by a warm cozy fireplace in a grand library',
    'Rei Artur e a Espada na Rocha': 'humble young Arthur gently resting his hand on a mystical sword in a stone in a sun-dappled magical English woodland',
    'A Tartaruga e a Lebre': 'cute little green turtle smiling peacefully near the finish line while a fluffy friendly rabbit watches with admiration',
    'O Leão e o Rato': 'mighty gentle lion with soft fluffy mane smiling warmly as a tiny brave little mouse unties a soft rope from his paw',
    'A Cigarra e a Formiga': 'cheerful little cicada playing a tiny violin while hardworking little ant brings food to a cozy underground warm home',
    'O Pastorzinho e o Lobo': 'young shepherd boy resting with fluffy sheep under a warm oak tree learning the beauty of truthfulness and trust',
    'Maria Quitéria, a Heroína da Independência': 'brave young Brazilian heroine in uniform standing proudly on a green hill overlooking historic Bahia landscape with soft sunlight',
    'Anita Garibaldi, a Heroína dos Dois Mundos': 'courageous heroine Anita on horseback riding across scenic rolling pampas hills under a wide open southern sky',
    'Princesa Isabel': 'gentle Princess Isabel signing a golden document of freedom with warm quill pen surrounded by flowers and joyful birds',
    'Dandara dos Palmares e a Força da Liberdade': 'strong brave warrior queen Dandara standing atop a lush green mountain of Palmares overlooking waterfalls and freedom',
    'Chiquinha Gonzaga e o Som da Coragem': 'young smiling woman playing lively cheerful notes on a grand upright piano with colorful musical sparkles dancing in the air',
    'Florence Nightingale e a Dama da Lâmpada': 'gentle caring nurse Florence carrying a soft glowing lantern through a cozy peaceful nighttime hospital room',
    'Joana d\'Arc': 'brave young Joan of Arc in shining silver armor holding a white flag with golden fleurs-de-lis, standing serenely in a French meadow',
    'Marie Curie e a Luz da Descoberta': 'young Marie Curie holding a gentle glowing beaker of soft blue luminescence in a sunlit science laboratory',
    'Ada Lovelace, a Pioneira dos Computadores': 'clever young Ada drawing mathematical starry gears and flying mechanical steam wings in a grand Victorian study',
    'Cleópatra e os Mistérios de Alexandria': 'young elegant queen Cleopatra standing on a stone balcony overlooking the great Lighthouse of Alexandria and the Nile at sunset',
    'Hatshepsut, a Faraó da Paz e Prosperidade': 'noble female Pharaoh Hatshepsut standing by a grand sandstone temple terrace with blooming incense trees and peaceful trading ships',
    'Mulan e a Honra da Família': 'brave young heroine Mulan in traditional Chinese robe practicing with a bamboo staff under pink blooming cherry blossoms',
    'O Garoto que Falou a Verdade': 'honest young boy looking kindly and bravely at a wise teacher in an ancient courtyard, surrounded by blooming plum trees',
    'O Segredo das Duas Palavras Mágicas': 'two sweet little children smiling and sharing a basket of fresh red apples in a cozy village garden',
    'A Paciência do Mestre Bambu': 'wise elderly master and a young student watering a green bamboo shoot that grows tall and strong in a peaceful Zen garden',
    'O Vaso da Honestidade': 'young humble boy presenting a clean clay pot with rich dark soil to the emperor, showing true integrity and courage',
    'A Árvore da Gratidão': 'a majestic ancient tree with glowing golden and pastel leaves, surrounded by happy forest animals bringing gifts of friendship',
    'Arrumando o Quarto': 'cute little children happily and playfully putting colorful wooden toys, books and teddy bears in tidy baskets in a cozy bedroom',
    'A Onça-Pintada do Pantanal': 'magnificent friendly jaguar resting on a tree branch above a calm Pantanal river with water lilies and colorful toucans',
    'O Boto Cor-de-Rosa e os Rios da Amazônia': 'cheerful pink river dolphin leaping gracefully in the Amazon river surrounded by lush giant water lilies and lush green jungle',
    'O Voo Dourado da Arara-Azul': 'stunning cobalt blue macaw flying joyfully above the emerald green canopy of Brazilian cerrado at golden sunrise',
    'A Pequena Abelha e o Milagre das Flores': 'cute chubby little bumblebee with big friendly eyes visiting a vibrant meadow of colorful wildflowers under warm sunshine'
  };

  const sceneDesc = descriptions[title] || `heartwarming storybook scene about ${title}, rich in virtues and wonder`;

  return `Charming 2D children storybook cover illustration in the visual style of Puffin Rock, ${sceneDesc}, gentle stippled gouache textures, soft earthy pastel color palette, warm sand and moss green tones, layered stylized vegetation, sweet curious expressive eyes, calming cozy storybook atmosphere, clean handcrafted 2D animation aesthetic, award winning children illustration, high resolution, 16:9 widescreen, no 3D, no realism, no text, no title`;
}

async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao baixar imagem: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
  return buffer.length;
}

async function generateAllCovers() {
  console.log('🌸 [Flora.ai - Puffin Rock] Iniciando geração das 60 Capas...\n');

  const workspacesRes = await flora.workspaces.list();
  const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
  const projectsPage = await flora.projects.list({ workspace_id: workspaceId });
  const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
  const projectId = projectList[0]?.project_id;

  console.log(`Workspace: ${workspaceId} | Projeto: ${projectId}`);

  const snap = await db.collection('stories').get();
  const stories = [];
  snap.forEach(d => stories.push({ id: d.id, ...d.data() }));

  console.log(`Total de histórias para processar: ${stories.length}\n`);

  let completedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (let i = 0; i < stories.length; i++) {
    const story = stories[i];
    const storyDir = path.join(process.cwd(), 'public', 'stories', story.id);
    const coverPath = path.join(storyDir, 'cover.jpg');
    const coverUrl = `/stories/${story.id}/cover.jpg`;

    if (!fs.existsSync(storyDir)) {
      fs.mkdirSync(storyDir, { recursive: true });
    }

    // Se a capa já foi gerada com Puffin Rock, pula
    if (fs.existsSync(coverPath) && story.coverGeneratedFlora) {
      console.log(`[${i + 1}/${stories.length}] ⏭️  Capa já existe para "${story.title}"`);
      skippedCount++;
      continue;
    }

    const prompt = buildPuffinRockPrompt(story);
    console.log(`\n[${i + 1}/${stories.length}] 🎨 Gerando capa Puffin Rock: "${story.title}" (${story.category})...`);

    try {
      const generation = await flora.generations.create({
        workspace_id: workspaceId,
        project_id: projectId,
        type: 'image',
        prompt,
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

      if (!outputUrl) throw new Error('Timeout ao aguardar imagem da Flora');

      const bytes = await downloadImage(outputUrl, coverPath);
      console.log(`   💾 Salva em: ${coverUrl} (${bytes} bytes)`);

      // Atualiza Firestore
      await db.collection('stories').doc(story.id).update({
        coverImageUrl: coverUrl,
        nanoBananaImageUrl: coverUrl,
        coverGeneratedFlora: true,
        updatedAt: new Date()
      });

      completedCount++;
      console.log(`   ✨ Capa vinculada no Firestore com sucesso!`);
    } catch (err) {
      console.error(`   ❌ Falha na história "${story.title}":`, err.message);
      errorCount++;
    }
  }

  console.log('\n======================================================');
  console.log('🎉 [Processo Concluído!]');
  console.log(`Capas geradas: ${completedCount}`);
  console.log(`Capas puladas: ${skippedCount}`);
  console.log(`Erros: ${errorCount}`);
}

generateAllCovers().then(() => process.exit(0)).catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
