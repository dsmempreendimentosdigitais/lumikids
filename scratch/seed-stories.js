const admin = require('firebase-admin');
const fs = require('fs');

// Read .env.local manually
const env = fs.readFileSync('.env.local', 'utf8');
const getEnvVal = (name) => {
  const match = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
  if (!match) return null;
  return match[1].trim().replace(/['"]/g, '').replace(/\\n/g, '\n');
};

const projectId = getEnvVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
const clientEmail = getEnvVal('FIREBASE_CLIENT_EMAIL');
const privateKey = getEnvVal('FIREBASE_PRIVATE_KEY');

if (!projectId || !clientEmail || !privateKey) {
  console.error("Faltam variáveis de ambiente no .env.local!");
  process.exit(1);
}

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    })
  });
}

const db = admin.firestore();

// 6 categorias
const categories = [
  'vida-de-jesus',
  'hora-de-dormir',
  'sentimentos',
  'mulheres-fortes',
  'inventores-genios',
  'classicos-infantis'
];

// 3 faixas etárias
const ageGroups = ['2-4', '5-7', '8-10'];

// Dados base para geração das histórias
const baseData = {
  'vida-de-jesus': {
    emoji: '✝️',
    color: 'linear-gradient(135deg, #E3F2FD, #BBDEFB)', // Azul celeste suave
    subjects: {
      '2-4': [
        "O Bebê Jesus no Berço", "Jesus e os Peixinhos", "Jesus Acalma o Vento", "As Ovelhinhas no Aprisco",
        "A Estrela do Menino Jesus", "O Abraço de Jesus", "Jesus e os Passarinhos", "As Flores de Nazaré",
        "A Casinha de Maria", "Jesus Agradece o Pão", "O Barquinho com Jesus", "O Sorriso de Jesus"
      ],
      '5-7': [
        "A Multiplicação dos Pães", "Jesus Caminha sobre a Água", "A Ovelha que se Perdeu", "O Amigo que Entrou pelo Telhado",
        "A Moeda na Boca do Peixe", "A Casa na Rocha Forte", "A Sementinha de Mostarda", "Os Lírios do Campo Vestidos por Deus",
        "A Pescaria Maravilhosa", "Jesus Cura o Ceguinho", "A Oração dos Discípulos", "A Entrada Festiva em Jerusalém"
      ],
      '8-10': [
        "A Parábola do Filho Pródigo", "O Bom Samaritano no Caminho", "A Pérola de Grande Valor", "A Parábola dos Talentos",
        "As Dez Virgens e as Lâmpadas", "O Trigo e o Joio no Campo", "O Semeador e as Quatro Terras", "Zaqueu o Coletor na Árvore",
        "O Sermão do Monte e as Bem-Aventuranças", "A Cura do Servo do Centurião", "A Caminhada para Emaús", "A Tempestade e a Fé"
      ]
    },
    nouns: ["Jesus", "Mestre", "Salvador", "Bom Pastor", "Amigo", "Discípulo", "Anjo", "Coração"],
    verbs: ["ensina", "ajuda", "cura", "guia", "abençoa", "acalma", "acolhe", "ilumina"],
    values: ["amor", "fé", "generosidade", "perdão", "bondade", "gratidão", "oração", "esperança"]
  },
  'hora-de-dormir': {
    emoji: '💤',
    color: 'linear-gradient(135deg, #E0F2F1, #B2DFDB)', // Verde menta/azul pastel relaxante
    subjects: {
      '2-4': [
        "O Sono do Ursinho Azul", "O Leãozinho que Bocejou", "O Carneirinho Branco", "O Gatinho Dorminhoco",
        "O Elefante que Fechou os Olhos", "O Patinho nas Nuvens", "O Coelhinho das Estrelas", "O Macaquinho Cansado",
        "O Cachorrinho na Cesta", "O Peixinho que Dormia no Aquário", "A Girafinha de Pijama", "O Passarinho no Ninho"
      ],
      '5-7': [
        "A Estrela que Perdeu o Sono", "O Urso e a Canção de Ninar", "O Balão de Algodão-Doce", "A Lua Cheia de Histórias",
        "O Guardião dos Sonhos Lindos", "O Bosque das Luzes Suaves", "O Trem da Meia-Noite", "O Vento que Cantava Baixinho",
        "A Montanha dos Cobertores Fofos", "A Pipa que Dormia no Céu", "O Carrossel do Descanso", "A Nuvem Viajante do Sono"
      ],
      '8-10': [
        "A Viagem ao Vale das Estrelas Cadentes", "O Mistério do Relógio de Areia", "O Farol da Ilha do Silêncio",
        "O Oceano de Leite e Mel", "A Floresta dos Sussurros de Prata", "O Templo do Descanso Sagrado",
        "O Planeta das Luas Adormecidas", "O Grande Livro de Histórias da Noite", "O Reino da Brisa Mansa",
        "A Dança das Constelações", "A Sinfonia Noturna da Natureza", "O Segredo do Sonho Colorido"
      ]
    },
    nouns: ["sono", "sonho", "descanso", "luar", "vento", "estrela", "nuvem", "travesseiro"],
    verbs: ["adormece", "flutua", "ninar", "sussurra", "guarda", "descansa", "envolve", "protege"],
    values: ["paz", "serenidade", "confiança", "segurança", "gratidão", "calma", "acolhimento", "tranquilidade"]
  },
  'sentimentos': {
    emoji: '❤️',
    color: 'linear-gradient(135deg, #FCE4EC, #F8BBD0)', // Rosa algodão-doce
    subjects: {
      '2-4': [
        "O Sorriso do Macaquinho", "O Dia Feliz do Coelhinho", "O Abraço do Cachorrinho", "A Alegria do Pintinho",
        "O Amor do Ursinho", "O Pote de Carinho do Gatinho", "A Calma do Jacarezinho", "O Carinho da Mamãe Ursa",
        "O Abraço Quentinho", "A Dança do Sapitolo", "A Risada da Girafinha", "O Amor que Mora em Casa"
      ],
      '5-7': [
        "O Dinossauro com Medo do Escuro", "A Nuvem Cinzenta que Sentia Tristeza", "O Leão que Aprendeu a Calma",
        "O Castor Frustrado com a Represa", "O Caranguejo Tímido na Areia", "O Urso com Ciúmes do Irmão",
        "A Saudade da Tartaruguinha", "A Paciência do Caracol no Caminho", "O Orgulho do Pavão Colorido",
        "A Generosidade do Sol Quente", "A Empatia da Corujinha", "A Pressa da Lebre Saltitante"
      ],
      '8-10': [
        "A Descoberta da Verdadeira Empatia", "O Segredo de Perdoar o Amigo", "A Importância de Dizer a Verdade",
        "A Resiliência do Pequeno Pinheiro", "O Segredo da Autoestima da Coruja", "A Generosidade que Transforma Cidades",
        "Como Vencer a Ansiedade na Escola", "A Coragem para Superar um Desafio", "A Paz no Coração Atribulado",
        "A Gratidão Sincera de Clara", "A União que Vence a Solidão", "O Valor de Compartilhar a Alegria"
      ]
    },
    nouns: ["coração", "sentimento", "abraço", "sorriso", "amigo", "carinho", "dia", "peito"],
    verbs: ["sente", "aprende", "compartilha", "perdoa", "conversa", "acalma", "supera", "cura"],
    values: ["empatia", "coragem", "autoestima", "paciência", "resiliência", "amor", "perdão", "sinceridade"]
  },
  'mulheres-fortes': {
    emoji: '👸',
    color: 'linear-gradient(135deg, #FFF8E1, #FFECB3)', // Amarelo dourado suave
    subjects: {
      '2-4': [
        "A Rainha Ester que era Boa", "Ruth a Amiga Fiel", "Maria que Cuidava com Amor", "Débora que Ajudava o Povo",
        "Sarah que Sorria Sempre", "Ana que Sabia Orar", "Rebeca do Poço de Água", "Abigail que Trazia a Paz",
        "Miriã que Tocava Pandeiro", "Noemi do Abraço Forte", "Marta que Fazia Doces", "Lídia do Tecido Bonito"
      ],
      '5-7': [
        "A Coragem da Rainha Ester", "A Oração com Fé de Ana", "A Lealdade de Ruth", "A Justiça e Liderança de Débora",
        "O Cântico de Alegria de Miriã", "A Generosidade de Rebeca", "A Sabedoria de Abigail", "A Fé de Maria Mãe de Jesus",
        "A Hospitalidade de Marta", "A Bondade da Menina Cativa", "A Perseverança de Lídia", "O Coração Grato de Maria Madalena"
      ],
      '8-10': [
        "Ester e o Plano para Salvar seu Povo", "Ruth nos Campos de Boaz", "Débora e a Batalha da Vitória",
        "O Voto de Ana e o Nascimento de Samuel", "A Sabedoria de Abigail para Evitar a Guerra", "Miriã e a Travessia do Mar Vermelho",
        "A Fé de Maria na Manjedoura", "Priscila e a Dedicação ao Ensino", "Lídia e a Venda de Púrpura na Cidade",
        "O Milagre do Azeite da Viúva de Sarepta", "A Rainha de Sabá e a Busca por Sabedoria", "A Fé e Persistência da Mulher Cananeia"
      ]
    },
    nouns: ["mulher", "rainha", "líder", "heroína", "fé", "sabedoria", "lealdade", "vitória"],
    verbs: ["protege", "ora", "ajuda", "vence", "lidera", "ensina", "escuta", "persevera"],
    values: ["lealdade", "sabedoria", "coragem", "fé", "justiça", "dedicação", "gratidão", "oração"]
  },
  'inventores-genios': {
    emoji: '🔬',
    color: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)', // Verde folha pastel
    subjects: {
      '2-4': [
        "O Inventor e o Aviãozinho", "A Lâmpada que Brilha", "O Telefoninho de Latinha", "O Relógio de Corda",
        "A Roda Gigante Colorida", "O Radinho de Pilha", "A Luneta das Estrelas", "O Barquinho na Água",
        "O Balão que Voa", "O Óculos de Cores", "A Bússola Mágica", "O Trem de Brinquedo"
      ],
      '5-7': [
        "Santos Dumont e o Sonho de Voar", "Thomas Edison e a Primeira Lâmpada", "Graham Bell e a Invenção do Telefone",
        "A Luneta de Galileu Galilei", "O Avião 14-Bis no Ar", "O Relógio de Pulso de Santos Dumont",
        "A Oficina de Invenções Divertidas", "Benjamin Franklin e o Raio da Pipa", "Johannes Gutenberg e a Máquina de Livros",
        "A Roda que Faz o Mundo Andar", "O Barco que Navega com Vapor", "A Bússola que Mostra o Norte"
      ],
      '8-10': [
        "Santos Dumont e a Conquista dos Céus", "Thomas Edison e as Mil Tentativas da Lâmpada", "Graham Bell e a Mensagem pelo Fio",
        "Galileu Galilei e o Mistério das Estrelas", "Leonardo da Vinci e Seus Desenhos de Máquinas", "Isaac Newton e a Gravidade da Maçã",
        "Nikola Tesla e a Dança da Eletricidade", "Albert Einstein e as Perguntas sobre o Espaço", "Gutenberg e a Primeira Imprensa",
        "Ada Lovelace e os Primeiros Códigos", "Irmãos Wright e os Testes do Planador", "Blaise Pascal e a Calculadora Mecânica"
      ]
    },
    nouns: ["inventor", "gênio", "ideia", "oficina", "máquina", "luz", "ciência", "descoberta"],
    verbs: ["inventa", "descobre", "desenha", "tenta", "cria", "estuda", "imagina", "constrói"],
    values: ["perseverança", "curiosidade", "criatividade", "foco", "determinação", "paciência", "esforço", "visão"]
  },
  'classicos-infantis': {
    emoji: '📚',
    color: 'linear-gradient(135deg, #FFE0B2, #FFCC80)', // Laranja pêssego pastel
    subjects: {
      '2-4': [
        "O Boneco de Madeira Feliz", "O Sapatinho de Vidro", "A Menina do Capuz Vermelho", "O Patinho Diferente",
        "O Gato de Botas Altas", "Os Três Porquinhos e a Palha", "A Cinderela da Casinha", "A Bela e a Flor",
        "O Lobo Manso e Bom", "O Soldadinho de Metal", "O Menino da Terra das Estrelas", "O Espantalho de Palha"
      ],
      '5-7': [
        "O Boneco de Madeira que Queria Ser Menino", "A Menina do Sapatinho de Cristal Perdido", "A Aventura da Menina do Capuz Vermelho",
        "O Patinho Feio que Virou Cisne", "O Gato de Botas e o Moinho", "Os Três Porquinhos e a Casa de Tijolos",
        "A Bela Adormecida no Castelo de Flores", "A Bela que Amava a Fera Gentil", "O Soldadinho de Chumbo e a Bailarina",
        "A Menina dos Longos Cabelos na Torre", "João e Maria na Floresta Feliz", "O Alfaiate Valente e Espertinho"
      ],
      '8-10': [
        "Pinóquio e a Lição de Dizer a Verdade", "Cinderela e a Força da Bondade", "Chapeuzinho Vermelho e o Caminho Seguro",
        "O Voo de Peter Pan à Terra das Estrelas", "As Viagens de Gulliver no País dos Pequenos", "Alice no País das Maravilhas Lindas",
        "O Mágico de Oz e a Busca pelo Coração", "Rapunzel e a Luz da Verdadeira Liberdade", "O Pequeno Príncipe e a Flor no Asteroide",
        "O Vento nos Salgueiros e a Grande Amizade", "A Bela Adormecida e o Despertar do Reino", "Robin Hood e o Valor de Compartilhar"
      ]
    },
    nouns: ["clássico", "história", "aventura", "caminho", "castelo", "floresta", "personagem", "reino"],
    verbs: ["viaja", "aprende", "brinca", "descobre", "ajuda", "ensina", "supera", "escolhe"],
    values: ["honestidade", "bondade", "lealdade", "amizade", "generosidade", "humildade", "prudência", "gratidão"]
  }
};

