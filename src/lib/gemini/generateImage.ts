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
    ? 'High quality 3D digital cartoon render, Pixar Disney animation style, warm glowing sunlight, rich detailed scenery, cute character design, Octane render, masterpiece animation'
    : 'Masterpiece 2D children storybook illustration, vibrant digital watercolor painting, warm cozy lighting, clean crisp lineart, rich colorful background, charming fairytale book art, highly detailed, beautiful classic children book aesthetic';

  const rawScene = storyTitleOrScene
    .replace(/[*_#~`"']/g, '')
    .replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ')
    .trim()
    .slice(0, 180);

  const safeScene = sanitizeSceneForChild(childName, rawScene);

  const charTag = characterAppearance && characterAppearance.trim() 
    ? `${childName}, cute animated ${ageGroup} year old child with ${characterAppearance}`
    : `${childName}, cute animated ${ageGroup} year old child`;

  return [
    styleMode === '2d_storybook' ? 'Beautiful 2D storybook illustration' : '3D animated scene full of life and color',
    `Character visual appearance: ${charTag}`,
    `Scene action & environment: ${safeScene}`,
    stylePrompt,
    `cheerful vibrant background, sunny daylight, no text, no letters, no words, no watermark, no logo, clean framing`
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
  
  // Seed constante baseado no NOME + APARÊNCIA da criança para travar a consistência visual em todas as páginas
  const appearanceHash = (characterAppearance || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const nameHash = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseSeed = (nameHash * 1000) + appearanceHash;
  const seed = baseSeed + (index * 43);

  // TENTATIVA 1: Cloudflare Worker AI Privado (Se ativo)
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
        signal: AbortSignal.timeout(6000)
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
      console.warn(`[generateImage] Worker Cloudflare offline/timeout (${cfErr.message}). Usando Pollinations...`);
    }
  }

  // TENTATIVA 2: Pollinations FLUX (2D Storybook de alta qualidade, sem marcas d'água)
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  
  // Usar model=flux (ou model=turbo) para garantir ilustrações 2D perfeitas sem artefatos 3D
  const selectedModel = 'flux';
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}&model=${selectedModel}&enhance=false`;
  
  console.log(`[generateImage] Pollinations ${selectedModel} (Página ${index}, Seed ${seed}): ${imageUrl.slice(0, 90)}...`);
  
  return imageUrl;
}
