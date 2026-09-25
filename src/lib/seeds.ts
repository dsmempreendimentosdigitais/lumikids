export interface SeedStory {
  id?: string;
  title: string;
  category: string;
  ageGroups: string[];
  coverEmoji: string;
  value: string;
  description: string;
  isPlaceholder?: boolean;
}

export const SEED_STORIES: SeedStory[] = [
  // 🏛️ Mitologia Grega
  {
    title: 'Os 12 Trabalhos de Hércules e a Força da Virtude',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏛️',
    value: 'perseverança e superação',
    description: 'Acompanhe Hércules em desafios épicos aprendendo que a verdadeira força está no autocontrole e no serviço ao próximo.',
    isPlaceholder: true
  },
  {
    title: 'Perseu, a Coragem e o Escudo Reluzente',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🛡️',
    value: 'coragem e sabedoria',
    description: 'Descubra como a inteligência e a prudência ajudaram o jovem Perseu a vencer o medo e cumprir sua nobre missão.',
    isPlaceholder: true
  },
  {
    title: 'A Odisseia de Ulisses: O Retorno para Casa',
    category: 'mitologia-grega',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '⛵',
    value: 'fidelidade e paciência',
    description: 'Uma grande viagem marinha repleta de perigos onde a inteligência e o amor pela família superam todas as tempestades.',
    isPlaceholder: true
  },

  // 📖 Histórias da Bíblia
  {
    title: 'Davi e o Gigante Golias: A Fé Vence o Medo',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '👑',
    value: 'fé e bravura',
    description: 'Um jovem pastor com um coração puro e muita confiança em Deus enfrenta um desafio colossal que assustava a todos.',
    isPlaceholder: true
  },
  {
    title: 'A Arca de Noé e o Arco-Íris da Esperança',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🕊️',
    value: 'obediência e esperança',
    description: 'Uma aventura cheia de animais de todos os tipos a bordo de uma grande arca de madeira em busca de um novo recomeço.',
    isPlaceholder: true
  },
  {
    title: 'Daniel na Cova dos Leões: Fidelidade Inabalável',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🦁',
    value: 'fidelidade e integridade',
    description: 'Mesmo cercado por desafios e leões famintos, a fé sincera e a postura firme mantêm Daniel seguro e protegido.',
    isPlaceholder: true
  },
  {
    title: 'O Nascimento de Jesus: A Estrela da Estábulo',
    category: 'biblia-kids',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '⭐',
    value: 'humildade e amor',
    description: 'A linda história do nascimento do Salvador em Belém sob o brilho da estrela mais radiante dos céus.',
    isPlaceholder: true
  },
  {
    title: 'O Filho Pródigo e o Abraço do Pai',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '❤️',
    value: 'perdão e acolhimento',
    description: 'Uma parábola emocionante sobre o valor do arrependimento e o amor infinito que sempre nos acolhe de volta.',
    isPlaceholder: true
  },

  // 👑 Mulheres Fortes
  {
    title: "Joana d'Arc: A Jovem do Olhar de Fogo",
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '⚔️',
    value: 'coragem e convicção',
    description: 'Uma menina camponesa de fé inabalável que atendeu a um chamado nobre e liderou com honra e bravura.',
    isPlaceholder: true
  },
  {
    title: 'Princesa Isabel: O Coração que Libertou um Povo',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '📜',
    value: 'justiça e compaixão',
    description: 'A história da governante brasileira que agiu com determinação para garantir a liberdade de milhares de pessoas.',
    isPlaceholder: true
  },
  {
    title: 'Santa Terezinha e o Pequeno Caminho do Amor',
    category: 'mulheres-fortes',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🌹',
    value: 'humildade e gentileza',
    description: 'Aprenda como pequenas ações diárias feitas com grande amor transformam o mundo ao nosso redor.',
    isPlaceholder: true
  },
  {
    title: 'Florence Nightingale: A Anja da Lâmpada',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🕯️',
    value: 'cuidado e dedicação',
    description: 'A jovem que revolucionou a medicina e o cuidado com os doentes com sua compaixão e determinação.',
    isPlaceholder: true
  },

  // 🏰 Biografias Inspiradoras
  {
    title: 'São Luís IX: O Rei Justo e Caridoso',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🏰',
    value: 'honra e integridade',
    description: 'A vida do rei que servia os necessitados com as próprias mãos e governou com verdade e honra.',
    isPlaceholder: true
  },
  {
    title: 'Santos Dumont: O Garoto que Sonhou Voar',
    category: 'biografias-historicas',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '✈️',
    value: 'criatividade e inventividade',
    description: 'O brasileiro genial que olhou para os pássaros, estudou a ciência e presenteou o mundo com os aviões.',
    isPlaceholder: true
  },
  {
    title: 'Albert Einstein: As Perguntas que Mudarão o Mundo',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🌌',
    value: 'curiosidade e imaginação',
    description: 'Descubra como um garotinho curioso que gostava de bússolas se tornou um dos maiores cientistas da história.',
    isPlaceholder: true
  },

  // 🛡️ Contos de Heróis e Fábulas
  {
    title: 'O Leão e o Rato: Fábulas de Esopo',
    category: 'contos-de-herois',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🐭',
    value: 'gratidão e respeito',
    description: 'Nenhum ato de gentileza é pequeno demais. Aprenda como um pequenino rato salvou o rei da floresta.',
    isPlaceholder: true
  },
  {
    title: 'São Jorge e o Dragão da Ilha Nebulosa',
    category: 'contos-de-herois',
    ageGroups: ['5-7', '8-10'],
    coverEmoji: '🐉',
    value: 'bravura e proteção',
    description: 'Um nobre cavaleiro enfrenta um grande desafio para proteger um reino e resgatar a paz dos vilarejos.',
    isPlaceholder: true
  },

  // ✨ Virtudes em Ação
  {
    title: 'O Garoto que Escolheu Falar a Verdade',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '💎',
    value: 'honestidade e integridade',
    description: 'Uma história tocante sobre como a verdade gera confiança verdadeira e fortalece nossa amizade com todos.',
    isPlaceholder: true
  },
  {
    title: 'Arrumando o Quarto: A Super Missão de Autonomia',
    category: 'virtudes-em-acao',
    ageGroups: ['2-4', '5-7'],
    coverEmoji: '🧹',
    value: 'autonomia e responsabilidade',
    description: 'Aprender a organizar as próprias coisas é um superpoder que torna nossa casa um lugar mais alegre e harmonioso.',
    isPlaceholder: true
  },

  // 🌿 Natureza & Animais
  {
    title: 'A Onça-Pintada do Pantanal e o Vale Verde',
    category: 'natureza-animais',
    ageGroups: ['2-4', '5-7', '8-10'],
    coverEmoji: '🐆',
    value: 'respeito à criação',
    description: 'Uma jornada pelo coração do Brasil descobrindo a beleza das nossas florestas, rios e animais selvagens.',
    isPlaceholder: true
  }
];
