/**
 * Módulo de Geração de Imagens - LumiKids
 * 
 * Estilo Visual: Ilustração 2D de Livro Infantil Clássico (Límpido, rico, sem defeitos 3D ou marcas d'água)
 */

const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://lumikids-image-api.lumikidsapp.workers.dev';
const CLOUDFLARE_WORKER_API_KEY = process.env.CLOUDFLARE_WORKER_API_KEY || 'lumikids_segredo_12345';

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
      `holding a toy. A caring parent is clearly visible in the front driver seat. ` +
      `Warm sunlight through window, safe family car trip`
    );
  }

  return scene;
}

export function buildPrompt(
  childName: string, 
  ageGroup: string, 
  storyTitleOrScene: string,
  characterAppearance?: string,
  styleMode: '2d_storybook' | '3d_pixar' = '2d_storybook'
): string {
  const stylePrompt = styleMode === '3d_pixar'
    ? 'High quality 3D digital cartoon render, Pixar animation style, warm glowing sunlight, rich detailed scenery, cute character design, masterpiece'
    : 'Cute 2D children storybook illustration, vibrant digital watercolor painting, flat vector art, bright sunny colors, cheerful fairytale book style, clean lines, clear sky';

  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180);

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  const charTag = characterAppearance && characterAppearance.trim() 
    ? `${childName}, cute animated ${ageGroup} year old child with ${characterAppearance}`
    : `${childName}, cute animated child`;

  return [
    styleMode === '2d_storybook' ? 'Beautiful 2D storybook drawing for kids' : '3D animated scene full of life and color',
    `Scene: ${safeScene}`,
    `Character: ${charTag}`,
    stylePrompt,
    `cheerful background, sunny daylight, no text, no letters, no words, no watermark, no logo`
  ].join(', ');
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0,
  characterAppearance?: string,
  styleMode: '2d_storybook' | '3d_pixar' = '2d_storybook'
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene, characterAppearance, styleMode);
  
  const appearanceHash = (characterAppearance || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameHash = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSeed = (nameHash * 1000) + appearanceHash;
  const seed = baseSeed + (index * 43);

  // TENTATIVA 1: Cloudflare Worker AI Privado (Ultra-rápido, 2D de altíssima qualidade)
  if (CLOUDFLARE_WORKER_URL && CLOUDFLARE_WORKER_API_KEY) {
    try {
      console.log(`[generateImage] Gerando imagem via Cloudflare Worker AI (Página ${index})...`);
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_WORKER_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: cleanPrompt }),
        signal: AbortSignal.timeout(12000)
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
      console.warn(`[generateImage] Worker Cloudflare (${cfErr.message}). Usando Pollinations fallback...`);
    }
  }

  // TENTATIVA 2: Pollinations (Fallback sem nologo=true ou model=flux para evitar HTTP 402)
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}`;
  
  console.log(`[generateImage] Pollinations Fallback (Página ${index}): ${imageUrl.slice(0, 90)}...`);
  return imageUrl;
}