const prefixes = ["A fantástica jornada de", "O mistério de", "A incrível aventura de", "O segredo de", "O lindo dia de", "A doce lição de", "O sonho mágico de", "A busca de"];
const suffixes = ["na floresta colorida", "sob as estrelas brilhantes", "e o valor da amizade", "com amor no coração", "no vale da paz", "no reino dos sonhos", "pelo caminho do bem", "e a luz da verdade"];

// Função para gerar um título/tema único e procedimental para preencher até 50 por combinação
function generateStoryMetadata(category, ageGroup, index) {
  const data = baseData[category];
  const list = data.subjects[ageGroup];

  let title = "";
  if (index < list.length) {
    title = list[index];
  } else {
    // Procedural
    const baseSubject = list[index % list.length];
    const prefix = prefixes[(index + 3) % prefixes.length];
    const suffix = suffixes[(index + 5) % suffixes.length];
    title = `${prefix} ${baseSubject.replace(/O |A |Os |As /i, '')} ${suffix}`;
  }

  // Garantir unicidade limitando caracteres
  title = title.substring(0, 100);

  // Slugifier simples
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');

  // Definir se é premium
  // Primeiras 15 são grátis, as outras 35 são premium
  const isPremium = index >= 15;

  // Valor moral associado
  const value = data.values[index % data.values.length];

  return {
    title,
    slug,
    category,
    ageGroups: [ageGroup],
    durationMinutes: ageGroup === '2-4' ? 3 : ageGroup === '5-7' ? 5 : 8,
    language: 'pt-BR',
    coverEmoji: data.emoji,
    coverColor: data.color,
    isPremium,
    isAIGenerated: false,
    isPlaceholder: true,
    value,
    theme: `${title} - Um aprendizado sobre ${value} para a faixa etária de ${ageGroup} anos.`,
    createdAt: new Date(),
    publishedAt: new Date(),
    rating: 5,
    reviewCount: 0,
    viewCount: 0
  };
}

