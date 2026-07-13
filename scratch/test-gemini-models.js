const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const key = env.split('GEMINI_API_KEY=')[1].split('\n')[0].trim().replace(/['"]/g, '');
fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key)
  .then(r => r.json())
  .then(d => {
    const ok = d.models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
    console.log(ok.map(m=>m.name).join('\n'));
  })
  .catch(console.error);
