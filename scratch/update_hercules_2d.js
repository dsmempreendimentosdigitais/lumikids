const fs = require('fs');
const path = require('path');

// Carrega .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.replace(/\\n/g, '\n');
    }
  });
}

const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

const db = admin.firestore();

// 14 páginas detalhadas sobre os 12 trabalhos
const herculesParagraphs = [
  {
    text: "Na Grécia Antiga, vivia o jovem Hércules, um herói conhecido por sua grande força. Mas Hércules descobriu que a força verdadeira não vem dos músculos, e sim do amor, da sabedoria e do autocontrole.",
    prompt: "Young Hercules as a brave boy standing in ancient Greece with blue sky and marble pillars, holding a wooden staff, warm 2D children storybook illustration, digital watercolor, clean lineart"
  },
  {
    text: "O 1º Trabalho foi enfrentar o mítico Leão de Nemeia. Em vez de agir com raiva, Hércules usou sua calma e inteligência para proteger os habitantes sem precisar de violência desnecessária.",
    prompt: "Young Hercules facing a large golden lion in a sunlit Greek wheat field, brave calm posture, golden sunlight, 2D fairytale book illustration, vibrant watercolor"
  },
  {
    text: "No 2º Trabalho, Hércules enfrentou a Hidra de Lerna no pântano. Percebendo que cada obstáculo exigia estratégia, ele trabalhou unido com seu amigo Iolau, mostrando o valor da cooperação.",
    prompt: "Young Hercules and his loyal friend holding torches in a misty valley with green trees, working together bravely, warm 2D storybook illustration, clean lineart"
  },
  {
    text: "No 3º Trabalho, Hércules precisou capturar a sagrada Cerva de Cerineia, que tinha chifres de ouro. Durante um ano inteiro, ele a seguiu com enorme paciência sem jamais feri-la.",
    prompt: "Young Hercules gently approaching a graceful golden-horned deer in a sunlit forest, peaceful atmosphere, 2D children book illustration"
  },
  {
    text: "No 4º Trabalho, Hércules subiu as montanhas geladas de Erimanto. Com serenidade e sem medo do frio, ele guiou o selvagem javali até a neve profunda, amansando a fera com domínio próprio.",
    prompt: "Young Hercules walking safely in snowy Greek mountains with pine trees, blue winter sky, 2D storybook watercolor painting"
  },
  {
    text: "No 5º Trabalho, o desafio parecia impossível: limpar os gigantescos estábulos do Rei Augias em um único dia. Hércules usou a criatividade e desviou dois rios límpidos que lavaram tudo com perfeição.",
    prompt: "Young Hercules redirecting two rushing blue rivers with stones to clean a sunny farm, water splashing in sunbeams, 2D fairytale book illustration"
  },
  {
    text: "No 6º Trabalho, no lago Estínfalo, Hércules usou címbalos de bronze presenteados por Atena. O som suave fez as aves misteriosas voarem para longe sem machucar ninguém.",
    prompt: "Young Hercules playing golden cymbals under a sunny sky as colorful birds fly gracefully away over a calm lake, 2D children storybook illustration"
  },
  {
    text: "No 7º Trabalho, na ilha de Creta, Hércules amansou o grande touro com gestos firmes e tranquilos, navegando de volta pelo Mar Egeu com o animal totalmente pacificado.",
    prompt: "Young Hercules standing next to a gentle brown bull on a wooden sailboat in turquoise sea, sunny day, 2D storybook art"
  },
  {
    text: "No 8º Trabalho, na Trácia, Hércules resgatou os velozes cavalos de Diomedes, alimentando-os com boa grama e trazendo a paz de volta às fazendas da região.",
    prompt: "Young Hercules feeding fresh green grass to majestic horses in a sunlit meadow, 2D fairytale illustration"
  },
  {
    text: "No 9º Trabalho, Hércules viajou ao reino das Amazonas. Usando palavras de respeito e verdade, ele conquistou a confiança da Rainha Hipólita sem travar nenhuma batalha.",
    prompt: "Young Hercules speaking respectfully to a queen wearing a golden crown in ancient Greece, sunny palace garden, 2D storybook illustration"
  },
  {
    text: "No 10º Trabalho, Hércules caminhou por terras distantes até a ilha de Eritreia, mantendo a perseverança firme mesmo sob o calor forte do deserto.",
    prompt: "Young Hercules walking bravely across a golden desert dune with a clear blue sky, carrying a wooden staff, 2D children book illustration"
  },
  {
    text: "No 11º Trabalho, Hércules encontrou o jardim secreto das Hespérides. Com ajuda e humildade, ele colheu as maçãs douradas da sabedoria para presentear o povo.",
    prompt: "Young Hercules holding shiny golden apples under a tree with golden fruit in a magical garden, 2D fairytale storybook painting"
  },
  {
    text: "No 12º e último Trabalho, Hércules cumpriu sua missão com a promessa de não usar nenhuma arma. Com afeição e respeito, amansou o guarda Cerberus.",
    prompt: "Young Hercules gently petting a large friendly three-headed dog in a sunlit stone hall, warm peaceful atmosphere, 2D children storybook illustration"
  },
  {
    text: "Ao concluir os Doze Trabalhos, Hércules provou que o maior herói não é aquele que vence batalhas com a força bruta, mas sim aquele que domina a si mesmo e coloca seus talentos a serviço do bem.",
    prompt: "Young Hercules standing heroically on a mountain peak looking over a peaceful Greek village, golden sunset, inspiring 2D children storybook illustration, masterpiece"
  }
];

