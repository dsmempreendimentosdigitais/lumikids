import { genAI, defaultGenerationConfig, defaultSafetySettings } from './client';
import { SYSTEM_PROMPT_STORY, buildStoryUserPrompt } from './prompts';
import { GenerateStoryRequest } from '@/types/ai';
import { Story as GeneratedStory } from '@/types/story';

function cleanTitleString(title: string): string {
  if (!title) return 'Aventura de Nobreza';
  return title
    .replace(/\s*-\s*Um aprendizado.*$/i, '')
    .replace(/\s*para a faixa etária.*$/i, '')
    .replace(/\s*sob as estrelas brilhantes.*$/i, '')
    .replace(/mundo[s]? mágico[s]?/gi, 'Reino')
    .replace(/magia/gi, 'Sabedoria')
    .replace(/encantado[s]?/gi, 'Nobre')
    .trim();
}

const createEmergencyFallbackStory = (data: GenerateStoryRequest): GeneratedStory => {
  const child = data.childName || 'Aventureiro';
  const rawTheme = data.theme || 'A Jornada da Coragem';
  const cleanTheme = cleanTitleString(rawTheme);
  const value = data.value || 'Coragem e Virtude';

  const title = `${cleanTheme}: A Jornada de ${child}`;

  // 12 parágrafos de narrativa real e edificante
  const paragraphsText = [
    `${child} era um jovem conhecido por sua atenção aos detalhes e por seu coração sincero. Naquela manhã ensolarada, um novo dever bateu à sua porta.`,
    `A comunidade precisava de uma ajuda especial para organizar os recursos da fazenda e cuidar das tarefas do dia antes do pôr do sol.`,
    `Sem hesitar, ${child} vestiu seu casaco confortável, pegou seu caderno de anotações e partiu a passos firmes pelo caminho de pedra.`,
    `Ao longo da jornada, encontrou vizinhos que precisavam de auxílio para carregar pesadas cestas de frutas do pomar.`,
    `Com gentileza e braços fortes, ${child} ajudou um a um, mostrando que a verdadeira nobreza está no servir.`,
    `Chegando ao centro do vilarejo, observou atentamente cada desafio e dividiu a grande tarefa em pequenos passos organizados.`,
    `Trabalhando com paciência e foco, sem reclamações nem pressa excessiva, os obstáculos foram sendo superados um a um.`,
    `À tarde, os animais da fazenda já estavam bem alimentados e todo o grão estava guardado em segurança no celeiro.`,
    `Todos no vilarejo se reuniram para agradecer o empenho e a dedicação exemplar demonstrados por ${child}.`,
    `Ao retornar para casa ao cair da tarde, ${child} olhou para o horizonte sabendo que o dever comprido traz paz ao coração.`,
    `Ao lado de sua amada família, compartilhou a refeição quente com gratidão e alegria sincera.`,
    `Aquela jornada provou que com coragem, trabalho duro e foco no bem, qualquer criança pode realizar grandes feitos.`
  ];

  const paragraphs = paragraphsText.map((text, idx) => ({
    index: idx,
    text: text,
    imagePrompt: `${child}, a cute ${data.ageGroup || '7'} year old child with ${data.gender === 'menina' ? 'girl' : 'boy'} appearance, performing a noble duty in a sunlit countryside village, 2D children storybook illustration, digital watercolor, clean lineart, fairytale book art, no text, no watermark`,
    isHighlight: idx % 3 === 0,
    startTime: idx * 5000,
    endTime: (idx + 1) * 5000
  }));

  return {
    id: '',
    title: cleanTitleString(title),
    slug: `jornada-de-${child.toLowerCase()}`,
    category: 'ai-personalizada',
    ageGroups: [data.ageGroup as any],
    durationMinutes: 6,
    language: data.language || 'pt-BR',
    content: {
      text: paragraphsText.join('\n\n'),
      paragraphs: paragraphs
    },
    audio: {},
    coverEmoji: '📖',
    coverColor: '#2563EB',
    value: value,
    mission: {
      title: 'Missão do Trabalho Bem Feito',
      description: `Hoje, faça uma tarefa de casa com todo o capricho e dedicação, assim como ${child} fez!`,
      duration: '5 minutos'
    },
    reflection: {
      question: `Como a dedicação e o trabalho bem feito trazem paz para a nossa família?`
    },
    isInteractive: false,
    isAIGenerated: true,
    isPremium: false,
    rating: 5,
    reviewCount: 1,
    viewCount: 1,
    createdAt: new Date() as any,
    publishedAt: new Date() as any
  };
};

export async function generateStoryWithGemini(
  data: GenerateStoryRequest
): Promise<GeneratedStory> {
  const prompt = `${SYSTEM_PROMPT_STORY}\n\n${buildStoryUserPrompt(data)}`;

  const modelsToTry = [
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Tentando gerar história com o modelo: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          ...defaultGenerationConfig,
          maxOutputTokens: 8192,
        },
        safetySettings: defaultSafetySettings,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(clean);

      if (parsed.text && parsed.paragraphs && !parsed.content) {
        parsed.content = {
          text: parsed.text,
          paragraphs: parsed.paragraphs
        };
        delete parsed.text;
        delete parsed.paragraphs;
      }

      const story = parsed as GeneratedStory;

      if (!story.title || !story.content?.text || !story.content?.paragraphs || story.content.paragraphs.length < 5) {
        throw new Error(`Resposta incompleta do modelo ${modelName}`);
      }

      // Limpa títulos longos e sufixos incômodos
      story.title = cleanTitleString(story.title);

      console.log(`História gerada com sucesso via ${modelName}! (${story.content.paragraphs.length} páginas)`);
      return story;
    } catch (error: any) {
      console.warn(`Falha ao gerar com ${modelName} (${error.message}). Tentando próximo modelo...`);
    }
  }

  console.error('Todos os modelos do Gemini falharam. Retornando história de fallback completa.');
  return createEmergencyFallbackStory(data);
}