async function clearOldPlaceholders() {
  console.log('Limpando placeholders antigos no Firestore...');
  const storiesColl = db.collection('stories');
  const snap = await storiesColl.where('isPlaceholder', '==', true).get();
  
  if (snap.empty) {
    console.log('Nenhum placeholder antigo encontrado.');
    return;
  }
  
  console.log(`Encontrados ${snap.size} documentos. Excluindo em blocos...`);
  const chunks = [];
  let currentBatch = db.batch();
  let count = 0;
  
  for (const doc of snap.docs) {
    currentBatch.delete(doc.ref);
    count++;
    if (count % 400 === 0) {
      chunks.push(currentBatch);
      currentBatch = db.batch();
    }
  }
  if (count % 400 !== 0) {
    chunks.push(currentBatch);
  }
  
  for (const batch of chunks) {
    await batch.commit();
  }
  console.log('Limpeza concluída!');
}

async function run() {
  await clearOldPlaceholders();

  console.log('Iniciando o seeding de 900 histórias...');
  const storiesColl = db.collection('stories');
  
  let totalSeeded = 0;
  let batch = db.batch();
  let batchCount = 0;

  for (const category of categories) {
    for (const ageGroup of ageGroups) {
      console.log(`Gerando 50 histórias para: ${category} (${ageGroup} anos)...`);
      for (let i = 0; i < 50; i++) {
        const storyDoc = generateStoryMetadata(category, ageGroup, i);
        const ref = storiesColl.doc(); // Gera ID automático único
        
        batch.set(ref, {
          ...storyDoc,
          id: ref.id,
          createdAt: admin.firestore.Timestamp.fromDate(storyDoc.createdAt),
          publishedAt: admin.firestore.Timestamp.fromDate(storyDoc.publishedAt)
        });

        batchCount++;
        totalSeeded++;

        if (batchCount === 400) {
          console.log(`Enviando lote de ${batchCount} documentos ao Firestore...`);
          await batch.commit();
          batch = db.batch();
          batchCount = 0;
        }
      }
    }
  }

  if (batchCount > 0) {
    console.log(`Enviando lote final de ${batchCount} documentos ao Firestore...`);
    await batch.commit();
  }

  console.log(`Sucesso! Total de ${totalSeeded} histórias seedadas no Firestore.`);
  process.exit(0);
}

run().catch(err => {
  console.error('Erro durante o seeding:', err);
  process.exit(1);
});
