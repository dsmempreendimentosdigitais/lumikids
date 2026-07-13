import { genAI, defaultGenerationConfig, defaultSafetySettings } from './client';
import { SYSTEM_PROMPT_STORY, buildStoryUserPrompt } from './prompts';
import { GenerateStoryRequest } from '@/types/ai';
import { Story as GeneratedStory } from '@/types/story';

const createEmergencyFallbackStory = (data: GenerateStoryRequest): GeneratedStory => {
  const child = data.childName || 'Aventureiro';
  const theme = data.theme || 'Uma aventura mágica na praia';
  const value = data.value || 'Gratidão e Amor';
  
  return {
    id: '',
    title: `A Grande Aventura de ${child}: ${theme}`,
    slug: `aventura-de-${child.toLowerCase()}`,
    category: 'ai-personalizada',
    ageGroups: [data.ageGroup as any],
    durationMinutes: 5,
    language: data.language || 'pt-BR',
    content: {
      text: `${child} estava com muita alegria no coração para viver uma grande aventura sobre ${theme}.\n\nOlhando para o céu azul, ${child} sentiu que o dia seria muito especial e cheio de aprendizados.\n\nCom muito carinho, aprendeu sobre a importância de ${value} e de sempre agradecer a Deus por tudo de bom.\n\nFoi um dia inesquecível e feliz para toda a família!`,
      paragraphs: [
        {
          index: 0,
          text: `${child} estava com muita alegria no coração para viver uma grande aventura sobre ${theme}. Olhando para o céu azul, sentiu que o dia seria muito especial.`,
          imagePrompt: `O personagem ${child} vivendo uma grande aventura sobre ${theme}, dia ensolarado lindo, céu azul, estilo animação infantil mágica`,
          isHighlight: false,
          startTime: 0,
          endTime: 5000
        },
        {
          index: 1,
          text: `Com muito carinho, aprendeu sobre a importância de ${value} e de sempre agradecer a Deus por tudo de bom. Foi um dia inesquecível e feliz para toda a família!`,
          imagePrompt: `O personagem ${child} feliz em família, agradecendo a Deus, momento especial e caloroso, estilo animação infantil mágica`,
          isHighlight: true,
          startTime: 5000,
          endTime: 10000
        }
      ]
    },
    audio: {},
    coverEmoji: '🌟',
    coverColor: '#3D5AFE',
    value: value,
    mission: {
      title: 'Missão da Gratidão',
      description: `Hoje, dê um abraço bem apertado em sua família e diga pelo que você é grato sobre ${value}!`,
      duration: '5 minutos'
    },
    reflection: {
      question: `Como podemos praticar ${value} no nosso dia a dia, assim como ${child} fez?`
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

  // Lista robusta de modelos para failover automático em caso de 503 (High Demand) ou 429
  const modelsToTry = [
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-latest',
    'gemini-2.5-pro'
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Tentando gerar história com o modelo: ${modelName}...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: defaultGenerationConfig,
        safetySettings: defaultSafetySettings,
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Limpar possível markdown residual
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

      if (!story.title || !story.content?.text || !story.content?.paragraphs) {
        throw new Error(`Resposta incompleta do modelo ${modelName}`);
      }

      console.log(`História gerada com sucesso via ${modelName}!`);
      return story;
    } catch (error: any) {
      console.warn(`Falha ao gerar com ${modelName} (${error.message}). Tentando próximo modelo...`);
    }
  }

  console.error('Todos os modelos do Gemini falharam (provável instabilidade geral/503). Retornando história de fallback de emergência garantida.');
  return createEmergencyFallbackStory(data);
}

