const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const gLine = lines.find(l => l.startsWith('GEMINI_API_KEY='));
const apiKey = gLine.replace('GEMINI_API_KEY=', '').trim().replace(/^['"]|['"]$/g, '');

const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.5-flash'
];

async function testModels() {
  for (const m of modelsToTest) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Diga "ok"');
      console.log(`✓ ${m}: Success ->`, res.response.text().trim());
    } catch (e) {
      console.log(`✗ ${m}: Failed ->`, e.message.slice(0, 100));
    }
  }
}
testModels();
