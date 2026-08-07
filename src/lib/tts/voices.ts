// Vozes Google Cloud TTS por idioma e faixa etária
export const TTS_VOICES: Record<string, Record<string, string>> = {
  'pt-BR': {
    '2-4':   'pt-BR-Neural2-C',   // voz feminina suave
    '5-7':   'pt-BR-Neural2-A',   // voz feminina expressiva
    '8-10':  'pt-BR-Neural2-B',   // voz masculina clara
    '11-14': 'pt-BR-Neural2-C',   // voz jovem expressiva
  },
  'en-US': {
    '2-4':   'en-US-Neural2-F',
    '5-7':   'en-US-Neural2-H',
    '8-10':  'en-US-Neural2-D',
    '11-14': 'en-US-Neural2-C',
  },
  'es-ES': {
    '2-4':   'es-ES-Neural2-A',
    '5-7':   'es-ES-Neural2-C',
    '8-10':  'es-ES-Neural2-B',
    '11-14': 'es-ES-Neural2-F',
  },
  'fr-FR': {
    '2-4':   'fr-FR-Neural2-A',
    '5-7':   'fr-FR-Neural2-C',
    '8-10':  'fr-FR-Neural2-B',
    '11-14': 'fr-FR-Neural2-E',
  },
  'de-DE': {
    '2-4':   'de-DE-Neural2-A',
    '5-7':   'de-DE-Neural2-C',
    '8-10':  'de-DE-Neural2-B',
    '11-14': 'de-DE-Neural2-[#]',
  },
  'it-IT': {
    '2-4':   'it-IT-Neural2-A',
    '5-7':   'it-IT-Neural2-C',
    '8-10':  'it-IT-Neural2-B',
    '11-14': 'it-IT-Neural2-A',
  },
};

// Velocidade de fala por faixa etária
export const TTS_SPEAKING_RATE: Record<string, number> = {
  '2-4':   0.80,   // mais devagar para bebês
  '5-7':   0.90,   // ritmo confortável
  '8-10':  1.00,   // normal
  '11-14': 1.00,   // normal
};

// Tom de voz por faixa etária
export const TTS_PITCH: Record<string, number> = {
  '2-4':   2.0,    // mais agudo, lúdico
  '5-7':   1.0,    // neutro
  '8-10':  0.0,    // natural
  '11-14': 0.0,    // natural
};
