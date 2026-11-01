const fs = require('fs');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const getVal = (k) => {
  const l = lines.find(x => x.startsWith(k + '='));
  return l ? l.replace(k + '=', '').trim().replace(/^['"]|['"]$/g, '') : '';
};

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: getVal('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      clientEmail: getVal('FIREBASE_CLIENT_EMAIL'),
      privateKey: getVal('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();
const genAI = new GoogleGenerativeAI(getVal('GEMINI_API_KEY'));

const TARGET_LANGS = [
  { code: 'en', name: 'English (US)' },
  { code: 'es', name: 'Spanish (Latin America/Castilian neutral)' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
];

async function translateStoryWithGemini(storyData, targetCode, targetName) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const paragraphs = (storyData.content?.paragraphs || []).map(p => p.text);
  const input = {
    title: storyData.title,
    description: storyData.description || storyData.title,
    paragraphs
  };

  const prompt = `You are a world-class children's bedtime story author and translator.
Translate the following story from Portuguese into natural, warm, poetic, and soothing ${targetName} appropriate for young children (ages 4-10).
Preserve gentle cadence, virtues, warmth, and exact sentence meanings. Never use esoteric, scary, or complex vocabulary.

Return valid JSON in this exact structure:
{
  "title": "translated title",
  "description": "translated description",
  "paragraphs": ["translated paragraph 1", "translated paragraph 2", ...]
}

Source story:
${JSON.stringify(input, null, 2)}`;

  const res = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  });

  const parsed = JSON.parse(res.response.text());
  return parsed;
}

async function run() {
  console.log('Fetching stories from Firestore...');
  const snap = await db.collection('stories').limit(1).get();
  console.log(`Found ${snap.size} stories total.`);

  let processed = 0;
  for (const docSnap of snap.docs) {
    const id = docSnap.id;
    const data = docSnap.data();
    processed++;

    const existingTranslations = data.translations || {};
    const neededLangs = TARGET_LANGS.filter(l => !existingTranslations[l.code]);

    if (neededLangs.length === 0) {
      console.log(`[${processed}/${snap.size}] Story "${data.title}" already fully translated.`);
      continue;
    }

    console.log(`[${processed}/${snap.size}] Translating "${data.title}" (${neededLangs.map(l => l.code).join(', ')})...`);
    const newTranslations = { ...existingTranslations };

    for (const lang of neededLangs) {
      try {
        const translated = await translateStoryWithGemini(data, lang.code, lang.name);
        newTranslations[lang.code] = translated;
        console.log(`  ✓ ${lang.code.toUpperCase()}: "${translated.title}" (${translated.paragraphs?.length} paragraphs)`);
        // Pausa breve para respeitar taxa da API
        await new Promise(r => setTimeout(r, 600));
      } catch (err) {
        console.error(`  ✗ Error translating to ${lang.code}:`, err.message);
      }
    }

    await db.collection('stories').doc(id).update({
      translations: newTranslations,
      updatedAt: new Date()
    });
    console.log(`  💾 Saved translations for "${data.title}" to Firestore!`);
  }

  console.log('\n🎉 All stories pre-translated and saved to database successfully!');
  process.exit(0);
}

run();
