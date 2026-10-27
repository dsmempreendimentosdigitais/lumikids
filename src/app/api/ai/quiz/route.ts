import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// In-memory cache for fast repeated quizzes
const quizCache = new Map<string, any>();

export async function POST(req: NextRequest) {
  try {
    const { 
      storyTitle, 
      storyCategory, 
      storyValue, 
      storySummary = '', 
      ageGroup = '6-8', 
      language = 'pt' 
    } = await req.json();

    if (!storyTitle) {
      return NextResponse.json({ error: 'Título da história não fornecido' }, { status: 400 });
    }

    const cacheKey = `${storyTitle}:${ageGroup}:${language}`;
    if (quizCache.has(cacheKey)) {
      return NextResponse.json({ quiz: quizCache.get(cacheKey) });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chave Gemini não configurada' }, { status: 500 });
    }

    const langNameMap: Record<string, string> = {
      pt: 'Portuguese (Brazil)',
      en: 'English (US)',
      es: 'Spanish',
      fr: 'French',
      it: 'Italian',
    };
    const targetLangName = langNameMap[language] || 'Portuguese';

    const ageDescMap: Record<string, string> = {
      '3-5': 'ages 3 to 5 (simple visual, character identification, animal, color, or simple feelings)',
      '6-8': 'ages 6 to 8 (plot events, actions, cause and effect, virtues)',
      '9-12': 'ages 9 to 12 (moral lessons, character motivations, deeper meaning and real-life reflection)',
    };
    const ageDesc = ageDescMap[ageGroup] || ageDescMap['6-8'];

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const prompt = `You are an expert child educator and storyteller.
Create an interactive 3-question reading comprehension quiz for children aged ${ageDesc} based on the story:
Title: "${storyTitle}"
Theme / Value: "${storyValue || 'Virtudes'}"
Context: "${storySummary || storyTitle}"

Target Language: ${targetLangName}

REQUIREMENTS:
1. Exactly 3 multiple-choice questions.
2. Each question MUST have exactly 3 options.
3. Only 1 option is correct. The other 2 options must be plausible and gentle (never scary, violent, or punishing).
4. For ages 3-5, keep sentences very short and direct.
5. Return ONLY a valid JSON object matching this schema:
{
  "questions": [
    {
      "id": 1,
      "question": "Question text here in ${targetLangName}",
      "options": [
        "Option A",
        "Option B",
        "Option C"
      ],
      "correctIndex": 0,
      "encouragement": "Short encouraging sentence in ${targetLangName}"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const data = JSON.parse(text);

    if (data && Array.isArray(data.questions) && data.questions.length === 3) {
      quizCache.set(cacheKey, data.questions);
      return NextResponse.json({ quiz: data.questions });
    }

    return NextResponse.json({ quiz: data.questions || [] });
  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json({ error: 'Falha ao gerar quiz', details: error?.message }, { status: 500 });
  }
}