function build2DPrompt(scenePrompt, index) {
  const stylePrompt = 'Masterpiece 2D children storybook illustration, vibrant digital watercolor painting, warm cozy lighting, clean crisp lineart, rich colorful background, charming fairytale book art, highly detailed, beautiful classic children book aesthetic';
  const cleanScene = scenePrompt.replace(/[*_#~`"']/g, '').trim();
  return `Beautiful 2D storybook illustration of ${cleanScene}, ${stylePrompt}, clear sky, no text, no letters, no words, no watermark, no logo, nologo=true`;
}

async function updateHercules() {
  console.log('[Hercules 2D] Buscando história no Firestore...');
  const snap = await db.collection('stories').where('title', '==', 'Os 12 Trabalhos de Hércules e a Força da Virtude').get();
  
  if (snap.empty) {
    console.error('História não encontrada.');
    return;
  }

  const doc = snap.docs[0];
  console.log(`[Hercules 2D] Atualizando ID: ${doc.id}`);

  const formattedParagraphs = herculesParagraphs.map((p, idx) => {
    const cleanPrompt = build2DPrompt(p.prompt, idx);
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const seed = 12345 + (idx * 99);
    // Usando Pollinations FLUX com modelo 2D limpo e sem marca d'água
    const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux&enhance=false`;

    return {
      index: idx,
      text: p.text,
      startTime: idx * 5000,
      endTime: (idx + 1) * 5000,
      isHighlight: idx % 2 === 1,
      imagePrompt: cleanPrompt,
      imageUrl: imgUrl
    };
  });

  const coverUrl = formattedParagraphs[0].imageUrl;

  const fullText = herculesParagraphs.map(p => p.text).join('\n\n');

  await doc.ref.update({
    'content.text': fullText,
    'content.paragraphs': formattedParagraphs,
    coverImageUrl: coverUrl,
    nanoBananaImageUrl: coverUrl,
    durationMinutes: 10,
    ageGroups: ['5-7', '8-10', '11-14'],
    value: 'perseverança, trabalho e autocontrole',
    updatedAt: new Date()
  });

  console.log(`\n🎉 [Hercules 2D] História atualizada com sucesso no Firestore!`);
  console.log(`14 páginas com ilustrações 2D Storybook limpas registradas.`);
}

updateHercules().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
