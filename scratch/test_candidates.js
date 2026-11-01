const fs = require('fs');

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let apiKey = '';
envConfig.split('\n').forEach(line => {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/['"]/g, '');
  }
});

const candidates = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-3.7-flash',
  'gemma-4-26b-a4b-it',
  'gemma-4-31b-it',
  'gemini-4-argon'
];

async function testCandidates() {
  for (const m of candidates) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Responda apenas OK' }] }] })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[${m}] SUCCESS:`, data.candidates?.[0]?.content?.parts?.[0]?.text);
      } else {
        console.log(`[${m}] FAIL (${res.status}):`, data.error?.message?.slice(0, 150));
      }
    } catch (e) {
      console.log(`[${m}] ERROR:`, e.message);
    }
  }
}

testCandidates();
