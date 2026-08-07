import textToSpeech from '@google-cloud/text-to-speech';
import { TTS_VOICES, TTS_SPEAKING_RATE, TTS_PITCH } from './voices';

const ttsClient = new textToSpeech.TextToSpeechClient({
  credentials: {
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

interface NarrationRequest {
  text:     string;
  language: string;
  ageGroup: '2-4' | '5-7' | '8-10' | '11-14';
}

// Função para limpar markdown e caracteres especiais que deixam a voz robotizada
function sanitizeTextForTTS(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\*+/g, '')             // Remove asteriscos (* e **)
    .replace(/#+/g, '')              // Remove hashtags (#)
    .replace(/_+/g, '')              // Remove underscores (_)
    .replace(/`+/g, '')              // Remove crases/code
    .replace(/\[.*?\]\(.*?\)/g, '')  // Remove links markdown
    .replace(/[-=]{3,}/g, '')        // Remove divisores
    .replace(/\s+/g, ' ')            // Normaliza espacos
    .trim();
}

export async function generateNarrationGoogle(
  req: NarrationRequest
): Promise<Buffer> {
  const cleanText    = sanitizeTextForTTS(req.text);
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

  return Buffer.from(response.audioContent as Uint8Array);
}
