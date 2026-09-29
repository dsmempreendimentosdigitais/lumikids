import { NextRequest, NextResponse } from 'next/server';
import { generateStoryWithGemini } from '@/lib/gemini/generateStory';
import { generateImageWithNanoBanana } from '@/lib/gemini/generateImage';
import { generateNarrationGoogle } from '@/lib/tts/googleTTS';
import { adminDb, adminStorage } from '@/lib/firebase/admin';
import { verifyFirebaseToken } from '@/lib/firebase/auth-admin';

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
    const name = decoded.name?.split(' ')[0] || 'Samuel';

    // 2. Dados do request (storyId, childName)
    const { storyId, childName } = await req.json();
    if (!storyId) {
      return NextResponse.json({ error: 'storyId é obrigatório' }, { status: 400 });
    }

    // 3. Buscar história no Firestore
    const storyRef = adminDb.collection('stories').doc(storyId);
    const storySnap = await storyRef.get();
    if (!storySnap.exists) {
      return NextResponse.json({ error: 'História não encontrada' }, { status: 404 });
    }

    const story = storySnap.data();

    if (!story) {
      return NextResponse.json({ error: 'História vazia' }, { status: 404 });
    }

    // 4. Validar plano de acesso se for Premium
    if (story.isPremium) {
      const userRef = adminDb.collection('users').doc(uid);
      const userSnap = await userRef.get();
      const user = userSnap.data();
      const plan = user?.plan || 'free';

      const allowedPlans = ['familia', 'familia_plus', 'premium2'];
      if (!allowedPlans.includes(plan)) {
        return NextResponse.json({ error: 'Este é um recurso Premium. Faça upgrade para ler esta história!' }, { status: 403 });
      }
    }

    // Usar o nome do corpo da requisição ou fallback
    const finalChildName = childName ? childName.trim() : name;

    // 5. Se a história JÁ POSSUI conteúdo completo (não é placeholder e tem 4+ páginas), não sobrescreve com fallback!
    if (!story.isPlaceholder && story.content?.paragraphs && story.content.paragraphs.length >= 4) {
      console.log(`[gerar-historia-biblioteca] História "${story.title}" já está completa (${story.content.paragraphs.length} páginas). Retornando diretamente.`);
      return NextResponse.json({ storyId, story });
    }

    // 6. Se for um placeholder inédito, gera a história completa com Gemini
    const requestPayload = {
      childName: finalChildName,
      ageGroup: story.ageGroups?.[0] || '5-7',
      theme: story.theme || story.title,
      emotion: 'Alegria',
      value: story.value || 'Coragem e Sabedoria',
      language: 'pt-BR' as const,
      includeBiblicalValues: true
    };

    const storyGenerated = await generateStoryWithGemini(requestPayload);

    // 7. Gerar Imagem de Capa em estilo 2D Storybook
    const imageUrl = await generateImageWithNanoBanana(
      finalChildName,
      requestPayload.ageGroup,
      storyGenerated.title,
      0,
      undefined,
      '2d_storybook'
    );
    storyGenerated.nanoBananaImageUrl = imageUrl;

    // 8. Gerar Imagem 2D para cada parágrafo
    if (storyGenerated.content && Array.isArray(storyGenerated.content.paragraphs)) {
      const updatedParagraphs = [];
      for (let idx = 0; idx < storyGenerated.content.paragraphs.length; idx++) {
        const p = storyGenerated.content.paragraphs[idx];
        const scenePrompt = p.imagePrompt || `${storyGenerated.title} - cena ${idx + 1}: ${p.text.slice(0, 100)}`;
        const pImageUrl = await generateImageWithNanoBanana(
          finalChildName,
          requestPayload.ageGroup,
          scenePrompt,
          idx,
          undefined,
          '2d_storybook'
        );
        updatedParagraphs.push({
          ...p,
          imageUrl: pImageUrl
        });
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      storyGenerated.content.paragraphs = updatedParagraphs;
    }

    // 9. Gerar Áudio (Opcional - Graceful Fallback)
    let audioUrl = '';
    try {
      const audioBuffer = await generateNarrationGoogle({
        text: storyGenerated.content.text,
        language: 'pt-BR',
        ageGroup: requestPayload.ageGroup,
      });

      if (audioBuffer && audioBuffer.length > 0) {
        const audioPath = `ai-audio/${uid}/${Date.now()}.mp3`;
        const bucket = adminStorage.bucket();
        const file = bucket.file(audioPath);
        await file.save(Buffer.from(audioBuffer), { contentType: 'audio/mpeg' });
        await file.makePublic();
        audioUrl = `https://storage.googleapis.com/${bucket.name}/${audioPath}`;
      }
    } catch (ttsErr: any) {
      console.warn('[gerar-historia-biblioteca] Áudio TTS não gerado (billing opcional):', ttsErr.message);
    }

    // 11. Salvar história atualizada no Firestore
    const updatedStoryData = {
      title: storyGenerated.title,
      content: storyGenerated.content,
      value: storyGenerated.value || story.value || 'Coragem e Sabedoria',
      bibleReference: storyGenerated.bibleReference || story.bibleReference || '',
      mission: storyGenerated.mission || story.mission || null,
      reflection: storyGenerated.reflection || story.reflection || null,
      coverEmoji: storyGenerated.coverEmoji || story.coverEmoji || '📖',
      audio: audioUrl ? { 'pt-BR': { url: audioUrl, duration: 0, voiceName: '' } } : {},
      nanoBananaImageUrl: imageUrl,
      isPlaceholder: false,
      updatedAt: new Date()
    };

    await storyRef.set(updatedStoryData, { merge: true });

    return NextResponse.json({ 
      storyId, 
      story: {
        ...story,
        ...updatedStoryData
      }
    });

  } catch (error: any) {
    console.error('Erro ao gerar história do catálogo:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
