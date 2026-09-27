import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { KNOWLEDGE_STORIES_55 } from '@/lib/knowledgeSeedData';
import { generateImageWithNanoBanana } from '@/lib/gemini/generateImage';

export async function GET(req: NextRequest) {
  return handleSeed();
}

export async function POST(req: NextRequest) {
  return handleSeed();
}

async function handleSeed() {
  try {
    console.log('[Seed] Iniciando povoamento de 55+ histórias nas Trilhas de Conhecimento...');
    const storiesRef = adminDb.collection('stories');

    let createdCount = 0;
    let flagshipStoryId = '';

    for (const rawStory of KNOWLEDGE_STORIES_55) {
      // Verifica se a história já existe pelo título no Firestore para não duplicar
      const existingSnap = await storiesRef.where('title', '==', rawStory.title).get();
      if (!existingSnap.empty) {
        console.log(`[Seed] História "${rawStory.title}" já existe. Pulando...`);
        const existingDoc = existingSnap.docs[0];
        if (rawStory.title.includes('Hércules')) {
          flagshipStoryId = existingDoc.id;
        }
        continue;
      }

      const docRef = storiesRef.doc();
      const isFlagship = rawStory.title.includes('Hércules');

      // Se for a história principal (Hércules), gera imagens de teste para aprovação do usuário!
      let formattedParagraphs = await Promise.all(
        rawStory.paragraphs.map(async (p, idx) => {
          let imageUrl = '';
          if (isFlagship) {
            try {
              console.log(`[Seed] Gerando imagem de alta qualidade para Hércules (Página ${idx + 1})...`);
              imageUrl = await generateImageWithNanoBanana(
                'Hércules',
                '5-7',
                p.imagePrompt,
                idx,
                'Hercules, cute animated 7 year old boy with short brown hair, fair skin, simple Greek tunic'
              );
            } catch (imgErr) {
              console.warn(`[Seed] Erro ao gerar imagem da pág ${idx}:`, imgErr);
            }
          }

          return {
            index: idx,
            text: p.text,
            startTime: idx * 5000,
            endTime: (idx + 1) * 5000,
            isHighlight: idx % 2 === 1,
            imagePrompt: p.imagePrompt,
            imageUrl: imageUrl || undefined
          };
        })
      );

      const coverImageUrl = isFlagship && formattedParagraphs[0]?.imageUrl ? formattedParagraphs[0].imageUrl : undefined;

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
        coverImageUrl: coverImageUrl,
        nanoBananaImageUrl: coverImageUrl,
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
      if (isFlagship) flagshipStoryId = docRef.id;
      console.log(`[Seed] ✅ História criada: "${rawStory.title}" (ID: ${docRef.id})`);
    }

    return NextResponse.json({
      success: true,
      message: `Povoamento concluído com sucesso! ${createdCount} histórias registradas no banco de dados.`,
      flagshipStoryId,
      totalStories: KNOWLEDGE_STORIES_55.length
    });

  } catch (error: any) {
    console.error('[Seed] Erro ao povoar histórias:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
