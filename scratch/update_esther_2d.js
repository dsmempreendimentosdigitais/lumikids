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

// 18 páginas detalhadas da história da Rainha Ester
const estherParagraphs = [
  {
    text: "Na grande cidade de Susã, na Pérsia Antiga, vivia uma jovem órfã chamada Ester. Ela era criada com muito amor e sabedoria por seu primo Mardoqueu.",
    prompt: "Young Esther standing gracefully in ancient Persian city of Susa with archways, warm sunlight, 2D children storybook illustration, digital watercolor painting, clean lineart"
  },
  {
    text: "Mardoqueu ensinou a Ester o valor da honestidade, do respeito aos mais velhos e da fé inabalável nos momentos de desafio.",
    prompt: "Wise elderly cousin Mordecai talking kindly to young Esther in a sunlit courtyard with potted flowers, 2D storybook illustration"
  },
  {
    text: "O rei Assuero organizou uma grande reunião em seu palácio real para escolher a nova rainha que governaria ao seu lado.",
    prompt: "King Ahasuerus sitting on a golden throne in a magnificent Persian palace hall, bright sunlight, 2D fairytale book illustration"
  },
  {
    text: "Por causa de sua gentileza, postura humilde e beleza sincera, Ester foi escolhida pelo rei para ser a Rainha da Pérsia.",
    prompt: "Esther wearing a delicate gold crown and royal blue dress, smiling gracefully in palace garden, 2D children book art"
  },
  {
    text: "Mesmo vivendo no palácio, Ester manteve seu coração simples e continuou ouvindo os bons conselhos de Mardoqueu.",
    prompt: "Queen Esther reading a scroll near a sunlit palace window with white curtains, peaceful scene, 2D storybook illustration"
  },
  {
    text: "Um dia, um oficial influente chamado Hamã planejou um decreto injusto contra todo o povo de Ester.",
    prompt: "Haman in dark purple cloak showing a sealed parchment scroll to court officials in stone hall, 2D storybook illustration"
  },
  {
    text: "Ao saber do perigo, Mardoqueu enviou uma mensagem a Ester dizendo: 'Quem sabe não foi exatamente para um momento como este que você se tornou rainha?'.",
    prompt: "Messenger delivering a secret note to Queen Esther in royal gardens, dramatic lighting, 2D fairytale illustration"
  },
  {
    text: "Entrar na presença do rei sem ser chamada era proibido e muito perigoso. Mas Ester decidiu agir com coragem moral para salvar seu povo.",
    prompt: "Queen Esther praying deeply with eyes closed and hands together in a peaceful bedroom, soft sunbeams, 2D storybook illustration"
  },
  {
    text: "Ester pediu a todos que fizessem três dias de oração e união em busca de sabedoria e proteção.",
    prompt: "People praying together in ancient Persian courtyard under clear blue sky, peaceful atmosphere, 2D storybook art"
  },
  {
    text: "No terceiro dia, Ester vestiu seus trajes reais e caminhou com coragem até o pátio interior diante do trono do rei Assuero.",
    prompt: "Queen Esther stepping bravely into the grand throne room towards King Ahasuerus, majestic golden lights, 2D children book illustration"
  },
  {
    text: "Ao ver a rainha, o rei estendeu seu cetro de ouro em sinal de acolhimento e perguntou qual era o seu pedido.",
    prompt: "King Ahasuerus holding out a golden scepter gently toward Queen Esther, warm smiling expression, 2D fairytale illustration"
  },
  {
    text: "Ester convidou carinhosamente o rei e Hamã para um jantar especial preparado com todo o capricho em seus aposentos.",
    prompt: "Queen Esther serving fruits and bread at a long wooden table for King Ahasuerus, palace dining room, 2D storybook illustration"
  },
  {
    text: "No jantar, Ester revelou com calma e verdade o decreto injusto que ameaçava o seu povo.",
    prompt: "Queen Esther speaking bravely and clearly at the banquet table with King Ahasuerus listening attentively, 2D storybook illustration"
  },
  {
    text: "O rei Assuero, percebendo a verdade e a nobreza de Ester, desfez imediatamente o decreto e protegeu todo o povo de Israel.",
    prompt: "King Ahasuerus signing a new royal decree sealing it with wax while Queen Esther watches happily, 2D storybook art"
  },
  {
    text: "Mardoqueu foi honrado por sua integridade e nomeado oficial de confiança no reino da Pérsia.",
    prompt: "Elderly Mordecai wearing a fine blue cloak being greeted warmly by townspeople, sunny street celebration, 2D storybook illustration"
  },
  {
    text: "Todo o povo celebrou com alegria, banquetes e troca de presentes entre os vizinhos, festejando a grande libertação.",
    prompt: "Families celebrating in sunny Persian town square with colorful banners, baskets of food, joyful faces, 2D children storybook art"
  },
  {
    text: "Essa celebração ficou conhecida como a festa de Purim, lembrando a todos do valor da coragem e da união.",
    prompt: "Children holding colorful paper lanterns under evening sky, warm festive lamps, 2D fairytale illustration"
  },
  {
    text: "A história da Rainha Ester nos ensina que a verdadeira coragem não é a ausência de medo, mas a determinação de fazer o que é certo pelos outros.",
    prompt: "Queen Esther standing peacefully looking at sunlit Persian hills, golden sunset, inspiring 2D children storybook illustration, masterpiece"
  }
];

