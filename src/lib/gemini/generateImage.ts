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
  // Estilo 3D Pixar / Patrulha Canina
  const stylePrompt = '3D Pixar render, Paw Patrol style, vibrant lighting, highly detailed, cute cartoon, vivid colors';

  // Sanitiza texto para evitar caracteres especiais que quebrem URLs de imagem
  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180); // Limita o tamanho para evitar URLs gigantes

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  return [
    `3D children storybook scene`,
    `Character: ${childName}, cute ${ageGroup} year old child`,
    `Scene: ${safeScene}`,
    stylePrompt,
    `no text, no watermark, no speech bubbles`
  ].join(', ');
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene);
  
  // A semente varia baseada no nome da criança E no índice da página para garantir imagens diferentes!
  const baseSeed = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seed = baseSeed + (index * 137); // Multiplicador para espalhar a semente
  
  // Formatamos a URL direta da imagem
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
  
  console.log(`[generateImage] Pollinations AI gerando via URL direta (Página ${index})...`);
  
  // Retornamos a URL diretamente! O Next.js/Navegador vai baixar a imagem no momento da renderização.
  // Como o modelo Flux da Pollinations gera a imagem sob demanda via GET, é instantâneo na nossa API.
  return imageUrl;
}
