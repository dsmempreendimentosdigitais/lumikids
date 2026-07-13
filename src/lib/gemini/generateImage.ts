/**
 * Módulo de Geração de Imagens - LumiKids
 * 
 * Prioridade:
 *  1. Flora.ai (SDK @flora-ai/flora — client.generations.create) — PRINCIPAL
 *  2. Pollinations FLUX                                          — FALLBACK
 *
 * GEMINI (Nano Banana) está PAUSADO: cota gratuita = 0 neste modelo.
 */

import Flora from '@flora-ai/flora';

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

  // ============================================================
  // FLORA.AI — API oficial via SDK @flora-ai/flora
  // ============================================================
  if (!FLORA_AI_API_KEY) {
    throw new Error('FLORA_AI_API_KEY não está configurada no .env.local');
  }

  try {
    console.log(`[generateImage] Flora.ai SDK gerando (Página ${index})...`);

    const client = new Flora({ apiKey: FLORA_AI_API_KEY });

    // 1. Busca workspace
    const workspacesRes = await client.workspaces.list();
    const workspaceId = workspacesRes?.workspaces?.[0]?.workspace_id;
    if (!workspaceId) throw new Error('Nenhum workspace encontrado na conta Flora.ai');

    // 2. Busca ou cria projeto no workspace
    const projectsPage: any = await client.projects.list({ workspace_id: workspaceId });
    const projectList = projectsPage?.data || projectsPage?.items || projectsPage?.projects || [];
    let projectId = projectList[0]?.project_id;

    if (!projectId) {
      console.log(`[generateImage] Nenhum projeto encontrado no workspace. Criando projeto 'LumiKids Stories'...`);
      const newProj = await client.projects.create({
        name: 'LumiKids Stories',
        workspace_id: workspaceId
      });
      projectId = newProj.project_id;
    }

    if (!projectId) throw new Error('Não foi possível obter ou criar um project_id no Flora.ai');

    // 3. Inicia geração de imagem (assíncrona — retorna run_id)
    const generation = await client.generations.create({
      workspace_id: workspaceId,
      project_id: projectId,
      type: 'image',
      prompt: cleanPrompt,
    });

    const runId = generation.run_id || (generation as any).id;
    if (!runId) throw new Error('Flora.ai não retornou um run_id');

    console.log(`[generateImage] Flora.ai run iniciado: ${runId} (Página ${index})`);

    // 4. Polling até completar (timeout: 90s)
    for (let attempt = 0; attempt < 45; attempt++) {
      await new Promise(r => setTimeout(r, 2000));

      const result = await client.generations.retrieve(runId);
      const status = result.status as string;

      if (status === 'completed' || status === 'succeeded') {
        const outputs = result.outputs;
        const outputUrl = outputs?.[0]?.url || (result as any).output_url;

        if (outputUrl) {
          console.log(`[generateImage] Flora.ai ✅ Página ${index}: ${outputUrl}`);
          return outputUrl;
        }
        throw new Error('Flora.ai: geração concluída mas sem URL de saída');
      }

      if (status === 'failed' || status === 'error' || status === 'cancelled') {
        throw new Error(`Flora.ai run ${runId} falhou: ${result.error_message || status}`);
      }

      if (attempt % 5 === 0) {
        console.log(`[generateImage] Flora.ai aguardando... status=${status} (tentativa ${attempt + 1}/45)`);
      }
    }

    throw new Error('Flora.ai timeout: 90s excedidos sem resultado');

  } catch (floraErr: any) {
    console.error(`[generateImage] Flora.ai falhou (página ${index}):`, floraErr.message || floraErr);
    throw floraErr;
  }
}
