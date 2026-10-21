export interface SeedStoryFull {
  title: string;
  category: string;
  ageGroups: ('2-4' | '5-7' | '8-10' | '11-14')[];
  coverEmoji: string;
  coverColor: string;
  value: string;
  missionTitle: string;
  missionDesc: string;
  reflectionQuestion: string;
  paragraphs: { text: string; imagePrompt: string }[];
}

export const KNOWLEDGE_STORIES_55: SeedStoryFull[] = [
  // ==========================================
  // 1. MITOLOGIA GREGA (15 Histórias)
  // ==========================================
  {
    title: 'Os 12 Trabalhos de Hércules e a Força da Virtude',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏛️',
    coverColor: '#D97706',
    value: 'perseverança e autocontrole',
    missionTitle: 'Missão do Autocontrole',
    missionDesc: 'Hoje, antes de se irritar com um desafio, respire fundo três vezes e vença com paciência assim como Hércules!',
    reflectionQuestion: 'O que é mais difícil: vencer um grande monstro ou controlar o próprio temperamento?',
    paragraphs: [
      { text: 'Há muito tempo, na antiga Grécia, vivia Hércules, um jovem famoso por sua força extraordinária. Mas Hércules aprendeu que a verdadeira força não está apenas nos músculos, mas no coração e na virtude.', imagePrompt: 'Young Hercules standing heroically on a sunny hill in ancient Greece, wearing a simple tunic, bright warm sunlight, ancient Greek temples in background, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Para provar sua nobreza e ajudar o povo grego, Hércules recebeu do rei a missão de cumprir doze grandes desafios. O primeiro deles foi enfrentar o feroz Leão de Nemeia.', imagePrompt: 'Hercules facing the giant Nemean Lion in a golden wheat field, brave expression, bright daylight, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Em vez de usar a violência sem pensar, Hércules usou sua inteligência e coragem, conseguindo proteger os vilarejos de forma justa e destemida.', imagePrompt: 'Hercules smiling gently as villagers cheer happily around him, ancient Greek village, bright sunny day, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Em seguida, viajou até o pântano de Lerna para resolver o mistério da Hidra. A cada obstáculo que surgia, Hércules mantinha a calma e a disciplina.', imagePrompt: 'Hercules walking through a misty green valley with a glowing golden torch, determined face, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Ele também capturou a lendária Cerva de Cerineia sem machucá-la, mostrando grande respeito à natureza e a todos os seres vivos.', imagePrompt: 'Hercules gently approaching a majestic golden-horned deer in a sunlit forest, peaceful atmosphere, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Ao limpar os imensos estábulos do rei Augusto em apenas um dia, desviando o curso de dois rios límpidos, Hércules provou que o trabalho duro e a criatividade superam qualquer preguiça.', imagePrompt: 'Hercules redirecting a crystal clear river stream with massive stones, water splashing in sunlight, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Em cada uma das doze tarefas, Hércules tornou-se mais sábio, mais paciente e mais generoso com todos ao seu redor.', imagePrompt: 'Hercules helping elderly villagers carry heavy baskets, warm smiling face, golden sunset lighting, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' },
      { text: 'Ele compreendeu que ser um herói de verdade significa usar seus talentos para proteger os fracos, praticar o bem e nunca desistir diante das dificuldades.', imagePrompt: 'Hercules standing on a high mountain peak looking at a peaceful Greek city, triumph and gratitude, 3D Pixar Paw Patrol CGI animation style, Octane Render, no text' }
    ]
  },
  {
    title: 'Perseu e a Medusa: A Coragem e o Escudo de Atena',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🛡️',
    coverColor: '#2563EB',
    value: 'coragem e sabedoria',
    missionTitle: 'Escudo do Respeito',
    missionDesc: 'Pense antes de agir hoje! Use a sabedoria para responder com educação a qualquer momento difícil.',
    reflectionQuestion: 'Como a sabedoria nos ajuda a vencer o medo quando encontramos algo assustador?',
    paragraphs: [
      { text: 'O jovem Perseu recebeu uma missão muito difícil, mas não estava sozinho. A deusa Atena lhe presenteou com um escudo de bronze tão brilhante quanto um espelho.', imagePrompt: 'Young Perseus receiving a polished bronze shield from a wise goddess in ancient Greece, sunny courtyard, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Com prudência e inteligência, Perseu olhou apenas para o reflexo no escudo, vencendo o perigo sem se deixar paralisar pelo medo.', imagePrompt: 'Perseus holding up his shiny shield reflection calmly, ancient stone ruins, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Ao retornar vitorioso, Perseu usou sua dádiva para proteger sua amada mãe e trazer a paz de volta ao reino.', imagePrompt: 'Perseus hugging his mother happily in a sunlit Greek palace garden, joyful emotional scene, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Teseu e o Minotauro: O Fio da Sabedoria',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🧶',
    coverColor: '#7C3AED',
    value: 'inteligência e união',
    missionTitle: 'Missão do Fio de Ariadne',
    missionDesc: 'Ajude alguém da sua família a encontrar algo perdido hoje com atenção e carinho!',
    reflectionQuestion: 'Por que planejar bem os nossos passos nos impede de ficar perdidos nos problemas?',
    paragraphs: [
      { text: 'Teseu viajou até a ilha de Creta para salvar seu povo do misterioso Labirinto. Ariadne lhe deu um simples novelo de fio mágico.', imagePrompt: 'Theseus holding a golden ball of yarn in an ancient Greek port, ships in background, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Desenrolando o fio a cada passo dentro das paredes de pedra, Teseu conseguiu guiar todos em segurança de volta à luz do sol.', imagePrompt: 'Theseus leading young friends out of a stone archway into bright daylight, smiling faces, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'A Odisseia de Ulisses: O Caminho de Volta',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '⛵',
    coverColor: '#0284C7',
    value: 'fidelidade e paciência',
    missionTitle: 'Navegador da Paciência',
    missionDesc: 'Realize uma tarefa longa hoje sem reclamar do tempo!',
    reflectionQuestion: 'Qual é a importância da família como o nosso porto seguro?',
    paragraphs: [
      { text: 'Ulisses navegou por mares misteriosos por muitos anos, enfrentando tempestades e sereias com astúcia e coragem.', imagePrompt: 'Ulysses standing on the deck of an ancient wooden sailboat in azure sea, brave expression, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Sua maior motivação era rever sua esposa Penélope e seu filho Telêmaco, provando que o amor à família vence qualquer distância.', imagePrompt: 'Ulysses embracing his wife and son warmly in a Greek stone home, emotional homecoming, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Ícaro e Dédalo: As Asas de Cera e a Prudência',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🪶',
    coverColor: '#EA580C',
    value: 'prudência e obediência',
    missionTitle: 'Escutar com Atenção',
    missionDesc: 'Ouça atentamente os conselhos dos seus pais hoje antes de tomar qualquer decisão!',
    reflectionQuestion: 'Por que os avisos dos mais velhos servem para nos proteger de cair?',
    paragraphs: [
      { text: 'Dédalo construiu asas de penas e cera para ele e seu filho Ícaro voarem livremente pelos céus.', imagePrompt: 'Daedalus putting feather wings on young Icarus, sunny cliffside, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Dédalo avisou: "Não voe perto demais do sol!". A história nos ensina o grande valor de ouvir a experiência dos pais.', imagePrompt: 'Father and son flying gracefully over blue sea, golden sunlight, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Jasão e os Argonautas: O Trabalho em Equipe',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🚢',
    coverColor: '#059669',
    value: 'trabalho em equipe',
    missionTitle: 'União da Equipe',
    missionDesc: 'Convide um amigo ou irmão para realizar uma tarefa juntos com alegria!',
    reflectionQuestion: 'Como a cooperação nos permite realizar coisas que seriam impossíveis sozinhos?',
    paragraphs: [
      { text: 'Jasão reuniu os maiores heróis da Grécia a bordo da nave Argo em busca do lendário Velo de Ouro.', imagePrompt: 'Jason and a diverse crew of heroes rowing a majestic ship together, sunny ocean, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Combinando os talentos únicos de cada companheiro, os Argonautas superaram perigos incríveis com amizade e união.', imagePrompt: 'Argonauts cheering together holding hands in victory, warm daylight, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Belerofonte e Pégaso: O Cavalo Alado',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🦄',
    coverColor: '#9333EA',
    value: 'humildade e respeito',
    missionTitle: 'Cuidado com os Animais',
    missionDesc: 'Trate seu bichinho de estimação ou plantas com extremo carinho hoje!',
    reflectionQuestion: 'Por que a vaidade pode arruinar grandes conquistas se não mantivermos a humildade?',
    paragraphs: [
      { text: 'Com uma rédea de ouro dada por Atena, Belerofonte conquistou a amizade do magnífico cavalo alado Pégaso.', imagePrompt: 'Bellerophon petting a beautiful white winged Pegasus on a grassy hill, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Juntos voaram pelos céus protegendo reinos, demonstrando que o respeito mútuo cria laços inquebráveis.', imagePrompt: 'Hero riding winged horse high in blue sky above clouds, golden sunlight, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 2. HISTÓRIAS DA BÍBLIA (10 Histórias)
  // ==========================================
  {
    title: 'Davi e o Gigante Golias: A Fé Vence o Medo',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '👑',
    coverColor: '#16A34A',
    value: 'fé e confiança em Deus',
    missionTitle: 'Guerreiro da Coragem',
    missionDesc: 'Escreva ou diga em voz alta três motivos pelos quais você confia em Deus para vencer seus medos!',
    reflectionQuestion: 'Como a fé nos torna fortes mesmo quando nos sentimos pequenininhos diante dos problemas?',
    paragraphs: [
      { text: 'Davi era um jovem pastor que cuidava das ovelhas com muito amor, tocando sua harpa nos verdes prados de Israel.', imagePrompt: 'Young boy David playing a wooden harp among fluffy white sheep in green hills, warm sunlight, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Quando um enorme gigante desafiou o exército, Davi não teve medo. Ele sabia que o Senhor estava com ele.', imagePrompt: 'Little David holding a sling walking bravely toward a distant giant shadow, determined smile, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Com apenas uma pedrinha e uma fé gigante, Davi trouxe a paz de volta ao seu povo, provando que a confiança em Deus vence tudo.', imagePrompt: 'David standing triumphantly in sunbeams, villagers celebrating happily around him, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'A Arca de Noé e o Arco-Íris da Aliança',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🌈',
    coverColor: '#0891B2',
    value: 'obediência e esperança',
    missionTitle: 'Pintura da Esperança',
    missionDesc: 'Desenhe um arco-íris bem colorido e dê de presente para alguém que você ama!',
    reflectionQuestion: 'O que a promessa do arco-íris nos ensina sobre a fidelidade de Deus?',
    paragraphs: [
      { text: 'Noé seguiu fielmente as instruções de Deus e construiu uma arca enorme de madeira firme.', imagePrompt: 'Noah building a big wooden ark with happy animals walking up the ramp in pairs, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Após dias navegando pelas águas do dilúvio, uma pomba trouxe um ramo de oliveira, anunciando terra firme.', imagePrompt: 'White dove flying with green olive branch toward Noah on ark deck, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Um lindo arco-íris brilhou no céu como símbolo de amor e esperança eterna entre Deus e toda a Terra.', imagePrompt: 'Vibrant rainbow over green hills with animals grazing happily, bright sunny sky, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Daniel na Cova dos Leões',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🦁',
    coverColor: '#D97706',
    value: 'fidelidade e oração',
    missionTitle: 'Momento da Oração',
    missionDesc: 'Separe 3 minutos hoje antes de dormir para fazer uma oração sincera de agradecimento!',
    reflectionQuestion: 'Por que a oração diária fortalece nosso coração para nos manter firmes na verdade?',
    paragraphs: [
      { text: 'Daniel orava a Deus três vezes ao dia junto à janela aberta, mantendo seu coração sempre limpo e fiel.', imagePrompt: 'Young man praying peacefully near open arched stone window, golden sun rays, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Mesmo colocado em uma caverna com leões, um anjo de luz foi enviado para proteger Daniel de todo mal.', imagePrompt: 'Daniel sitting calmly surrounded by sleeping friendly lions, glowing angel light, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Moisés e o Mar Vermelho',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌊',
    coverColor: '#2563EB',
    value: 'liderança e confiança',
    missionTitle: 'Guia do Bem',
    missionDesc: 'Seja um bom exemplo para seus amigos ou irmãos ajudando-os em uma tarefa hoje!',
    reflectionQuestion: 'Como Deus abre caminhos impossíveis quando confiamos em Seus passos?',
    paragraphs: [
      { text: 'Moisés estendeu seu cajado sobre o Mar Vermelho, e as águas se dividiram criando um caminho seco no meio do oceano.', imagePrompt: 'Moses holding wooden staff with sea waters parting into giant blue walls, dry path in middle, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Todo o povo atravessou em segurança cantando louvores e comemorando a grande libertação.', imagePrompt: 'Families walking happily together through parted sea, sunny daylight, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'O Nascimento de Jesus em Belém',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '⭐',
    coverColor: '#EAB308',
    value: 'humildade e amor',
    missionTitle: 'Gesto de Amor',
    missionDesc: 'Faça um cartão de carinho para um familiar ou amigo dizendo o quanto ele é especial!',
    reflectionQuestion: 'Por que o amor verdadeiro prefere a simplicidade e a humildade ao invés da ostentação?',
    paragraphs: [
      { text: 'Na cidade de Belém, sob uma estrela brilhante no céu noturno, nasceu o Menino Jesus em uma manjedoura simples.', imagePrompt: 'Cute baby Jesus in wooden manger with Mary and Joseph smiling, bright star shining above stable, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Pastores e reis trouxeram presentes e louvaram a chegada do Rei da Paz que ensinaria o verdadeiro amor ao mundo.', imagePrompt: 'Shepherds and animals gathered peacefully around stable, glowing warm starlight, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 3. MULHERES FORTES (8 Histórias)
  // ==========================================
  {
    title: "Joana d'Arc: A Jovem do Olhar de Fogo",
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '⚔️',
    coverColor: '#DC2626',
    value: 'coragem e fé firme',
    missionTitle: 'Chama da Coragem',
    missionDesc: 'Defenda a verdade hoje mesmo que seus colegas pensem diferente de você!',
    reflectionQuestion: 'Como a convicção nos nossos valores nos dá força para liderar com retidão?',
    paragraphs: [
      { text: 'Joana era uma jovem simples do campo que tinha um coração cheio de fé e amor por seu povo.', imagePrompt: 'Young Joan of Arc standing in a green flower field holding a white banner, sunny sky, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Com bravura impressionante, ela vestiu sua armadura prateada e guiou as pessoas a defenderem a justiça e a paz.', imagePrompt: 'Joan in shiny silver armor riding a white horse holding banner high, inspiring crowd, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Princesa Isabel: O Coração Libertador',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '📜',
    coverColor: '#4F46E5',
    value: 'justiça e empatia',
    missionTitle: 'Ato de Justiça',
    missionDesc: 'Inclua um amigo que está sozinho em uma brincadeira hoje!',
    reflectionQuestion: 'Por que o verdadeiro líder usa seu poder para libertar e ajudar os outros?',
    paragraphs: [
      { text: 'A Princesa Isabel assinou a Lei Áurea com uma pena dourada, garantindo a liberdade e a dignidade a todos.', imagePrompt: 'Princess Isabel signing an official scroll with a gold feather pen in palace hall, warm golden lights, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'As ruas se encheram de flores e comemorações pela vitória da fraternidade no Brasil.', imagePrompt: 'Crowds of happy diverse people throwing colorful flowers in sunny street, celebration, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Santa Terezinha e o Pequeno Caminho',
    category: 'mulheres-fortes',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🌹',
    coverColor: '#F43F5E',
    value: 'gentileza nas pequenas coisas',
    missionTitle: 'Pequenos Gestos',
    missionDesc: 'Faça 3 pequenas gentilezas hoje sem esperar nada em troca!',
    reflectionQuestion: 'Como pequenas atitudes feitas com grande amor transformam o dia das pessoas?',
    paragraphs: [
      { text: 'Terezinha descobriu que não precisamos fazer coisas gigantescas para ser heróis; basta fazer as pequenas coisas com um amor imenso.', imagePrompt: 'Young girl Terezinha dropping pink rose petals in a sunlit garden, peaceful smile, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Um sorriso amoroso, uma palavra generosa e a ajuda em casa espalham pétalas de alegria por onde passamos.', imagePrompt: 'Terezinha helping clean dishes with a cheerful expression, warm kitchen lighting, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 4. BIOGRAFIAS INSPIRADORAS (8 Histórias)
  // ==========================================
  {
    title: 'São Luís IX: O Rei que Servia o Povo',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏰',
    coverColor: '#D97706',
    value: 'humildade e caridade',
    missionTitle: 'Mão Amiga',
    missionDesc: 'Ofereça ajuda para carregar algo pesado para seus pais hoje!',
    reflectionQuestion: 'O que significa servir aos outros de coração aberto?',
    paragraphs: [
      { text: 'O rei Luís IX usava sua coroa com humildade. Todos os dias ele convidava pessoas necessitadas para comer em sua própria mesa.', imagePrompt: 'King Louis IX wearing royal cloak serving bread to poor people at long wooden table, palace dining hall, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Ele ensinou que a honra de um governante se mede pelo bem e pela justiça que ele faz aos humildes.', imagePrompt: 'King Louis smiling warmly hugging a young boy, sunbeams in throne room, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Santos Dumont: O Sonho de Voar',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '✈️',
    coverColor: '#0284C7',
    value: 'criatividade e perseverança',
    missionTitle: 'Inventor por um Dia',
    missionDesc: 'Crie um aviãozinho de papel e tente fazê-lo voar o mais longe possível!',
    reflectionQuestion: 'Como a curiosidade e o trabalho contínuo transformam sonhos em invenções reais?',
    paragraphs: [
      { text: 'Quando garoto, Alberto Santos Dumont olhava para os passarinhos nas fazendas do Brasil e desenhava máquinas voadoras.', imagePrompt: 'Young Santos Dumont sitting under a tree drawing airships in a notebook, blue sky, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Com o 14-Bis em Paris, Dumont decolou diante de todos, provando que o ser humano pode dominar os céus.', imagePrompt: '14-Bis biplane flying gracefully over Eiffel Tower in sunny Paris, crowds waving hats below, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Albert Einstein e as Perguntas do Universo',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🌌',
    coverColor: '#7C3AED',
    value: 'curiosidade e imaginação',
    missionTitle: 'Pergunta Curiosa',
    missionDesc: 'Faça uma pergunta sobre a natureza aos seus pais hoje e pesquisem a resposta juntos!',
    reflectionQuestion: 'Por que continuar fazendo perguntas é o segredo para nunca parar de aprender?',
    paragraphs: [
      { text: 'Ao ganhar uma simples bússola de seu pai, o pequeno Albert ficou fascinado com a agulha que sempre apontava para o norte.', imagePrompt: 'Young Albert Einstein holding a golden pocket compass with wide curious eyes, warm study room, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Ele aprendeu que a imaginação é mais importante que o mero conhecimento para desvendar os mistérios da ciência.', imagePrompt: 'Einstein smiling in front of a chalkboard with stars and glowing light formulas, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 5. CONTOS DE HERÓIS E FÁBULAS (6 Histórias)
  // ==========================================
  {
    title: 'O Leão e o Rato (Fábulas de Esopo)',
    category: 'contos-de-herois',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🐭',
    coverColor: '#EA580C',
    value: 'gratidão e respeito mútuo',
    missionTitle: 'Amigo Protetor',
    missionDesc: 'Trate com carinho alguém menor ou mais jovem que você hoje!',
    reflectionQuestion: 'Por que devemos respeitar a todos, independente do tamanho?',
    paragraphs: [
      { text: 'Um grande leão poupou a vida de um pequenino rato que prometeu ajudá-lo um dia.', imagePrompt: 'Big gentle lion smiling down at a tiny brave mouse on his paw, sunny jungle, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Quando o leão ficou preso na rede dos caçadores, o ratinho roeu as cordas com rapidez libertando o amigo.', imagePrompt: 'Tiny mouse chewing rope netting to free happy lion, bright forest background, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'São Jorge e a Bravura no Vale',
    category: 'contos-de-herois',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🐉',
    coverColor: '#B91C1C',
    value: 'proteção aos fracos',
    missionTitle: 'Escudo do Amigo',
    missionDesc: 'Defenda um colega se ele estiver sendo tratado de forma injusta!',
    reflectionQuestion: 'Como o amor pela justiça nos dá coragem para agir pelos outros?',
    paragraphs: [
      { text: 'O nobre cavaleiro Jorge cavalgava por terras distantes protegendo vilarejos com sua lança e escudo de prata.', imagePrompt: 'Knight St George on a white horse with red cross shield under bright sunny sky, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Ele superou os medos do povo trazendo esperança e provando que o bem sempre prevalece.', imagePrompt: 'Villagers surrounding St George celebrating joyfully in sunny town square, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 6. VIRTUDES EM AÇÃO (4 Histórias)
  // ==========================================
  {
    title: 'O Garoto que Escolheu Falar a Verdade',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '💎',
    coverColor: '#2563EB',
    value: 'honestidade e integridade',
    missionTitle: 'Falar a Verdade',
    missionDesc: 'Diga sempre a verdade hoje, mesmo que tenha cometido um pequeno erro!',
    reflectionQuestion: 'Por que a verdade limpa a nossa consciência e fortalece a amizade?',
    paragraphs: [
      { text: 'Ao quebrar o vaso favorito de sua mãe sem querer, o pequeno Lucas sentiu o coração apertar, mas decidiu dizer a verdade.', imagePrompt: 'Young boy looking at broken flower vase on floor with honest emotional expression, warm living room, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Sua mãe o abraçou com carinho valorizando sua coragem de ser honesto e sincero.', imagePrompt: 'Mother hugging young boy lovingly in warm sunlit room, smiling faces, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'Arrumando o Quarto: A Super Missão',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🧹',
    coverColor: '#16A34A',
    value: 'autonomia e organização',
    missionTitle: 'Super Quarto Limpo',
    missionDesc: 'Guardes seus brinquedos e organize sua cama hoje sem os pais precisarem pedir!',
    reflectionQuestion: 'Como cuidar do nosso espaço pessoal nos torna pessoas mais autônomas?',
    paragraphs: [
      { text: 'Sofia descobriu que transformar a arrumação do quarto em uma missão de super-herói deixava tudo divertido.', imagePrompt: 'Little girl putting colorful toy blocks happily into a storage box, neat bright bedroom, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Com tudo organizado em minutos, ela sentiu o orgulho de ter autonomia e responsabilidade.', imagePrompt: 'Little girl giving thumbs up standing in clean beautiful bedroom, sunbeams, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },

  // ==========================================
  // 7. NATUREZA E ANIMAIS (4 Histórias)
  // ==========================================
  {
    title: 'A Onça-Pintada e o Guardião do Pantanal',
    category: 'natureza-animais',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐆',
    coverColor: '#D97706',
    value: 'respeito à criação',
    missionTitle: 'Guardião das Plantas',
    missionDesc: 'Regue as plantas da sua casa com carinho hoje!',
    reflectionQuestion: 'Por que cuidar da natureza e dos animais é dever de todos nós?',
    paragraphs: [
      { text: 'No coração do Pantanal brasileiro, a graciosa onça Tainá caminhava pelas margens límpidas do rio.', imagePrompt: 'Cute spotted jaguar walking on riverbank in lush Pantanal wetland, clear water, sunny sky, 3D Pixar Paw Patrol CGI animation style, no text' },
      { text: 'Aprender sobre a fauna e as florestas nos ensina a respeitar e proteger a criação divina.', imagePrompt: 'Colorful macaws flying over lush green forest with jaguar resting peacefully under tree, 3D Pixar Paw Patrol CGI animation style, no text' }
    ]
  },
  {
    title: 'O Mico-Leão-Dourado e a Fruta Compartilhada',
    category: 'natureza-animais',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🐵',
    coverColor: '#F59E0B',
    value: 'generosidade e partilha',
    missionTitle: 'Missão da Partilha',
    missionDesc: 'Divida um lanche saboroso ou um brinquedo com um amigo hoje!',
    reflectionQuestion: 'Como a partilha na floresta garante que todos os animais fiquem alimentados e felizes?',
    paragraphs: [
      { text: 'No alto da Mata Atlântica, o pequeno mico-leão-dourado Joca encontrou a maior manga dourada da árvore.', imagePrompt: 'Cute golden lion tamarin monkey sitting on a green mossy tree branch holding a ripe yellow mango, warm sunlight, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Em vez de comer tudo sozinho, Joca chamou seus irmãozinhos e dividiu pedaço por pedaço com alegria.', imagePrompt: 'Three cute golden tamarin monkeys eating fruit slices together happily, lush jungle canopy, blue sky, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Ele descobriu que a comida fica muito mais gostosa quando é compartilhada com quem amamos.', imagePrompt: 'Happy monkey swinging on a vine smiling with full belly, colorful flowers and butterflies, Bible App for Kids 2D vector art style, no text' }
    ]
  },
  {
    title: 'A Tartaruga Marinha e a Praia Limpa',
    category: 'natureza-animais',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐢',
    coverColor: '#0D9488',
    value: 'cuidado com o meio ambiente',
    missionTitle: 'Guardião dos Oceanos',
    missionDesc: 'Recolha três papéis do chão e jogue na lixeira certa hoje!',
    reflectionQuestion: 'Por que não devemos jogar plástico na rua ou na praia?',
    paragraphs: [
      { text: 'A pequena tartaruguinha Tata nasceu nas areias mornas da Bahia e correu para encontrar as ondas azuis.', imagePrompt: 'Cute baby sea turtle crawling on golden sand toward sparkling turquoise ocean waves, sunny beach, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Com a ajuda de crianças atentas que limparam a praia, o caminho ficou seguro e limpo para todos os animais.', imagePrompt: 'Children picking up plastic bottles into recycling bags smiling on sunny beach, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Tata nadou livre pelos corais coloridos, agradecendo aos pequenos guardiões da Terra.', imagePrompt: 'Cute sea turtle swimming among colorful coral reef and friendly yellow fish, crystal clear ocean, Bible App for Kids 2D vector art style, no text' }
    ]
  },

  // ==========================================
  // 8. HISTÓRIAS BÍBLICAS ADICIONAIS (Novas)
  // ==========================================
  {
    title: 'Jonas e o Grande Peixe: O Perdão e a Obediência',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐋',
    coverColor: '#0284C7',
    value: 'obediência e perdão',
    missionTitle: 'Pedir Desculpas',
    missionDesc: 'Se você errou com alguém hoje, tenha a coragem de pedir um abraço e desculpas sinceras!',
    reflectionQuestion: 'Por que fugir das nossas responsabilidades nunca resolve os problemas?',
    paragraphs: [
      { text: 'Jonas tentou fugir de navio para não cumprir a missão que Deus havia lhe dado de ajudar a cidade de Nínive.', imagePrompt: 'Jonah boarding an ancient wooden sailing ship in a sunny port, thinking he can hide, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'No meio de uma tempestade no mar, um enorme e amigável peixe acolheu Jonas em sua barriga por três dias.', imagePrompt: 'Giant gentle blue whale swimming peacefully under rolling sea waves, Jonah praying inside warmly, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Jonas orou com sinceridade, foi deixado na praia com segurança e levou a mensagem de paz e perdão a todos.', imagePrompt: 'Jonah standing on sunny sandy beach speaking kindly to welcoming villagers, bright daylight, Bible App for Kids 2D vector art style, no text' }
    ]
  },
  {
    title: 'A Parábola do Bom Samaritano',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '❤️',
    coverColor: '#E11D48',
    value: 'compaixão e amor ao próximo',
    missionTitle: 'Bom Samaritano do Dia',
    missionDesc: 'Ajude alguém hoje que não é do seu grupinho mais próximo!',
    reflectionQuestion: 'Quem é o nosso próximo? Como podemos demonstrar amor na prática?',
    paragraphs: [
      { text: 'Um viajante machucado estava caído na beira do caminho de pedras entre Jerusalém e Jericó.', imagePrompt: 'A weary traveler resting beside a dusty road with rolling green hills, warm afternoon, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Um homem bom parou seu burrinho, cuidou das feridas do viajante com azeite e o levou a uma hospedaria acolhedora.', imagePrompt: 'A kind Samaritan tending gently to the traveler with bandages, friendly donkey waiting patiently, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Jesus nos ensinou que amar ao próximo significa ter compaixão e agir com generosidade com todas as pessoas.', imagePrompt: 'The traveler resting peacefully in a cozy room while the Samaritan waves goodbye, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  },
  {
    title: 'José do Egito e a Túnica de Muitas Cores',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🧥',
    coverColor: '#8B5CF6',
    value: 'perdão e reconciliação em família',
    missionTitle: 'Abraço de Reconciliação',
    missionDesc: 'Dê um abraço bem apertado em um irmão ou primo com quem você já brigou!',
    reflectionQuestion: 'Por que o perdão em família é a chave para a verdadeira paz?',
    paragraphs: [
      { text: 'O jovem José ganhou de seu pai Jacó uma linda túnica com todas as cores do arco-íris.', imagePrompt: 'Young Joseph wearing a bright colorful striped tunic smiling happily under sunny sky, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Depois de muitos anos e grandes desafios, José tornou-se um líder sábio e generoso no Egito.', imagePrompt: 'Joseph as a wise governor in Egyptian palace standing near grain storehouses, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Quando seus irmãos precisaram de comida, José não guardou rancor: abraçou a todos e dividiu os celeiros com amor.', imagePrompt: 'Joseph embracing his brothers tearfully and joyfully in grand hall, warm golden light, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  },

  // ==========================================
  // 9. INVENTORES E CIÊNCIA ADICIONAIS (Novas)
  // ==========================================
  {
    title: 'Marie Curie e o Brilho dos Elementos',
    category: 'inventores-genios',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🔬',
    coverColor: '#059669',
    value: 'dedicação e amor ao estudo',
    missionTitle: 'Cientista Curioso',
    missionDesc: 'Leia uma página de um livro informativo ou enciclopédia hoje!',
    reflectionQuestion: 'Como a perseverança nos estudos ajuda a curar doenças e melhorar a humanidade?',
    paragraphs: [
      { text: 'Desde menina na Polônia, Marie Curie adorava ler livros de ciências sob a luz suave do abajur.', imagePrompt: 'Young girl Marie reading a science book at a wooden desk with a vintage lamp, smiling curiously, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Com anos de trabalho paciente no laboratório, ela descobriu elementos brilhantes que ajudaram a medicina a salvar vidas.', imagePrompt: 'Marie Curie in laboratory holding a glowing test tube with gentle blue light, flasks around her, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Ela foi a primeira cientista a ganhar dois Prêmios Nobel, provando que a dedicação não tem limites.', imagePrompt: 'Marie receiving a golden medal with proud respectful smile, warm auditorium, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  },
  {
    title: 'Thomas Edison e a Lâmpada Encantada',
    category: 'inventores-genios',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '💡',
    coverColor: '#F59E0B',
    value: 'nunca desistir após errar',
    missionTitle: 'Tentar de Novo',
    missionDesc: 'Se algo der errado na primeira tentativa hoje, tente uma segunda vez com calma!',
    reflectionQuestion: 'Por que errar faz parte do aprendizado para qualquer grande invenção?',
    paragraphs: [
      { text: 'Thomas Edison tentou mais de mil materiais diferentes para fazer uma lâmpada acender sem queimar rápido.', imagePrompt: 'Young Thomas Edison working in a cozy workshop filled with wires and glass bulbs, determined face, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Ele dizia: "Eu não falhei mil vezes; descobri mil maneiras de como não fazer antes de achar a certa!".', imagePrompt: 'Edison smiling joyfully as a bright warm lightbulb glows brightly illuminating his face, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Sua persistência iluminou as casas, ruas e escolas de todo o planeta.', imagePrompt: 'Cozy city street lit up with glowing street lamps at dusk, happy families walking, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  },

  // ==========================================
  // 10. VIRTUDES EM AÇÃO ADICIONAIS (Novas)
  // ==========================================
  {
    title: 'O Menino que Aprendeu a Esperar (A Paciência)',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '⏳',
    coverColor: '#7C3AED',
    value: 'paciência e calma',
    missionTitle: 'Esperar a Sua Vez',
    missionDesc: 'Espere pacientemente sua vez de falar ou brincar sem interromper ninguém!',
    reflectionQuestion: 'Por que as melhores coisas da vida levam tempo para amadurecer, como as frutas na árvore?',
    paragraphs: [
      { text: 'Mateus plantou uma sementinha de girassol no vaso e queria que ela crescesse em cinco minutos.', imagePrompt: 'Little boy kneeling next to a ceramic plant pot on a sunny balcony, watering can in hand, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Seu avô o ensinou: "A terra precisa de sol, água e tempo. A paciência é como o sol para o nosso coração".', imagePrompt: 'Kind grandfather explaining to grandson with a warm smile, pointing to tiny green sprout, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Semanas depois, um girassol gigante e dourado se abriu, recompensando a paciência de Mateus.', imagePrompt: 'Giant beautiful yellow sunflower blooming happily in sunlight with smiling boy hugging the pot, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  },
  {
    title: 'A Menina da Gratidão (O Pote do Agradecimento)',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🌻',
    coverColor: '#10B981',
    value: 'gratidão diária',
    missionTitle: 'Pote da Gratidão',
    missionDesc: 'Agradeça a seus pais pela comida gostosa e pelo teto quentinho hoje!',
    reflectionQuestion: 'Como agradecer pelas coisas simples nos torna mais felizes todos os dias?',
    paragraphs: [
      { text: 'Clara tinha um potinho transparente onde colocava um papelzinho colorido toda noite com algo bom que viveu.', imagePrompt: 'Little girl writing on a small colorful paper note at her desk with a glass jar filled with notes, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Mesmo nos dias chuvosos, ela encontrava motivos para sorrir: um abraço da vovó, um desenho bonito ou a chuva regando as flores.', imagePrompt: 'Little girl looking out window at rainy garden with warm cocoa mug, happy smiling face, Bible App for Kids 2D vector art style, clean lines, no text' },
      { text: 'Seu potinho ficou tão cheio de papéis que o quarto dela parecia brilhar com pura felicidade.', imagePrompt: 'Glass jar glowing with warm starlight on bedside table, smiling girl sleeping peacefully, Bible App for Kids 2D vector art style, clean lines, no text' }
    ]
  }
];