function build2DPrompt(scenePrompt) {
  const stylePrompt = 'Masterpiece 2D children storybook illustration, digital watercolor painting, warm cozy lighting, clean crisp lineart, rich colorful background, charming fairytale book art, highly detailed, beautiful classic children book aesthetic';
  return `Beautiful 2D storybook illustration of ${scenePrompt}, ${stylePrompt}, clear sky, no text, no letters, no words, no watermark, no logo`;
}

async function updateEsther() {
  console.log('[Esther 2D] Buscando histórias de Ester no Firestore...');
  const snap = await db.collection('stories').get();
  
  const estherDocs = snap.docs.filter(doc => {
    const t = doc.data().title || '';
    return t.toLowerCase().includes('ester') || t.toLowerCase().includes('estér');
  });

  if (estherDocs.length === 0) {
    console.log('[Esther 2D] Nenhuma história da Ester encontrada. Criando nova...');
    const newDoc = db.collection('stories').doc();
    await saveEstherToDoc(newDoc);
  } else {
    for (const doc of estherDocs) {
      console.log(`[Esther 2D] Atualizando documento ID: ${doc.id} ("${doc.data().title}")`);
      await saveEstherToDoc(doc.ref);
    }
  }
}

async function saveEstherToDoc(docRef) {
  const formattedParagraphs = estherParagraphs.map((p, idx) => {
    const cleanPrompt = build2DPrompt(p.prompt);
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    const seed = 9999 + (idx * 37);
    const imgUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux&enhance=false`;

    return {
      index: idx,
      text: p.text,
      startTime: idx * 5000,
      endTime: (idx + 1) * 5000,
      isHighlight: idx % 3 === 0,
      imagePrompt: cleanPrompt,
      imageUrl: imgUrl
    };
  });

  const coverUrl = formattedParagraphs[0].imageUrl;
  const fullText = estherParagraphs.map(p => p.text).join('\n\n');

  await docRef.set({
    id: docRef.id,
    title: 'A Coragem da Rainha Ester',
    slug: 'a-coragem-da-rainha-ester',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    durationMinutes: 8,
    language: 'pt-BR',
    content: {
      text: fullText,
      paragraphs: formattedParagraphs
    },
    audio: {},
    coverEmoji: '👑',
    coverColor: '#4F46E5',
    coverImageUrl: coverUrl,
    nanoBananaImageUrl: coverUrl,
    value: 'coragem e sabedoria',
    mission: {
      title: 'Missão da Coragem Moral',
      description: 'Hoje, defenda a verdade e ajude um amigo que esteja precisando com coragem!',
      duration: '5 minutos'
    },
    reflection: {
      question: 'Como a sabedoria e a oração nos dão coragem para fazer o que é certo?'
    },
    isInteractive: false,
    isAIGenerated: false,
    isPlaceholder: false,
    isPremium: false,
    rating: 5,
    reviewCount: 1,
    viewCount: 1,
    createdAt: new Date(),
    publishedAt: new Date(),
    updatedAt: new Date()
  }, { merge: true });

  console.log(`🎉 [Esther 2D] História "A Coragem da Rainha Ester" (18 páginas 2D) gravada com sucesso!`);
}

updateEsther().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
