const fs = require('fs');
const path = require('path');

const envPath = path.resolve('.env.local');
const envConfig = fs.readFileSync(envPath, 'utf-8');
let apiKey = '';
envConfig.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed.startsWith('GEMINI_API_KEY=')) {
    apiKey = trimmed.split('=')[1].replace(/['"]/g, '').trim();
  }
});

async function testGemini() {
  const prompt = `Gere uma versão completa, rica em detalhes e profunda da história clássica "A Tartaruga e a Lebre".
A história deve ter entre 16 e 20 cenas detalhadas.
Cada cena deve ter um texto envolvente, poético e acolhedor (3 a 5 frases ricas, com diálogos vívidos, descrições da natureza, reações dos animais e lições de sabedoria moral).
Formato de retorno obrigatório em JSON:
{
  "scenes": [
    {
      "text": "Texto completo e descritivo da cena...",
      "imagePrompt": "Detailed 2D storybook illustration prompt..."
    }
  ]
}`;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    })
  });

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(rawText);
  console.log('Scenes count:', parsed.scenes?.length);
  const totalWords = parsed.scenes.map(s => s.text).join(' ').split(/\s+/).length;
  console.log('Total words:', totalWords);
  console.log('Average words per scene:', Math.round(totalWords / parsed.scenes.length));
  console.log('Sample scene 1:\n', parsed.scenes[0]);
  console.log('Sample scene 2:\n', parsed.scenes[1]);
}
testGemini().catch(console.error);
