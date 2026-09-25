/**
 * Módulo de Geração de Imagens - LumiKids
 * 
 * Motores Suportados (Gratuitos & Ultra-rápidos):
 *  1. Cloudflare Worker AI (Se configurado no .env)
 *  2. Pollinations FLUX 3D / 2D Storybook (Ultra-estável, gratuito, sem chave API)
 *  3. Fallback inteligente com rotação de sementes e modelos (flux-3d, flux, turbo)
 */

// Variáveis de ambiente para Cloudflare Worker AI (Opcional)
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://lumikids-image-api.lumikidsapp.workers.dev';
const CLOUDFLARE_WORKER_API_KEY = process.env.CLOUDFLARE_WORKER_API_KEY || 'lumikids_segredo_12345';

/**
 * Detecta cenas com veículo e reescreve de forma segura para crianças.
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

export function buildPrompt(
  childName: string, 
  ageGroup: string, 
  storyTitleOrScene: string,
  characterAppearance?: string,
  styleMode: '3d_pixar' | '2d_storybook' = '3d_pixar'
): string {
  // Escolha do estilo visual
  const stylePrompt = styleMode === '2d_storybook'
    ? 'High quality 2D children storybook illustration, vibrant watercolor digital painting, warm cozy lighting, clean outlines, rich colorful background, charming cute character design, magical children book art'
    : '3D Paw Patrol Pixar CGI animation style, 3D digital cartoon render, rich detailed scenery, high contrast, vivid saturated colors, bright sunny daylight, cinematic glowing highlights, crisp clean 3D character design, highly expressive 3D animated character, Octane Render, masterpiece animation';

  // Sanitiza texto para evitar caracteres especiais que quebrem URLs de imagem
  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180);

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  // Tag de Consistência Visual do Personagem
  const charTag = characterAppearance && characterAppearance.trim() 
    ? `${childName}, cute animated ${ageGroup} year old child with ${characterAppearance}, happily surrounded by family, friendly companions, cute pets or toys`
    : `${childName}, cute animated ${ageGroup} year old child, happily surrounded by family, friendly companions, cute pets or toys`;

  return [
    styleMode === '2d_storybook' ? 'Beautiful 2D storybook illustration' : '3D animated Paw Patrol Pixar style scene full of life and color',
    `Character visual appearance: ${charTag}`,
    `Scene action & environment: ${safeScene}`,
    stylePrompt,
    `cheerful vibrant background, clear sky, sunny daylight, no text, no letters, no words, no watermark`
  ].join(', ');
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0,
  characterAppearance?: string
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene, characterAppearance, '3d_pixar');
  
  // Seed constante baseado no NOME + APARÊNCIA da criança para travar a consistência visual em todas as páginas
  const appearanceHash = (characterAppearance || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameHash = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSeed = (nameHash * 1000) + appearanceHash;
  const seed = baseSeed + (index * 43);

  // TENTATIVA 1: Cloudflare Worker AI Privado (Se ativo e responsivo)
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
        signal: AbortSignal.timeout(6000) // Timeout de 6s
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
      console.warn(`[generateImage] Worker Cloudflare offline/timeout (${cfErr.message}). Usando Pollinations FLUX...`);
    }
  }

  // TENTATIVA 2: Pollinations FLUX 3D / 2D (Estável, rápido e gratuito)
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Rotação inteligente de modelo: se o índice for par usa flux-3d, se ímpar usa flux para máxima confiabilidade
  const selectedModel = index % 2 === 0 ? 'flux-3d' : 'flux';
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=${selectedModel}&enhance=false`;
  
  console.log(`[generateImage] Pollinations ${selectedModel} (Página ${index}, Seed ${seed}): ${imageUrl.slice(0, 90)}...`);
  
  return imageUrl;
}
