const fs = require('fs');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const gLine = lines.find(l => l.startsWith('GEMINI_API_KEY='));
const apiKey = gLine.replace('GEMINI_API_KEY=', '').trim().replace(/^['"]|['"]$/g, '');

async function testTTS() {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Era uma vez uma estrelinha' }] }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Aoede' }
          }
        }
      }
    })
  });
  console.log('Status:', res.status);
  const data = await res.text();
  console.log('Response:', data);
}
testTTS();
