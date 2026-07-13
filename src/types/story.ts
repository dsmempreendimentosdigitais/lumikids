import { Timestamp } from 'firebase/firestore';

export interface Story {
  id: string;
  title: string;
  slug: string;
  category:
    | 'vida-de-jesus'     | 'biblia-kids'
    | 'hora-de-dormir'    | 'sentimentos'
    | 'mulheres-fortes'   | 'inventores-genios'
    | 'classicos-infantis'| 'paises-culturas'
    | 'bebes-2-4'         | 'mitologia-grega'
    | 'budismo-hinduismo' | 'ai-personalizada';
  ageGroups: ('2-4' | '5-7' | '8-10')[];
  durationMinutes: number;
  language: string;
  content: {
    text: string;
    paragraphs: {
      index: number;
      text: string;
      startTime: number;    // ms — para karaokê
      endTime: number;      // ms
      isHighlight: boolean;
      imagePrompt?: string;
      imageUrl?: string;
    }[];
  };
  audio: {
    [language: string]: {
      url: string;          // Firebase Storage URL
      duration: number;
      voiceName: string;    // voz Google TTS usada
    };
  };
  coverEmoji: string;
  coverColor: string;
  coverImageUrl?: string;
  nanoBananaImageUrl?: string;
  value: string;
  bibleReference?: string;
  mission: {
    title: string;
    description: string;
    duration: string;
  };
  reflection: { question: string; };
  isInteractive: boolean;
  choices?: {
    id: string;
    text: string;
    nextChapterId: string;
    value?: string;
  }[];
  isAIGenerated: boolean;
  generatedForUid?: string;
  isPremium: boolean;
  rating: number;
  reviewCount: number;
  viewCount: number;
  createdAt: Timestamp;
  publishedAt: Timestamp;
}
