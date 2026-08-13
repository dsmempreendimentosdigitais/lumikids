import { NextRequest, NextResponse } from 'next/server';
import { generateStoryWithGemini } from '@/lib/gemini/generateStory';
import { generateImageWithNanoBanana } from '@/lib/gemini/generateImage';
import { generateNarrationGoogle } from '@/lib/tts/googleTTS';
import { adminDb, adminStorage } from '@/lib/firebase/admin';
import { checkAndIncrementQuota } from '@/lib/quota';
import { verifyFirebaseToken } from '@/lib/firebase/auth-admin';
import { GenerateStoryRequest } from '@/types/ai';

export async function POST(req: NextRequest) {
  try {
    // 1. Autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await verifyFirebaseToken(token);
    const uid = decoded.uid;

    // 2. Verificar quota do plano
    const quotaOk = await checkAndIncrementQuota(uid);
    if (!quotaOk) {
      return NextResponse.json(
        { error: 'Limite de criações atingido. Faça upgrade do plano.' },
        { status: 429 }
      );
    }

    // 3. Dados do request
    const body: GenerateStoryRequest = await req.json();

    // 3.5 Construir tag de aparência consistente para o gerador de imagem
    const charAppearance = body.characterAppearanceSummary || [
      body.gender ? (body.gender === 'menino' ? 'boy' : 'girl') : '',
      body.skinTone ? `${body.skinTone} skin` : '',
      body.hairColor && body.hairStyle ? `${body.hairStyle} ${body.hairColor} hair` : body.hairColor ? `${body.hairColor} hair` : '',
      body.topClothing ? `wearing ${body.topClothing}` : '',
      body.bottomClothing ? `and ${body.bottomClothing}` : '',
      body.accessories ? `with ${body.accessories}` : ''
    ].filter(Boolean).join(', ');

    // 4. Gerar história com Gemini
    const story = await generateStoryWithGemini(body);

    // 4.5 Gerar imagem FLUX para a capa e para cada parágrafo/página
    const imageUrl = await generateImageWithNanoBanana(
      body.childName,
      body.ageGroup,
      story.title,
      0,
      charAppearance
    );
    story.nanoBananaImageUrl = imageUrl;

    if (story.content && Array.isArray(story.content.paragraphs)) {
      const updatedParagraphs = await Promise.all(
        story.content.paragraphs.map(async (p, idx) => {
          const scenePrompt = p.imagePrompt || `${story.title} - cena ${idx + 1}: ${p.text.slice(0, 100)}`;
          const pImageUrl = await generateImageWithNanoBanana(
            body.childName,
            body.ageGroup,
            scenePrompt,
            idx,
            charAppearance
          );
          return {
            ...p,
            imageUrl: pImageUrl
          };
        })
      );
      story.content.paragraphs = updatedParagraphs;
    }

    // 5. Gerar narração com Google Cloud TTS
    const audioBuffer = await generateNarrationGoogle({
      text:     story.content.text,
      language: body.language,
      ageGroup: body.ageGroup,
    });

    // 6. Salvar áudio no Firebase Storage
    const audioPath = `ai-audio/${uid}/${Date.now()}.mp3`;
    const bucket    = adminStorage.bucket();
    const file      = bucket.file(audioPath);
    await file.save(Buffer.from(audioBuffer), { contentType: 'audio/mpeg' });
    await file.makePublic();
    
    // Tornar público se configurado no bucket, ou usar signed URL
    const audioUrl = `https://storage.googleapis.com/${bucket.name}/${audioPath}`;

    // 7. Salvar história no Firestore
    const storyRef = adminDb.collection('stories').doc();
    await storyRef.set({
      ...story,
      id:              storyRef.id,
      category:        'ai-personalizada',
      ageGroups:       [body.ageGroup],
      language:        body.language,
      audio:           { [body.language]: { url: audioUrl, duration: 0, voiceName: '' } },
      nanoBananaImageUrl: imageUrl,
      isAIGenerated:   true,
      generatedForUid: uid,
      isPremium:       false,
      rating:          0,
      reviewCount:     0,
      viewCount:       0,
      createdAt:       new Date(),
      publishedAt:     new Date(),
    });

    return NextResponse.json({ storyId: storyRef.id, story, audioUrl });

  } catch (error: any) {
    console.error('Erro ao gerar história:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
