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

// Função para gerar URL do proxy de imagem 2D limpa
function generate2DImageUrl(promptText, seed) {
  const cleanPrompt = promptText.replace(/[*_#~`"']/g, '').trim();
  const encoded = encodeURIComponent(cleanPrompt);
  return `/api/ai/image?prompt=${encoded}&seed=${seed}`;
}

// Conjunto mestre de histórias clássicas completas, profundas e detalhadas
const MASTER_CLASSIC_STORIES = [
  // ==========================================
  // 1. MITOLOGIA GREGA
  // ==========================================
  {
    title: 'Teseu e o Fio de Ariadne',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🧶',
    coverColor: '#7C3AED',
    value: 'inteligência e organização',
    missionTitle: 'Caminho Seguro',
    missionDesc: 'Ajude alguém da sua família a encontrar algo perdido hoje organizando os passos com calma!',
    reflectionQuestion: 'Por que o planejamento cuidadoso e a serenidade nos ajudam a resolver os problemas mais difíceis da vida?',
    paragraphs: [
      { text: "Na antiga cidade grega de Trezena, o jovem Teseu cresceu sendo educado por sua mãe Aetria e seu avô, o sábio rei Piteu. Ele aprendeu desde cedo que um verdadeiro líder é reconhecido pelo respeito, pela justiça e pelo autocontrole.", prompt: "Young Theseus walking through sunny Greek marble courtyard with olive trees and blue sky, 2D storybook illustration" },
      { text: "Ao completar dezesseis anos, Teseu conseguiu erguer uma pesada rocha de pedra, encontrando a espada e as sandálias deixadas por seu pai, o Rei Egeu de Atenas. Com coração corajoso, ele decidiu viajar para conhecer a capital.", prompt: "Young Theseus lifting a large stone block revealing a gold sword and sandals, sunny Greek meadow, 2D storybook illustration" },
      { text: "Durante a longa caminhada pela costa do Istmo de Corinto, Teseu protegeu os viajantes contra bandidos e perigos, mostrando que a verdadeira força deve ser usada sempre para defender os fracos e necessitados.", prompt: "Theseus holding a wooden staff walking along sunny Greek mountain path near blue sea, 2D storybook illustration" },
      { text: "Ao chegar à grandiosa Atenas, o Rei Egeu reconheceu a espada de seu filho e abraçou-o com profunda emoção diante de toda a corte, declarando Teseu o príncipe herdeiro do reino.", prompt: "King Aegus embracing young Theseus warmly in a sunlit Athenian palace court, 2D storybook illustration" },
      { text: "Contudo, o ambiente na cidade era de profunda tristeza. Todos os anos, por causa de um antigo tratado, jovens de Atenas eram enviados para a ilha de Creta para entrar no temido Labirinto construído pelo arquiteto Dédalo.", prompt: "Townspeople in ancient Athens gathering in sadness under clear blue sky, 2D storybook illustration" },
      { text: "Não suportando ver as famílias chorarem, o príncipe Teseu deu um passo à frente perante o Rei Egeu e disse com determinação: 'Pai, eu irei como voluntário. Com inteligência e retidão, trarei a paz de volta à nossa terra'.", prompt: "Young Theseus speaking bravely to his father King Aegus in throne room, 2D storybook illustration" },
      { text: "O Rei Egeu abençoou o filho e pediu: 'Se você for vitorioso, troque as velas pretas do navio por velas brancas reluzentes na viagem de volta, para que eu saiba de longe que você está vivo e bem'.", prompt: "Ancient Greek sailboat with black sails departing sunny port as elderly king waves, 2D storybook illustration" },
      { text: "Teseu embarcou na frota e navegou pelas águas cristalinas do Mar Egeu. Durante o trajeto, ele manteve a serenidade, conversando com os outros jovens e incentivando-os a confiar na sabedoria e no bem.", prompt: "Theseus standing calmly on wooden sailboat deck looking over turquoise Mediterranean sea, 2D storybook illustration" },
      { text: "Ao desembarcarem no movimentado porto de Cnosso, na ilha de Creta, os atenienses foram conduzidos ao imponente palácio real, cujas colunas vermelhas brilhavam sob o sol radiante da tarde.", prompt: "Group of young travelers walking into majestic Cretan palace with red pillars, 2D storybook illustration" },
      { text: "A jovem princesa Ariadne, filha do Rei Minos, observou o príncipe Teseu da varanda do palácio. Impressionada com sua postura nobre, olhar sincero e amor ao seu povo, Ariadne decidiu ajudá-lo.", prompt: "Princess Ariadne watching young Theseus from palace balcony with warm respectful expression, 2D storybook illustration" },
      { text: "Naquela mesma noite, Ariadne encontrou-se secretamente com Teseu no jardim de oliveiras. Ela entregou-lhe um pequeno novelo de fio de seda dourado e uma pequena espada de bronze limpa.", prompt: "Princess Ariadne handing a golden thread ball to young Theseus in a sunlit moonlit garden, 2D storybook illustration" },
      { text: "Ariadne explicou-lhe o conselho do sábio Dédalo: 'Amarre a ponta deste fio dourado logo no portão de entrada. À medida que caminhar pelos corredores escuros, vá desenrolando o novelo sem soltar a guia'.", prompt: "Close up of Ariadne showing golden thread ball to Theseus with soft gentle light, 2D storybook illustration" },
      { text: "Ariadne continuou: 'Quando sua missão estiver concluída, basta rebobinar o fio de seda dourado. Ele conduzirá seus passos com exatidão de volta à luz, impede qualquer pessoa de se perder'.", prompt: "Theseus holding the shiny golden thread ball attentively listening to Ariadne, 2D storybook illustration" },
      { text: "Ao alvorecer, Teseu caminhou firme até o imenso portão de bronze do Labirinto. Com todo o cuidado, ele amarrou a ponta do fio de seda em uma argola de ferro encravada na pedra da entrada.", prompt: "Theseus tying golden thread to large stone archway entrance, sunny daylight, 2D storybook illustration" },
      { text: "Passo a passo, Teseu adentrou os corredores sinuosos de mármore. Enquanto o sol filtrava pelos arcos superiores, ele desenrolava a linha dourada com calma, sem jamais se afobar ou entrar em pânico.", prompt: "Theseus holding golden thread walking through sunlit marble labyrinth hallways, 2D storybook illustration" },
      { text: "O som de seus passos ecoava nas paredes de pedra. Lembrou-se dos conselhos de seu avô: a calma e a organização vencem o caos, e o medo desaparece quando mantemos o foco no dever justo.", prompt: "Theseus holding a warm lantern and golden thread in arched stone passage, 2D storybook illustration" },
      { text: "No grande pátio central do Labirinto, iluminado por feixes de luz solar, Teseu encontrou o lendário Minotauro. Com destreza, inteligência e serenidade, Teseu superou o desafio sem violência desnecessária.", prompt: "Theseus standing calmly before a tall peaceful horned guardian in sunlit atrium, 2D storybook illustration" },
      { text: "Com o objetivo alcançado, Teseu sorriu com gratidão. Ele começou a rebobinar o fio de seda dourado, que resplandecia sob os feixes de luz, mostrando o caminho exato da volta.", prompt: "Theseus rolling back the shiny golden thread ball carefully in marble corridor, 2D storybook illustration" },
      { text: "Seguindo o fio de ouro, Teseu guiou todos os jovens atenienses com segurança total de volta ao portão de bronze, onde Ariadne os esperava com imensa alegria e alívio.", prompt: "Theseus leading happy young people out of stone archway into bright sunny garden, 2D storybook illustration" },
      { text: "Todos celebraram a vitória da sabedoria. Teseu retornou a Atenas, trocou as velas do navio por mantos brancos radiantes e tornou-se um rei sábio que ensinou seu povo a planejar cada passo com virtude.", prompt: "King Theseus wearing laurels crown standing on sailboat looking over sunny Athens at golden sunset, 2D storybook illustration" }
    ]
  },
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
      { text: "Na Grécia Antiga, o jovem Hércules cresceu demonstrando uma força extraordinária. Porém, ele aprendeu com seus sábios mestres que a verdadeira heroísmo não vem dos músculos, mas do amor, da serenidade e do domínio próprio.", prompt: "Young Hercules as a brave boy standing in ancient Greece with blue sky and marble pillars, holding a wooden staff, warm 2D storybook illustration" },
      { text: "Para reparar seus erros da juventude e provar sua nobreza de caráter, Hércules comprometeu-se a realizar doze tarefas desafiadoras impostas pelo Rei Euristeu, mantendo sempre o coração em paz.", prompt: "Young Hercules receiving a wooden scroll from king in Greek palace court, sunny blue sky, 2D storybook illustration" },
      { text: "No 1º Trabalho, Hércules enfrentou o invulnerável Leão de Nemeia. Com calma e estratégia, ele amansou a fera e usou sua própria lenda para proteger os habitantes da região sem crueldade.", prompt: "Young Hercules facing a large golden lion in a sunlit Greek wheat field, brave calm posture, 2D storybook illustration" },
      { text: "No 2º Trabalho, Hércules enfrentou a Hidra de Lerna no pântano. Percebendo que cada obstáculo exigia cooperação, trabalhou lado a lado com seu fiel amigo Iolau, mostrando o valor do trabalho em equipe.", prompt: "Young Hercules and his friend holding torches in a misty valley, working together, 2D storybook illustration" },
      { text: "No 3º Trabalho, Hércules precisou capturar a sagrada Cerva de Cerineia, que tinha chifres de ouro. Durante um ano inteiro, ele a seguiu pelas florestas com enorme paciência sem jamais ferir a graciosa criatura.", prompt: "Young Hercules gently approaching a graceful golden-horned deer in a sunlit forest, 2D storybook illustration" },
      { text: "No 4º Trabalho, Hércules subiu as montanhas geladas de Erimanto. Com serenidade e resistente ao frio, ele guiou o selvagem javali até a neve profunda, pacificando o animal com paciência inabalável.", prompt: "Young Hercules walking safely in snowy Greek mountains with pine trees, blue winter sky, 2D storybook illustration" },
      { text: "No 5º Trabalho, o desafio parecia impossível: limpar os gigantescos estábulos do Rei Augias em um único dia. Hércules usou a criatividade e desviu dois rios límpidos que lavaram tudo com perfeita eficiência.", prompt: "Young Hercules redirecting two rushing blue rivers with stones to clean a sunny farm, 2D storybook illustration" },
      { text: "No 6º Trabalho, no lago Estínfalo, Hércules recebeu címbalos de bronze presenteados pela deusa Atena. O som suave fez as aves misteriosas voarem para longe pacificamente sem ferir ninguém.", prompt: "Young Hercules playing golden cymbals under a sunny sky as colorful birds fly away over a calm lake, 2D storybook illustration" },
      { text: "No 7º Trabalho, na ilha de Creta, Hércules amansou o grande touro selvagem com gestos firmes e tranquilos, navegando de volta pelo Mar Egeu com o animal totalmente pacificado.", prompt: "Young Hercules standing next to a gentle brown bull on a wooden sailboat in turquoise sea, 2D storybook illustration" },
      { text: "No 8º Trabalho, na Trácia, Hércules resgatou os velozes cavalos de Diomedes, alimentando-os com boa grama fresca e trazendo a paz de volta às fazendas da região.", prompt: "Young Hercules feeding fresh green grass to majestic horses in a sunlit meadow, 2D storybook illustration" },
      { text: "No 9º Trabalho, Hércules viajou ao reino das Amazonas. Usando palavras de respeito e verdade, ele conquistou a confiança da Rainha Hipólita sem travar nenhuma batalha.", prompt: "Young Hercules speaking respectfully to a queen wearing a golden crown in ancient Greece, 2D storybook illustration" },
      { text: "No 10º Trabalho, Hércules caminhou por terras distantes até a ilha de Eritreia, mantendo a perseverança firme e a mente focada no dever mesmo sob o calor forte do deserto.", prompt: "Young Hercules walking bravely across a golden desert dune with a clear blue sky, 2D storybook illustration" },
      { text: "No 11º Trabalho, Hércules encontrou o jardim secreto das Hespérides. Com humildade e sabedoria, ele colheu as maçãs douradas para presentear o povo com ensinamentos de vida.", prompt: "Young Hercules holding shiny golden apples under a tree with golden fruit, 2D storybook illustration" },
      { text: "No 12º e último Trabalho, Hércules cumpriu a promessa de não usar nenhuma arma. Com afeição e respeito, amansou o leal guarda Cerberus, demonstrando que o amor vence o medo.", prompt: "Young Hercules gently petting a friendly three-headed dog in a sunlit stone hall, 2D storybook illustration" },
      { text: "Ao concluir os Doze Trabalhos, Hércules provou a todo o mundo antigo que o maior herói não é aquele que vence batalhas brutas, mas sim aquele que domina a si mesmo e serve com amor.", prompt: "Young Hercules standing heroically on a mountain peak looking over a peaceful Greek village, golden sunset, 2D storybook illustration" }
    ]
  },
  {
    title: 'Perseu e o Escudo de Bronze',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🛡️',
    coverColor: '#2563EB',
    value: 'coragem e sabedoria',
    missionTitle: 'Escudo do Respeito',
    missionDesc: 'Pense antes de agir hoje! Use a sabedoria para responder com educação a qualquer momento difícil.',
    reflectionQuestion: 'Como a sabedoria nos ajuda a vencer o medo quando encontramos algo assustador?',
    paragraphs: [
      { text: "Na vibrante Grécia Antiga, o jovem Perseu vivia com sua querida mãe, Danae, na tranquila ilha de Serifos. Ele era um rapaz conhecido por sua lealdade, bondade e amor à família.", prompt: "Young Perseus standing in a sunny Greek coastal village with turquoise sea and olive trees, 2D storybook illustration" },
      { text: "Um dia, para proteger sua mãe de imposições injustas do governante local, Perseu comprometeu-se a realizar uma jornada perigosa para obter o reflexo da verdade e restaurar a paz no reino.", prompt: "Young Perseus talking to an old wise scholar holding a ancient scroll in a sunny Greek courtyard, 2D storybook illustration" },
      { text: "Sentado à beira do Mar Egeu, Perseu buscou forças na oração e na reflexão silenciosa, sabendo que a coragem autêntica é a firme determinação de fazer o que é certo mesmo diante da incerteza.", prompt: "Perseus sitting on a stone by the sea watching bright sunbeams on blue waves, 2D storybook illustration" },
      { text: "Sensibilizada com a nobreza de seu coração, a deusa da sabedoria, Atena, presenteou Perseu com um escudo de bronze perfeitamente polido que reluzia como um espelho sob a luz do sol.", prompt: "Athena giving a gleaming polished bronze shield to young Perseus in a sunlit garden, 2D storybook illustration" },
      { text: "'Este escudo refletirá a verdade', ensinou Atena. 'Ele ajudará você a enxergar os obstáculos com clareza sem se deixar paralisar pelo pavor ou por ilusões enganosas'.", prompt: "Young Perseus admiring the reflection of clouds in his shiny golden bronze shield, 2D storybook illustration" },
      { text: "O deus Hermes presenteou-o com sandálias aladas que permitiam caminhar com agilidade e leveza sobre montanhas e vales, mantendo os passos sempre seguros.", prompt: "Hermes handing winged sandals to Perseus under a clear blue sky, 2D storybook illustration" },
      { text: "Com as sandálias aladas, Perseu voou serenamente sobre ilhas, mares e florestas, aprendendo a contemplar a beleza da criação enquanto cumpria sua missão com prudência.", prompt: "Perseus flying gracefully above green Greek islands and blue ocean with white clouds, 2D storybook illustration" },
      { text: "Ao chegar à caverna de pedra onde as sombras se ocultavam, Perseu colocou o escudo de bronze em sua frente, olhando apenas para a imagem refletida no espelho reluzente.", prompt: "Perseus holding up his mirror shield inside a warm stone passage, seeing clear reflections, 2D storybook illustration" },
      { text: "Guiado pelo reflexo nítido do bronze, Perseu caminhou com serenidade e passos firmes, superando o desafio sem hesitar nem derramar lágrimas de medo.", prompt: "Perseus stepping carefully guided by shield reflection in sunny archway, 2D storybook illustration" },
      { text: "Na viagem de volta, Perseu resgatou a jovem Andrade na praia, ajudando-a a libertar-se das correntes de uma tempestade e levando-a em segurança em seu barco.", prompt: "Young Andromeda standing safely on a sunny beach near gentle sea waves with Perseus helping her, 2D storybook illustration" },
      { text: "Ao retornar a Serifos, Perseu reencontrou sua mãe e usou o escudo da sabedoria para estabelecer a paz em todo o vilarejo, provando que a virtude vence qualquer adversidade.", prompt: "Perseus hugging his mother Danae happily in a flower-filled village square with cheering people, 2D storybook illustration" }
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
    ageGroups: ['2-4', '5-7', '8-10', '11-14'],
    coverEmoji: '👑',
    coverColor: '#16A34A',
    value: 'fé e confiança em Deus',
    missionTitle: 'Guerreiro da Coragem',
    missionDesc: 'Escreva ou diga em voz alta três motivos pelos quais você confia em Deus para vencer seus medos!',
    reflectionQuestion: 'Como a fé nos torna fortes mesmo quando nos sentimos pequenininhos diante dos problemas?',
    paragraphs: [
      { text: "Nos ensolarados campos de Belém, o jovem Davi cuidava das ovelhinhas do seu pai Jessé com enorme amor, responsabilidade e carinho.", prompt: "Young boy David playing a wooden harp among fluffy white sheep in green hills, 2D storybook illustration" },
      { text: "Enquanto pastoreava, Davi costumava tocar sua harpa de madeira e cantar louvores a Deus sob a sombra das grandes oliveiras.", prompt: "Little David sitting under olive tree playing harp under blue sunny sky, 2D storybook illustration" },
      { text: "Quando um leão faminto tentou atacar o rebanho, Davi não fugiu: ele orou a Deus e protegeu a ovelhinha com sua coragem de pastor.", prompt: "Young shepherd boy standing protectively in front of fluffy sheep in green meadow, 2D storybook illustration" },
      { text: "Certo dia, seu pai pediu que ele levasse pães e queijos para seus irmãos mais velhos que estavam no acampamento do exército de Israel.", prompt: "Young David carrying a wicker basket with fresh bread and cheese along a dusty path, 2D storybook illustration" },
      { text: "Ao chegar ao Vale de Elá, Davi ouviu a voz estrondosa do gigante Golias, que assustava a todos os soldados com grandes ameaças.", prompt: "Large warrior standing across a valley shouting while soldiers watch nervously, 2D storybook illustration" },
      { text: "Enquanto todos os guerreiros recuavam com medo, o pequeno Davi manteve o coração sereno, sabendo que Deus estava com ele.", prompt: "Young David looking calm and brave standing among nervous soldiers, 2D storybook illustration" },
      { text: "Davi apresentou-se ao rei Saul e disse com firmeza: 'Não fiquem com medo! Deus me livrou do leão e do urso, e me ajudará hoje também'.", prompt: "Young David talking respectfully to King Saul wearing a gold crown in a tent, 2D storybook illustration" },
      { text: "O rei tentou vestir Davi com uma pesada armadura de bronze, mas Davi mal conseguia andar. Ele preferiu ir com suas roupas simples de pastor.", prompt: "Young David taking off a heavy metal helmet and smiling simply, 2D storybook illustration" },
      { text: "Davi caminhou até um riacho límpido no vale e escolheu cinco pedrinhas lisas e arredondadas, colocando-as em sua bolsa de couro.", prompt: "Young David picking up smooth round pebbles from a clear rushing stream, 2D storybook illustration" },
      { text: "Com seu cajado de madeira em uma mão e sua atiradeira simples na outra, Davi deu passos firmes ao encontro do gigante Golias.", prompt: "Young David holding a wooden staff walking bravely in a sunlit valley, 2D storybook illustration" },
      { text: "Golias riu ao ver um jovem pastor tão pequeno. Mas Davi respondeu: 'Você vem contra mim com espada e lança, mas eu vou em nome do Senhor!'.", prompt: "Young David standing courageously looking up with faith in a sunny valley, 2D storybook illustration" },
      { text: "Davi colocou uma pedra na atiradeira, girou-a com precisão e lançou-a. A pedra voou direto e venceu o gigante, trazendo paz a todo o povo.", prompt: "Young David standing triumphantly in golden sunbeams as villagers cheer happily around him, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Arca de Noé',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🌈',
    coverColor: '#0891B2',
    value: 'obediência e esperança',
    missionTitle: 'Pintura da Esperança',
    missionDesc: 'Desenhe um arco-íris bem colorido e dê de presente para alguém que você ama!',
    reflectionQuestion: 'O que a promessa do arco-íris nos ensina sobre a fidelidade de Deus?',
    paragraphs: [
      { text: "Há muitos e muitos anos, vivia um homem bom e justo chamado Noé. Ele andava sempre nos caminhos de Deus e cuidava da sua família com amor.", prompt: "Elderly Noah standing peacefully in a green field with a sunny blue sky, 2D storybook illustration" },
      { text: "Deus falou ao coração de Noé e pediu que ele construísse uma grande arca de madeira firme para proteger a vida na Terra.", prompt: "Noah listening reverently as light shines through clouds in a peaceful meadow, 2D storybook illustration" },
      { text: "Noé e seus filhos começaram a trabalhar com muita dedicação, cortando tábuas de madeira e passando resina para vedar tudo com perfeição.", prompt: "Noah and his sons sawing wooden planks and building a large wooden ship, 2D storybook illustration" },
      { text: "Os vizinhos achavam estranho construir um barco enorme no meio da terra seca, mas Noé permaneceu obediente e paciente.", prompt: "Noah smiling kindly and carrying wooden beams while family works together, 2D storybook illustration" },
      { text: "Quando a arca ficou pronta, animais de todas as espécies começaram a se aproximar em pares, trazidos por uma força especial.", prompt: "Pairs of lions, giraffes, elephants and birds walking peacefully towards the ark, 2D storybook illustration" },
      { text: "Noé abriu a grande porta de madeira e acolheu com carinho cada casal de animais dentro da grande arca.", prompt: "Noah welcoming gentle giraffes and rabbits up the wooden ramp of the ark, 2D storybook illustration" },
      { text: "Assim que todos entraram em segurança, as janelas do céu se abriram e uma chuva suave e contínua começou a cair sobre a Terra.", prompt: "Raindrops falling gently on the large wooden ark floating safely on calm water, 2D storybook illustration" },
      { text: "Dentro da arca, Noé e sua família cuidavam dos animais, alimentando-os com grãos e ervas secas em ambiente quentinho e seguro.", prompt: "Noah feeding hay to horses and rabbits inside a cozy lit wooden room in ark, 2D storybook illustration" },
      { text: "Após muitos dias, as nuvens escuras foram se dissipando e o sol voltou a brilhar radiante sobre as águas.", prompt: "Bright sun shining through soft white clouds onto calm blue sea around ark, 2D storybook illustration" },
      { text: "Noé soltou uma pomba branca para saber se a terra já havia secado. Ela retornou à tarde trazendo um raminho verde de oliveira no bico.", prompt: "White dove landing on Noah hand holding a green olive leaf, sunny window, 2D storybook illustration" },
      { text: "Noé abriu a porta da arca e todos os animais saíram saltando e voando com imensa alegria sobre a grama novinha.", prompt: "Animals running happily out of the ark onto green sunny hills, 2D storybook illustration" },
      { text: "No céu azul, Deus desenhou um lindo arco-íris de sete cores brilhantes como símbolo eterno de sua promessa, esperança e amor.", prompt: "Vibrant rainbow glowing over green hills with Noah family praising God, golden sunset, 2D storybook illustration" }
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
      { text: "Na pequena e acolhedora aldeia de Domrémy, na França, cresceu a jovem Joana d'Arc. Ela passava seus dias ajudando a cuidar da fazenda e pastoreando as ovelhas.", prompt: "Young Joan of Arc as a simple farm girl walking with sheep in green flower field, 2D storybook illustration" },
      { text: "Joana tinha um coração profundamente espiritual. Ela costumava orar sob a sombra de uma árvore antiga e escutar a voz da sua consciência.", prompt: "Young Joan praying peacefully near a large oak tree in sunny French countryside, 2D storybook illustration" },
      { text: "Naquela época, a França enfrentava tempos muito difíceis e tristes por causa de conflitos prolongados que destruíam as colheitas das famílias.", prompt: "Simple French village with thatched roofs under a quiet cloudy sky, 2D storybook illustration" },
      { text: "Aos dezessete anos, sentindo uma forte determinação no coração, Joana decidiu viajar até a cidade de Chinon para falar com o futuro rei Carlos VII.", prompt: "Young Joan riding a horse along a dirt path through green hills, 2D storybook illustration" },
      { text: "Os conselheiros reais duvidaram de uma jovem tão simples, mas ao conversarem com Joana, ficaram impressionados com sua clareza, fé e humildade.", prompt: "Joan speaking with deep conviction to court nobles in a stone palace hall, 2D storybook illustration" },
      { text: "O rei concedeu a Joana uma armadura prateada e um estandarte branco desenhado com lírios dourados para liderar o exército na libertação da cidade de Orléans.", prompt: "Joan wearing shiny silver armor and holding a white lily banner, 2D storybook illustration" },
      { text: "Joana não lutava com violência ou raiva; ela cavalgava à frente das tropas segurando o estandarte e transmitindo esperança e coragem aos soldados.", prompt: "Joan riding a noble white horse holding her banner high, sunny battlefield, 2D storybook illustration" },
      { text: "Em poucos dias, com a liderança inspiradora de Joana, a cidade de Orléans foi libertada e o povo voltou a ter paz e segurança.", prompt: "Townspeople in Orléans cheering and throwing flowers as Joan rides through stone gates, 2D storybook illustration" },
      { text: "Joana acompanhou o príncipe até a catedral de Reims, onde ele foi solenemente coroado Rei da França sob aplausos de toda a nação.", prompt: "Coronation of French king in grand cathedral with stained glass windows and Joan watching, 2D storybook illustration" },
      { text: "Mesmo enfrentando incompreensões e julgamentos injustos mais tarde, Joana d'Arc nunca abriu mão da sua fé, da sua integridade e do seu amor à verdade.", prompt: "Joan standing bravely with calm expression looking towards bright sunlight, 2D storybook illustration" },
      { text: "Sua determinação inabalável transformou-a em uma das maiores heroínas da história mundial e padroeira da França.", prompt: "Statue motif of Joan of Arc surrounded by glowing white lilies and sunny blue sky, 2D storybook illustration" },
      { text: "A história de Joana d'Arc inspira meninas e meninos até hoje a agirem com bravura moral, defendendo o bem e a justiça sem jamais temer.", prompt: "Young girl reading a book under a tree looking at clouds shaped like Joan of Arc, 2D storybook illustration" }
    ]
  },
  {
    title: 'Princesa Isabel',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '📜',
    coverColor: '#4F46E5',
    value: 'justiça e liberdade',
    missionTitle: 'Ato de Justiça',
    missionDesc: 'Inclua um amigo que está sozinho em uma brincadeira hoje!',
    reflectionQuestion: 'Por que o verdadeiro líder usa seu poder para libertar e ajudar os outros?',
    paragraphs: [
      { text: "No Palácio de São Cristóvão, no Rio de Janeiro, cresceu a Princesa Isabel, filha do imperador Dom Pedro II. Ela era uma menina curiosa e estudiosa.", prompt: "Young Princess Isabel as a child reading a leather book in palace garden, 2D storybook illustration" },
      { text: "Seus professores ensinavam línguas, história e ciências, mas seu pai fazia questão de ensinar o respeito a todas as pessoas, sem distinção.", prompt: "Emperor Pedro II talking kindly to young Isabel in a palace library, 2D storybook illustration" },
      { text: "Ao crescer, a Princesa Isabel ficou chocada ao ver que muitas pessoas ainda eram escravizadas no Brasil e viviam sem liberdade.", prompt: "Princess Isabel looking compassionately at working people in historical Rio de Janeiro, 2D storybook illustration" },
      { text: "Isabel usou sua influência para apoiar artistas, escritores e movimentos que lutavam pelo fim do cativeiro e pela igualdade humana.", prompt: "Princess Isabel meeting with scholars and abolitionists in a sunlit parlor, 2D storybook illustration" },
      { text: "Quando assumiu a regência do país na ausência de seu pai, Isabel decidiu que era o momento de tomar uma atitude histórica pela justiça.", prompt: "Princess Isabel sitting at official wooden desk reviewing government documents, 2D storybook illustration" },
      { text: "No dia 13 de maio de 1888, cercada por deputados e cidadãos, a Princesa Isabel segurou uma linda pena de ouro.", prompt: "Princess Isabel holding a gold fountain pen in grand hall with Brazilian flags, 2D storybook illustration" },
      { text: "Com gesto firme e coração cheio de compaixão, ela assinou a Lei Áurea, declarando a liberdade imediata e definitiva de todas as pessoas no Brasil.", prompt: "Close up of Princess Isabel signing the golden scroll Lei Aurea with smiling expression, 2D storybook illustration" },
      { text: "Assim que a notícia se espalhou, milhares de pessoas tomaram as ruas do Rio de Janeiro cantando, dançando e jogando flores de laranjeira.", prompt: "Crowds of diverse happy people celebrating in sunny street with tropical trees and flowers, 2D storybook illustration" },
      { text: "Por sua coragem e senso de justiça, a Princesa Isabel passou a ser chamada carinhosamente por todo o povo de 'A Redentora'.", prompt: "Princess Isabel smiling warmly receiving a bouquet of yellow roses from townspeople, 2D storybook illustration" },
      { text: "Sua vida nos ensina que o verdadeiro poder de um líder deve ser usado para promover a liberdade, a dignidade e a paz para todos os seres humanos.", prompt: "Princess Isabel standing gracefully looking out at Guanabara Bay at golden sunset, 2D storybook illustration" }
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
      { text: "No século XIII, o jovem Luís tornou-se Rei da França ainda criança. Sua mãe, a rainha Branca de Castela, educou-o com profundo amor à justiça e à virtude.", prompt: "Young King Louis IX receiving a gold crown while mother smiles lovingly in cathedral, 2D storybook illustration" },
      { text: "Sua mãe dizia-lhe frequentemente: 'Meu filho, prefiro que você seja um homem justo e temente a Deus a que possua todas as riquezas do mundo'.", prompt: "Queen Blanche talking to young Louis IX in sunlit palace room, 2D storybook illustration" },
      { text: "Ao crescer, Luís IX governou o país não com ostentação, mas com extrema simplicidade, criando leis que protegiam os camponeses contra abusos dos nobres.", prompt: "King Louis IX listening to poor farmers in a rustic village court, 2D storybook illustration" },
      { text: "Todos os dias, as portas do seu palácio se abriam para receber centenas de necessitados. O próprio rei servia sopa quentinha e pão a eles com suas mãos.", prompt: "King Louis IX wearing simple tunic serving soup from a iron pot to poor families, 2D storybook illustration" },
      { text: "Ele fundou o famoso hospital dos Quinze-Vinte em Paris para cuidar de pessoas cegas e enfermas que não tinham onde morar.", prompt: "King Louis IX visiting sick people in a clean sunlit hospital room with white beds, 2D storybook illustration" },
      { text: "Nas horas vagas, o rei gostava de sentar-se sob a sombra de um grande carvalho no parque de Vincennes para ouvir e resolver as dúvidas do povo.", prompt: "King Louis IX sitting under a big green oak tree listening to citizens calmly, 2D storybook illustration" },
      { text: "Luís IX promoveu a construção da deslumbrante Sainte-Chapelle em Paris, um monumento de pedra e vitrais coloridos dedicado à oração.", prompt: "Magnificent Sainte-Chapelle stained glass windows shining in sunlight, 2D storybook illustration" },
      { text: "Mesmo sendo um monarca poderoso, Luís IX vestia-se de forma modesta e fazia questão de lavar os pés dos peregrinos como gesto de profunda humildade.", prompt: "King Louis IX washing feet of elderly traveler with wooden bowl and towel, 2D storybook illustration" },
      { text: "Por causa de sua vida dedicada inteiramente à caridade, à paz e ao serviço dos mais fracos, ele foi canonizado como São Luís da França.", prompt: "Saint Louis IX with gentle golden light around him holding a wooden cross, 2D storybook illustration" },
      { text: "Sua biografia lembra a governantes e crianças que a verdadeira nobreza de uma pessoa é medida pelo tamanho do seu coração e pela caridade com o próximo.", prompt: "Children looking up at colorful stained glass window in a peaceful sunny church, 2D storybook illustration" }
    ]
  },
  {
    title: 'Santos Dumont e o Avião',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '✈️',
    coverColor: '#0284C7',
    value: 'criatividade e perseverança',
    missionTitle: 'Inventor por um Dia',
    missionDesc: 'Crie um aviãozinho de papel e tente fazê-lo voar o mais longe possível!',
    reflectionQuestion: 'Como a curiosidade e o trabalho contínuo transformam sonhos em invenções reais?',
    paragraphs: [
      { text: "Nas belas colinas da Fazenda Cabangu, em Minas Gerais, cresceu o pequeno Alberto Santos Dumont. Ele era um menino calmo e fascinado pelo céu.", prompt: "Young Santos Dumont as a child sitting on a wooden fence looking at fluffy clouds, 2D storybook illustration" },
      { text: "Enquanto lia os livros de aventura de Júlio Verne, Alberto olhava para os pássaros e dentes-de-leão voando com o vento, sonhando em voar um dia.", prompt: "Young Santos Dumont reading a book under a tree while dandelion seeds float in air, 2D storybook illustration" },
      { text: "No oficina da fazenda do seu pai, Alberto adorava consertar as máquinas de café e criar pequenos balões de papel colorido.", prompt: "Young Santos Dumont building miniature paper balloons in a sunny wooden workshop, 2D storybook illustration" },
      { text: "Ao ficar adulto, Santos Dumont mudou-se para Paris, a capital dos inventores, disfarçando seus cadernos com esquemas de dirigíveis.", prompt: "Santos Dumont sketching airship blueprints at a wooden desk with lamps in Paris, 2D storybook illustration" },
      { text: "Ele construiu o dirigível N° 6 e realizou um feito incrível: contornou a famosa Torre Eiffel voando nos céus de Paris sob aplausos da multidão.", prompt: "Santos Dumont airship floating gracefully around Eiffel Tower in sunny blue sky, 2D storybook illustration" },
      { text: "Mas Alberto não parou por aí. Ele queria criar uma máquina mais pesada que o ar, capaz de decolar sozinha por seus próprios meios.", prompt: "Santos Dumont measuring wooden wing frames of his airplane in a hangar, 2D storybook illustration" },
      { text: "Na sua oficina, trabalhando dia e noite com bambu, seda de balão e fios de cana-de-açúcar, nasceu a histórica aeronave 14-Bis.", prompt: "Santos Dumont adjusting the engine of 14-Bis biplane with tools in sunny hangar, 2D storybook illustration" },
      { text: "No dia 23 de outubro de 1906, no campo de Bagatelle em Paris, uma multidão curiosa se reuniu para assistir ao grande teste do 14-Bis.", prompt: "Crowd of people in vintage clothes gathered in a green grass field watching 14-Bis, 2D storybook illustration" },
      { text: "Santos Dumont ligou o motor. O 14-Bis correu pela grama, acelerou e subiu suavemente pelos ares, voando por 60 metros diante de todos!", prompt: "14-Bis biplane flying high over green field with bright blue sky and cheering crowd, 2D storybook illustration" },
      { text: "Foi o primeiro voo público e homologado de um avião no mundo! Santos Dumont não patenteou suas invenções, doando os projetos para toda a humanidade.", prompt: "Santos Dumont smiling proudly wearing panama hat standing next to his airplane, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // 5. CONTOS DE HERÓIS E FÁBULAS
  // ==========================================
  {
    title: 'O Leão e o Rato',
    category: 'contos-de-herois',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐭',
    coverColor: '#EA580C',
    value: 'gratidão e respeito',
    missionTitle: 'Amigo Protetor',
    missionDesc: 'Trate com carinho alguém menor ou mais jovem que você hoje!',
    reflectionQuestion: 'Por que devemos respeitar a todos, independente do tamanho?',
    paragraphs: [
      { text: "Um grande e majestoso leão dormia tranquilamente sob a sombra acolhedora de uma árvore gigante na savana africana.", prompt: "Large fluffy lion sleeping peacefully under a big tree in sunny green savanna, 2D storybook illustration" },
      { text: "Um pequenino ratinho do campo, correndo alegremente entre as folhagens, acabou passando sem querer por cima do nariz do leão.", prompt: "Tiny cute brown mouse running across grass near sleeping lion, 2D storybook illustration" },
      { text: "O leão acordou assustado, soltou um bocejo grande e colocou sua pata enorme sobre o rabo do pequenino ratinho.", prompt: "Big gentle lion looking down at tiny mouse trapped under his soft paw, 2D storybook illustration" },
      { text: "O ratinho tremeu e pediu com voz fininha: 'Por favor, rei da floresta, poupe minha vida! Prometo que um dia poderei retribuir sua bondade'.", prompt: "Tiny mouse looking up with polite pleading eyes at big lion, 2D storybook illustration" },
      { text: "O leão achou engraçada a ideia de um ratinho tão pequeno ajudá-lo, mas sensibilizado pela educação do bicho, abriu a pata e deixou-o ir livre.", prompt: "Big lion smiling kindly and lifting his paw to let tiny mouse run free, 2D storybook illustration" },
      { text: "Alguns meses depois, enquanto caminhava pela floresta, o leão acabou caindo em uma forte rede colocada por caçadores entre as árvores.", prompt: "Big lion trapped in rope netting hanging from a tree branch, looking sad, 2D storybook illustration" },
      { text: "O leão tentou se soltar com sua enorme força, mas quanto mais se mexia, mais as cordas apertavam. Ele soltou um urro de socorro que ecoou pelos vales.", prompt: "Lion roaring for help in sunny forest clearing trapped in net, 2D storybook illustration" },
      { text: "O ratinho ouviu o rugido do seu amigo e correu imediatamente. Com seus dentes afiados, começou a roer as cordas grossas uma a uma com paciência e determinação.", prompt: "Tiny mouse chewing thick rope netting enthusiastically to free big lion, 2D storybook illustration" },
      { text: "Em poucos minutos, a rede se abriu e o grande leão caiu suavemente na grama, totalmente livre e são e salvo.", prompt: "Big lion jumping out of net happily landing safely on soft green grass, 2D storybook illustration" },
      { text: "O leão agradeceu ao ratinho do fundo do coração, aprendendo que nenhum ato de gentileza é em vão e que amigos pequenos podem realizar atos gigantescos de lealdade.", prompt: "Big lion and tiny mouse sitting together happily as best friends under sunny sky, 2D storybook illustration" }
    ]
  },
  {
    title: 'A Bela e a Fera',
    category: 'contos-de-herois',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌹',
    coverColor: '#B91C1C',
    value: 'amor e enxergar a essência',
    missionTitle: 'Olhar de Carinho',
    missionDesc: 'Faça um elogio sincero sobre as qualidades internas de alguém da sua família hoje!',
    reflectionQuestion: 'Por que a verdadeira beleza de uma pessoa está no seu coração e nas suas atitudes?',
    paragraphs: [
      { text: "Em um tranquilo vilarejo no interior da França, vivia uma jovem inteligente e leitora assídua chamada Bela.", prompt: "Young woman Bela in simple blue dress reading a book in sunny village square, 2D storybook illustration" },
      { text: "Bela adorava livros de cavalaria e poesia. Ela cuidava de seu pai, Maurice, um inventor de coração bondoso e dedicado.", prompt: "Bela helping her elderly father Maurice with wooden gears in a sunny workshop, 2D storybook illustration" },
      { text: "Um dia, ao viajar para vender suas invenções, Maurice se perdeu em uma tempestade de neve e encontrou abrigo em um castelo misterioso.", prompt: "Elderly merchant walking through snowy forest towards a magnificent stone castle, 2D storybook illustration" },
      { text: "No castelo, Maurice colheu uma rosa vermelha para presentear Bela, despertando a indignação do morador do castelo: uma Fera de aparência assustadora.", prompt: "Elderly father holding a red rose in castle garden with tall shadowy Beast watching, 2D storybook illustration" },
      { text: "Para resgatar seu amado pai, Bela viajou corajosamente até o castelo e ofereceu-se para morar no lugar em substituição a ele.", prompt: "Bela stepping bravely into sunlit stone castle hall to hug her elderly father, 2D storybook illustration" },
      { text: "Nos primeiros dias, Bela sentia medo da Fera por causa da sua voz grave e aparência rústica.", prompt: "Bela sitting at long wooden dinner table looking curiously at tall furry Beast, 2D storybook illustration" },
      { text: "Com o tempo, a Fera mostrou a Bela a grande biblioteca do castelo, cheia de milhares de livros raros iluminados pelo sol.", prompt: "Bela and the Beast standing in a huge castle library with bright arched windows, 2D storybook illustration" },
      { text: "Bela começou a perceber que a Fera tratava a todos com gentileza, educação e grande respeito, guardando um coração muito nobre.", prompt: "Bela and the Beast feeding birds together in a snowy castle garden, 2D storybook illustration" },
      { text: "Eles conversavam sobre histórias, ouviam música e passeavam pelos jardins de rosas vermelhas sob a claridade da tarde.", prompt: "Bela in yellow dress dancing gracefully with the Beast in a sunlit palace ballroom, 2D storybook illustration" },
      { text: "Quando a Fera adoeceu de saudade, Bela segurou sua mão com carinho e declarou que enxergava a verdadeira beleza do seu coração.", prompt: "Bela holding the furry hand of the Beast tenderly with tears of affection, 2D storybook illustration" },
      { text: "Nesse instante, um brilho mágico envolveu o castelo e a Fera transformou-se num príncipe jovem, gentil e de olhar sincero.", prompt: "Handsome prince standing in golden light holding hands with happy Bela in rose garden, 2D storybook illustration" },
      { text: "A história ensina a todas as crianças que as aparências exteriores passam, mas o amor, a gentileza e a essência do coração duram para sempre.", prompt: "Bela and prince standing happily together surrounded by colorful flowers and sunshine, 2D storybook illustration" }
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
      { text: "Numa tarde ensolarada de sábado, o pequeno Lucas brincava alegremente na sala de estar de sua casa com sua bola de futebol.", prompt: "Little boy Lucas playing happily with a soccer ball in a bright cozy living room, 2D storybook illustration" },
      { text: "Mesmo sabendo que sua mãe pedia para não chutar a bola dentro de casa, Lucas deu um chute um pouquinho mais forte.", prompt: "Soccer ball flying near a wooden table with a porcelain flower vase, 2D storybook illustration" },
      { text: "A bola bateu no vaso de cerâmica azul da vovó, que caiu no tapete e dividiu-se em alguns pedaços.", prompt: "Porcelain vase broken into pieces on rug with soccer ball nearby, 2D storybook illustration" },
      { text: "O coração de Lucas acelerou e ele sentiu um friozinho na barriga. Por um momento, ele pensou em inventar que o vento havia derrubado o vaso.", prompt: "Little boy looking at broken vase with a worried expression holding his soccer ball, 2D storybook illustration" },
      { text: "Mas Lucas lembrou-se das lições sobre honestidade: mentir pode parecer fácil na hora, mas deixa a consciência pesada e mancha a confiança.", prompt: "Little boy taking a deep breath with honest determined look, 2D storybook illustration" },
      { text: "Sua mãe entrou na sala ao ouvir o barulho. Lucas olhou nos olhos dela e disse com sinceridade: 'Mamãe, fui eu quem desobedeceu e chutou a bola'.", prompt: "Little boy looking up honestly and speaking to his caring mother in living room, 2D storybook illustration" },
      { text: "A mãe de Lucas respirou fundo, ajoelhou-se ao lado dele e o abraçou com muito carinho e ternura.", prompt: "Mother hugging her young son lovingly in sunlit living room, 2D storybook illustration" },
      { text: "'Fiquei chateada com o vaso', explicou a mãe, 'mas estou muito orgulhosa da sua coragem de dizer a verdade. A honestidade vale mais que mil vasos!'.", prompt: "Mother and young boy smiling happily together holding hands in sunny room, 2D storybook illustration" }
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
      { text: "A pequena Sofia adorava brincar de construir castelos com blocos de madeira e vestir suas bonecas no quarto.", prompt: "Little girl Sofia playing with colorful toy blocks on bedroom rug, 2D storybook illustration" },
      { text: "No final da tarde, o chão do quarto estava cheio de brinquedos espalhados por todos os cantos.", prompt: "Child bedroom with toys and books scattered on the wooden floor, 2D storybook illustration" },
      { text: "Em vez de esperar que a mamãe pedisse, Sofia decidiu transformar a arrumação em um jogo divertido de super-heroína da organização!", prompt: "Little girl smiling enthusiastically holding a red toy storage box, 2D storybook illustration" },
      { text: "Ela separou os blocos nas caixas amarelas, os livros na prateleira de madeira e os bichinhos de pelúcia sobre a cama.", prompt: "Little girl neatly placing plush teddy bears on a made bed in sunny room, 2D storybook illustration" },
      { text: "Sofia esticou o lençol da cama com carinho e dobrou seu pijama preferido, deixando tudo impecável em poucos minutos.", prompt: "Little girl folding a pink blanket neatly over her small bed, 2D storybook illustration" },
      { text: "Ao abrir a porta do quarto, a mamãe de Sofia ficou de queixo caído e deu um grande sorriso de surpresa.", prompt: "Mother smiling proudly looking into clean beautiful organized child bedroom, 2D storybook illustration" },
      { text: "'Parabéns, Sofia!', disse a mãe. 'Você mostrou que está crescendo com autonomia, maturidade e amor ao nosso lar'.", prompt: "Mother hugging little girl happily in bright clean bedroom with sunbeams, 2D storybook illustration" },
      { text: "Sofia sentiu uma alegria enorme no peito, aprendendo que cuidar das próprias coisas traz paz, beleza e orgulho para toda a família.", prompt: "Little girl standing proudly in center of her clean sunny room giving thumbs up, 2D storybook illustration" }
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
      { text: "Nas margens do sereno Rio Paraguay, no coração do Pantanal brasileiro, vivia a graciosa onça-pintada Tainá.", prompt: "Cute jaguar cub with beautiful spotted coat sitting near clear riverbank in Pantanal, 2D storybook illustration" },
      { text: "Tainá tinha um pelagem dourada cheia de rosetas pretas perfeitas e olhos brilhantes como duas esmeraldas.", prompt: "Jaguar resting peacefully on a thick tree branch looking at turquoise water, 2D storybook illustration" },
      { text: "Todas as manhãs, Tainá observava os tuiuiús de bico longo voando baixo sobre as águas e as capivaras nadando em família.", prompt: "Big white jabiru birds flying over wetland river with capybaras swimming happily, 2D storybook illustration" },
      { text: "Certo dia, Tainá notou que alguns plásticos de garrafas flutuavam perto do ninho dos jacarés de papo-amarelo.", prompt: "Cute jaguar looking curiously at floating plastic bottle near water plants, 2D storybook illustration" },
      { text: "Com muito cuidado, Tainá empurrou o objeto para fora da água com a pata, evitando que os animais da floresta se machucassem.", prompt: "Jaguar gently pulling plastic bottle out of water onto grassy bank, 2D storybook illustration" },
      { text: "Um grupo de crianças que fazia um passeio ecológico de barco viu o gesto carinhoso de Tainá e comemorou com aplausos.", prompt: "Children wearing sun hats on a wooden boat waving happily at jaguar on riverbank, 2D storybook illustration" },
      { text: "As crianças recolheram todo o lixo do rio e prometeram ser guardiãs da natureza e da fauna pantaneira.", prompt: "Children placing recycled bottles into bags on boat with sunny blue sky, 2D storybook illustration" },
      { text: "Tainá soltou um miado suave e voltou para a sombra das vitórias-régias, lembrando que cuidar dos animais é proteger a obra da criação.", prompt: "Cute jaguar lying contentedly among huge green water lily pads at golden sunset, 2D storybook illustration" }
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

  console.log(`\n[Wipe & Reseed] 🚀 Cadastrando ${MASTER_CLASSIC_STORIES.length} histórias clássicas pré-configuradas (narrativas profundas)...`);

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
    createdCount++;
    console.log(`[Wipe & Reseed] ✅ (${createdCount}/${MASTER_CLASSIC_STORIES.length}) História criada: "${rawStory.title}" (ID: ${docRef.id}, Páginas: ${formattedParagraphs.length})`);
  }

  console.log(`\n🎉 [Wipe & Reseed] CONCLUÍDO COM SUCESSO! Todas as ${createdCount} histórias clássicas estão cadastradas com narrativas ricas e profundas.`);
}

wipeAndReseed().then(() => process.exit(0)).catch(err => {
  console.error('[Wipe & Reseed] Erro:', err);
  process.exit(1);
});
