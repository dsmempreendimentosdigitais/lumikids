const fs = require('fs');
const path = require('path');

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

const WAVE_2_STORIES = [
  // ==========================================
  // MULHERES FORTES (mulheres-fortes) - Brasil, Egito, China, Mundo
  // ==========================================
  {
    title: 'Dandara dos Palmares e a Força da Liberdade',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🏹',
    coverColor: '#BE123C',
    value: 'dignidade e liderança protetora',
    missionTitle: 'Missão do Respeito e Igualdade',
    missionDesc: 'Demonstre respeito a todas as pessoas ao seu redor, valorizando as diferenças e origens!',
    reflectionQuestion: 'Como a coragem de defender quem precisa de proteção transforma uma comunidade em uma grande família?',
    paragraphs: [
      { text: "Nas altas serras verdejantes da Serra da Barriga, em Alagoas, erguia-se o Quilombo dos Palmares, um refúgio de homens e mulheres livres que plantavam milho, feijão e mandioca sob o sol do Nordeste.", prompt: "Lush green mountains of Serra da Barriga under sunny Brazilian sky with traditional wooden houses, 2D storybook illustration" },
      { text: "Dandara cresceu como uma líder admirada por sua agilidade e inteligência. Mestra na arte da capoeira e estrategista brilhante, ela organizava a defesa e a agricultura comunitária de Palmares com energia contagiante.", prompt: "Brave Afro-Brazilian woman Dandara practicing agile capoeira movements in sunny mountain clearing, 2D storybook illustration" },
      { text: "Ao lado de Zumbi dos Palmares, Dandara não apenas defendia as fronteiras, mas cuidava para que todas as crianças aprendessem a cultivar a terra, a respeitar a natureza e a ter orgulho de sua ancestralidade.", prompt: "Dandara smiling warmly teaching young children how to plant seeds in rich garden soil, 2D storybook illustration" },
      { text: "Quando expedições tentavam destruir a harmonia da comunidade, Dandara liderava os guerreiros com velocidade e determinação, usando o conhecimento perfeito das trilhas e cavernas da serra.", prompt: "Dandara standing tall and courageous on rocky mountain overlook watching over peaceful village, 2D storybook illustration" },
      { text: "Dandara preferiu lutar pela liberdade incondicional a aceitar tratados que mantivessem outros irmãos escravizados, tornando-se o maior símbolo de dignidade e resistência feminina da história do Brasil.", prompt: "Dandara looking toward golden sunset with noble proud expression holding a wooden staff, 2D storybook illustration" }
    ]
  },
  {
    title: 'Chiquinha Gonzaga e o Som da Coragem',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🎹',
    coverColor: '#E11D48',
    value: 'ousadia criativa e persistência',
    missionTitle: 'Missão da Expressão Musical',
    missionDesc: 'Ouça uma canção brasileira antiga ou toque um ritmo com as mãos para alegrar seu dia!',
    reflectionQuestion: 'Por que a arte e a música têm a capacidade de quebrar preconceitos e unir corações?',
    paragraphs: [
      { text: "No Rio de Janeiro colonial do século XIX, a menina Francisca Edwiges Neves Gonzaga, carinhosamente chamada de Chiquinha, passava horas fascinada pelas notas e melodias do piano de sua casa.", prompt: "Young Brazilian girl Chiquinha playing wooden piano happily in sunlit colonial living room, 2D storybook illustration" },
      { text: "Naquela época, a sociedade considerava que as mulheres não deveriam ser músicas profissionais. Mas Chiquinha tinha a música correndo nas veias e não aceitou abrir mão do seu talento divino.", prompt: "Chiquinha with determined smile writing musical notes on sheet music by candlelight, 2D storybook illustration" },
      { text: "Ela começou a dar aulas de piano e a compor valsas, polcas e chorinhos vibrantes que misturavam os ritmos africanos com a música de salão, inventando as bases da música popular brasileira.", prompt: "Chiquinha playing lively piano in bohemian music gathering with acoustic guitars and smiling guests, 2D storybook illustration" },
      { text: "Chiquinha usava o dinheiro de suas composições para comprar a carta de alforria de pessoas escravizadas, lutando ativamente pela abolição da escravatura e pelos direitos autorais dos artistas.", prompt: "Chiquinha Gonzaga handing freedom papers to happy grateful families with tears of joy, 2D storybook illustration" },
      { text: "Em 1899, compôs 'Ô Abre Alas', a primeira marcha carnavalesca da história do Brasil, e tornou-se a primeira mulher a reger uma orquestra no país com batuta e dignidade inabaláveis.", prompt: "Chiquinha Gonzaga conducting a grand orchestra with wooden baton as theater audience applauds standing, 2D storybook illustration" }
    ]
  },
  {
    title: 'Florence Nightingale e a Dama da Lâmpada',
    category: 'mulheres-fortes',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🪔',
    coverColor: '#FB7185',
    value: 'compaixão e cuidado com o próximo',
    missionTitle: 'Missão do Conforto',
    missionDesc: 'Ofereça um copo de água ou uma massagem nos pés ou mãos de alguém cansado na sua casa!',
    reflectionQuestion: 'Como a dedicação carinhosa e o cuidado com os doentes transformam o sofrimento em esperança?',
    paragraphs: [
      { text: "Na Inglaterra vitoriana, a jovem Florence Nightingale nasceu em uma família rica e aristocrática. Em vez de escolher uma vida de luxo e festas, sentiu um chamado profundo no coração: cuidar das pessoas doentes e esquecidas.", prompt: "Young Florence Nightingale tending gentle wounded dog in peaceful English country garden, 2D storybook illustration" },
      { text: "Florence viajou para estudar enfermagem na Alemanha e no Egito. Ela percebeu que a limpeza, o ar fresco, a luz do sol e a alimentação nutritiva eram essenciais para a recuperação dos pacientes.", prompt: "Florence studying medical books and hygiene charts by bright hospital window with sunlight, 2D storybook illustration" },
      { text: "Durante a Guerra da Crimeia, Florence liderou uma equipe de enfermeiras voluntárias em um hospital de campanha precário em Scutari. Com vassouras, água limpa e lençóis lavados, transformou o local em um refúgio seguro.", prompt: "Florence and nurses cleaning and organizing hospital ward bringing white sheets and fresh air, 2D storybook illustration" },
      { text: "Todas as noites, quando todos dormiam, Florence caminhava quilômetros pelos corredores escuros segurando uma pequena lamparina de metal, confortando soldado por soldado com palavras de ternura.", prompt: "Florence Nightingale holding glowing oil lamp comforting wounded soldier in dark quiet hospital room, 2D storybook illustration" },
      { text: "Os soldados beijavam sua sombra na parede e a chamavam de 'A Dama da Lâmpada'. Sua dedicação salvou milhares de vidas e fundou as bases da enfermagem moderna no mundo inteiro.", prompt: "Florence Nightingale surrounded by grateful smiling patients and nurse students in modern clean hospital, 2D storybook illustration" }
    ]
  },
  {
    title: 'Ada Lovelace, a Pioneira dos Computadores',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '💻',
    coverColor: '#A855F7',
    value: 'imaginação visionária e lógica',
    missionTitle: 'Missão do Passo a Passo',
    missionDesc: 'Escreva uma receita ou instruções passo a passo (um algoritmo) para fazer um lanche delicioso!',
    reflectionQuestion: 'Como a imaginação poética e a matemática juntas nos ajudam a inventar tecnologias que mudam o mundo?',
    paragraphs: [
      { text: "Em Londres do século XIX, a menina Ada Byron Lovelace, filha do poeta Lord Byron e da matemática Annabella, adorava construir pipas e desenhava máquinas de voar com asas de penas e motores a vapor.", prompt: "Young girl Ada drawing blueprints of flying mechanical birds in sunlit Victorian study room, 2D storybook illustration" },
      { text: "Sua mãe incentivou os estudos rigorosos de matemática, astronomia e música. Ada chamava sua paixão de 'ciência poética', pois unia a precisão dos números com a beleza da imaginação criativa.", prompt: "Ada studying complex geometric shapes and equations on blackboard with bright eager eyes, 2D storybook illustration" },
      { text: "Aos dezessete anos, conheceu o matemático Charles Babbage, que projetava a 'Máquina Analítica', um gigantesco computador mecânico feito de engrenagens de bronze movidas a cartões perfurados.", prompt: "Ada and Charles Babbage examining intricate brass gears of large mechanical calculating machine, 2D storybook illustration" },
      { text: "Enquanto outros viam a máquina apenas como uma calculadora para somar números, Ada teve uma visão genial: percebeu que a máquina poderia manipular símbolos, palavras, notas musicais e imagens.", prompt: "Ada Lovelace writing by hand the first algorithm instructions on parchment with glowing vision of future, 2D storybook illustration" },
      { text: "Em 1843, Ada escreveu o primeiro programa de computador de toda a história humana, tornando-se a mãe da programação e inspirando gerações de meninas e meninos na tecnologia.", prompt: "Portrait of visionary Ada Lovelace surrounded by floating binary code and starry lights, smiling with pride, 2D storybook illustration" }
    ]
  },
  {
    title: 'Cleópatra e os Mistérios de Alexandria',
    category: 'mulheres-fortes',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '📜',
    coverColor: '#D97706',
    value: 'inteligência e amor ao estudo',
    missionTitle: 'Missão das Muitas Línguas',
    missionDesc: 'Aprenda como dizer "bom dia" e "obrigado" em um idioma diferente hoje!',
    reflectionQuestion: 'Por que o domínio dos idiomas e o estudo da história são as ferramentas mais poderosas de um líder?',
    paragraphs: [
      { text: "No imponente porto de Alexandria, com seu farol colossal brilhando sobre as ondas azuis, a jovem princesa Cleópatra passava horas estudando nos corredores da lendária Biblioteca de Alexandria.", prompt: "Young Cleopatra reading papyrus scrolls in majestic ancient Library of Alexandria with tall columns, 2D storybook illustration" },
      { text: "Diferente de seus antecessores, Cleópatra aprendeu a língua do povo egípcio e dominava fluentemente mais de nove idiomas, incluindo grego, latim, hebraico, aramaico e etíope.", prompt: "Cleopatra conversing smilingly with foreign merchants and scholars in diverse Alexandria market, 2D storybook illustration" },
      { text: "Ela era apaixonada por astronomia, filosofia, matemática e medicina natural, governando com inteligência estratégica para proteger a independência e a riqueza cultural do Egito.", prompt: "Queen Cleopatra sitting on royal throne discussing celestial globe maps with Egyptian astronomers, 2D storybook illustration" },
      { text: "Com diplomacia brilhante e carisma incontestável, defendeu seu povo das maiores potências do mundo e financiou pesquisas científicas que enriqueceram a ciência universal por séculos.", prompt: "Cleopatra standing on terrace of Alexandria palace looking over sunny Mediterranean sea with dignity, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // HISTÓRIAS DA BÍBLIA (biblia-kids) - Mais Histórias Clássicas
  // ==========================================
  {
    title: 'Davi e a Harpa da Paz',
    category: 'biblia-kids',
    ageGroups: ['3-5', '5-7', '8-10'],
    coverEmoji: '🎵',
    coverColor: '#0D9488',
    value: 'serenidade e o poder da música',
    missionTitle: 'Missão da Canção Serena',
    missionDesc: 'Cante ou coloque uma música calma em casa para trazer paz a todos ao seu redor!',
    reflectionQuestion: 'Como a música suave e os pensamentos tranquilos acalmam o coração quando estamos nervosos?',
    paragraphs: [
      { text: "Nas colinas douradas de Belém, o jovem Davi cuidava das ovelhas de seu pai com zelo e amor. Quando a tarde caía, ele sentava-se na relva e tocava melodias divinas em sua pequena harpa de madeira.", prompt: "Young shepherd David playing wooden harp in sunny green pasture with fluffy white sheep, 2D storybook illustration" },
      { text: "O som de sua harpa era tão doce e calmo que até os passarinhos pousavam nos galhos para ouvir, e as ovelhinhas descansavam em perfeita paz sem medo dos lobos da noite.", prompt: "Birds resting on branches listening to David gentle harp playing under pastel sunset sky, 2D storybook illustration" },
      { text: "No palácio de Israel, o Rei Saul sofria com crises de tristeza, ansiedade e angústia no peito. Seus médicos e conselheiros recomendaram que buscassem alguém que tocasse com a alma.", prompt: "King Saul sitting on throne looking sad and weary while attendants look on with concern, 2D storybook illustration" },
      { text: "Davi foi chamado à presença do rei. Ao ver a aflição nos olhos de Saul, Davi respirou fundo, orou em silêncio e começou a dedilhar as cordas da harpa, cantando salmos de esperança e amor.", prompt: "Young David playing harp gently before King Saul, soft golden light filling the room, 2D storybook illustration" },
      { text: "À medida que a melodia preenchia o salão real, a angústia de Saul se dissipou como neblina ao sol da manhã. O rei sorriu, sentiu alívio profundo e abraçou o jovem músico com gratidão.", prompt: "King Saul smiling warmly with peaceful face placing hand on young David shoulder in friendship, 2D storybook illustration" },
      { text: "Davi ensinou a todas as gerações que a verdadeira força muitas vezes não está na armadura ou na espada, mas na suavidade de uma canção que cura a alma e espalha a paz.", prompt: "David walking happily under starry sky with his harp and trusted shepherd staff, 2D storybook illustration" }
    ]
  },
  {
    title: 'Rute e a Amizade Fiel',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🌾',
    coverColor: '#0F766E',
    value: 'lealdade familiar e carinho',
    missionTitle: 'Missão da Amizade Fiel',
    missionDesc: 'Diga a um amigo leal ou a alguém da sua família o quanto você valoriza estar ao lado dele!',
    reflectionQuestion: 'O que significa ser leal a alguém nos momentos alegres e também nos momentos difíceis?',
    paragraphs: [
      { text: "Nas terras de Moabe, a jovem Rute casou-se com um dos filhos da bondosa israelita Noemi. Com o passar dos anos, Noemi enfrentou grandes perdas e decidiu retornar sozinha e pobre para sua terra em Belém.", prompt: "Elderly Noemi and young Ruth walking together along dusty mountain path with pack, 2D storybook illustration" },
      { text: "Noemi disse a Rute para ficar em sua terra natal com sua própria família. Mas Rute segurou as mãos enrugadas da sogra com profundo carinho e disse palavras eternas:", prompt: "Ruth looking lovingly into Noemi eyes holding her hands with heartfelt loyalty, 2D storybook illustration" },
      { text: "'Não insistas para que eu te deixe! Aonde quer que fores, irei eu; onde quer que pousares, ali pousarei; o teu povo será o meu povo, e o teu Deus será o meu Deus!'", prompt: "Ruth embracing elderly Noemi warmly on sunny mountain road under blue sky, 2D storybook illustration" },
      { text: "Juntas chegaram a Belém na época da colheita da cevada. Para que não faltasse alimento para a idosa Noemi, Rute ia todos os dias aos campos recolher com humildade os grãos que sobravam aos pés dos ceifeiros.", prompt: "Ruth gathering golden barley stalks gently in sunlit wheat field with smiling workers, 2D storybook illustration" },
      { text: "O dono do campo, o sábio e generoso Boaz, notou a nobreza e a dedicação filial de Rute. Ordenou que deixassem feixes inteiros de trigo caírem de propósito no caminho para que ela colhesse com facilidade.", prompt: "Kind farmer Boaz speaking respectfully to hardworking Ruth offering fresh water in field, 2D storybook illustration" },
      { text: "Rute casou-se com Boaz e encheu a casa de Noemi de risos e fartura. De sua descendência nasceria o rei Davi, mostrando que a fidelidade e o amor puro são sempre recompensados com bênçãos eternas.", prompt: "Joyful family celebration in sunny Bethlehem courtyard with Ruth holding newborn baby surrounded by loved ones, 2D storybook illustration" }
    ]
  },
  {
    title: 'O Bom Samaritano e o Amor ao Próximo',
    category: 'biblia-kids',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '❤️',
    coverColor: '#0284C7',
    value: 'compaixão ativa e empatia',
    missionTitle: 'Missão do Acolhimento',
    missionDesc: 'Ajude alguém que esteja precisando sem se preocupar se essa pessoa é parecida ou não com você!',
    reflectionQuestion: 'Quem é o nosso próximo? Por que devemos ajudar a qualquer pessoa com compaixão?',
    paragraphs: [
      { text: "Pela estrada íngreme e pedregosa que descia de Jerusalém para Jericó, um viajante caminhava sozinho quando foi atacado por bandidos, que levaram seus pertences e o deixaram ferido à beira do caminho.", prompt: "A traveler lying weak and injured by rocky dusty desert road under hot sun, 2D storybook illustration" },
      { text: "Pouco depois, passou por ali um sacerdote do templo. Ao ver o homem caído, atravessou para o outro lado da estrada com pressa e continuou seu caminho sem parar para ajudar.", prompt: "A proud priest walking past on the far side of road looking away, 2D storybook illustration" },
      { text: "Em seguida, passou um levita, conhecedor das leis sagradas. Ele chegou perto, olhou com curiosidade, mas teve medo de se envolver e também se afastou sem prestar socorro.", prompt: "Another traveler pausing briefly then walking away quickly, leaving the injured man alone, 2D storybook illustration" },
      { text: "Por fim, aproximou-se um homem samaritano, membro de um povo com quem os habitantes locais não costumavam se relacionar. Ao ver o homem ferido, seu coração encheu-se de profunda compaixão.", prompt: "Kind Samaritan kneeling gently beside injured traveler offering water from canteen, 2D storybook illustration" },
      { text: "O samaritano desceu de seu burrinho, limpou as feridas com azeite e vinho aromático, enfaixou-as com panos limpos e acomodou o homem com todo o carinho sobre o lombo de seu próprio animal.", prompt: "Samaritan bandaging wounds with care and helping man onto his gentle donkey, 2D storybook illustration" },
      { text: "Levou-o até uma estalagem acolhedora, cuidou dele a noite toda e, na manhã seguinte, pagou ao estalajadeiro duas moedas de prata garantindo que cuidaria de qualquer despesa a mais que fosse necessária.", prompt: "Samaritan paying innkeeper with silver coins in cozy rustic inn with warm lantern, 2D storybook illustration" },
      { text: "Com este ensinamento sublime, Jesus ensinou que o verdadeiro amor ao próximo não tem fronteiras: próximo é qualquer pessoa que cruza o nosso caminho e precisa do nosso abraço e auxílio.", prompt: "Happy traveler resting comfortably in bed smiling at compassionate Samaritan, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // BIOGRAFIAS INSPIRADORAS (biografias-historicas)
  // ==========================================
  {
    title: 'Dom Pedro II e o Reino dos Livros',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '👑',
    coverColor: '#16A34A',
    value: 'humildade e dedicação à educação',
    missionTitle: 'Missão do Mestre Mirim',
    missionDesc: 'Ensine algo bacana que você sabe fazer para um amigo ou irmãozinho hoje!',
    reflectionQuestion: 'Por que o líder mais respeitado é aquele que busca o saber e vive com modéstia e respeito?',
    paragraphs: [
      { text: "No Palácio de São Cristóvão, no Rio de Janeiro, o menino Pedro de Alcântara tornou-se Imperador do Brasil com apenas cinco anos após a partida de seus pais. Para suportar a solidão, encontrou nos livros seus melhores amigos.", prompt: "Young boy Emperor Pedro II studying in grand royal library surrounded by high shelves of books, 2D storybook illustration" },
      { text: "Pedro acordava antes das seis da manhã e passava horas estudando línguas, matemática, botânica e geografia. Ele dizia com simplicidade: 'Se eu não fosse imperador, gostaria de ser professor. Não conheço missão mais nobre'.", prompt: "Pedro II walking in sunny botanical garden with notebook examining tropical plants, 2D storybook illustration" },
      { text: "Mesmo governando um império gigantesco por quase meio século, Pedro mantinha hábitos simples: vestia ternos de linho comuns, viajava pelo Brasil visitando escolas e conversava com cidadãos de todas as classes.", prompt: "Emperor Pedro II visiting a humble rural classroom talking kindly to students and teacher, 2D storybook illustration" },
      { text: "Ele financiou pessoalmente a pesquisa de inventores como Graham Bell e Louis Pasteur, trouxe o telefone e a fotografia para o Brasil e fundou instituições científicas de preservação da memória nacional.", prompt: "Dom Pedro II testing first telephone in Rio de Janeiro with scientists smiling around him, 2D storybook illustration" },
      { text: "Ao fim de sua vida, exilado, levou consigo apenas um saquinho de terra brasileira debaixo do travesseiro, lembrado por todos como um governante sábio, humilde e apaixonado pelo progresso do seu povo.", prompt: "Elderly Dom Pedro II holding a small bag of Brazilian earth with gentle nostalgic smile, 2D storybook illustration" }
    ]
  },
  {
    title: 'Albert Schweitzer e o Respeito pela Vida',
    category: 'biografias-historicas',
    ageGroups: ['8-10', '11-14'],
    coverEmoji: '🩺',
    coverColor: '#059669',
    value: 'compaixão e serviço ao próximo',
    missionTitle: 'Missão do Cuidado com os Vivos',
    missionDesc: 'Trate com gentileza uma plantinha, um bichinho ou um animal de estimação hoje!',
    reflectionQuestion: 'Como o respeito por todas as formas de vida nos torna seres humanos mais completos e amorosos?',
    paragraphs: [
      { text: "Na Europa do início do século XX, Albert Schweitzer era um gênio consagrado: filósofo ilustre, teólogo brilhante e um dos maiores organistas de música clássica de todo o continente.", prompt: "Albert Schweitzer playing a grand wooden pipe organ in historic European cathedral with radiant light, 2D storybook illustration" },
      { text: "Porém, aos trinta anos, leu sobre a falta extrema de médicos nas florestas tropicais da África. Decidiu recomeçar a vida do zero: estudou medicina e partiu com sua esposa Helene para o Gabão.", prompt: "Albert and Helene Schweitzer on wooden boat sailing along African river with dense green forest, 2D storybook illustration" },
      { text: "Às margens do Rio Ogooué, em Lambaréné, construíram com as próprias mãos um hospital feito de tábuas e folhas de zinco, onde atendiam gratuitamente milhares de pessoas doentes que viajavam em canoas.", prompt: "Albert Schweitzer treating a smiling patient gently on the porch of a wooden hospital in tropical forest, 2D storybook illustration" },
      { text: "Um dia, navegando pelo rio ao entardecer vendo uma manada de hipopótamos na água, veio-lhe a fórmula de sua vida: 'Reverência pela Vida'. Toda vida — de um ser humano a uma formiguinha — é sagrada e digna de respeito.", prompt: "Schweitzer in canoe observing peaceful hippopotamus family in sunlit river with golden reflection, 2D storybook illustration" },
      { text: "Ele usou o dinheiro de concertos de órgão na Europa e do Prêmio Nobel da Paz para expandir o hospital e cuidar dos leprosos, provando que o maior dom que temos é a capacidade de servir com amor.", prompt: "Albert Schweitzer surrounded by happy smiling African children and animals in sunny garden, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // MITOLOGIA GREGA (mitologia-grega) - Mais Histórias
  // ==========================================
  {
    title: 'Perseu e o Pégaso Alado',
    category: 'mitologia-grega',
    ageGroups: ['5-7', '8-10', '11-14'],
    coverEmoji: '🦄',
    coverColor: '#F59E0B',
    value: 'lealdade e harmonia com as criaturas',
    missionTitle: 'Missão do Companheiro Leal',
    missionDesc: 'Aja com calma e carinho com um animal de estimação ou amigo, construindo confiança mútua!',
    reflectionQuestion: 'Como a delicadeza e a confiança mútua conquistam mais do que o medo ou a força?',
    paragraphs: [
      { text: "Nas altas montanhas de Corinto, falava-se de um cavalo alado de pelagem branca como a neve chamado Pégaso, cujos cascos faziam brotar fontes de água cristalina nas encostas sagradas.", prompt: "Magnificent white winged horse Pegasus drinking from clear mountain spring under blue sky, 2D storybook illustration" },
      { text: "O jovem príncipe Belerofonte sonhava em cavalgar os céus ao lado de Pégaso para proteger as aldeias contra monstros que aterrorizavam a região. Mas Pégaso era livre e não aceitava correntes de ferro.", prompt: "Young hero Belerophon looking up at mountain peaks with gentle respectful expression, 2D storybook illustration" },
      { text: "A sábia deusa Atena apareceu em um sonho e lhe entregou um freio de ouro mágico, orientando que a criatura só aceitaria ser montada se houvesse respeito mútuo e pureza de intenção no coração.", prompt: "Goddess Athena handing a glowing golden bridle to young hero in sunlit temple, 2D storybook illustration" },
      { text: "Belerofonte aproximou-se da Fonte de Pirene com passos lentos e voz mansa. Mostrou as mãos vazias e o freio dourado, esperando pacientemente até que Pégaso o cheirasse e se aproximasse por livre vontade.", prompt: "Hero gently offering hand to majestic winged horse by water spring with total trust, 2D storybook illustration" },
      { text: "Juntos, homem e corcel alado voaram alto sobre as nuvens. Com perfeita sincronia e coragem, derrotaram a terrível Quimera sem queimar as florestas nem ferir as colheitas dos aldeões.", prompt: "Hero and Pegasus flying gracefully together in sky swooping down to protect cheering villages, 2D storybook illustration" },
      { text: "Belerofonte aprendeu que o verdadeiro líder não domina as criaturas pela imposição, mas cria amizades eternas pela confiança, pelo respeito e pela harmonia com o mundo natural.", prompt: "Hero resting hand on neck of winged Pegasus on mountain cliff at sunset with deep mutual bond, 2D storybook illustration" }
    ]
  },

  // ==========================================
  // VIRTUDES EM AÇÃO (virtudes-em-acao)
  // ==========================================
  {
    title: 'O Segredo das Duas Palavras Mágicas',
    category: 'virtudes-em-acao',
    ageGroups: ['3-5', '5-7'],
    coverEmoji: '✨',
    coverColor: '#9333EA',
    value: 'gentileza e educação',
    missionTitle: 'Missão da Chave de Ouro',
    missionDesc: 'Use "Por favor" e "Muito obrigado" com um sorriso para todos que te ajudarem hoje!',
    reflectionQuestion: 'Por que a gentileza transforma o ambiente da nossa casa e da escola em um lugar muito mais alegre?',
    paragraphs: [
      { text: "Na aldeia florida do Vale Verde, o pequeno Theo vivia de mau humor. Quando queria um brinquedo, puxava das mãos dos amigos; quando queria um lanche, gritava exigindo pressa.", prompt: "Grumpy little boy Theo demanding toys from friends who look sad, 2D storybook illustration" },
      { text: "Com o passar dos dias, Theo percebeu algo estranho: as portas pareciam mais pesadas, os amigos preferiam brincar longe dele e até seu cachorrinho Bilu se escondia debaixo da cama.", prompt: "Little boy Theo standing alone in garden while other happy children play together in distance, 2D storybook illustration" },
      { text: "Um dia, Theo encontrou um simpático relojoeiro que lhe entregou duas chavinhas douradas que brilhavam como vagalumes: 'Theo, estas são as palavras mágicas que abrem qualquer porta e qualquer coração fechado'.", prompt: "Friendly old clockmaker with white hair handing two glowing golden keys to curious boy Theo, 2D storybook illustration" },
      { text: "Na primeira chave estava escrito 'Por Favor'; na segunda chave, 'Muito Obrigado'. Theo guardou as chaves no bolso e decidiu testar a mágica ao chegar em casa.", prompt: "Close up of small hands holding tiny golden keys engraved with kind words, 2D storybook illustration" },
      { text: "Na hora do jantar, em vez de exigir, Theo sorriu e disse: 'Mamãe, você pode me passar o suco de uva, por favor?' A mamãe abriu um sorriso radiante de surpresa. Ao receber o copo, Theo completou: 'Muito obrigado, mamãe!'", prompt: "Mother smiling happily hugging boy Theo at dining table with fresh fruit and juice, 2D storybook illustration" },
      { text: "Na escola, Theo usou as palavras mágicas com os colegas. Como num passe de mágica, todos queriam brincar com ele, rindo e dividindo os brinquedos em perfeita harmonia.", prompt: "Children happily sharing blocks and drawing together with smiling boy Theo in classroom, 2D storybook illustration" },
      { text: "Theo descobriu o maior segredo do mundo: a gentileza não custa nada, mas tem o poder de iluminar o dia de qualquer pessoa e fazer o coração florescer de felicidade.", prompt: "Boy Theo smiling with open arms surrounded by friends, butterflies and sunshine in playground, 2D storybook illustration" }
    ]
  }
];

async function seedWave2() {
  console.log(`\n🚀 [Onda 2] Iniciando cadastro de mais ${WAVE_2_STORIES.length} histórias completas no Firestore...`);

  const existingSnapshot = await db.collection('stories').get();
  const existingTitles = new Set();
  existingSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.title) {
      existingTitles.add(data.title.trim().toLowerCase());
    }
  });

  let insertedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < WAVE_2_STORIES.length; i++) {
    const rawStory = WAVE_2_STORIES[i];
    const normalizedTitle = rawStory.title.trim().toLowerCase();

    if (existingTitles.has(normalizedTitle)) {
      console.log(`- Pulando história já existente: "${rawStory.title}"`);
      skippedCount++;
      continue;
    }

    const docRef = db.collection('stories').doc();
    const seedBase = 700 + (insertedCount * 35);

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
    console.log(`[${insertedCount}/${WAVE_2_STORIES.length}] ✅ Inserida com sucesso: "${rawStory.title}" (${rawStory.category})`);
  }

  const finalSnapshot = await db.collection('stories').get();
  const summaryByCat = {};
  finalSnapshot.forEach(doc => {
    const d = doc.data();
    const cat = d.category || 'sem-categoria';
    summaryByCat[cat] = (summaryByCat[cat] || 0) + 1;
  });

  console.log(`\n==============================================`);
  console.log(`🎉 [Onda 2] CONCLUÍDO! Novas inseridas: ${insertedCount}`);
  console.log(`\n📊 Panorama Final Completo no Firestore:`);
  console.table(summaryByCat);
  console.log(`🏆 TOTAL ABSOLUTO DE HISTÓRIAS NO BANCO: ${finalSnapshot.size} histórias!`);
}

seedWave2().then(() => process.exit(0)).catch(err => {
  console.error('Erro na execução da Onda 2:', err);
  process.exit(1);
});
