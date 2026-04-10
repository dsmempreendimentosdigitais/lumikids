import { geminiFlash } from './client';
import { SYSTEM_PROMPT_STORY, buildStoryUserPrompt } from './prompts';
import { GenerateStoryRequest } from '@/types/ai';
import { Story as GeneratedStory } from '@/types/story';

export async function generateStoryWithGemini(
  data: GenerateStoryRequest
): Promise<GeneratedStory> {
  const prompt = `${SYSTEM_PROMPT_STORY}\n\n${buildStoryUserPrompt(data)}`;

  const result = await geminiFlash.generateContent(prompt);
  const text   = result.response.text();

  // Limpar possível markdown residual
  const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const story = JSON.parse(clean) as GeneratedStory;

  // Validação básica
  if (!story.title || !story.content?.text || !story.content?.paragraphs) {
    throw new Error('Resposta do Gemini incompleta');
  }

  return story;
}
