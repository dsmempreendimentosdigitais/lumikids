const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const gLine = lines.find(l => l.startsWith('GEMINI_API_KEY='));
const apiKey = gLine.replace('GEMINI_API_KEY=', '').trim().replace(/^['"]|['"]$/g, '');

const genAI = new GoogleGenerativeAI(apiKey);

async function testTranslateFullStory() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const storySample = {
    title: "O Pescador Generoso",
    description: "Uma história sobre a alegria de compartilhar o que temos com quem mais precisa.",
    paragraphs: [
      "Era uma vez um velho pescador chamado Bento, que vivia em uma pequena cabana perto do mar calmo.",
      "Todas as manhãs, ele lançava suas redes e agradecia pelo pão de cada dia.",
      "Quando outros pescadores voltavam de mãos vazias, Bento sempre dividia seus peixes com um sorriso acolhedor."
    ]
  };

  const prompt = `You are a professional children's book author and translator.
Translate the following story into natural, poetic, gentle French appropriate for young children (ages 4-10).
Preserve warmth, gentle cadence, and bedtime storytelling tone.

Return valid JSON in this exact structure:
{
  "title": "...",
  "description": "...",
  "paragraphs": ["...", "..."]
}

Source text to translate:
${JSON.stringify(storySample, null, 2)}`;

  const t0 = Date.now();
  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  });
  console.log(`Translated in ${Date.now() - t0}ms:`);
  console.log(res.response.text());
}
testTranslateFullStory();
