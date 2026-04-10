export interface GenerateStoryRequest {
  childName: string;
  ageGroup: '2-4' | '5-7' | '8-10';
  theme: string;
  emotion: string;
  value?: string;
  character?: string;
  language: 'pt-BR' | 'en-US' | 'es-ES' | 'fr-FR' | 'de-DE' | 'it-IT';
  includeBiblicalValues?: boolean;
}

export interface GeneratedStoryResponse {
  title: string;
  text: string;
  moral: string;
  mission: string;
  reflectionQuestion: string;
}
