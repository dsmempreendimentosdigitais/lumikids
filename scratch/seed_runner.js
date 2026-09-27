const fs = require('fs');
const path = require('path');

// Carrega .env.local manualmente
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.replace(/\\n/g, '\n');
    }
  });
}

const admin = require('firebase-admin');

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
  admin.firestore().settings({ ignoreUndefinedProperties: true });
}

const db = admin.firestore();

// Pega dados das 55 histórias
const seedData = require('./knowledge_data.js');

async function seed() {
  console.log(`[Seed Script] Povoando ${seedData.length} histórias no Firestore...`);
  const storiesRef = db.collection('stories');

  let createdCount = 0;
  let skippedCount = 0;

  for (const rawStory of seedData) {
    const existingSnap = await storiesRef.where('title', '==', rawStory.title).get();
    if (!existingSnap.empty) {
      console.log(`[Seed] "${rawStory.title}" já existe no Firestore. Pulando.`);
      skippedCount++;
      continue;
    }

    const docRef = storiesRef.doc();
    const isFlagship = rawStory.title.includes('Hércules');

    const formattedParagraphs = rawStory.paragraphs.map((p, idx) => ({
      index: idx,
      text: p.text,
      startTime: idx * 5000,
      endTime: (idx + 1) * 5000,
      isHighlight: idx % 2 === 1,
      imagePrompt: p.imagePrompt
    }));

    const storyPayload = {
      id: docRef.id,
      title: rawStory.title,
      slug: rawStory.title.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      category: rawStory.category,
      ageGroups: rawStory.ageGroups,
      durationMinutes: 5,
      language: 'pt-BR',
      content: {
        text: rawStory.paragraphs.map(p => p.text).join('\n\n'),
        paragraphs: formattedParagraphs
      },
      audio: {},
      coverEmoji: rawStory.coverEmoji,
      coverColor: rawStory.coverColor,
      value: rawStory.value,
      mission: {
        title: rawStory.missionTitle,
        description: rawStory.missionDesc,
        duration: '5 minutos'
      },
      reflection: {
        question: rawStory.reflectionQuestion
      },
      isInteractive: false,
      isAIGenerated: false,
      isPremium: false,
      rating: 5,
      reviewCount: 1,
      viewCount: 1,
      createdAt: new Date(),
      publishedAt: new Date()
    };

    await docRef.set(storyPayload);
    createdCount++;
    console.log(`[Seed] ✅ (${createdCount}/${seedData.length}) História criada: "${rawStory.title}" (ID: ${docRef.id})`);
  }

  console.log(`\n🎉 Finalizado! ${createdCount} histórias criadas com sucesso no Firestore. ${skippedCount} já existiam.`);
}

seed().then(() => process.exit(0)).catch(err => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
