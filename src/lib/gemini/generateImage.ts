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

function buildPrompt(
  childName: string, 
  ageGroup: string, 
  storyTitleOrScene: string,
  characterAppearance?: string
): string {
  // Estilo 2D Storybook Vibrante Disney/Pixar Nítido
  const stylePrompt = 'cute vibrant 2D storybook illustration, Disney style, clean lines, colorful digital art, bright lighting, high quality children book art, masterpiece';

  // Sanitiza texto para evitar caracteres especiais que quebrem URLs de imagem
  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180);

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  // Tag de Consistência Visual do Personagem
  const charTag = characterAppearance && characterAppearance.trim() 
    ? `${childName}, cute ${ageGroup} year old child with ${characterAppearance}`
    : `${childName}, cute ${ageGroup} year old child`;

  return [
    `2D children storybook scene`,
    `Character visual appearance: ${charTag}`,
    `Scene action & environment: ${safeScene}`,
    stylePrompt,
    `no watermark, no text, no letters, no words, no ugly artifacts`
  ].join(', ');
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0,
  characterAppearance?: string
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene, characterAppearance);
  
  // A semente baseia-se no NOME + APARÊNCIA da criança para travar a consistência visual em todas as páginas
  const appearanceHash = (characterAppearance || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameHash = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Mantedes o mesmo seed principal para a mesma criança + pequena variação fixa por cena
  const baseSeed = (nameHash * 1000) + appearanceHash;
  const seed = baseSeed + (index * 43);

  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Usamos o modelo FLUX de alta qualidade e rapidez do Pollinations
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
  
  console.log(`[generateImage] FLUX 2D (Página ${index}, Seed ${seed}) gerando URL: ${imageUrl.slice(0, 90)}...`);
  
  return imageUrl;
}
