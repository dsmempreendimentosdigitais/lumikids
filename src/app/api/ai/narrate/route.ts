import { NextRequest, NextResponse } from 'next/server';
import { EdgeTTS } from 'node-edge-tts';
import fs from 'fs';
import os from 'os';
import path from 'path';

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
  let tempFile: string | null = null;
  try {
    const voice = NEURAL_VOICE_BY_LANG[lang] || 'pt-BR-FranciscaNeural';
    const tts = new EdgeTTS({
      voice,
      rate: '-12%', // Leitura materna, suave e acolhedora para hora do sono
      timeout: 7000,
    });

    tempFile = path.join(
      os.tmpdir(),
      `cv_tts_${Date.now()}_${Math.random().toString(36).substring(7)}.mp3`
    );

    await tts.ttsPromise(text, tempFile);

    if (fs.existsSync(tempFile)) {
      const buffer = await fs.promises.readFile(tempFile);
      if (buffer && buffer.length > 100) {
        return buffer;
      }
    }
    return null;
  } catch (err) {
    console.warn('Edge Neural TTS warning:', err);
    return null;
  } finally {
    if (tempFile) {
      fs.promises.unlink(tempFile).catch(() => {});
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { text, lang = 'pt' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    const cleanText = text.trim();

    // 1. Voz Neural Humanizada FranciscaNeural / Multilíngue (alta fidelidade e leitura pausada acolhedora)
    const mp3Buffer = await synthesizeWithEdgeNeural(cleanText, lang);
    if (mp3Buffer && mp3Buffer.length > 0) {
      return new NextResponse(new Uint8Array(mp3Buffer), {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': mp3Buffer.length.toString(),
          'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        },
      });
    }

    return NextResponse.json(
      { error: 'Não foi possível sintetizar o áudio neural no momento' },
      { status: 502 }
    );
  } catch (error: any) {
    console.error('Narrate API error:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno de narração' },
      { status: 500 }
    );
  }
}
