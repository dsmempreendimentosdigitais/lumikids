const fs = require('fs');
const path = require('path');

// Carrega .env.local
const envPath = path.resolve('.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      let value = trimmed.slice(idx + 1).trim();
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
  });
}

const db = admin.firestore();

function generate2DImageUrl(promptText, seed) {
  const cleanPrompt = promptText.replace(/[*_#~`"']/g, '').trim();
  const encoded = encodeURIComponent(cleanPrompt);
  return `/api/ai/image?prompt=${encoded}&seed=${seed}`;
}

const NEW_STORIES = [
  // ==========================================
  // 1. MITOLOGIA GREGA (mitologia-grega)
  // ==========================================
  {
    title: 'O Voo de Ícaro e a Prudência',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🪶',
    coverColor: '#D97706',
    value: 'prudência e humildade',
    missionTitle: 'Missão do Bom Conselho',
    missionDesc: 'Ouça atentamente hoje um conselho dado pelos seus pais ou professores e coloque em prática!',
    reflectionQuestion: 'Por que escutar quem tem mais experiência nos protege dos perigos do excesso de confiança?',
    paragraphs: [
      { text: "Na ilha de Creta, o genial arquiteto Dédalo e seu filho Ícaro viviam sob os cuidados do rei. Com saudades de sua terra natal, Dédalo começou a estudar o voo gracioso das gaivotas sobre as ondas azuis.", prompt: "Daedalus and his son Icarus observing seagulls flying over sunny blue sea cliffs, 2D storybook illustration" },
      { text: "Com paciência infinita, Dédalo juntou penas brancas de vários tamanhos e as uniu cuidadosamente com fios de linho e cera de abelhas aromática, moldando duas asas magníficas para ele e seu filho.", prompt: "Daedalus crafting majestic feathered wings with wax on a wooden workbench, sunny Greek workshop, 2D storybook illustration" },
      { text: "Antes de alçarem voo, Dédalo segurou as mãos de Ícaro e advertiu com ternura: 'Meu filho, voe pelo caminho do meio. Se voar muito baixo, a umidade do mar pesará suas asas; se voar muito alto, o sol derreterá a cera'.", prompt: "Daedalus placing wings gently on young Icarus shoulders, advising him with fatherly love, 2D storybook illustration" },
      { text: "Pai e filho bateram as asas e subiram aos céus. Os pastores e pescadores olhavam maravilhados lá de baixo, acreditando estarem vendo seres divinos cruzando as brisas do mar.", prompt: "Father and son flying through sunny sky over green islands and blue sea, 2D storybook illustration" },
      { text: "No início, Ícaro seguiu o pai com disciplina. Mas logo sentiu o entusiasmo de subir cada vez mais alto, encantando-se com o calor dourado dos raios solares e esquecendo-se da advertência recebida.", prompt: "Young Icarus flying happily higher toward bright golden sun with wings glowing, 2D storybook illustration" },
      { text: "O calor intenso amoleceu a cera que segurava as penas. Percebendo o perigo a tempo, Ícaro lembrou-se do conselho, manobrou com rapidez e desceu para a altitude segura indicada por seu sábio pai.", prompt: "Young Icarus descending safely through clouds back toward his father over calm blue sea, 2D storybook illustration" },
      { text: "Juntos, alcançaram a terra firme com segurança e gratidão. Ícaro guardou para sempre no coração que a verdadeira liberdade caminha lado a lado com a prudência e o respeito à sabedoria dos mais velhos.", prompt: "Daedalus and Icarus landing safely on a sunny sandy beach embraced with joy and relief, 2D storybook illustration" }
    ]
  },
  {
    title: 'O Toque de Midas e a Verdadeira Riqueza',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '✨',
    coverColor: '#F59E0B',
    value: 'gratidão e amor à família',
    missionTitle: 'Missão do Abraço de Ouro',
    missionDesc: 'Dê um abraço apertado em alguém que você ama e diga o quanto essa pessoa é valiosa para você!',
    reflectionQuestion: 'O que o ouro e o dinheiro não conseguem comprar que a família e a amizade nos dão de graça?',
    paragraphs: [
      { text: "O Rei Midas governava a Frígia cercado por palácios de mármore e lindos jardins de rosas perfumadas. Apesar de ter tudo, Midas acreditava tolamente que nada no mundo superava o brilho do ouro.", prompt: "King Midas walking in lush royal rose garden looking at gold coins in his hands, 2D storybook illustration" },
      { text: "Certo dia, um visitante místico concedeu-lhe um desejo por sua hospitalidade. Sem pensar duas vezes, Midas pediu com ambição: 'Que tudo o que eu tocar se transforme em ouro puro!'", prompt: "King Midas making a wish before a glowing mysterious guest in a sunlit palace hall, 2D storybook illustration" },
      { text: "Na manhã seguinte, Midas acordou maravilhado. Tocou um ramo de oliveira e ele reluziu em ouro maciço; tocou uma maçaneta e uma mesa, e tudo brilhava com ouro resplandecente.", prompt: "King Midas happily touching an apple and a wooden table turning them into pure gold, 2D storybook illustration" },
      { text: "Porém, na hora do almoço, veio a grande surpresa: ao tocar o pão macio e a taça de água fresca, eles viraram metal duro e frio, tornando impossível alimentar-se ou saciar a sede.", prompt: "King Midas looking shocked as a crust of bread turns to solid gold in his hands, 2D storybook illustration" },
      { text: "Sua querida filha, a princesinha Zoe, correu para confortá-lo ao vê-lo chorar. Antes que pudesse impedi-la, Midas a abraçou, e com profundo desespero viu sua filha transformar-se em uma estátua dourada e fria.", prompt: "King Midas weeping beside golden statue of his little daughter in palace dining room, 2D storybook illustration" },
      { text: "Ajoelhado em lágrimas sinceras, Midas orou: 'Por favor, levem todo o ouro do universo! Eu só quero o sorriso, o abraço e a vida da minha filha amada!'", prompt: "King Midas on his knees praying sincerely in palace courtyard with open hands, 2D storybook illustration" },
      { text: "O viajante sábio ouviu o arrependimento do rei e o instruiu a lavar as mãos nas águas puras do Rio Pactolo. Midas banhou-se com fervor e espalhou a água sagrada sobre a filha e seus bens.", prompt: "King Midas washing his hands in clear running river water with golden sparkles fading away, 2D storybook illustration" },
      { text: "Zoe voltou à vida e pulou nos braços do pai. Daquele dia em diante, Midas ensinou todo o reino que a verdadeira riqueza não está no metal reluzente, mas no amor, na saúde e na companhia de quem amamos.", prompt: "King Midas happily holding his living daughter in colorful rose garden, warm sunset light, 2D storybook illustration" }
    ]
  },
  {
    title: 'Jasão e os Argonautas',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '⛵',
    coverColor: '#0284C7',
    value: 'união e lealdade',
    missionTitle: 'Missão do Companheiro de Equipe',
    missionDesc: 'Trabalhe em equipe hoje em uma tarefa escolar ou doméstica, apoiando o ponto forte de cada um!',
    reflectionQuestion: 'Como a união de pessoas com talentos diferentes torna possível superar os maiores obstáculos?',
    paragraphs: [
      { text: "O príncipe Jasão precisava recuperar o trono de seu pai, usurpado injustamente pelo rei Pélias. O desafio imposto parecia impossível: navegar até os confins do mundo e trazer o sagrado Velo de Ouro.", prompt: "Young Jason looking bravely at ancient Greek scroll in majestic port city, 2D storybook illustration" },
      { text: "Jasão sabia que sozinho não conseguiria nada. Ele convocou os maiores heróis de todas as terras e construiu o navio Argos, cujas tábuas foram abençoadas com carvalho sagrado pelo mestre Argo.", prompt: "Group of diverse Greek heroes building a magnificent wooden galley ship on sunny beach, 2D storybook illustration" },
      { text: "A bordo do navio Argos estavam cinquenta heróis: o músico Orfeu, os gêmeos Castor e Pólux, e a ágil caçadora Atalanta. Cada um trazia um dom único a serviço da missão coletiva.", prompt: "Jason standing on prow of ship Argo surrounded by brave diverse crew sailing open blue ocean, 2D storybook illustration" },
      { text: "Ao passarem pelas temidas Rochas Simplégades, que se fechavam esmagando qualquer embarcação, Orfeu tocou sua lira suave enquanto a tripulação remava em perfeita sincronia guiada pela prudência.", prompt: "The Argo ship sailing gracefully between towering cliffs under bright clear sky, 2D storybook illustration" },
      { text: "Nas terras da Cólquida, Jasão manteve a compostura e o respeito aos costumes locais. Com a ajuda dos conselhos da princesa Medeia, amansou os touros mágicos sem ferir a terra sagrada.", prompt: "Jason calmly approaching majestic guardian bulls in sunlit sacred temple meadow, 2D storybook illustration" },
      { text: "Adormecendo o dragão guardião com uma melodia pacificadora, Jasão alcançou o Velo de Ouro no alto do carvalho ancestral, dividindo a glória da vitória com todos os seus companheiros.", prompt: "Jason reaching for glowing golden fleece on oak tree branch in mystical sunlit grove, 2D storybook illustration" },
      { text: "O navio Argos retornou triunfante à Grécia. Jasão ensinou a todos os povos que a honra de uma jornada não está na força de um único guerreiro, mas na lealdade e cooperação de amigos que confiam uns nos outros.", prompt: "The ship Argo welcomed by cheering crowds at marble port under triumphant blue sky, 2D storybook illustration" }
    ]
  },
  {
    title: 'Atalanta, a Corredora Invencível',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏹',
    coverColor: '#E11D48',
    value: 'determinação e igualdade',
    missionTitle: 'Missão do Foco e Energia',
    missionDesc: 'Pratique um esporte ou corrida hoje com espírito esportivo, celebrando o esforço de todos os participantes!',
    reflectionQuestion: 'O que aprendemos quando competimos com respeito mútuo e honra aos nossos talentos?',
    paragraphs: [
      { text: "Nas verdes florestas da Arcádia, a jovem Atalanta cresceu em harmonia com a natureza. Veloz como o vento e com olhos atentos como os de uma águia, ela superava qualquer pessoa na corrida e no arco.", prompt: "Young brave girl Atalanta running swiftly through sunlit green forest with deer, 2D storybook illustration" },
      { text: "Quando o terrível Javali de Cálidon ameaçou as colheitas dos camponeses, muitos guerreiros duvidaram da jovem. Porém, foi a flecha certeira de Atalanta que primeiro conteve a fera, salvando a aldeia com coragem.", prompt: "Atalanta with bow and arrow protecting grateful villagers in mountain forest, 2D storybook illustration" },
      { text: "Para escolher seu companheiro de vida, Atalanta declarou que se casaria apenas com quem conseguisse vencê-la em uma corrida a pé, mantendo o direito de ser dona do seu próprio destino.", prompt: "Atalanta ready at starting line of ancient Greek running track with marble pillars, 2D storybook illustration" },
      { text: "O jovem Hipomene, que a admirava não só por sua beleza mas pela nobreza de seu caráter, buscou a orientação da deusa Afrodite e recebeu três maçãs douradas colhidas no Jardim das Hespérides.", prompt: "Young man Hippomenes holding three shiny golden apples in a sunlit olive grove, 2D storybook illustration" },
      { text: "Durante a prova emocionante, Atalanta corria com elegância sem igual. Hipomene soltou suavemente uma maçã de ouro brilhante no caminho, que rolou pela grama cintilando sob o sol.", prompt: "Atalanta pausing with curious smile to pick up golden apple on grass during race, 2D storybook illustration" },
      { text: "Fascinada pela beleza e perfeição das maçãs, Atalanta parou por breves instantes para recolhê-las, permitindo que Hipomene cruzasse a linha de chegada lado a lado com ela com profundo respeito.", prompt: "Hippomenes and Atalanta crossing finish line together smiling happily, 2D storybook illustration" },
      { text: "Atalanta e Hipomene uniram suas vidas como verdadeiros parceiros e heróis, demonstrando que a inteligência, o respeito e a admiração mútua criam a mais bela das alianças.", prompt: "Atalanta and Hippomenes walking joyfully through blooming meadow hand in hand, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 2. HISTÓRIAS DA BÍBLIA (biblia-kids)
  // ==========================================
  {
    title: 'Daniel na Cova dos Leões',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🦁',
    coverColor: '#0D9488',
    value: 'fé inabalável e integridade',
    missionTitle: 'Missão da Fidelidade',
    missionDesc: 'Mantenha-se firme na verdade hoje, mesmo que pessoas ao redor tentem convencê-lo a fazer o errado!',
    reflectionQuestion: 'Como a calma e a oração nos ajudam a manter a paz quando passamos por momentos assustadores?',
    paragraphs: [
      { text: "Na grandiosa Babilônia, o jovem profeta Daniel servia no palácio do Rei Dario. Por sua sabedoria, justiça e honestidade irrepreensível, o rei planejava nomeá-lo o principal administrador de todo o império.", prompt: "Daniel in simple blue linen tunic speaking wisely to King Darius in golden Babylonian throne room, 2D storybook illustration" },
      { text: "Oficiais ciumentos, que não encontravam nenhum erro ou mentira na conduta de Daniel, tramaram um decreto injusto: durante trinta dias, qualquer pessoa que orasse a qualquer outro Deus além do rei seria lançada na cova dos leões.", prompt: "Conspiring officials presenting a sealed parchment decree to the king in palace hall, 2D storybook illustration" },
      { text: "Ao saber do decreto, Daniel não se escondeu nem mudou seus hábitos. Como sempre fazia, abriu as janelas de seu quarto voltadas para Jerusalém e ajoelhou-se três vezes ao dia para orar com serenidade e gratidão.", prompt: "Daniel kneeling calmly in prayer beside open arched window overlooking sunlit ancient city, 2D storybook illustration" },
      { text: "Os conspiradores denunciaram Daniel perante o rei. Dario ficou profundamente triste por ter sido enganado pela própria lei, mas não encontrou saída legal e ordenou que Daniel fosse levado à cova.", prompt: "King Darius looking sad and regretful as guards gently escort calm Daniel to stone cave, 2D storybook illustration" },
      { text: "Antes de fechar a pedra, o rei disse com esperança: 'Que o teu Deus, a quem tu serves continuamente, te livre!' Uma enorme pedra foi selada na entrada da cova escura.", prompt: "Large stone rolling over entrance of lion den with royal seal, evening twilight, 2D storybook illustration" },
      { text: "Dentro da cova, leões gigantescos caminhavam famintos. Mas um anjo luminoso desceu dos céus e fechou a boca das feras. Os leões deitaram-se pacificamente aos pés de Daniel como mansos gatinhos.", prompt: "Daniel sitting peacefully surrounded by majestic sleeping lions and a soft gentle angelic glow, 2D storybook illustration" },
      { text: "O rei Dario passou a noite em jejum sem conseguir dormir. Ao raiar da aurora, correu até a cova e clamou com voz aflita: 'Daniel, servo do Deus vivo, deu certo o teu Deus te salvar dos leões?'", prompt: "King Darius running to the stone cave in morning pink light shouting with hope, 2D storybook illustration" },
      { text: "De dentro da cova, a voz serena de Daniel respondeu: 'Viva o rei para sempre! O meu Deus enviou o Seu anjo e fechou a boca dos leões, pois nenhuma maldade foi achada em mim!'", prompt: "Daniel smiling happily emerging unhurt from the den as the king rejoices, 2D storybook illustration" },
      { text: "O rei cheio de júbilo mandou içar Daniel imediatamente e promulgou um novo decreto por todo o império, declarando que o Deus de Daniel é o protetor eterno dos que andam na justiça e na paz.", prompt: "King Darius and Daniel embracing in bright morning sunlight as people celebrate, 2D storybook illustration" }
    ]
  },
  {
    title: 'José do Egito e o Poder do Perdão',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌾',
    coverColor: '#0F766E',
    value: 'perdão e reconciliação',
    missionTitle: 'Missão do Abraço da Paz',
    missionDesc: 'Perdoe de coração um amigo ou irmão que tenha te chateado recentemente e faça as pazes hoje mesmo!',
    reflectionQuestion: 'Por que perdoar quem errou conosco nos torna muito mais livres e felizes do que guardar mágoa?',
    paragraphs: [
      { text: "Na terra de Canaã, o jovem José era amado por seu pai Jacó, que lhe deu uma bela túnica de muitas cores. José tinha sonhos especiais, mas a inveja de seus irmãos mais velhos cresceu a ponto de eles o venderem como servo.", prompt: "Young Joseph wearing a colorful striped coat in sunny pastoral valley tending sheep, 2D storybook illustration" },
      { text: "Levado para o Egito distante, José manteve a fé inabalável, a integridade e a boa vontade. Mesmo diante de falsas acusações que o levaram à prisão, ele serviu a todos com alegria, honestidade e paciência.", prompt: "Joseph helping people with kindness in sunlit courtyard of ancient Egyptian residence, 2D storybook illustration" },
      { text: "Anos depois, o Faraó teve sonhos misteriosos com sete vacas gordas devoradas por sete vacas magras. Convocado, José interpretou com sabedoria: viriam sete anos de grande fartura seguidos por sete anos de escassez.", prompt: "Joseph standing respectfully before Pharaoh on his throne explaining dream with warmth, 2D storybook illustration" },
      { text: "Impressionado com a prudência de José, o Faraó o nomeou governador de todo o Egito. Durante os anos férteis, José organizou celeiros imensos em todas as cidades, armazenando grãos para alimentar o povo.", prompt: "Joseph wearing noble Egyptian robes overseeing golden wheat harvest stored in tall silos, 2D storybook illustration" },
      { text: "Quando a seca atingiu a terra, pessoas de muitas nações viajaram ao Egito para comprar comida, inclusive os dez irmãos de José, que não o reconheceram após tantos anos passados.", prompt: "Travelers from desert arriving at bustling Egyptian market with sacks of wheat, 2D storybook illustration" },
      { text: "Em vez de se vingar pelo sofrimento que passou, o coração de José se encheu de compaixão. Ele os testou para ver se haviam mudado e, ao ver o arrependimento sincero deles, não conteve as lágrimas.", prompt: "Joseph turning his face away with emotional tears in his eyes in palace chamber, 2D storybook illustration" },
      { text: "José revelou-se a eles: 'Eu sou José, vosso irmão! Não se aflijam nem fiquem com raiva de si mesmos. Deus transformou o que era dor em salvação para salvar muitas vidas!'", prompt: "Joseph weeping with open arms embracing his stunned brothers with deep love, 2D storybook illustration" },
      { text: "José mandou buscar seu idoso pai Jacó e toda a sua família, acolhendo-os na melhor terra do Egito. O perdão curou todas as feridas e uniu aquela família em um abraço de amor que atravessou séculos.", prompt: "Elderly Jacob embracing Joseph with tears of joy surrounded by large happy family, 2D storybook illustration" }
    ]
  },
  {
    title: 'Moisés e a Travessia do Mar Vermelho',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌊',
    coverColor: '#0284C7',
    value: 'coragem e esperança',
    missionTitle: 'Missão do Passo de Fé',
    missionDesc: 'Quando algo parecer impossível hoje, confie, respire fundo e dê o primeiro passo com coragem!',
    reflectionQuestion: 'Como a confiança no Criador nos dá forças para seguir em frente quando os caminhos parecem fechados?',
    paragraphs: [
      { text: "Após séculos de servidão no Egito, o povo de Israel partiu em busca da liberdade guiado pelo sábio líder Moisés. Homens, mulheres e crianças caminhavam pelo deserto com o coração cheio de esperança.", prompt: "Moses holding a wooden staff leading a joyful crowd of families walking into the sunny desert, 2D storybook illustration" },
      { text: "De dia, uma coluna de nuvem os protegia do sol escaldante; de noite, uma coluna de fogo suave os aquecia e iluminava seus passos pelas areias douradas.", prompt: "A comforting luminous pillar of cloud hovering over peaceful desert camp, sunset light, 2D storybook illustration" },
      { text: "Porém, ao chegarem diante das praias imensas do Mar Vermelho, avistaram as carruagens do Faraó se aproximando ao longe. O povo sentiu medo, encurralado entre as águas profundas e o exército.", prompt: "Families looking anxiously at deep blue sea waves in front of them with dust cloud in distance, 2D storybook illustration" },
      { text: "Moisés subiu em uma rocha à beira d'água e disse ao povo com voz firme e calma: 'Não temam! Fiquem firmes e vejam o livramento que o Senhor lhes dará hoje!'", prompt: "Moses standing tall and calm on coastal rocks raising his hands to encourage the people, 2D storybook illustration" },
      { text: "Moisés estendeu seu cajado sobre as águas. Um vento oriental forte e constante soprou a noite toda, abrindo o mar em dois e formando gigantescas paredes de água cristalina à esquerda e à direita.", prompt: "Moses stretching staff over crashing sea as water separates revealing a dry sand path, 2D storybook illustration" },
      { text: "O leito do mar transformou-se em chão seco e seguro. Com os olhos cheios de espanto e gratidão, todo o povo atravessou a pé pelas profundezas, vendo peixes e corais brilhando nas paredes de água.", prompt: "Families walking peacefully across dry path through parted blue sea walls with bright light, 2D storybook illustration" },
      { text: "Ao chegarem em segurança à outra margem, Moisés estendeu a mão novamente e as águas voltaram ao seu lugar em perfeita calmaria. A liberdade estava conquistada.", prompt: "Calm blue sea closing back as morning sun rises over desert coastline, 2D storybook illustration" },
      { text: "Míriam, irmã de Moisés, pegou seu pandeiro e liderou todas as mulheres e crianças em uma dança de celebração e louvor, ensinando que a fé abre caminhos onde parecia não haver saída.", prompt: "Miriam playing tambourine leading joyful singing families dancing on coastal dunes, 2D storybook illustration" }
    ]
  },
  {
    title: 'Jonas e o Grande Peixe',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🐋',
    coverColor: '#0369A1',
    value: 'obediência e compaixão',
    missionTitle: 'Missão do Coração Generoso',
    missionDesc: 'Deseje o bem e ajude hoje uma pessoa que você normalmente não costuma conversar!',
    reflectionQuestion: 'Por que devemos desejar que todas as pessoas tenham a oportunidade de aprender e melhorar?',
    paragraphs: [
      { text: "O profeta Jonas recebeu uma missão sagrada: viajar até a grande cidade de Nínive e avisar as pessoas para abandonarem as más atitudes e viverem com amor e respeito mútuo.", prompt: "Jonah standing in village market receiving inspiration with thoughtful expression, 2D storybook illustration" },
      { text: "Com receio de que o povo de Nínive não o ouvisse, Jonas tentou fugir de sua responsabilidade. Ele embarcou em um navio de mercadores no porto de Jope, navegando para a distante cidade de Társis.", prompt: "Jonah boarding wooden merchant ship with sails set towards stormy sea horizon, 2D storybook illustration" },
      { text: "Em alto-mar, uma tempestade violenta fez o navio balançar perigosamente. Os marinheiros clamavam com medo. Jonas reconheceu seu erro e disse honestamente que a tempestade cessaria se o lançassem ao mar.", prompt: "Big waves splashing over wooden ship deck as brave sailors look at sincere Jonah, 2D storybook illustration" },
      { text: "Ao ser jogado na água, o mar acalmou-se imediatamente. Mas Jonas não se afogou: um grande peixe gentil enviado para socorrê-lo engoliu Jonas com cuidado, mantendo-o a salvo dentro de seu ventre.", prompt: "Large friendly blue whale gently approaching Jonah under clear turquoise water, 2D storybook illustration" },
      { text: "Durante três dias no ventre do peixe, no silêncio do oceano, Jonas orou com profundo arrependimento e gratidão pela vida, prometendo cumprir sua missão de ajudar os outros com amor.", prompt: "Jonah sitting peacefully inside glowing warm underwater space praying with folded hands, 2D storybook illustration" },
      { text: "O grande peixe nadou até a beira de uma praia ensolarada e depositou Jonas suavemente na areia morna. Jonas levantou-se com vigor renovado e partiu imediatamente para Nínive.", prompt: "Large whale releasing Jonah gently onto sunny sandy beach near palm trees, 2D storybook illustration" },
      { text: "Jonas caminhou pelas praças de Nínive convidando todos à paz. Desde o rei em seu trono até as crianças nas ruas, todos se arrependeram e passaram a cuidar uns dos outros com amor e bondade.", prompt: "People of ancient Nineveh embracing peacefully in city square listening to Jonah, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Sabedoria do Rei Salomão',
    category: 'biblia-kids',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '👑',
    coverColor: '#CA8A04',
    value: 'discernimento e justiça',
    missionTitle: 'Missão da Decisão Justa',
    missionDesc: 'Ouça todos os lados com calma antes de tirar conclusões em uma brincadeira ou conversa!',
    reflectionQuestion: 'Como a busca pela sabedoria e empatia nos ajuda a tomar as melhores decisões para o bem de todos?',
    paragraphs: [
      { text: "Quando o jovem Salomão tornou-se rei de Israel após seu pai Davi, sentiu o peso da grande responsabilidade. Em uma noite de oração, pediu não por riquezas ou vida longa, mas por sabedoria para julgar o povo com justiça.", prompt: "Young King Solomon kneeling before altar in sunlit temple with hands open seeking wisdom, 2D storybook illustration" },
      { text: "O Criador alegrou-se com a humildade do jovem e concedeu-lhe um coração sábio e compreensivo como nunca antes se vira, além de paz e prosperidade para todo o reino.", prompt: "King Solomon wearing royal blue and gold robes sitting thoughtfully on throne, 2D storybook illustration" },
      { text: "Certo dia, duas mães entraram na corte real chorando. Elas dividiam a mesma casa e haviam tido bebês ao mesmo tempo, mas uma delas perdeu o seu filho e agora ambas reivindicavam ser a verdadeira mãe da criança viva.", prompt: "Two women standing before the king in throne room arguing tearfully over a healthy baby, 2D storybook illustration" },
      { text: "Os conselheiros e guardas não sabiam como desvendar o mistério, pois não havia testemunhas. O rei Salomão observou atentamente o olhar e a respiração de cada uma das mulheres.", prompt: "King Solomon looking deeply and perceptively at both women with calm judicial expression, 2D storybook illustration" },
      { text: "Salomão ordenou: 'Tragam-me uma espada! Dividam a criança ao meio e deem metade a cada mulher'. Os guardas hesitaram sem compreender a estratégia psicológica do sábio monarca.", prompt: "A guard holding a bronze sword upright as king gives calm instruction from throne, 2D storybook illustration" },
      { text: "Naquele instante, a verdadeira mãe ajoelhou-se em desespero e gritou: 'Ó meu senhor, deem o bebê a ela! Não o matem, deixem-no viver!' Enquanto isso, a outra dizia friamente que dividissem.", prompt: "True mother on her knees crying out with self-sacrificing maternal love, 2D storybook illustration" },
      { text: "Salomão sorriu com profunda ternura e apontou para a primeira mulher: 'Entreguem a criança a ela, pois ela é a verdadeira mãe! O amor genuíno prefere abrir mão a ver o filho sofrer'.", prompt: "King Solomon smiling warmly as guard hands healthy baby back to joyful weeping mother, 2D storybook illustration" },
      { text: "A notícia da sabedoria do rei espalhou-se por todas as terras, e governantes de nações distantes viajavam a Jerusalém para aprender com suas palavras e testemunhar um reino governado pela justiça.", prompt: "People and travelers gathering in majestic courtyard admiring the wise and fair King Solomon, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 3. MULHERES FORTES (mulheres-fortes)
  // ==========================================
  {
    title: 'Hatshepsut, a Faraó da Paz e Prosperidade',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '👑',
    coverColor: '#E11D48',
    value: 'diplomacia e liderança pacífica',
    missionTitle: 'Missão da Convivência Harmoniosa',
    missionDesc: 'Resolva um desentendimento hoje usando o diálogo tranquilo em vez de brigas!',
    reflectionQuestion: 'Por que construir pontes de amizade e cooperação é uma vitória muito maior do que vencer guerras?',
    paragraphs: [
      { text: "Às margens do fértil Rio Nilo, no Antigo Egito, a princesa Hatshepsut cresceu observando a administração dos celeiros, a construção dos monumentos e a sabedoria dos escribas do templo.", prompt: "Young Egyptian princess Hatshepsut standing on palace balcony overlooking blue Nile River and lotus flowers, 2D storybook illustration" },
      { text: "Quando assumiu o trono real, Hatshepsut tomou uma decisão revolucionária: em vez de liderar guerras de conquista, seu reinado seria focado na educação, na arte e no comércio pacífico entre as nações.", prompt: "Queen Hatshepsut wearing golden pharaoh headdress speaking with architects and scribes, 2D storybook illustration" },
      { text: "Ela organizou uma expedição naval lendária à terra de Punt. Cinco grandes navios egípcios navegaram pelas águas límpidas do Mar Vermelho carregados de tecidos e artesanato para trocar com povos vizinhos.", prompt: "Magnificent ancient Egyptian ships sailing on turquoise waters carrying goods peacefully, 2D storybook illustration" },
      { text: "A expedição retornou com mudas vivas de árvores de incenso, marfim, ouro e especiarias raras. Hatshepsut mandou plantar as árvores nos pátios dos templos, perfumando a capital com a doçura da paz.", prompt: "Workers planting aromatic green myrrh trees in sunny courtyards with Egyptian columns, 2D storybook illustration" },
      { text: "Hatshepsut encomendou ao arquiteto Senemut a construção de Deir el-Bahari, um dos templos mais deslumbrantes da história humana, erguido em harmonia perfeita com as encostas de rocha calcária.", prompt: "Majestic terraced stone temple of Deir el-Bahari nestled against golden sandstone cliffs, 2D storybook illustration" },
      { text: "Durante mais de duas décadas de liderança visionária, Hatshepsut garantiu alimento farto para todas as famílias do Egito e provou que a grandeza de um governante se mede pelas vidas que ele constrói e protege.", prompt: "Pharaoh Hatshepsut smiling with dignity surrounded by happy Egyptian families and blooming gardens, 2D storybook illustration" }
    ]
  },
  {
    title: 'Mulan e a Honra da Família',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌸',
    coverColor: '#BE123C',
    value: 'amor filial e bravura',
    missionTitle: 'Missão do Cuidado Familiar',
    missionDesc: 'Ajude voluntariamente seus pais ou avós em uma tarefa que eles costumam fazer sozinhos!',
    reflectionQuestion: 'Como o amor sincero pela nossa família nos dá forças para enfrentar os maiores desafios?',
    paragraphs: [
      { text: "Nas montanhas floridas da China Antiga, a jovem Hua Mulan vivia em uma aldeia tranquila tecendo sedas e praticando artes marciais sob o olhar carinhoso de seu idoso pai, um veterano de guerra.", prompt: "Young Chinese girl Hua Mulan practicing graceful martial arts in courtyard with pink peach blossoms, 2D storybook illustration" },
      { text: "Quando mensageiros do Imperador chegaram anunciando que cada família deveria enviar um homem para defender as fronteiras do reino, o coração de Mulan se apertou ao ver seu pai idoso e frágil aprontando a espada.", prompt: "Elderly kind father looking with tired eyes at ancient armor in wooden traditional house, 2D storybook illustration" },
      { text: "Movida por um amor filial sem limites, Mulan tomou uma decisão corajosa: cortou seus longos cabelos, vestiu a armadura da família e partiu montada em seu fiel cavalo para assumir o lugar do pai.", prompt: "Mulan with short hair tying her armor firmly under moonlight with determined gentle gaze, 2D storybook illustration" },
      { text: "No acampamento militar, Mulan treinou com disciplina impecável. Com inteligência estratégica, pontaria certeira e humildade, conquistou o respeito e a amizade leal de todos os seus companheiros.", prompt: "Mulan training with staff and bow alongside fellow soldiers in misty mountain valley, 2D storybook illustration" },
      { text: "Durante uma perigosa batalha nas montanhas geladas, foi a agilidade e a mente brilhante de Mulan que causou uma avalanche de neve controlada, desarmando o exército invasor e salvando todo o destacamento.", prompt: "Mulan shooting a signal arrow creating controlled snow avalanche in snowy mountain pass, 2D storybook illustration" },
      { text: "Diante do Imperador na Cidade Proibida, Mulan foi honrada perante todo o império. O monarca ofereceu-lhe os mais altos cargos ministeriais, mas Mulan pediu apenas um cavalo veloz para voltar ao abraço de seu pai.", prompt: "The Emperor bowing respectfully to brave Mulan in grand imperial palace courtyard, 2D storybook illustration" },
      { text: "Ao retornar à aldeia, seu pai a abraçou com lágrimas de orgulho: 'A maior honra e glória que já recebi na vida, minha filha, é ter você como presente em meu lar'.", prompt: "Elderly father embracing smiling Mulan warmly in home courtyard under blooming cherry blossoms, 2D storybook illustration" }
    ]
  },
  {
    title: 'Marie Curie e a Luz da Descoberta',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🔬',
    coverColor: '#9333EA',
    value: 'perseverança e generosidade científica',
    missionTitle: 'Missão da Curiosidade Científica',
    missionDesc: 'Descubra hoje como funciona algo curioso na sua casa (como um filtro de água ou uma lâmpada)!',
    reflectionQuestion: 'Por que o amor pelo conhecimento e a vontade de ajudar o mundo são mais valiosos que patentes e fama?',
    paragraphs: [
      { text: "Na fria Varsóvia, na Polônia, a pequena Maria Sklodowska lia livros sob a luz de lamparinas, sonhando em desvendar os segredos da natureza. Apesar de seu país proibir mulheres de frequentar a universidade, ela nunca desistiu.", prompt: "Young girl Marie studying passionately with stack of science books by candlelight in cozy library, 2D storybook illustration" },
      { text: "Trabalhando durante anos como governanta para ajudar nos estudos da irmã, Maria economizou cada centavo até conseguir viajar para Paris e ingressar na prestigiada Universidade da Sorbonne.", prompt: "Young Marie arriving with determination at historic Parisian university university building with autumn leaves, 2D storybook illustration" },
      { text: "Em um galpão simples e frio, ao lado de seu companheiro Pierre Curie, Marie passou anos purificando toneladas de minério de pechblenda, trabalhando dia e noite com caldeirões de ferro e tubos de vidro.", prompt: "Marie and Pierre Curie working patiently with glowing test tubes in old laboratory workshop, 2D storybook illustration" },
      { text: "Em uma noite escura de 1898, entraram no laboratório e viram frascos brilhando com uma suave e fascinante luz azulada. Marie havia descoberto dois novos elementos químicos: o Polônio e o Rádio.", prompt: "Marie Curie looking with wonder at glass vial glowing with soft beautiful blue light in dark laboratory, 2D storybook illustration" },
      { text: "Marie recusou-se a patentear sua descoberta para ganhar dinheiro, doando todas as pesquisas livremente aos médicos de todo o mundo para que criassem tratamentos contra doenças graves.", prompt: "Marie Curie smiling generously presenting scientific notebooks to doctors and students, 2D storybook illustration" },
      { text: "Ela se tornou a primeira mulher a ganhar um Prêmio Nobel — e a única pessoa na história a receber dois Prêmios Nobel em duas áreas científicas diferentes: Física e Química.", prompt: "Marie Curie standing proudly with gold Nobel medal surrounded by international scientists, 2D storybook illustration" },
      { text: "Durante a Primeira Guerra Mundial, Marie criou ambulâncias com aparelhos portáteis de raio-X que ela mesma dirigia, salvando a vida de mais de um milhão de soldados feridos nos hospitais de campanha.", prompt: "Marie Curie driving a medical vehicle with red cross helping injured people with courage, 2D storybook illustration" }
    ]
  },
  {
    title: 'Maria Quitéria, a Heroína da Independência',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🇧🇷',
    coverColor: '#16A34A',
    value: 'patriotismo e bravura cívica',
    missionTitle: 'Missão do Amor à Pátria',
    missionDesc: 'Aprenda e cante um verso do Hino Nacional ou conheça um herói da história do nosso país!',
    reflectionQuestion: 'Como o compromisso com a justiça e a liberdade ajuda a construir um país melhor para todos?',
    paragraphs: [
      { text: "No sertão da Bahia, em Feira de Santana, a jovem Maria Quitéria de Jesus cresceu montando a cavalo e dominando com precisão o manejo de ferramentas no campo. Ela tinha um coração patriota que vibrava pela liberdade do Brasil.", prompt: "Young Brazilian girl Maria Quiteria riding horse through beautiful Bahia countryside under sunny blue sky, 2D storybook illustration" },
      { text: "Em 1822, quando o Brasil declarou sua independência, voluntários foram chamados para defender a jovem nação contra as tropas que resistiam em Salvador. Quitéria sentiu no peito o chamado do dever.", prompt: "Crowd of Brazilian patriots gathering in town square with green and yellow banners, 2D storybook illustration" },
      { text: "Seu pai proibiu sua partida, mas com a ajuda de sua irmã, Quitéria vestiu as roupas de soldado de seu cunhado e alistou-se como voluntária com o nome de 'Soldado Medeiros' no Batalhão dos Voluntários do Príncipe.", prompt: "Maria Quiteria in uniform standing tall and confident at military muster in Bahia, 2D storybook illustration" },
      { text: "Logo sua bravura e disciplina destacaram-se. Ao saber da verdade, o comandante não a dispensou; pelo contrário, elogiou sua coragem exemplar e a promoveu, adicionando um saiote ao seu uniforme de gala.", prompt: "Maria Quiteria proudly wearing historic Brazilian uniform with blue and green tunic, 2D storybook illustration" },
      { text: "Na histórica Batalha da Pituba e na foz do Rio Paraguaçu, Maria Quitéria liderou a resistência na linha de frente com coragem inabalável, impedindo o desembarque de forças contrárias à liberdade.", prompt: "Maria Quiteria leading courageous defense near coastal river mouth under sunny sky, 2D storybook illustration" },
      { text: "Em 2 de julho de 1823, Salvador foi libertada em festa. Quitéria desfilou coberta de flores pelo povo baiano e foi recebida no Rio de Janeiro pelo Imperador Dom Pedro I, que a condecorou com a Imperial Ordem do Cruzeiro.", prompt: "Emperor Dom Pedro I awarding royal medal of honor to Maria Quiteria in sunlit palace hall, 2D storybook illustration" },
      { text: "Maria Quitéria retornou ao seu sertão como símbolo eterno de que a determinação, o amor à terra e a coragem feminina são pilares fundamentais da história do Brasil.", prompt: "Maria Quiteria smiling peacefully on Bahian farm holding the Brazilian flag with dignity, 2D storybook illustration" }
    ]
  },
  {
    title: 'Anita Garibaldi, a Heroína dos Dois Mundos',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🏇',
    coverColor: '#059669',
    value: 'lealdade e bravura incondicional',
    missionTitle: 'Missão da Coragem Cotidiana',
    missionDesc: 'Defenda um amigo que esteja sendo tratado de forma injusta em uma conversa ou brincadeira!',
    reflectionQuestion: 'O que significa lutar por um ideal com lealdade mesmo quando as circunstâncias são difíceis?',
    paragraphs: [
      { text: "Em Laguna, no litoral de Santa Catarina, nasceu Ana Maria de Jesus Ribeiro, carinhosamente chamada de Anita. Desde menina, ela cavalgava livre pelas praias e campos sulistas com espírito indomável e senso de justiça.", prompt: "Young brave girl Anita riding a black horse along white sand beach and blue ocean waves, 2D storybook illustration" },
      { text: "Quando a Revolução Farroupilha proclamou a República Juliana em 1839, Anita conheceu o jovem italiano Giuseppe Garibaldi. Eles uniram suas vidas e seus ideais de liberdade em uma parceria histórica.", prompt: "Anita and Giuseppe Garibaldi meeting near wooden dock in historic colonial Brazilian port, 2D storybook illustration" },
      { text: "Anita não ficava na retaguarda: ela participou ativamente das batalhas navais e terrestres, cuidando dos feridos, recarregando canhões e encorajando os combatentes com sua energia contagiante.", prompt: "Anita Garibaldi standing bravely on ship deck defending her companions with courage, 2D storybook illustration" },
      { text: "Certa vez, cercada por tropas adversárias durante uma retirada nos pampas, Anita conseguiu escapar a galope por florestas densas e rios caudalosos, cruzando o perigoso Rio Canoas a nado com seu cavalo.", prompt: "Anita galloping fearlessly across rushing river on horseback under stormy sky, 2D storybook illustration" },
      { text: "Mais tarde, viajou para a Europa para apoiar a unificação da Itália ao lado de Garibaldi, tornando-se admirada em dois continentes como a 'Heroína dos Dois Mundos'.", prompt: "Anita Garibaldi riding alongside freedom defenders through historic Italian hills under sunset sky, 2D storybook illustration" },
      { text: "Seu nome e sua memória permanecem gravados em praças, cidades e corações no Brasil e na Itália como exemplo de lealdade, força de vontade e paixão pela liberdade de todos os povos.", prompt: "Statue and memory of Anita Garibaldi honored with blooming flowers and sunshine in public square, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 4. BIOGRAFIAS INSPIRADORAS (biografias-historicas)
  // ==========================================
  {
    title: 'Abraham Lincoln e a Lâmpada da Honestidade',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🎩',
    coverColor: '#4F46E5',
    value: 'honestidade e empatia',
    missionTitle: 'Missão do Troco Certo',
    missionDesc: 'Pratique a honestidade absoluta hoje: se alguém esquecer algo ou der algo a mais, devolva na hora!',
    reflectionQuestion: 'Por que ser conhecido como uma pessoa honesta é a maior honra que alguém pode conquistar na vida?',
    paragraphs: [
      { text: "Nas florestas rurais de Kentucky, o menino Abraham Lincoln cresceu em uma humilde cabana de troncos de madeira. Sem dinheiro para comprar velas, ele deitava-se perto do fogo da lareira para ler livros de história até tarde da noite.", prompt: "Young boy Abraham Lincoln reading a book by the warm glow of a cabin fireplace, 2D storybook illustration" },
      { text: "Abe caminhava quilômetros a pé para pegar livros emprestados com vizinhos distantes. Certa vez, quando uma chuva molhou um livro de biografias de George Washington que havia pego emprestado, trabalhou dias no campo do vizinho para pagar o dano.", prompt: "Young Lincoln walking with a book under his arm along a country dirt path with tall trees, 2D storybook illustration" },
      { text: "Quando jovem, trabalhando como balconista em um pequeno armazém de secos e molhados, percebeu que havia cobrado alguns centavos a mais de uma senhora por engano. Após fechar a loja, caminhou quilômetros na noite escura para devolver o troco exato.", prompt: "Young Lincoln handing coins back to an elderly lady at her porch in evening light with sincere smile, 2D storybook illustration" },
      { text: "Pela sua retidão impecável em todas as situações, todos na região passaram a chamá-lo com carinho de 'Honest Abe' (Abe Honesto). Ele estudou direito por conta própria e tornou-se um advogado dedicado a defender os pobres.", prompt: "Lincoln speaking kindly and honestly to people outside a rustic courthouse, 2D storybook illustration" },
      { text: "Eleito Presidente dos Estados Unidos em um momento de grave divisão no país, Lincoln manteve a firmeza moral de que todos os seres humanos nascem iguais e livres perante o Criador.", prompt: "President Lincoln sitting at wooden desk signing historic Proclamation with gentle determined face, 2D storybook illustration" },
      { text: "Com a Proclamação de Emancipação, Lincoln aboliu a escravidão, libertando milhões de pessoas e reunificando a nação sob os princípios do perdão mútuo e da caridade para com todos.", prompt: "President Lincoln delivering a speech with warmth and dignity before large diverse crowd, 2D storybook illustration" }
    ]
  },
  {
    title: 'Mahatma Gandhi e a Força da Paz',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🕊️',
    coverColor: '#6366F1',
    value: 'não-violência e serenidade',
    missionTitle: 'Missão da Resposta Pacífica',
    missionDesc: 'Quando alguém levantar a voz hoje, responda com calma, serenidade e palavras de paz!',
    reflectionQuestion: 'Por que a gentileza e a persistência na verdade têm mais poder de transformar o mundo do que a força bruta?',
    paragraphs: [
      { text: "Na Índia ensolarada, o jovem Mohandas Gandhi aprendeu com sua família que a verdade (Satya) e a não-violência (Ahimsa) são as forças mais puras e invencíveis que existem no coração humano.", prompt: "Young Mohandas Gandhi listening to his kind mother in traditional Indian courtyard with flowers, 2D storybook illustration" },
      { text: "Após formar-se em direito, Gandhi viajou para a África do Sul. Ao ver pessoas sendo tratadas com injustiça por causa da cor de sua pele, decidiu dedicar sua vida a defender os direitos humanos sem jamais usar violência.", prompt: "Gandhi speaking peacefully with diverse workers in sunlit town square, 2D storybook illustration" },
      { text: "De volta à Índia, Gandhi adotou uma vida de extrema simplicidade. Ele mesmo tecia suas roupas de algodão em uma roda de fiar artesanal (charkha), incentivando o povo a ser autossuficiente e livre.", prompt: "Gandhi sitting cross-legged spinning white cotton thread on a wooden charkha wheel, warm morning light, 2D storybook illustration" },
      { text: "Em 1930, em protesto contra o imposto abusivo sobre o sal, Gandhi liderou a histórica 'Marcha do Sal'. Caminhou quase 400 quilômetros a pé até as praias de Dandi, seguido por uma multidão de milhares de pessoas em completa paz.", prompt: "Gandhi holding wooden walking stick leading long peaceful line of smiling people along coastline, 2D storybook illustration" },
      { text: "Ao chegar à praia, Gandhi curvou-se suavemente e pegou um punhado de sal natural das ondas, demonstrando que os presentes da natureza pertencem a todos os seres vivos igualmente.", prompt: "Gandhi bending down to pick up white sea salt from ocean sand with serene joyful smile, 2D storybook illustration" },
      { text: "Com seu exemplo inabalável de coragem desarmada, Gandhi conquistou a independência da Índia sem disparar um único tiro, inspirando movimentos de direitos civis e paz em todos os cantos do planeta.", prompt: "Gandhi surrounded by cheering peaceful children and families holding olive branches, 2D storybook illustration" }
    ]
  },
  {
    title: 'Machado de Assis, o Menino das Letras',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '📚',
    coverColor: '#4338CA',
    value: 'superação e amor ao conhecimento',
    missionTitle: 'Missão do Pequeno Leitor',
    missionDesc: 'Leia um capítulo de um livro ou escreva uma pequena poesia sobre um momento feliz do seu dia!',
    reflectionQuestion: 'Como a dedicação à leitura e ao estudo pode transformar completamente a história de uma pessoa?',
    paragraphs: [
      { text: "No Morro do Livramento, no Rio de Janeiro do século XIX, nasceu Joaquim Maria Machado de Assis. Menino pobre, neto de pessoas escravizadas e portador de gagueira e epilepsia, ele parecia ter todos os caminhos fechados.", prompt: "Young Brazilian boy Machado de Assis sitting on hillside looking at old Rio de Janeiro harbor, 2D storybook illustration" },
      { text: "Mas dentro daquele menino brilhava uma paixão incomum: as palavras. Sem frequentar escolas de elite, Machado aprendeu a ler sozinho, devorando todos os jornais, panfletos e livros que conseguia encontrar pelas ruas.", prompt: "Young Machado reading eagerly by street lamp light with books in his hands, 2D storybook illustration" },
      { text: "Trabalhando como jornaleiro e depois aprendiz de tipógrafo na Imprensa Nacional, Machado aprendeu francês e inglês nas horas vagas conversando com tipógrafos estrangeiros e lendo dicionários à luz de velas.", prompt: "Machado working diligently in traditional printing press shop among letterpress wooden trays, 2D storybook illustration" },
      { text: "Com disciplina férrea e elegância moral, começou a escrever contos, crônicas e romances que encantavam os leitores por sua inteligência fina, observação humana profunda e defesa da justiça social.", prompt: "Machado writing with feather quill at a modest wooden desk with open books, warm room light, 2D storybook illustration" },
      { text: "Machado de Assis tornou-se o maior escritor da língua portuguesa no Brasil e fundou a Academia Brasileira de Letras em 1897, sendo aclamado seu primeiro presidente perpétuo.", prompt: "Machado de Assis with spectacles and noble kind face receiving applause at historic literary academy hall, 2D storybook illustration" },
      { text: "Sua trajetória ensina a cada criança brasileira que a origem humilde não limita o tamanho dos seus sonhos quando alimentados pelo esforço honesto e pelo amor aos livros.", prompt: "Statue and books of Machado de Assis in sunlit garden with children reading happily, 2D storybook illustration" }
    ]
  },
  {
    title: 'Leonardo da Vinci e a Curiosidade Infinita',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🎨',
    coverColor: '#3730A3',
    value: 'curiosidade e criatividade',
    missionTitle: 'Missão do Observador da Natureza',
    missionDesc: 'Observe um pássaro voando ou uma flor no seu bairro e desenhe o que você achou de mais interessante!',
    reflectionQuestion: 'Como o hábito de fazer perguntas sobre o mundo ao nosso redor nos ajuda a inventar coisas novas?',
    paragraphs: [
      { text: "Nas colinas verdejantes da pequena aldeia de Vinci, na Itália, o menino Leonardo passava dias inteiros caminhando pelos campos observando o formato das folhas, o bater das asas das libélulas e o fluxo dos riachos.", prompt: "Young boy Leonardo da Vinci sketching a flying bird in his leather notebook in sunny Tuscan meadow, 2D storybook illustration" },
      { text: "Leonardo carregava sempre um pequeno caderno preso à cintura, onde desenhava tudo o que via e anotava perguntas curiosas: 'Por que o céu é azul?', 'Como os peixes nadam sem afundar?', 'Como a água sobe nas plantas?'", prompt: "Close up of Leonardo sketching water ripples and dragonfly wings with ink pen, 2D storybook illustration" },
      { text: "Em Florença, entrou no ateliê do mestre Verrocchio. Sua dedicação era tão intensa que dominou a pintura, a escultura, a arquitetura e a mecânica com uma perfeição que maravilhava a todos.", prompt: "Young Leonardo painting in sunlit Renaissance artist studio surrounded by sculptures and canvases, 2D storybook illustration" },
      { text: "Leonardo não se contentava apenas com a arte: ele desenhou projetos pioneiros de máquinas voadoras inspiradas em morcegos, pontes desmontáveis seguras, paraquedas e até veículos autopropelidos séculos antes de sua época.", prompt: "Leonardo studying a wooden model of a glider with canvas wings in his workshop, 2D storybook illustration" },
      { text: "Sua obra-prima, a pintura da Mona Lisa, fascinou o mundo pelo olhar enigmático e pela técnica do 'sfumato', que misturava luzes e sombras como se a personagem respirasse vida.", prompt: "Leonardo painting the Mona Lisa with gentle brush strokes in beautiful soft light, 2D storybook illustration" },
      { text: "Leonardo da Vinci deixou um legado eterno: a mente humana é capaz de voos extraordinários quando mantém viva a curiosidade de uma criança e a disciplina de um verdadeiro sábio.", prompt: "Elderly Leonardo smiling warmly looking out over starry night sky with open sketchbook, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 5. INVENTORES & CIÊNCIA (inventores-genios)
  // ==========================================
  {
    title: 'Thomas Edison e as Mil Tentativas da Lâmpada',
    category: 'inventores-genios',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '💡',
    coverColor: '#CA8A04',
    value: 'perseverança e resiliência',
    missionTitle: 'Missão de Não Desistir',
    missionDesc: 'Tente novamente hoje fazer algo que deu errado da primeira vez (um desenho, um jogo ou uma conta)!',
    reflectionQuestion: 'Por que errar faz parte do aprendizado e nos deixa mais perto da resposta certa?',
    paragraphs: [
      { text: "No laboratório de Menlo Park, o inventor Thomas Edison e sua equipe trabalhavam sem parar para resolver um dos maiores desafios do mundo: criar uma lâmpada elétrica segura e durável que iluminasse as casas à noite.", prompt: "Thomas Edison in workshop with glass bulbs and wires surrounded by curious assistants, 2D storybook illustration" },
      { text: "Até então, as cidades eram iluminadas por velas e lampiões a gás, que soltavam fumaça escura e provocavam incêndios perigosos. Edison sonhava em trazer uma luz limpa, clara e acessível a todas as famílias.", prompt: "Old city street at night with dim flickering gas lamps and shadows, 2D storybook illustration" },
      { text: "O problema era encontrar um filamento que não queimasse em poucos segundos dentro do bulbo de vidro. Edison testou platina, cobre, fios de seda, algodão e até fios de barba de bambu japonês.", prompt: "Edison testing different glowing wires inside glass tubes with magnifying glass, 2D storybook illustration" },
      { text: "Depois de mais de mil tentativas que não deram certo, um jovem repórter perguntou se ele não se sentia desanimado por ter fracassado tantas vezes. Edison respondeu com um sorriso sereno:", prompt: "Edison smiling kindly to a reporter in his sunlit workshop with tools on bench, 2D storybook illustration" },
      { text: "'Eu não falhei mil vezes! Eu descobri com sucesso mil materiais que não funcionam. Cada tentativa me deixou um passo mais perto da solução verdadeira!'", prompt: "Edison showing a glowing filament prototype to his team with inspiring confidence, 2D storybook illustration" },
      { text: "Na noite de 21 de outubro de 1879, Edison testou um filamento de algodão carbonizado sob vácuo. A lâmpada acendeu com um brilho dourado e acolhedor — e permaneceu brilhando por mais de quarenta horas contínuas!", prompt: "First electric lightbulb shining with warm bright golden light illuminating happy faces in workshop, 2D storybook illustration" },
      { text: "A invenção de Edison transformou a história da humanidade. Ele provou que o gênio é 1% de inspiração e 99% de transpiração e persistência inabalável diante das dificuldades.", prompt: "Modern city illuminated with thousands of warm friendly lights at twilight, 2D storybook illustration" }
    ]
  },
  {
    title: 'Nikola Tesla e a Energia das Estrelas',
    category: 'inventores-genios',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '⚡',
    coverColor: '#A16207',
    value: 'visão e generosidade para com o mundo',
    missionTitle: 'Missão da Imaginação Criativa',
    missionDesc: 'Imagine e desenhe uma invenção do futuro que ajude a cuidar do meio ambiente ou dos animais!',
    reflectionQuestion: 'Como as ideias que parecem impossíveis hoje podem se tornar os benefícios de amanhã?',
    paragraphs: [
      { text: "Nas montanhas de Smiljan, o menino Nikola Tesla olhava para as tempestades de relâmpagos com encantamento. Ao acariciar seu gato preto no inverno e ver faíscas estalando no pelo, perguntou: 'Será a eletricidade a mesma luz das estrelas?'", prompt: "Young boy Nikola Tesla petting a black cat by window watching distant gentle lightning, 2D storybook illustration" },
      { text: "Tesla tinha uma imaginação visual extraordinária: conseguia desenhar máquinas completas e colocá-las em funcionamento dentro de sua própria mente com perfeita precisão antes de construir a primeira peça de metal.", prompt: "Tesla sitting with books seeing floating glowing blueprints of motors in his imagination, 2D storybook illustration" },
      { text: "Ao crescer, Tesla desenvolveu o sistema de Corrente Alternada (AC), que permitia transportar energia elétrica por centenas de quilômetros de distância sem perda, iluminando cidades inteiras com represas de água.", prompt: "Tesla working with copper coils and spinning electromagnetic motors in sunlit laboratory, 2D storybook illustration" },
      { text: "Nas Cataratas do Niágara, construiu a primeira grande usina hidrelétrica da história, transformando a força natural da água em eletricidade limpa para milhares de lares e indústrias.", prompt: "Historic hydroelectric plant at majestic Niagara Falls with water spray and rainbows, 2D storybook illustration" },
      { text: "Tesla também criou o controle remoto sem fio, estudou as ondas de rádio, os motores de indução e sonhava em fornecer energia livre e gratuita para todos os povos da Terra.", prompt: "Tesla demonstrating a small remote-controlled toy boat in water basin to amazed spectators, 2D storybook illustration" },
      { text: "Mesmo quando outros ficavam com a fama de suas ideias, Tesla mantinha a serenidade: 'O presente pode pertencer a eles; mas o futuro, pelo qual eu realmente trabalhei, pertence a mim'.", prompt: "Nikola Tesla standing peacefully under starry night sky with gentle electric glow in background, 2D storybook illustration" }
    ]
  },
  {
    title: 'Alexander Graham Bell e a Voz à Distância',
    category: 'inventores-genios',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '📞',
    coverColor: '#EAB308',
    value: 'comunicação e empatia',
    missionTitle: 'Missão da Ligação de Carinho',
    missionDesc: 'Telefone ou mande um áudio carinhoso para um avô, avó ou parente que você não vê há algum tempo!',
    reflectionQuestion: 'Como o telefone e a tecnologia devem ser usados para aproximar corações e espalhar gentileza?',
    paragraphs: [
      { text: "Em Edimburgo, na Escócia, o jovem Alexander Graham Bell cresceu em uma família dedicada aos sons e à fala. Sua mãe era quase totalmente surda, e Bell aprendeu a se comunicar com ela falando em tons suaves na testa dela para que sentisse a vibração.", prompt: "Young Alexander Graham Bell speaking gently to his kind mother in Victorian sitting room with piano, 2D storybook illustration" },
      { text: "Essa profunda empatia levou Bell a se tornar professor de pessoas surdas em Boston. Ele ensinava crianças que nunca haviam ouvido sons a falar com clareza, acreditando que a comunicação é a chave da dignidade humana.", prompt: "Bell teaching happy children how to speak using visible speech diagrams on blackboard, 2D storybook illustration" },
      { text: "Bell começou a se perguntar: 'Se o som é apenas uma vibração no ar que o tímpano escuta, por que não podemos transformar essa vibração em impulsos elétricos através de um fio de cobre?'", prompt: "Bell and assistant Thomas Watson experimenting with tuning forks and telegraph wires on workbench, 2D storybook illustration" },
      { text: "Trabalhando ao lado de seu talentoso amigo Thomas Watson em um sótão cheio de fios, Bell passou anos testando membranas de metal, ímãs e circuitos líquidos sem jamais desanimar.", prompt: "Bell and Watson working with copper coils and batteries in cozy wooden workshop, 2D storybook illustration" },
      { text: "No dia 10 de março de 1876, Bell derramou sem querer um pouco de ácido na bancada e chamou pelo transmissor: 'Senhor Watson, venha cá, eu preciso do senhor!'", prompt: "Bell speaking urgently into a cone transmitter on wooden table with wires, 2D storybook illustration" },
      { text: "No quarto ao lado, pelo fone de metal, Watson ouviu nitidamente a voz de Bell pela primeira vez na história! Ele correu entusiasmado gritando: 'Eu ouvi! Eu ouvi cada palavra com clareza!'", prompt: "Watson running through door smiling with joy holding the receiver to show Bell, 2D storybook illustration" },
      { text: "O telefone nasceu da vontade sincera de aproximar as pessoas que estavam longe. Bell dedicou grande parte dos recursos obtidos para fundar escolas e apoiar pesquisas para pessoas com deficiência auditiva.", prompt: "People in historic town happily speaking to family far away using early wall telephone, 2D storybook illustration" }
    ]
  },
  {
    title: 'Galileu Galilei e os Mistérios do Céu',
    category: 'inventores-genios',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🔭',
    coverColor: '#D97706',
    value: 'amor à verdade e observação científica',
    missionTitle: 'Missão do Observador Estelar',
    missionDesc: 'Olhe para a lua e as estrelas hoje à noite com sua família e tente encontrar a lua crescente ou cheia!',
    reflectionQuestion: 'Por que olhar para a natureza com olhos atentos nos revela a grandeza e a harmonia do universo?',
    paragraphs: [
      { text: "Na histórica cidade de Pisa, na Itália, o jovem Galileu Galilei adorava observar as coisas simples: ao ver o lustre da catedral balançando com o vento, usou os batimentos de seu próprio pulso para descobrir a lei do pêndulo.", prompt: "Young Galileo observing a swinging bronze lantern in majestic cathedral with curious thoughtful gaze, 2D storybook illustration" },
      { text: "Mais tarde, professor em Pádua, soube que um fabricante de óculos na Holanda havia montado dois vidros que faziam objetos distantes parecerem mais próximos. Galileu imediatamente construiu sua própria luneta aperfeiçoada.", prompt: "Galileo polishing optical glass lenses carefully on wooden desk by sunny window, 2D storybook illustration" },
      { text: "Em uma noite clara de 1609, em vez de apontar o tubo para navios no mar, Galileu apontou sua luneta para o céu noturno — e o que viu mudou a história do pensamento para sempre.", prompt: "Galileo pointing his long wooden telescope towards starry night sky from rooftop terrace, 2D storybook illustration" },
      { text: "A Lua não era uma esfera lisa e perfeita como diziam as lendas antigas, mas um relevo majestoso com crateras profundas, vales e montanhas iluminadas pelo sol.", prompt: "Detailed view of moon surface through telescope showing crater rims and silvery shadows, 2D storybook illustration" },
      { text: "Ao olhar para o planeta Júpiter, descobriu quatro pequenas luas brilhantes que dançavam ao seu redor, provando que nem todos os corpos celestes giravam ao redor da Terra.", prompt: "Galileo drawing Jupiter with four tiny bright moons in his notebook with ink and quill, 2D storybook illustration" },
      { text: "Galileu defendeu corajosamente a verdade de que a Terra gira em torno do Sol, ensinando que 'o livro da natureza foi escrito na linguagem da matemática e da observação honesta'.", prompt: "Galileo standing before scholars showing charts of solar system with sun at the center, 2D storybook illustration" }
    ]
  },
  {
    title: 'Louis Pasteur e a Vitória contra o Invisível',
    category: 'inventores-genios',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🧫',
    coverColor: '#059669',
    value: 'cuidado com a saúde e higiene',
    missionTitle: 'Missão das Mãos Limpas',
    missionDesc: 'Lave suas mãos com sabão com muito cuidado hoje antes das refeições, lembrando de Pasteur!',
    reflectionQuestion: 'Como atitudes simples de limpeza e cuidado diário protegem a nossa família de doenças?',
    paragraphs: [
      { text: "Na França do século XIX, o cientista Louis Pasteur observava o mundo através das lentes de um microscópio. Naquela época, ninguém compreendia por que os alimentos estragavam ou por que feridas pequenas inflamavam.", prompt: "Louis Pasteur looking through brass microscope in sunlit laboratory filled with glassware, 2D storybook illustration" },
      { text: "Com experimentos pacientes e rigorosos com frascos de vidro em formato de pescoço de cisne, Pasteur provou que os germes e bactérias não surgem do nada: eles viajam pelo ar e podem ser controlados.", prompt: "Pasteur holding curved glass flask showing clean clear broth inside to amazed colleagues, 2D storybook illustration" },
      { text: "Ele desenvolveu o processo de pasteurização: aquecer o leite e outros alimentos na temperatura certa para eliminar micróbios perigosos sem alterar o sabor, salvando a vida de milhões de bebês e crianças.", prompt: "Farmer and milkmaid safely bottling fresh pasteurized milk in sunny clean dairy farm, 2D storybook illustration" },
      { text: "Pasteur ensinou os médicos e cirurgiões a ferver instrumentos e lavar as mãos com sabão antes de cuidar de pacientes, uma revolução que transformou os hospitais em locais de cura segura.", prompt: "Doctors washing hands carefully in clean hospital ward with bright windows, 2D storybook illustration" },
      { text: "Seu maior triunfo veio com a vacina contra a temida raiva. Quando o pequeno Joseph Meister, de nove anos, foi mordido por um cão doente, Pasteur aplicou o tratamento e salvou a vida do menino com sucesso total.", prompt: "Pasteur gently holding hand of healthy smiling boy Joseph Meister in hospital room, 2D storybook illustration" },
      { text: "Louis Pasteur dedicou cada dia à ciência da vida, deixando uma lição inesquecível: a verdadeira grandeza do conhecimento está em proteger e abençoar a saúde de cada ser humano.", prompt: "Statue of Pasteur surrounded by green trees and children playing happily in clean sunny park, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 6. CONTOS & FÁBULAS (contos-de-herois)
  // ==========================================
  {
    title: 'A Tartaruga e a Lebre',
    category: 'contos-de-herois',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🐢',
    coverColor: '#0284C7',
    value: 'constância e humildade',
    missionTitle: 'Missão do Passo Firme',
    missionDesc: 'Complete uma tarefa devagar e com capricho hoje, sem pressa de terminar correndo!',
    reflectionQuestion: 'Por que o esforço constante e paciente vence a pressa e a arrogância?',
    paragraphs: [
      { text: "Na bela clareira da floresta, a Lebre saltava de um lado para o outro exibindo sua incrível velocidade. Ela ria de todos os animais e zombava especialmente da calma e vagarosa Tartaruga.", prompt: "Proud hare jumping high in sunny forest meadow while gentle green tortoise walks peacefully, 2D storybook illustration" },
      { text: "Cansada das zombarias, a Tartaruga ergueu a cabeça e propôs com serenidade: 'Dona Lebre, que tal disputarmos uma corrida até a grande colina dos carvalhos?' A Lebre soltou uma gargalhada estrondosa.", prompt: "Wise tortoise speaking calmly to laughing hare in front of gathering forest animals, 2D storybook illustration" },
      { text: "A Coruja deu o sinal de partida. A Lebre disparou como um raio e em poucos segundos já estava longe, enquanto a Tartaruga deu seu primeiro passo firme e constante.", prompt: "Animals waving at starting line as hare zooms ahead in cloud of dust and tortoise walks steadily, 2D storybook illustration" },
      { text: "Vendo que a rival mal havia saído do lugar, a Lebre pensou com arrogância: 'Tenho tempo de sobra! Vou tirar uma soneca gostosa sob a sombra desta árvore florida antes de cruzar a linha'.", prompt: "Hare sleeping comfortably under shade of blooming apple tree with sweet smile, 2D storybook illustration" },
      { text: "Enquanto a Lebre dormia a sono solto, a Tartaruga continuou caminhando: passo a passo, sem parar para reclamar do calor, sem desviar a atenção e sem desistir do seu objetivo.", prompt: "Tortoise walking determinedly along path passing sleeping hare quietly, afternoon sunlight, 2D storybook illustration" },
      { text: "Quando a Lebre acordou com os raios do pôr do sol, esticou os braços e correu desesperada até a colina. Mas era tarde demais: a Tartaruga acabava de cruzar a linha de chegada sob aplausos calorosos!", prompt: "Tortoise crossing finish line with golden ribbon as forest animals cheer happily, 2D storybook illustration" },
      { text: "A Lebre aprendeu uma lição humilde que nunca mais esqueceu: a velocidade sem constância não leva a lugar algum, mas passos firmes e pacientes sempre alcançam a vitória.", prompt: "Hare congratulating smiling tortoise with respectful handshake in golden sunset light, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Cigarra e a Formiga',
    category: 'contos-de-herois',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🐜',
    coverColor: '#0369A1',
    value: 'previdência e cooperação',
    missionTitle: 'Missão do Guarda-Brinquedos',
    missionDesc: 'Organize e guarde seus brinquedos e materiais escolares sem esperar ninguém pedir!',
    reflectionQuestion: 'Como o equilíbrio entre o trabalho responsável e a alegria da arte torna a vida mais feliz para todos?',
    paragraphs: [
      { text: "Durante todo o verão ensolarado, a Cigarra cantava alegremente empoleirada em um ramo de salgueiro, enchendo os campos com melodias suaves e encantadoras.", prompt: "Green singing cicada with small violin sitting on branch of leafy willow tree, summer flowers, 2D storybook illustration" },
      { text: "Lá embaixo, na terra fértil, a pequena Formiga e suas companheiras marchavam em fila carregando pesados grãos de trigo, sementes e folhas secas para dentro do formigueiro seguro.", prompt: "Hardworking ants in organized line carrying golden wheat grains and green leaves, 2D storybook illustration" },
      { text: "A Cigarra cantava: 'Dona Formiga, venha dançar e aproveitar o calor do sol! Para que trabalhar tanto agora?' A Formiga respondeu com gentileza: 'O inverno virá, amiga Cigarra, e quem não armazena no verão passa frio no inverno'.", prompt: "Cicada smiling from branch looking down at determined friendly ant carrying acorn, 2D storybook illustration" },
      { text: "Os meses passaram e o outono levou as folhas verdes. Logo, nuvens escuras trouxeram ventos gelados e uma densa camada de neve branca cobriu todos os campos e árvores da floresta.", prompt: "Winter snow falling gently over bare trees and frozen stream in silent forest, 2D storybook illustration" },
      { text: "Sem ter o que comer e tremendo com as patinhas congeladas, a Cigarra bateu timidamente à porta de madeira do aquecido formigueiro subterrâneo.", prompt: "Shivering cold cicada knocking softly on small round wooden door of snow-covered anthill, 2D storybook illustration" },
      { text: "A bondosa Formiga abriu a porta. Vendo a amiga faminta, não a desprezou: convidou-a para entrar, serviu-lhe um caldo quente de sementes aromáticas e uma coberta macia.", prompt: "Warm cozy underground ant home with fireplace and food, ant offering warm tea to relieved cicada, 2D storybook illustration" },
      { text: "A Formiga disse com sabedoria: 'No próximo verão, trabalharemos juntas algumas horas colhendo sementes, e você alegrará o nosso esforço com suas canções!' A união entre trabalho e arte aqueceu aquele lar.", prompt: "Cicada playing violin by warm fireplace while ants listen happily together, cozy winter night, 2D storybook illustration" }
    ]
  },
  {
    title: 'O Pastorzinho e o Lobo',
    category: 'contos-de-herois',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🐑',
    coverColor: '#0284C7',
    value: 'honestidade e verdade',
    missionTitle: 'Missão da Verdade Pura',
    missionDesc: 'Fale apenas a verdade em todas as brincadeiras e conversas hoje, sem exageros ou pegadinhas!',
    reflectionQuestion: 'Por que quando uma pessoa mente com frequência, os outros deixam de acreditar nela até quando fala a verdade?',
    paragraphs: [
      { text: "No alto de uma bela colina perto de um povoado pacífico, o menino Pedro cuidava do rebanho de ovelhas brancas da aldeia. Seus dias eram tranquilos, mas às vezes Pedro achava a rotina monótona.", prompt: "Young shepherd boy sitting on grassy hill with fluffy white sheep grazing under blue sky, 2D storybook illustration" },
      { text: "Para se divertir e pregar uma peça nos moradores, Pedro correu até a beira da colina e gritou com todas as forças: 'Socorro! O lobo! O lobo está atacando as ovelhas!'", prompt: "Boy shouting with hands cupped around mouth from hill ledge looking down at village, 2D storybook illustration" },
      { text: "Os aldeões largaram suas ferramentas no campo e subiram correndo a colina com ancinhos e paus para ajudar o menino. Ao chegarem esbaforidos, encontraram Pedro rolando de rir no chão.", prompt: "Villagers arriving breathless on hill while boy points and laughs at his prank, 2D storybook illustration" },
      { text: "Os aldeões repreenderam o menino com seriedade: 'Pedro, não se brinca com perigo nem com a confiança das pessoas!' Mas dias depois, Pedro repetiu a mentira, enganando a aldeia novamente.", prompt: "Elderly villager advising boy firmly while boy looks slightly ashamed, 2D storybook illustration" },
      { text: "Num final de tarde cinzento, um lobo de verdade saiu cautelosamente da mata escura e aproximou-se do rebanho assustado. As ovelhas baliram em desespero.", prompt: "A wild gray wolf stepping out of forest shadow towards nervous sheep, dusk light, 2D storybook illustration" },
      { text: "Apavorado, Pedro gritou com lágrimas nos olhos: 'Socorro! Desta vez é verdade! Um lobo de verdade está aqui!' Mas no povoado, todos pensaram ser mais uma brincadeira e ninguém subiu.", prompt: "Terrified boy shouting desperately from rocks as wolf approaches sheep in dim twilight, 2D storybook illustration" },
      { text: "Pedro conseguiu salvar as ovelhas subindo com elas em um aprisco alto com muito esforço e medo. Chorando de alívio na manhã seguinte, pediu perdão sincero a toda a aldeia e jurou nunca mais mentir na vida.", prompt: "Boy tearfully apologizing to kind villagers in village square holding a lamb in his arms, 2D storybook illustration" }
    ]
  },
  {
    title: 'Rei Artur e a Espada na Rocha',
    category: 'contos-de-herois',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🗡️',
    coverColor: '#075985',
    value: 'nobreza de espírito e humildade',
    missionTitle: 'Missão do Nobre Coração',
    missionDesc: 'Demonstre nobreza hoje ajudando um colega sem esperar aplausos ou recompensas em troca!',
    reflectionQuestion: 'O que faz de alguém um verdadeiro rei ou líder: a força de uma espada ou a bondade do coração?',
    paragraphs: [
      { text: "Na antiga Bretanha medieval, a terra vivia em conflito após a perda de seu rei. No pátio da grande catedral de Londres, apareceu misteriosamente uma enorme bigorna de ferro cravada em uma rocha de mármore.", prompt: "Mysterious shining steel sword stuck in ancient anvil upon marble stone outside gothic cathedral, 2D storybook illustration" },
      { text: "Na lâmina dourada da espada, estavam gravadas letras reluzentes: 'Aquele que retirar esta espada desta pedra e bigorna é por direito rei nato de toda a Bretanha'.", prompt: "Close up of gold runes glowing on sword hilt embedded in gray stone under soft sunbeam, 2D storybook illustration" },
      { text: "Cavaleiros orgulhosos, condes poderosos e nobres musculosos de todas as províncias tentaram puxar a espada com toda a força de seus braços, mas nenhum conseguiu movê-la sequer um milímetro.", prompt: "Armored knights attempting in vain to pull the sword while crowds watch in suspense, 2D storybook illustration" },
      { text: "Anos depois, realizou-se um grande torneio festivo na capital. O jovem escudeiro Artur, carinhosamente chamado de Artie, acompanhava seu irmão mais velho, Sir Kay, e seu pai adotivo, Sir Ector.", prompt: "Young humble squire Arthur carrying a tournament banner walking beside his family, 2D storybook illustration" },
      { text: "Sir Kay percebeu que havia esquecido sua espada de duelo na hospedaria e pediu a Artur que corresse para buscá-la. Artur correu, mas encontrou a hospedaria trancada a chave.", prompt: "Young Arthur looking through keyhole of locked inn door with worried friendly face, 2D storybook illustration" },
      { text: "Não querendo desapontar o irmão, Artur passou pelo pátio silencioso da igreja e viu a espada na rocha. Sem saber da profecia real, aproximou-se com reverência apenas para emprestá-la.", prompt: "Arthur approaching the sword in the stone in peaceful deserted cathedral courtyard, 2D storybook illustration" },
      { text: "Artur tocou o punho de couro da espada. Ao puxar com suavidade, a lâmina deslizou como se estivesse guardada em uma bainha de seda macia, brilhando com uma luz dourada deslumbrante.", prompt: "Young Arthur easily pulling glowing sword straight up from the stone with gentle ease, 2D storybook illustration" },
      { text: "Diante do espanto de todos os cavaleiros e com a bênção do mago Merlim, o povo aclamou Artur como seu soberano legítimo, iniciando a era de ouro da Távola Redonda e da justiça para todos.", prompt: "Crowds and armored knights kneeling respectfully before young King Arthur holding Excalibur high, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 7. VIRTUDES EM AÇÃO (virtudes-em-acao)
  // ==========================================
  {
    title: 'O Vaso da Honestidade',
    category: 'virtudes-em-acao',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌱',
    coverColor: '#9333EA',
    value: 'integridade e coragem moral',
    missionTitle: 'Missão do Vaso Verdadeiro',
    missionDesc: 'Assuma com coragem e calma quando algo não der certo, valorizando a verdade acima de tudo!',
    reflectionQuestion: 'Por que a honestidade tem um valor muito mais duradouro do que fingir um sucesso que não é verdadeiro?',
    paragraphs: [
      { text: "No antigo Oriente, um sábio imperador sem herdeiros queria escolher seu sucessor entre os jovens de todas as províncias. Ele convocou todas as crianças ao palácio e entregou uma semente especial a cada uma.", prompt: "Elderly kind Emperor handing small seeds to line of hopeful children in palace garden, 2D storybook illustration" },
      { text: "O imperador anunciou: 'Levem esta semente, plantem-na em um vaso com boa terra, reguem com carinho e voltem aqui daqui a um ano com a planta que brotar. Quem trouxer o melhor resultado será o novo governante'.", prompt: "Young humble boy Ping holding his tiny seed carefully in cupped hands walking home, 2D storybook illustration" },
      { text: "O jovem Ping amava a jardinagem e colocou a melhor terra preta em um lindo vaso de cerâmica. Regava todos os dias com água pura e colocava o vaso ao sol da manhã, mas nenhuma folha brotava.", prompt: "Boy Ping watering an empty ceramic flowerpot by window with loving patient gaze, 2D storybook illustration" },
      { text: "Os meses passaram e os amigos de Ping exibiam vasos com orquídeas perfumadas, bambus altos e flores de lótus deslumbrantes. Ping trocou a terra, colocou adubo novo, mas a semente continuava dormindo.", prompt: "Other children carrying colorful blooming plants while Ping looks sadly at his barren pot, 2D storybook illustration" },
      { text: "Ao completar um ano, chegou o dia da apresentação. Com o coração apertado e com vergonha, Ping disse ao pai que não iria. Seu pai abraçou-o e disse: 'Vá com a cabeça erguida, meu filho. Você deu o seu melhor e a honestidade não tem do que se envergonhar'.", prompt: "Wise father putting hand on sad boy Ping shoulder encouraging him with love, 2D storybook illustration" },
      { text: "No palácio, o imperador caminhava inspecionando centenas de vasos repletos de flores coloridas com uma expressão séria. Ao chegar diante de Ping, com seu vaso de terra nua, perguntou por que não havia flor.", prompt: "Emperor with thoughtful face stopping in front of small boy Ping holding completely empty pot, 2D storybook illustration" },
      { text: "Ping respondeu com lágrimas sinceras: 'Senhor imperador, eu reguei todos os dias e cuidei com todo o carinho, mas ela não brotou. Trago apenas o meu esforço verdadeiro'.", prompt: "Ping bowing respectfully with open honest face before Emperor holding his empty pot, 2D storybook illustration" },
      { text: "O imperador sorriu com imenso alívio e ergueu Ping diante de toda a corte: 'Encontrei o novo líder! Todas as sementes que distribuí haviam sido fervidas e jamais poderiam brotar. Todos os outros trouxeram flores trocadas, mas apenas este jovem teve a coragem da honestidade!'", prompt: "Emperor holding Ping hand high in celebration as palace crowd smiles in admiration, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Árvore da Gratidão',
    category: 'virtudes-em-acao',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🌳',
    coverColor: '#7E22CE',
    value: 'gratidão e apreço',
    missionTitle: 'Missão dos Três Agradecimentos',
    missionDesc: 'Antes de dormir hoje, agradeça por três coisas simples que aconteceram no seu dia!',
    reflectionQuestion: 'Como agradecer pelas coisas simples nos ajuda a enxergar a beleza e a abundância da vida?',
    paragraphs: [
      { text: "No quintal da casa da vovó Rosa crescia uma figueira antiga de galhos largos e folhas macias. As crianças da vizinhança adoravam subir em sua copa e brincar sob sua sombra fresca nos dias de verão.", prompt: "Children laughing and playing under a large friendly fig tree in sunny garden, 2D storybook illustration" },
      { text: "Certo dia, o pequeno Lucas estava chateado porque seu brinquedo preferido havia quebrado. Ele sentou-se emburrado na raiz da árvore, cruzou os braços e disse que nada dava certo em sua vida.", prompt: "Little boy Lucas sitting sulking on tree roots with crossed arms looking unhappy, 2D storybook illustration" },
      { text: "A vovó Rosa sentou-se ao lado dele com um cesto de figos doces e propôs uma brincadeira: 'Lucas, cada folha desta árvore tem uma história secreta. Para cada coisa boa pela qual você agradecer hoje, a árvore deixará cair um fruto doce'.", prompt: "Kind smiling grandmother offering a sweet purple fig to little boy under tree shade, 2D storybook illustration" },
      { text: "Lucas pensou um pouco e disse: 'Agradeço pelo almoço gostoso que você fez'. Uma brisa suave balançou os galhos e uma folha dourada flutuou no ar como uma borboleta carinhosa.", prompt: "A soft breeze rustling tree leaves as golden leaf drifts down gently, 2D storybook illustration" },
      { text: "Animado, Lucas continuou: 'Agradeço pelos meus amigos da escola, pelas brincadeiras de correr, pelo canto dos passarinhos na janela e pelo abraço do papai e da mamãe quando chegam do trabalho'.", prompt: "Boy Lucas smiling broadly counting blessings on his fingers with grandmother, 2D storybook illustration" },
      { text: "À medida que agradecia, Lucas sentiu um calor aconchegante preencher seu peito. O brinquedo quebrado já não parecia mais tão importante diante de tantas bênçãos que preenchiam seus dias.", prompt: "Boy Lucas and grandmother looking up at sunbeams filtering through green leafy branches, 2D storybook illustration" },
      { text: "Lucas abraçou o tronco da figueira com alegria e prometeu a si mesmo nunca esquecer que o segredo de um coração feliz não é ter tudo o que se quer, mas ser grato por tudo o que se tem.", prompt: "Little boy hugging friendly tree trunk happily surrounded by blooming flowers and birds, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Paciência do Mestre Bambu',
    category: 'virtudes-em-acao',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🎋',
    coverColor: '#A855F7',
    value: 'paciência e perseverança',
    missionTitle: 'Missão da Espera Calma',
    missionDesc: 'Espere a sua vez com calma em uma fila ou conversa sem interromper ninguém!',
    reflectionQuestion: 'Por que criar raízes fortes de caráter é mais importante do que querer crescer rápido sem base?',
    paragraphs: [
      { text: "No vale das montanhas de névoa, o sábio mestre Li ensinava a seus alunos sobre os segredos do crescimento. Ele levou as crianças até um canteiro onde havia plantado sementes de bambu-mossô.", prompt: "Old Chinese master with long white beard showing children a patch of freshly raked earth, 2D storybook illustration" },
      { text: "Durante o primeiro ano inteiro, os alunos regaram e adubaram o solo todos os dias, mas nada brotou. No segundo ano, continuaram cuidando, e a terra permaneceu nua. Alguns alunos pensaram em desistir.", prompt: "Children watering bare soil with bamboo watering cans with puzzled patient faces, 2D storybook illustration" },
      { text: "No terceiro e quarto anos, nada parecia acontecer na superfície. Um dos jovens disse: 'Mestre, estamos perdendo tempo! Outras plantas já cresceram e deram frutos, mas este canteiro continua vazio'.", prompt: "Disheartened student speaking to calm smiling master Li in tranquil Zen garden, 2D storybook illustration" },
      { text: "O mestre Li sorriu com doçura e explicou: 'Não se enganem com a aparência da superfície. Debaixo da terra fofa, o bambu está tecendo uma gigantesca rede de raízes fortes e profundas'.", prompt: "Cross-section illustration showing deep strong roots spreading wide under rich dark earth, 2D storybook illustration" },
      { text: "No quinto ano, subitamente, um broto verde e forte apontou do chão. Em apenas seis semanas, impulsionado pelas raízes invisíveis, o bambu cresceu mais de vinte metros em direção ao céu!", prompt: "Tall elegant green bamboo stalks shooting up towards blue sky in misty morning grove, 2D storybook illustration" },
      { text: "Quando fortes ventos de tempestade sopravam, o bambu inclinava-se com humildade e flexibilidade até o chão sem jamais quebrar, voltando a ficar ereto assim que a brisa passava.", prompt: "Bamboo forest bending gracefully in wind without breaking, resilient and flexible, 2D storybook illustration" },
      { text: "Os alunos compreenderam a lição para suas vidas: a paciência não é perda de tempo, mas o tempo necessário para criar raízes invisíveis de bondade, estudo e caráter antes de alcançar as alturas.", prompt: "Master Li and happy smiling children standing in tall green bamboo forest looking up in awe, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 8. NATUREZA & ANIMAIS (natureza-animais)
  // ==========================================
  {
    title: 'O Voo Dourado da Arara-Azul',
    category: 'natureza-animais',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🦜',
    coverColor: '#16A34A',
    value: 'preservação da natureza e amizade',
    missionTitle: 'Missão do Amigo da Natureza',
    missionDesc: 'Coloque água fresca para os passarinhos na sua varanda ou recolha um lixo do chão hoje!',
    reflectionQuestion: 'Como o cuidado de cada um de nós protege as florestas e os animais preciosos do Brasil?',
    paragraphs: [
      { text: "Nas imensas planícies alagadas do Pantanal brasileiro, onde as águas refletem o céu como um espelho de prata, nasceu a pequena arara-azul chamada Nina, dona de penas azuis como safiras brilhantes.", prompt: "Beautiful blue hyacinth macaw Nina perched on branch of flowering yellow ipe tree in Pantanal, 2D storybook illustration" },
      { text: "Nina e seu bando tinham uma missão essencial para toda a floresta: alimentar-se das castanhas dos coqueiros acuri e bocaiúva, espalhando as sementes férteis por toda a planície pantaneira.", prompt: "Flock of magnificent blue macaws flying gracefully over winding Pantanal river and water lilies, 2D storybook illustration" },
      { text: "Certo dia, durante a estação seca, uma faísca provocou um incêndio que começou a queimar as árvores antigas onde os filhotes de muitas aves descansavam em seus ninhos seguros.", prompt: "Smoke rising near edge of forest as gentle macaws alert other forest animals with calls, 2D storybook illustration" },
      { text: "Em vez de fugir assustada, Nina voou alto soltando seu chamado característico, alertando capivaras, tucanos e veados-campeiros para que buscassem refúgio nas margens límpidas do rio.", prompt: "Blue macaw flying over herd of capybaras and deer guiding them toward clear safe riverbank, 2D storybook illustration" },
      { text: "Biólogos e brigadistas pantaneiros chegaram com barcos e mangueiras, apagando o fogo com coragem e protegendo os ocos de manduvi onde as araras botavam seus ovos.", prompt: "Friendly wildlife rescuers and park rangers in boats saving forest animals by riverbank, 2D storybook illustration" },
      { text: "Quando as primeiras chuvas de outono caíram, a terra reverdeceu em um tapete florido de vitória-régias e ipês amarelos. Nina sobrevoou o Pantanal livre e cantou em harmonia com toda a criação.", prompt: "Pantanal wetland blooming with colorful flowers and green plants under rainbow and blue sky, 2D storybook illustration" }
    ]
  },
  {
    title: 'O Boto Cor-de-Rosa e os Rios da Amazônia',
    category: 'natureza-animais',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🐬',
    coverColor: '#15803D',
    value: 'respeito às águas e cooperação',
    missionTitle: 'Missão da Água Limpa',
    missionDesc: 'Feche a torneira enquanto escova os dentes e cuide para não desperdiçar água hoje!',
    reflectionQuestion: 'Por que cuidar dos rios e não jogar lixo na água protege a vida de todos os seres do planeta?',
    paragraphs: [
      { text: "Nas águas escuras e misteriosas do Rio Negro, no coração da Floresta Amazônica, vivia Pirá, um jovem boto cor-de-rosa alegre que nadava com agilidade entre as raízes dos igapós inundados.", prompt: "Friendly pink Amazon river dolphin Pira leaping gracefully out of dark reflective river water, 2D storybook illustration" },
      { text: "Pirá tinha o dom de usar o eco de seus sons suaves para navegar com perfeição pelas águas cheias de folhas, conversando com os peixes-bois e os cardumes de peixes coloridos.", prompt: "Pink river dolphin swimming underwater with a gentle manatee and colorful tropical fish, 2D storybook illustration" },
      { text: "Certo dia, uma canoa de ribeirinhos navegava de volta para a aldeia quando a hélice do motor enroscou em galhos submersos no meio do rio caudaloso.", prompt: "Traditional wooden river canoe with kind indigenous family floating near forested riverbank, 2D storybook illustration" },
      { text: "Pirá percebeu que uma tempestade tropical de fim de tarde se aproximava com nuvens pesadas e trovões. Nadou até a frente da canoa e deu saltos suaves, indicando o canal seguro e sem pedras.", prompt: "Pink dolphin jumping gently in front of wooden canoe guiding family to calm sandy cove, 2D storybook illustration" },
      { text: "O pescador Seu Manoel e sua filha Iara confiaram nos saltos do boto e remaram tranquilamente até uma enseada protegida de areia branca, antes que a chuva forte começasse.", prompt: "Happy ribeirinho family landing canoe safely under shelter of giant Amazonian tree canopy, 2D storybook illustration" },
      { text: "Agradecidos, Iara e seu pai prometeram sempre manter os rios limpos de qualquer plástico e proteger os botos com carinho, celebrando a aliança sagrada entre as pessoas e a natureza.", prompt: "Little girl Iara waving with love at smiling pink river dolphin poking head out of calm water, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Pequena Abelha e o Milagre das Flores',
    category: 'natureza-animais',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🐝',
    coverColor: '#65A30D',
    value: 'trabalho em equipe e utilidade',
    missionTitle: 'Missão da Pequena Ajuda',
    missionDesc: 'Faça uma pequena boa ação que ninguém viu, sabendo que cada detalhe melhora o mundo!',
    reflectionQuestion: 'Como até as menores atitudes de cooperação podem gerar resultados grandiosos para todos?',
    paragraphs: [
      { text: "Em um lindo jardim perfumado, a pequena abelhinha Melinda acordava todos os dias com o nascer do sol. Suas asinhas transparentes batiam tão rápido que pareciam um sussurro musical no ar.", prompt: "Cute friendly honeybee Melinda hovering over bright red and yellow blooming garden flowers, 2D storybook illustration" },
      { text: "Muitos animais do jardim não entendiam o que Melinda fazia: ela pousava com delicadeza de flor em flor, recolhendo pequenos grãos de pólen dourado em suas patinhas peludinhas.", prompt: "Close up of cute honeybee gently touching golden pollen on a daisy flower petals, 2D storybook illustration" },
      { text: "O sapinho Cururu perguntou: 'Por que você viaja tanto o dia inteiro em vez de ficar descansando à beira da lagoa?' Melinda sorriu e respondeu que cada flor precisa do pólen da outra para dar frutos suculentos.", prompt: "Gentle green frog on lily pad talking respectfully to hovering friendly bee, 2D storybook illustration" },
      { text: "Sem o trabalho incansável das abelhinhas, as macieiras não teriam maçãs, as laranjeiras não dariam laranjas doces e as florestas não produziriam sementes para alimentar os passarinhos.", prompt: "Orchard with heavy branches full of bright red apples and oranges shining in golden sunlight, 2D storybook illustration" },
      { text: "De volta à colmeia de cera dourada, Melinda e suas irmãs dançavam indicando o caminho das flores mais frescas e transformavam o néctar no mel mais saboroso e curativo da terra.", prompt: "Inside warm golden hexagonal honeycomb with busy happy bees making honey, warm light, 2D storybook illustration" },
      { text: "Melinda ensinou a todos que nenhum ser é pequeno demais para fazer a diferença: quando cada um cumpre sua parte com amor e dedicação, a vida inteira floresce ao redor.", prompt: "Honeybee Melinda flying happily above colorful meadow full of wildflowers and butterflies, 2D storybook illustration" }
    ]
  }
];

async function seedMassiveStories() {
  console.log(`\n🚀 Iniciando cadastro de ${NEW_STORIES.length} novas histórias no Firestore...`);

  // Busca histórias existentes para evitar duplicatas por título
  const existingSnapshot = await db.collection('stories').get();
  const existingTitles = new Set();
  existingSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.title) {
      existingTitles.add(data.title.trim().toLowerCase());
    }
  });

  console.log(`Histórias atualmente cadastradas no banco: ${existingTitles.size}`);

  let insertedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < NEW_STORIES.length; i++) {
    const rawStory = NEW_STORIES[i];
    const normalizedTitle = rawStory.title.trim().toLowerCase();

    if (existingTitles.has(normalizedTitle)) {
      console.log(`- Pulando história já existente: "${rawStory.title}"`);
      skippedCount++;
      continue;
    }

    const docRef = db.collection('stories').doc();
    const seedBase = 300 + (insertedCount * 40);

    const formattedParagraphs = rawStory.paragraphs.map((p, idx) => {
      const imgUrl = generate2DImageUrl(p.prompt, seedBase + idx);
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

    const coverUrl = formattedParagraphs[0]?.imageUrl || '';
    const fullText = rawStory.paragraphs.map(p => p.text).join('\n\n');

    const payload = {
      id: docRef.id,
      title: rawStory.title,
      slug: rawStory.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      category: rawStory.category,
      ageGroups: rawStory.ageGroups || ['5-7', '8-10'],
      durationMinutes: Math.max(5, Math.ceil(formattedParagraphs.length / 2)),
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
    insertedCount++;
    console.log(`[${insertedCount}/${NEW_STORIES.length}] ✅ Inserida com sucesso: "${rawStory.title}" (${rawStory.category}) [${formattedParagraphs.length} páginas]`);
  }

  console.log(`\n==============================================`);
  console.log(`🎉 PROCESSO CONCLUÍDO COM SUCESSO!`);
  console.log(`Total inseridas: ${insertedCount}`);
  console.log(`Total puladas (já existiam): ${skippedCount}`);

  // Recontagem final no banco
  const finalSnapshot = await db.collection('stories').get();
  const summaryByCat = {};
  finalSnapshot.forEach(doc => {
    const d = doc.data();
    const cat = d.category || 'sem-categoria';
    summaryByCat[cat] = (summaryByCat[cat] || 0) + 1;
  });

  console.log(`\n📊 Novo Panorama Geral de Histórias no Firestore:`);
  console.table(summaryByCat);
  console.log(`Total geral no catálogo: ${finalSnapshot.size} histórias.`);
}

seedMassiveStories().then(() => process.exit(0)).catch(err => {
  console.error('Erro na execução:', err);
  process.exit(1);
});
