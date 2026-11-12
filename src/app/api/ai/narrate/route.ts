import { NextRequest, NextResponse } from 'next/server';
import { Communicate } from 'edge-tts-universal';

function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitDepth = 16): Buffer {
  const byteRate = sampleRate * numChannels * (bitDepth / 8);
  const blockAlign = numChannels * (bitDepth / 8);
  const wavHeader = Buffer.alloc(44);

  wavHeader.write('RIFF', 0);
  wavHeader.writeUInt32LE(36 + pcmBuffer.length, 4);
  wavHeader.write('WAVE', 8);
  wavHeader.write('fmt ', 12);
  wavHeader.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  wavHeader.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  wavHeader.writeUInt16LE(numChannels, 22);
  wavHeader.writeUInt32LE(sampleRate, 24);
  wavHeader.writeUInt32LE(byteRate, 28);
  wavHeader.writeUInt16LE(blockAlign, 32);
  wavHeader.writeUInt16LE(bitDepth, 34);
  wavHeader.write('data', 36);
  wavHeader.writeUInt32LE(pcmBuffer.length, 40);

  return Buffer.concat([wavHeader, pcmBuffer]);
}

const NEURAL_VOICE_BY_LANG: Record<string, string> = {
  pt: 'pt-BR-FranciscaNeural',
  en: 'en-US-AvaMultilingualNeural',
  es: 'es-ES-ElviraNeural',
  fr: 'fr-FR-DeniseNeural',
  it: 'it-IT-ElsaNeural',
};

async function synthesizeWithEdgeNeural(text: string, lang = 'pt'): Promise<Buffer | null> {
  try {
    const voice = NEURAL_VOICE_BY_LANG[lang] || 'pt-BR-FranciscaNeural';
    const communicate = new Communicate(text, {
      voice,
      rate: '-14%', // Leitura pausada, calma e acolhedora
      pitch: '+1Hz',
      connectionTimeout: 5000,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of communicate.stream()) {
      if (chunk.type === 'audio' && chunk.data) {
        chunks.push(chunk.data);
      }
    }

    if (chunks.length === 0) return null;
    return Buffer.concat(chunks);
  } catch (err) {
    console.warn('Edge Neural TTS fallback warning:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'Aoede', lang = 'pt' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    const cleanText = text.trim();
    const apiKey = process.env.GEMINI_API_KEY;

    // 1. Tentar Gemini 2.5 Flash TTS com direção de voz materna, fluida e leitura pausada suave
    if (apiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

        const directionByLang: Record<string, string> = {
          pt: 'Narre este trecho de livro infantil em português do Brasil com voz humana, materna, muito suave, acolhedora, expressiva e em ritmo de leitura pausada e calma, respeitando cada vírgula e ponto:\n\n',
          en: 'Narrate this children storybook passage in a warm, gentle, maternal, fluid, and unhurried bedtime storytelling voice:\n\n',
          es: 'Narra este pasaje de cuento infantil con una voz humana, maternal, suave, cálida y pausada:\n\n',
          fr: 'Racontez ce passage de conte pour enfants avec une voix maternelle, douce, chaleureuse et posée:\n\n',
          it: 'Narra questo brano di fiaba per bambini con una voce materna, dolce, calda e pacata:\n\n',
        };

        const promptText = `${directionByLang[lang] || directionByLang.pt}${cleanText}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        const response = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }],
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: voice // 'Aoede' (narradora calorosa e maternal)
                  }
                }
              }
            }
          })
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const part = data.candidates?.[0]?.content?.parts?.[0];
          if (part?.inlineData?.data) {
            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);

            return new NextResponse(new Uint8Array(wavBuffer), {
              status: 200,
              headers: {
                'Content-Type': 'audio/wav',
                'Content-Length': wavBuffer.length.toString(),
                'Cache-Control': 'public, max-age=86400, s-maxage=86400',
              }
            });
          }
        } else {
          console.warn('Gemini TTS non-OK status, falling back to Neural TTS:', response.status);
        }
      } catch (geminiErr) {
        console.warn('Gemini TTS failed or timed out, falling back to Neural TTS:', geminiErr);
      }
    }

    // 2. Voz Neural Humanizada FranciscaNeural / Multilíngue com leitura pausada (-14%)
    const mp3Buffer = await synthesizeWithEdgeNeural(cleanText, lang);
    if (mp3Buffer && mp3Buffer.length > 0) {
      return new NextResponse(new Uint8Array(mp3Buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': mp3Buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        }
      });
    }

    return NextResponse.json({ error: 'Não foi possível sintetizar o áudio neural no momento' }, { status: 502 });
  } catch (error: any) {
    console.error('Narrate API error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno de narração' }, { status: 500 });
  }
}
