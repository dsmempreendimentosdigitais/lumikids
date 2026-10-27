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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave Gemini não configurada' }, { status: 500 });
    }

    // Usar Gemini Flash para tradução rápida e de alta sensibilidade para livros infantis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a world-class children's book translator and editor.
Translate the following bedtime story text into beautiful, natural, poetic ${targetLangName} appropriate for young children (ages 4 to 10).
Preserve all emotions, warmth, gentle pacing, and virtues. Do not use scary or esoteric words.
Return ONLY the raw translated text, with no preamble, commentary or quotes.

Source text:
"${text}"`;

    const result = await model.generateContent(prompt);
    const translatedText = result.response.text().trim();

    translationCache.set(cacheKey, translatedText);

    return NextResponse.json({ translatedText });
  } catch (error: any) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Falha na tradução', details: error?.message },
      { status: 500 }
    );
  }
}
