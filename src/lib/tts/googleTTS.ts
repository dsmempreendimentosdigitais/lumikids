import textToSpeech from '@google-cloud/text-to-speech';
import { TTS_VOICES, TTS_SPEAKING_RATE, TTS_PITCH } from './voices';

let ttsClient: any = null;

try {
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    ttsClient = new textToSpeech.TextToSpeechClient({
      credentials: {
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  }
} catch (e) {
  console.warn('[googleTTS] Não foi possível inicializar o cliente Google TTS:', e);
}

interface NarrationRequest {
  text:     string;
  language: string;
  ageGroup: '2-4' | '5-7' | '8-10' | '11-14';
}

function sanitizeTextForTTS(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\*+/g, '')
    .replace(/#+/g, '')
    .replace(/_+/g, '')
    .replace(/`+/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/[-=]{3,}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function generateNarrationGoogle(
  req: NarrationRequest
): Promise<Buffer | null> {
  try {
    if (!ttsClient) {
      console.warn('[googleTTS] Cliente Google TTS não configurado.');
      return null;
    }

    const cleanText    = sanitizeTextForTTS(req.text);
    if (!cleanText) return null;

    const voiceName    = TTS_VOICES[req.language]?.[req.ageGroup] ?? 'pt-BR-Neural2-A';
    const speakingRate = TTS_SPEAKING_RATE[req.ageGroup] ?? 0.90;
    const pitch        = TTS_PITCH[req.ageGroup] ?? 1.0;

    const [response] = await ttsClient.synthesizeSpeech({
      input: { text: cleanText },
      voice: {
        languageCode: req.language,
        name:         voiceName,
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate,
        pitch,
        effectsProfileId: ['headphone-class-device'],
      },
    });

    if (response.audioContent) {
      return Buffer.from(response.audioContent as Uint8Array);
    }
    return null;
  } catch (error: any) {
    console.warn('[googleTTS] Google TTS indisponível ou billing desativado (usando fallback silencioso):', error?.message || error);
    return null;
  }
}
