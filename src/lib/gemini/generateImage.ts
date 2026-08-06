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
  // Estilo cartoon 2D inspirado em quadrinhos infantis (cel-shaded, cores limpas, contornos bem definidos)
  const stylePrompt = 'Cute 2D vector cartoon style, comic book panel illustration, bold outlines, flat colors, children storybook art, friendly and expressive characters, warm and vibrant lighting, highly clean, vector graphic look';

  const rawScene = storyTitleOrScene.replace(/[^\w\sÀ-ÿ,.()\-]/g, ' ').trim();
  const safeScene = sanitizeSceneForChild(childName, rawScene);

  const fullPrompt = [
    `Children's comic book illustration panel`,
    `Main character: ${childName}, a cute ${ageGroup}-year-old Brazilian child`,
    `Action in this scene: ${safeScene}`,
    stylePrompt,
    `Child-safe, family-friendly, warm and inviting atmosphere`,
    `No text, no letters, no words, no watermark, no speech bubbles, no talk bubbles anywhere in the image`,
  ].join('. ');

  return fullPrompt.replace(/\s+/g, ' ').trim();
}

export async function generateImageWithNanoBanana(
  childName: string,
  ageGroup: string,
  storyTitleOrScene: string,
  index: number = 0
): Promise<string> {
  const cleanPrompt = buildPrompt(childName, ageGroup, storyTitleOrScene);
  
  // Usamos Pollinations AI para geração gratuita, super rápida e sem necessidade de SDK/Keys.
  // Criamos uma 'seed' baseada no nome da criança para tentar manter alguma consistência na mesma história.
  const seed = Array.from(childName).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Formatamos a URL direta da imagem
  const encodedPrompt = encodeURIComponent(cleanPrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
  
  console.log(`[generateImage] Pollinations AI gerando via URL direta (Página ${index})...`);
  
  // Retornamos a URL diretamente! O Next.js/Navegador vai baixar a imagem no momento da renderização.
  // Como o modelo Flux da Pollinations gera a imagem sob demanda via GET, é instantâneo na nossa API.
  return imageUrl;
}
