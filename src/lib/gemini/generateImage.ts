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
  // Estilo 2D Storybook Vibrante Disney Nítido, Cheio de Vida e Brilho
  const stylePrompt = 'cute vibrant 2D storybook illustration, Disney style, clean lines, bright joyful lighting, full of life and color, magical glowing sparkles, masterpiece children book illustration';

  // Sanitiza texto para evitar caracteres especiais que quebrem URLs de imagem
  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180);

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  // Tag de Consistência Visual do Personagem acompanhado de familiares, bichinhos ou brinquedos fofos
  const charTag = characterAppearance && characterAppearance.trim() 
    ? `${childName}, cute ${ageGroup} year old child with ${characterAppearance}, happily surrounded by loving family, friendly siblings, plush toys or cute pets`
    : `${childName}, cute ${ageGroup} year old child, happily surrounded by loving family, friendly siblings, plush toys or cute pets`;

  return [
    `2D children storybook scene full of warmth and joy`,
    `Character visual appearance: ${charTag}`,
    `Scene action & environment: ${safeScene}`,
    stylePrompt,
    `cheerful colorful background, bright daylight, no watermark, no text, no letters, no words`
  ].join(', ');
}

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || '';
const CLOUDFLARE_WORKER_API_KEY = process.env.CLOUDFLARE_WORKER_API_KEY || '';

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0,
  characterAppearance?: string
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene, characterAppearance);
  
  // Seed constante baseado no NOME + APARÊNCIA da criança para travar a consistência visual em todas as páginas
  const appearanceHash = (characterAppearance || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameHash = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSeed = (nameHash * 1000) + appearanceHash;
  const seed = baseSeed + (index * 43);

  // TENTATIVA 1: Cloudflare Worker AI Privado (Se configurado)
  if (CLOUDFLARE_WORKER_URL && CLOUDFLARE_WORKER_API_KEY) {
    try {
      console.log(`[generateImage] Tentando Cloudflare Worker AI para página ${index}...`);
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_WORKER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
        signal: AbortSignal.timeout(8000) // Timeout de 8s para não travar
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength > 1000) {
          const base64 = Buffer.from(buffer).toString('base64');
          console.log(`[generateImage] ✨ Sucesso via Cloudflare Worker AI (${buffer.byteLength} bytes)!`);
          return `data:image/jpeg;base64,${base64}`;
        }
      }
    } catch (cfErr: any) {
      console.warn(`[generateImage] Worker Cloudflare falhou/timeout. Usando Fallback Pollinations:`, cfErr.message);
    }
  }

  // TENTATIVA 2 (FALLBACK): Pollinations FLUX 2D
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;
  
  console.log(`[generateImage] Pollinations FLUX 2D (Página ${index}, Seed ${seed}): ${imageUrl.slice(0, 90)}...`);
  
  return imageUrl;
}
