const fs = require('fs');
const path = require('path');

const envConfig = fs.readFileSync('.env.local', 'utf-8');
let apiKey = '';
envConfig.split('\n').forEach(line => {
  if (line.startsWith('GEMINI_API_KEY=')) {
    apiKey = line.split('=')[1].trim().replace(/['"]/g, '');
  }
});

async function checkModels() {
  console.log('Testing with API Key:', apiKey.slice(0, 10) + '...');
  
  // List models
  try {
    const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const listData = await listRes.json();
    if (listData.models) {
      console.log('Available models:');
      listData.models
        .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
        .forEach(m => console.log(' -', m.name));
    } else {
      console.log('List models response:', listData);
    }
  } catch (e) {
    console.error('List models error:', e.message);
  }

  // Test simple generation
  const testModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-exp'];
  for (const m of testModels) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: 'Ola mundo' }] }] })
      });
      const data = await res.json();
      console.log(`[${m}] status:`, res.status, data.error ? data.error.message : 'SUCCESS!');
    } catch (e) {
      console.log(`[${m}] error:`, e.message);
    }
  }
}

checkModels();
