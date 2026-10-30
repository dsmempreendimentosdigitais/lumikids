import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory server cache for fast subsequent hits
const translationCache = new Map<string, string>();

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English (US)',
  es: 'Spanish (Castilian/Neutral Latin American)',
  fr: 'French',
  it: 'Italian',
  pt: 'Portuguese (Brazil)',
};

// Fallback robusto e gratuito via MyMemory (para quando a cota gratuita do Gemini atingir o limite diário)
async function translateWithFallback(text: string, targetLang: string): Promise<string> {
  const clean = text.trim();
  if (clean.length <= 400) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=pt|${targetLang}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'LumikidsApp/1.0' } });
    if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
    const data = await res.json();
    return data?.responseData?.translatedText || clean;
  }

  // Divide por frases para textos maiores que 400 caracteres
  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
  const translatedSentences: string[] = [];
  for (const s of sentences) {
    const part = s.trim();
    if (!part) continue;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}&langpair=pt|${targetLang}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'LumikidsApp/1.0' } });
    if (res.ok) {
      const data = await res.json();
      translatedSentences.push(data?.responseData?.translatedText || part);
    } else {
      translatedSentences.push(part);
    }
  }
  return translatedSentences.join(' ');
}

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang = 'en', title = '' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto não fornecido' }, { status: 400 });
    }

    if (targetLang === 'pt') {
      return NextResponse.json({ translatedText: text, title });
    }

    const targetLangName = LANGUAGE_NAMES[targetLang] || 'English';
    const cacheKey = `${targetLang}:${text.trim()}`;

    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ translatedText: translationCache.get(cacheKey)! });
    }

    // 1. Tenta traduzir via Gemini 2.5 Flash
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const prompt = `You are a world-class children's book translator and editor.
Translate the following bedtime story text into beautiful, natural, poetic ${targetLangName} appropriate for young children (ages 4 to 10).
Preserve all emotions, warmth, gentle pacing, and virtues. Do not use scary or esoteric words.
Return ONLY the raw translated text, with no preamble, commentary or quotes.

Source text:
"${text}"`;

        const result = await model.generateContent(prompt);
        const translatedText = result.response.text().trim();
        if (translatedText) {
          translationCache.set(cacheKey, translatedText);
          return NextResponse.json({ translatedText });
        }
      } catch (geminiError: any) {
        console.warn('Gemini translation quota or error, falling back to neural translation memory:', geminiError?.message);
      }
    }

    // 2. Fallback robusto garantido (caso Gemini esteja com cota esgotada ou erro)
    const fallbackText = await translateWithFallback(text, targetLang);
    if (fallbackText) {
      translationCache.set(cacheKey, fallbackText);
      return NextResponse.json({ translatedText: fallbackText });
    }

    return NextResponse.json({ translatedText: text });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Falha na tradução', details: error?.message },
      { status: 500 }
    );
  }
}
