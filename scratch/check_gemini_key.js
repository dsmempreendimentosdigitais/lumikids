const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const gLine = lines.find(l => l.startsWith('GEMINI_API_KEY='));
const val = gLine.replace('GEMINI_API_KEY=', '').trim().replace(/^['"]|['"]$/g, '');

const genAI = new GoogleGenerativeAI(val);

async function testGen() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const res = await model.generateContent('Diga "olá"');
    console.log('Result:', res.response.text());
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testGen();
