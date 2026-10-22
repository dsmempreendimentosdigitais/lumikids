import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'Aoede' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave Gemini não configurada' }, { status: 500 });
    }

    // Usar o modelo dedicado de síntese de voz ultra-realista do Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

    const promptText = text.trim();

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: promptText }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voice // 'Aoede' (narradora calorosa), 'Kore', 'Puck', 'Charon'
              }
            }
          }
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini TTS error:', response.status, errText);
      return NextResponse.json({ error: 'Erro ao sintetizar áudio com IA' }, { status: 502 });
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const part = candidate?.content?.parts?.[0];

    if (!part?.inlineData?.data) {
      return NextResponse.json({ error: 'Nenhum áudio retornado pelo modelo' }, { status: 500 });
    }

    // O modelo retorna PCM bruto 24kHz 16-bit codificado em Base64
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
  } catch (error: any) {
    console.error('Narrate API error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno de narração' }, { status: 500 });
  }
}
