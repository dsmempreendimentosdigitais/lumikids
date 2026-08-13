export interface GenerateStoryRequest {
  childName: string;
  ageGroup: '2-4' | '5-7' | '8-10' | '11-14';
  theme: string;
  emotion: string;
  value?: string;
  character?: string;
  language: 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT';
  includeBiblicalValues?: boolean;
  
  // Opções de Aparência do Personagem para Consistência Visual
  gender?: 'menino' | 'menina';
  hairColor?: string;
  hairStyle?: string;
  skinTone?: string;
  topClothing?: string;
  bottomClothing?: string;
  accessories?: string;
  characterAppearanceSummary?: string;
}

export interface GeneratedStoryResponse {
  title: string;
  text: string;
  moral: string;
  mission: string;
  reflectionQuestion: string;
}
