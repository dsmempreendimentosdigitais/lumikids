const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

async function testImage() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const key = env.split('GEMINI_API_KEY=')[1].split('\n')[0].trim().replace(/['"]/g, '');
  const genAI = new GoogleGenerativeAI(key);
  
  const models = ['gemini-3.1-flash-image', 'gemini-2.5-flash-image', 'gemini-3.1-flash-image-preview'];
  for (const m of models) {
    try {
      console.log(`Testing model ${m}...`);
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Um menino de 5 anos brincando na praia');
      console.log(`Success with ${m}:`, res.response.text() ? res.response.text().slice(0, 100) : 'No text');
      return;
    } catch (e) {
      console.log(`Failed with ${m}:`, e.message);
    }
  }

  // Test Pollinations.ai fallback
  const prompt = "A 5 year old boy smiling arriving at the beach, blue sky, disney animation style";
  const url = `https://pollinations.ai/p/${encodeURIComponent(prompt)}?width=800&height=1024&nologo=true`;
  console.log("Fallback URL Pollinations:", url);
}
testImage();

