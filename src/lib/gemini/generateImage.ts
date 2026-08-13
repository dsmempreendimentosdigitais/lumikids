/**
 * Módulo de Geração de Imagens - LumiKids
 * 
 * Prioridade:
 *  1. Flora.ai (SDK @flora-ai/flora — client.generations.create) — PRINCIPAL
 *  2. Pollinations FLUX                                          — FALLBACK
 *
 * GEMINI (Nano Banana) está PAUSADO: cota gratuita = 0 neste modelo.
 */



// Variáveis de ambiente
const FLORA_AI_API_KEY = process.env.FLORA_AI_API_KEY || '';

/**
 * Detecta cenas com veículo e reescreve de forma AFIRMATIVA e segura.
 * Modelos de imagem ignoram negações — melhor descrever positivamente.
 */
function sanitizeSceneForChild(childName: string, scene: string): string {
  const vehicleRiskKeywords = [
    'dirig', 'volante', 'ao volante', 'dirigindo', 'pilotando',
    'steering', 'driving', 'cockpit', 'cabine do piloto',
  ];

  const hasVehicleRisk = vehicleRiskKeywords.some(kw =>
    scene.toLowerCase().includes(kw.toLowerCase())
  );

  if (hasVehicleRisk) {
    return (
      `${childName} seated happily in the backseat of a car, looking out the window with a big smile, ` +
      `holding a stuffed animal toy. A caring adult parent is clearly visible in the front driver seat. ` +
      `View from inside the car, rear passenger perspective, warm sunlight through window`
    );
  }

  return scene;
}

function buildPrompt(childName: string, ageGroup: string, storyTitleOrScene: string): string {
  // Estilo 2D Storybook Vibrante (Mais rápido, nítido e sem falhas)
  const stylePrompt = 'cute vibrant 2D storybook illustration, Disney style, clean lines, colorful digital art, bright lighting, high quality children book';

  // Sanitiza texto para evitar caracteres especiais que quebrem URLs de imagem
  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 160); // Limita o tamanho para URLs leves e rápidas

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  return [
    `2D children storybook scene`,
    `Character: ${childName}, cute ${ageGroup} year old child`,
    `Action: ${safeScene}`,
    stylePrompt,
    `no watermark, no text, no captions`
  ].join(', ');
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene);
  
  // A semente varia baseada no nome da criança E no índice da página para garantir imagens diferentes e consistentes
  const baseSeed = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = baseSeed + (index * 137);
  
  // Formatamos a URL direta da imagem usando o modelo Turbo (SDXL Turbo - Ultra rápido 1-2s e sem falhas)
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=turbo`;
  
  console.log(`[generateImage] 2D Turbo gerando via URL direta (Página ${index})...`);
  
  return imageUrl;
}
