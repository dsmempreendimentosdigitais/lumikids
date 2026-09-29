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

// Função para gerar URL de ilustração 2D limpa sem marcas d'água
function generate2DImageUrl(promptText, seed) {
  const stylePrompt = 'Masterpiece 2D children storybook illustration, digital watercolor painting, warm cozy lighting, clean crisp lineart, rich colorful background, charming fairytale book art, highly detailed, beautiful classic children book aesthetic';
  const cleanPrompt = `Beautiful 2D storybook illustration of ${promptText.replace(/[*_#~`"']/g, '').trim()}, ${stylePrompt}, clear sky, no text, no letters, no words, no watermark, no logo`;
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux&enhance=false`;
}

// Conjunto mestre de histórias clássicas completas
const MASTER_CLASSIC_STORIES = [
  // ==========================================
  // 1. MITOLOGIA GREGA
  // ==========================================
  {
    title: 'Os 12 Trabalhos de Hércules',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏛️',
    coverColor: '#D97706',
    value: 'perseverança e autocontrole',
    missionTitle: 'Missão do Autocontrole',
    missionDesc: 'Hoje, antes de se irritar com um desafio, respire fundo três vezes e vença com paciência!',
    reflectionQuestion: 'O que é mais difícil: vencer um grande obstáculo ou controlar o próprio temperamento?',
    paragraphs: [
      { text: "Na Grécia Antiga, vivia o jovem Hércules, um herói conhecido por sua grande força. Mas Hércules descobriu que a força verdadeira não vem dos músculos, e sim do amor, da sabedoria e do autocontrole.", prompt: "Young Hercules as a brave boy standing in ancient Greece with blue sky and marble pillars, holding a wooden staff, warm 2D storybook illustration" },
      { text: "O 1º Trabalho foi enfrentar o mítico Leão de Nemeia. Em vez de agir com raiva, Hércules usou sua calma e inteligência para proteger os habitantes sem precisar de violência desnecessária.", prompt: "Young Hercules facing a large golden lion in a sunlit Greek wheat field, brave calm posture, 2D storybook illustration" },
      { text: "No 2º Trabalho, Hércules enfrentou a Hidra de Lerna no pântano. Percebendo que cada obstáculo exigia estratégia, ele trabalhou unido com seu amigo Iolau, mostrando o valor da cooperação.", prompt: "Young Hercules and his friend holding torches in a misty valley, working together, 2D storybook illustration" },
      { text: "No 3º Trabalho, Hércules precisou capturar a sagrada Cerva de Cerineia, que tinha chifres de ouro. Durante um ano inteiro, ele a seguiu com enorme paciência sem jamais feri-la.", prompt: "Young Hercules gently approaching a graceful golden-horned deer in a sunlit forest, 2D storybook illustration" },
      { text: "No 4º Trabalho, Hércules subiu as montanhas geladas de Erimanto. Com serenidade e sem medo do frio, ele guiou o selvagem javali até a neve profunda, amansando a fera com domínio próprio.", prompt: "Young Hercules walking safely in snowy Greek mountains with pine trees, blue winter sky, 2D storybook illustration" },
      { text: "No 5º Trabalho, o desafio parecia impossível: limpar os gigantescos estábulos do Rei Augias em um único dia. Hércules usou a criatividade e desviou dois rios límpidos que lavaram tudo com perfeição.", prompt: "Young Hercules redirecting two rushing blue rivers with stones to clean a sunny farm, 2D storybook illustration" },
      { text: "No 6º Trabalho, no lago Estínfalo, Hércules usou címbalos de bronze presenteados por Atena. O som suave fez as aves misteriosas voarem para longe sem machucar ninguém.", prompt: "Young Hercules playing golden cymbals under a sunny sky as colorful birds fly away over a calm lake, 2D storybook illustration" },
      { text: "No 7º Trabalho, na ilha de Creta, Hércules amansou o grande touro com gestos firmes e tranquilos, navegando de volta pelo Mar Egeu com o animal totalmente pacificado.", prompt: "Young Hercules standing next to a gentle brown bull on a wooden sailboat in turquoise sea, 2D storybook illustration" },
      { text: "No 8º Trabalho, na Trácia, Hércules resgatou os velozes cavalos de Diomedes, alimentando-os com boa grama e trazendo a paz de volta às fazendas da região.", prompt: "Young Hercules feeding fresh green grass to majestic horses in a sunlit meadow, 2D storybook illustration" },
      { text: "No 9º Trabalho, Hércules viajou ao reino das Amazonas. Usando palavras de respeito e verdade, ele conquistou a confiança da Rainha Hipólita sem travar nenhuma batalha.", prompt: "Young Hercules speaking respectfully to a queen wearing a golden crown in ancient Greece, 2D storybook illustration" },
      { text: "No 10º Trabalho, Hércules caminhou por terras distantes até a ilha de Eritreia, mantendo a perseverança firme mesmo sob o calor forte do deserto.", prompt: "Young Hercules walking bravely across a golden desert dune with a clear blue sky, 2D storybook illustration" },
      { text: "No 11º Trabalho, Hércules encontrou o jardim secreto das Hespérides. Com ajuda e humildade, ele colheu as maçãs douradas da sabedoria para presentear o povo.", prompt: "Young Hercules holding shiny golden apples under a tree with golden fruit, 2D storybook illustration" },
      { text: "No 12º e último Trabalho, Hércules cumpriu sua missão com a promessa de não usar nenhuma arma. Com afeição e respeito, amansou o guarda Cerberus.", prompt: "Young Hercules gently petting a friendly three-headed dog in a sunlit stone hall, 2D storybook illustration" },
      { text: "Ao concluir os Doze Trabalhos, Hércules provou que o maior herói não é aquele que vence batalhas com a força bruta, mas sim aquele que domina a si mesmo e coloca seus talentos a serviço do bem.", prompt: "Young Hercules standing heroically on a mountain peak looking over a peaceful Greek village, golden sunset, 2D storybook illustration" }
    ]
  },
  {
    title: 'Perseu e o Escudo de Bronze',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🛡️',
    coverColor: '#2563EB',
    value: 'coragem e sabedoria',
    missionTitle: 'Escudo do Respeito',
    missionDesc: 'Pense antes de agir hoje! Use a sabedoria para responder com educação a qualquer momento difícil.',
    reflectionQuestion: 'Como a sabedoria nos ajuda a vencer o medo quando encontramos algo assustador?',
    paragraphs: [
      { text: "O jovem Perseu recebeu uma missão muito difícil na antiga Grécia, mas não estava sozinho. A deusa Atena lhe presenteou com um escudo de bronze brilhante como um espelho.", prompt: "Young Perseus receiving a polished bronze shield from a wise goddess in ancient Greece, sunny courtyard, 2D storybook illustration" },
      { text: "Com prudência e inteligência, Perseu usou o reflexo no escudo para guiar seus passos com segurança, vencendo o perigo sem se deixar paralisar pelo medo.", prompt: "Perseus holding up his shiny shield reflection calmly in ancient stone ruins, 2D storybook illustration" },
      { text: "Ao retornar vitorioso ao vilarejo, Perseu usou sua dádiva para proteger sua amada mãe e trazer a paz de volta a todo o reino.", prompt: "Perseus hugging his mother happily in a sunlit Greek palace garden, 2D storybook illustration" }
    ]
  },
  {
    title: 'Teseu e o Fio de Ariadne',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🧶',
    coverColor: '#7C3AED',
    value: 'inteligência e organização',
    missionTitle: 'Caminho Seguro',
    missionDesc: 'Ajude alguém da sua família a encontrar algo perdido hoje com atenção e carinho!',
    reflectionQuestion: 'Por que planejar bem os nossos passos nos impede de ficar perdidos nos problemas?',
    paragraphs: [
      { text: "Teseu viajou até a ilha de Creta para salvar seu povo das profundezas do grande Labirinto de pedra.", prompt: "Theseus holding a golden ball of yarn in an ancient Greek port, 2D storybook illustration" },
      { text: "A jovem Ariadne lhe entregou um novelo de fio de seda dourado, orientando-o a desenrolar o fio a cada passo dado.", prompt: "Ariadne handing a golden thread ball to young Theseus, sunny courtyard, 2D storybook illustration" },
      { text: "Com passos cuidadosos e seguindo a trilha do fio, Teseu cumpriu o desafio e guiou todos em segurança de volta à luz do sol.", prompt: "Theseus leading young friends out of a stone archway into bright daylight, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 2. HISTÓRIAS DA BÍBLIA
  // ==========================================
  {
    title: 'A Coragem da Rainha Ester',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '👑',
    coverColor: '#4F46E5',
    value: 'coragem e sabedoria',
    missionTitle: 'Missão da Coragem Moral',
    missionDesc: 'Hoje, defenda a verdade e ajude um amigo que esteja precisando com coragem!',
    reflectionQuestion: 'Como a sabedoria e a oração nos dão coragem para fazer o que é certo?',
    paragraphs: [
      { text: "Na grande cidade de Susã, na Pérsia Antiga, vivia uma jovem órfã chamada Ester. Ela era criada com muito amor e sabedoria por seu primo Mardoqueu.", prompt: "Young Esther standing gracefully in ancient Persian city of Susa with archways, warm sunlight, 2D storybook illustration" },
      { text: "Mardoqueu ensinou a Ester o valor da honestidade, do respeito aos mais velhos e da fé inabalável nos momentos de desafio.", prompt: "Wise elderly cousin Mordecai talking kindly to young Esther in a sunlit courtyard, 2D storybook illustration" },
      { text: "O rei Assuero organizou uma grande reunião em seu palácio real para escolher a nova rainha que governaria ao seu lado.", prompt: "King Ahasuerus sitting on a golden throne in a magnificent Persian palace hall, 2D storybook illustration" },
      { text: "Por causa de sua gentileza, postura humilde e beleza sincera, Ester foi escolhida pelo rei para ser a Rainha da Pérsia.", prompt: "Esther wearing a delicate gold crown and royal blue dress, smiling gracefully in palace garden, 2D storybook illustration" },
      { text: "Mesmo vivendo no palácio, Ester manteve seu coração simples e continuou ouvindo os bons conselhos de Mardoqueu.", prompt: "Queen Esther reading a scroll near a sunlit palace window with white curtains, 2D storybook illustration" },
      { text: "Um dia, um oficial influente chamado Hamã planejou um decreto injusto contra todo o povo de Ester.", prompt: "Haman in dark purple cloak showing a sealed parchment scroll to court officials, 2D storybook illustration" },
      { text: "Ao saber do perigo, Mardoqueu enviou uma mensagem a Ester dizendo: 'Quem sabe não foi exatamente para um momento como este que você se tornou rainha?'.", prompt: "Messenger delivering a secret note to Queen Esther in royal gardens, 2D storybook illustration" },
      { text: "Entrar na presença do rei sem ser chamada era proibido e muito perigoso. Mas Ester decidiu agir com coragem moral para salvar seu povo.", prompt: "Queen Esther praying deeply with eyes closed and hands together in a peaceful bedroom, 2D storybook illustration" },
      { text: "Ester pediu a todos que fizessem três dias de oração e união em busca de sabedoria e proteção.", prompt: "People praying together in ancient Persian courtyard under clear blue sky, 2D storybook illustration" },
      { text: "No terceiro dia, Ester vestiu seus trajes reais e caminhou com coragem até o pátio interior diante do trono do rei Assuero.", prompt: "Queen Esther stepping bravely into the grand throne room towards King Ahasuerus, 2D storybook illustration" },
      { text: "Ao ver a rainha, o rei estendeu seu cetro de ouro em sinal de acolhimento e perguntou qual era o seu pedido.", prompt: "King Ahasuerus holding out a golden scepter gently toward Queen Esther, 2D storybook illustration" },
      { text: "Ester convidou carinhosamente o rei e Hamã para um jantar especial preparado com todo o capricho em seus aposentos.", prompt: "Queen Esther serving fruits and bread at a long wooden table for King Ahasuerus, 2D storybook illustration" },
      { text: "No jantar, Ester revelou com calma e verdade o decreto injusto que ameaçava o seu povo.", prompt: "Queen Esther speaking bravely and clearly at the banquet table with King Ahasuerus listening, 2D storybook illustration" },
      { text: "O rei Assuero, percebendo a verdade e a nobreza de Ester, desfez imediatamente o decreto e protegeu todo o povo de Israel.", prompt: "King Ahasuerus signing a new royal decree while Queen Esther watches happily, 2D storybook illustration" },
      { text: "Mardoqueu foi honrado por sua integridade e nomeado oficial de confiança no reino da Pérsia.", prompt: "Elderly Mordecai wearing a fine blue cloak being greeted warmly by townspeople, 2D storybook illustration" },
      { text: "Todo o povo celebrou com alegria, banquetes e troca de presentes entre os vizinhos, festejando a grande libertação.", prompt: "Families celebrating in sunny Persian town square with colorful banners and food, 2D storybook illustration" },
      { text: "Essa celebração ficou conhecida como a festa de Purim, lembrando a todos do valor da coragem e da união.", prompt: "Children holding colorful paper lanterns under evening sky with warm lamps, 2D storybook illustration" },
      { text: "A história da Rainha Ester nos ensina que a verdadeira coragem não é a ausência de medo, mas a determinação de fazer o que é certo pelos outros.", prompt: "Queen Esther standing peacefully looking at sunlit Persian hills, golden sunset, 2D storybook illustration" }
    ]
  },
  {
    title: 'Davi e o Gigante Golias',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '👑',
    coverColor: '#16A34A',
    value: 'fé e confiança em Deus',
    missionTitle: 'Guerreiro da Coragem',
    missionDesc: 'Escreva ou diga em voz alta três motivos pelos quais você confia em Deus para vencer seus medos!',
    reflectionQuestion: 'Como a fé nos torna fortes mesmo quando nos sentimos pequenininhos diante dos problemas?',
    paragraphs: [
      { text: "Davi era um jovem pastor de ovelhas que cuidava do seu rebanho com muito amor e responsabilidade nos prados de Israel.", prompt: "Young boy David playing a wooden harp among fluffy white sheep in green hills, 2D storybook illustration" },
      { text: "Quando um enorme gigante assustou os soldados no vale, o pequeno Davi manteve a calma. Ele sabia que a verdadeira força vem da confiança em Deus.", prompt: "Little David holding a wooden shepherd staff looking calmly at distant hills, 2D storybook illustration" },
      { text: "Com sua atiradeira de pastor e uma pedra lisa do riacho, Davi venceu o desafio e trouxe a paz de volta para todo o seu povo.", prompt: "Young David standing triumphantly in sunbeams with villagers cheering happily around him, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Arca de Noé',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🌈',
    coverColor: '#0891B2',
    value: 'obediência e esperança',
    missionTitle: 'Pintura da Esperança',
    missionDesc: 'Desenhe um arco-íris bem colorido e dê de presente para alguém que você ama!',
    reflectionQuestion: 'O que a promessa do arco-íris nos ensina sobre a fidelidade de Deus?',
    paragraphs: [
      { text: "Noé era um homem justo e temente a Deus. Ele seguiu cada orientação com carinho e construiu uma grande arca de madeira firme.", prompt: "Noah building a big wooden ark with happy animals walking up the wooden ramp, 2D storybook illustration" },
      { text: "Animais de todas as espécies entraram em pares na arca e foram protegidos durante a grande chuva sobre a Terra.", prompt: "Pairs of lions, giraffes and birds sitting peacefully inside Noah ark, 2D storybook illustration" },
      { text: "Quando a chuva cessou, uma pomba branca trouxe um ramo verde de oliveira, e um lindo arco-íris brilhou no céu em sinal de esperança.", prompt: "Vibrant rainbow over green hills with animals grazing happily under sunny sky, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 3. MULHERES FORTES
  // ==========================================
  {
    title: "Joana d'Arc",
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '⚔️',
    coverColor: '#DC2626',
    value: 'coragem e determinação',
    missionTitle: 'Chama da Coragem',
    missionDesc: 'Defenda a verdade hoje mesmo que seus colegas pensem diferente de você!',
    reflectionQuestion: 'Como a convicção nos nossos valores nos dá força para liderar com retidão?',
    paragraphs: [
      { text: "Joana d'Arc cresceu em um pequeno vilarejo no interior da França, cuidando das ovelhas de sua família com grande fé e alegria.", prompt: "Young Joan of Arc standing in a green flower field holding a white banner, sunny sky, 2D storybook illustration" },
      { text: "Com uma coragem impressionante e amor à sua terra, Joana liderou seu povo a restaurar a paz e a justiça no reino.", prompt: "Joan in shiny silver armor riding a white horse holding banner high, 2D storybook illustration" },
      { text: "Sua história inspira jovens até hoje a defenderem a verdade com bravura e integridade de caráter.", prompt: "Joan of Arc smiling warmly looking at a peaceful French countryside at sunset, 2D storybook illustration" }
    ]
  },
  {
    title: 'Princesa Isabel',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '📜',
    coverColor: '#4F46E5',
    value: 'justiça e liberdade',
    missionTitle: 'Ato de Justiça',
    missionDesc: 'Inclua um amigo que está sozinho em uma brincadeira hoje!',
    reflectionQuestion: 'Por que o verdadeiro líder usa seu poder para libertar e ajudar os outros?',
    paragraphs: [
      { text: "A Princesa Isabel estudou muito desde criança para governar com sabedoria, empatia e senso de justiça.", prompt: "Young Princess Isabel studying scrolls in a palace library, 2D storybook illustration" },
      { text: "No dia 13 de maio de 1888, com uma pena dourada, ela assinou a Lei Áurea, garantindo a liberdade de todas as pessoas no Brasil.", prompt: "Princess Isabel signing an official scroll with a gold feather pen in palace hall, 2D storybook illustration" },
      { text: "As ruas do país se encheram de flores e comemorações pela vitória da justiça e da igualdade humana.", prompt: "Crowds of happy diverse people throwing colorful flowers in sunny street, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 4. BIOGRAFIAS INSPIRADORAS
  // ==========================================
  {
    title: 'São Luís IX',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏰',
    coverColor: '#D97706',
    value: 'humildade e caridade',
    missionTitle: 'Mão Amiga',
    missionDesc: 'Ofereça ajuda para carregar algo pesado para seus pais hoje!',
    reflectionQuestion: 'O que significa servir aos outros de coração aberto?',
    paragraphs: [
      { text: "O rei Luís IX governou a França com muita justiça. Todos os dias, ele abria as portas do palácio para servir refeições aos necessitados.", prompt: "King Louis IX wearing royal cloak serving bread to poor people at long wooden table, 2D storybook illustration" },
      { text: "Ele ensinou a seus filhos que a verdadeira nobreza não está na coroa, mas em tratar todas as pessoas com respeito e caridade.", prompt: "King Louis smiling warmly hugging a young boy in throne room, 2D storybook illustration" }
    ]
  },
  {
    title: 'Santos Dumont e o Avião',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '✈️',
    coverColor: '#0284C7',
    value: 'criatividade e perseverança',
    missionTitle: 'Inventor por um Dia',
    missionDesc: 'Crie um aviãozinho de papel e tente fazê-lo voar o mais longe possível!',
    reflectionQuestion: 'Como a curiosidade e o trabalho contínuo transformam sonhos em invenções reais?',
    paragraphs: [
      { text: "Quando garoto nas fazendas de Minas Gerais, Alberto Santos Dumont olhava para o céu e desenhava mapas de máquinas voadoras.", prompt: "Young Santos Dumont sitting under a tree drawing airships in a notebook, 2D storybook illustration" },
      { text: "Trabalhando com dedicação e testes contínuos, Dumont construiu o 14-Bis e realizou o primeiro voo homologado do mundo em Paris.", prompt: "14-Bis biplane flying gracefully over Eiffel Tower in sunny Paris, 2D storybook illustration" },
      { text: "Sua invenção aproximou os continentes e mostrou o valor da inventividade brasileira para toda a humanidade.", prompt: "Santos Dumont smiling proudly standing next to his airplane model, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 5. CONTOS DE HERÓIS E FÁBULAS
  // ==========================================
  {
    title: 'O Leão e o Rato',
    category: 'contos-de-herois',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🐭',
    coverColor: '#EA580C',
    value: 'gratidão e respeito',
    missionTitle: 'Amigo Protetor',
    missionDesc: 'Trate com carinho alguém menor ou mais jovem que você hoje!',
    reflectionQuestion: 'Por que devemos respeitar a todos, independente do tamanho?',
    paragraphs: [
      { text: "Um grande leão poupou a vida de um pequeno rato que prometeu ajudar o rei da floresta quando ele precisasse.", prompt: "Big gentle lion smiling down at a tiny brave mouse on his paw, sunny jungle, 2D storybook illustration" },
      { text: "Dias depois, o leão ficou preso na rede dos caçadores. O ratinho apareceu rapidamente e roeu todas as cordas com seus dentes afiados.", prompt: "Tiny mouse chewing rope netting to free happy lion, bright forest, 2D storybook illustration" },
      { text: "O leão aprendeu que nenhum ato de gentileza é pequeno demais e que pequenos amigos podem realizar grandes atos de lealdade.", prompt: "Lion and mouse sitting happily together in a sunny forest clearing, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Bela e a Fera',
    category: 'contos-de-herois',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🌹',
    coverColor: '#B91C1C',
    value: 'amor e enxergar a essência',
    missionTitle: 'Olhar de Carinho',
    missionDesc: 'Faça um elogio sincero sobre as qualidades internas de alguém da sua família hoje!',
    reflectionQuestion: 'Por que a verdadeira beleza de uma pessoa está no seu coração e nas suas atitudes?',
    paragraphs: [
      { text: "Era uma vez uma jovem muito culta e bondosa chamada Bela. Seu pai, um comerciante dedicado, acabou se perdendo em uma noite fria e se abrigou em um misterioso castelo na floresta.", prompt: "An elderly merchant carrying a backpack walking toward a stone castle on a hill at sunset, 2D storybook illustration" },
      { text: "Para proteger seu querido pai, Bela decidiu morar no castelo. Lá ela conheceu o dono do lugar, uma Fera de aparência assustadora, mas que guardava uma profunda tristeza.", prompt: "Gentle young woman Bela in simple blue dress speaking to a tall furry Beast in a sunlit palace library, 2D storybook illustration" },
      { text: "Com o passar dos dias, Bela observou a gentileza, a educação e o respeito da Fera, percebendo que a verdadeira beleza não está na aparência exterior, mas no coração.", prompt: "Bela and the Beast reading books together near a large arched window with warm sunlight, 2D storybook illustration" },
      { text: "Quando a Fera ficou doente de saudade, Bela declarou seu afeto sincero. O encanto se desfez, e a Fera se transformou em um príncipe nobre e generoso.", prompt: "Handsome young prince standing holding hands with Bela in a rose garden under bright sun, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 6. VIRTUDES EM AÇÃO
  // ==========================================
  {
    title: 'O Garoto que Falou a Verdade',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '💎',
    coverColor: '#2563EB',
    value: 'honestidade e integridade',
    missionTitle: 'Falar a Verdade',
    missionDesc: 'Diga sempre a verdade hoje, mesmo que tenha cometido um pequeno erro!',
    reflectionQuestion: 'Por que a verdade limpa a nossa consciência e fortalece a amizade?',
    paragraphs: [
      { text: "Ao quebrar o vaso favorito de sua mãe durante uma brincadeira, o pequeno Lucas sentiu o coração apertar, mas decidiu ser honesto.", prompt: "Young boy looking at broken flower vase on floor with honest emotional expression, warm room, 2D storybook illustration" },
      { text: "Sua mãe o abraçou com carinho valorizando sua coragem de dizer a verdade imediatamente.", prompt: "Mother hugging young boy lovingly in warm sunlit room, 2D storybook illustration" },
      { text: "Lucas aprendeu que ser sincero gera confiança verdadeira e traz paz ao nosso coração.", prompt: "Young boy smiling happily holding hands with his mother in a garden, 2D storybook illustration" }
    ]
  },
  {
    title: 'Arrumando o Quarto',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🧹',
    coverColor: '#16A34A',
    value: 'autonomia e organização',
    missionTitle: 'Super Quarto Limpo',
    missionDesc: 'Guarde seus brinquedos e organize sua cama hoje sem os pais precisarem pedir!',
    reflectionQuestion: 'Como cuidar do nosso espaço pessoal nos torna pessoas mais autônomas?',
    paragraphs: [
      { text: "Sofia descobriu que organizar seus brinquedos em caixas coloridas deixava seu quarto bonito e aconchegante.", prompt: "Little girl putting colorful toy blocks happily into a storage box, 2D storybook illustration" },
      { text: "Com tudo limpo e guardado em poucos minutos, ela sentiu o orgulho de demonstrar autonomia e cooperação em casa.", prompt: "Little girl standing proudly in clean beautiful bedroom with sunbeams, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 7. NATUREZA E ANIMAIS
  // ==========================================
  {
    title: 'A Onça-Pintada do Pantanal',
    category: 'natureza-animais',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐆',
    coverColor: '#D97706',
    value: 'respeito à criação',
    missionTitle: 'Guardião das Plantas',
    missionDesc: 'Regue as plantas da sua casa com carinho hoje!',
    reflectionQuestion: 'Por que cuidar da natureza e dos animais é dever de todos nós?',
    paragraphs: [
      { text: "No coração do Pantanal brasileiro, a graciosa onça Tainá caminhava pelas margens límpidas do rio.", prompt: "Cute spotted jaguar walking on riverbank in lush Pantanal wetland, clear water, 2D storybook illustration" },
      { text: "Aprender sobre os rios, as árvores e a vida selvagem nos ensina a respeitar a criação divina com cuidado e carinho.", prompt: "Colorful macaws flying over lush green forest with jaguar resting peacefully, 2D storybook illustration" }
    ]
  }
];

async function wipeAndReseed() {
  console.log('[Wipe & Reseed] 🧹 Limpando TODAS as histórias antigas do Firestore...');
  
  const snap = await db.collection('stories').get();
  let deletedCount = 0;

  for (const doc of snap.docs) {
    await doc.ref.delete();
    deletedCount++;
  }
  console.log(`[Wipe & Reseed] ✨ ${deletedCount} documentos antigos excluídos com sucesso.`);

  console.log(`\n[Wipe & Reseed] 🚀 Cadastrando ${MASTER_CLASSIC_STORIES.length} histórias clássicas pré-configuradas...`);

  let createdCount = 0;

  for (const rawStory of MASTER_CLASSIC_STORIES) {
    const docRef = db.collection('stories').doc();
    let seedCounter = 100 + (createdCount * 50);

    const formattedParagraphs = rawStory.paragraphs.map((p, idx) => {
      const imgUrl = generate2DImageUrl(p.prompt, seedCounter + idx);
      return {
        index: idx,
        text: p.text,
        startTime: idx * 5000,
        endTime: (idx + 1) * 5000,
        isHighlight: idx % 3 === 0,
        imagePrompt: p.prompt,
        imageUrl: imgUrl
      };
    });

    const coverUrl = formattedParagraphs[0].imageUrl;
    const fullText = rawStory.paragraphs.map(p => p.text).join('\n\n');

    const payload = {
      id: docRef.id,
      title: rawStory.title,
      slug: rawStory.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: rawStory.category,
      ageGroups: rawStory.ageGroups,
      durationMinutes: Math.max(3, Math.ceil(formattedParagraphs.length / 2)),
      language: 'pt-BR',
      content: {
        text: fullText,
        paragraphs: formattedParagraphs
      },
      audio: {},
      coverEmoji: rawStory.coverEmoji,
      coverColor: rawStory.coverColor,
      coverImageUrl: coverUrl,
      nanoBananaImageUrl: coverUrl,
      value: rawStory.value,
      mission: {
        title: rawStory.missionTitle,
        description: rawStory.missionDesc,
        duration: '5 minutos'
      },
      reflection: {
        question: rawStory.reflectionQuestion
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
    };

    await docRef.set(payload);
    createdCount++;
    console.log(`[Wipe & Reseed] ✅ (${createdCount}/${MASTER_CLASSIC_STORIES.length}) História criada: "${rawStory.title}" (ID: ${docRef.id}, Páginas: ${formattedParagraphs.length})`);
  }

  console.log(`\n🎉 [Wipe & Reseed] CONCLUÍDO COM SUCESSO! Todas as ${createdCount} histórias clássicas estão pré-cadastradas no Firestore com ilustrações 2D limpas.`);
}

wipeAndReseed().then(() => process.exit(0)).catch(err => {
  console.error('[Wipe & Reseed] Erro:', err);
  process.exit(1);
});
