import { SupportedLanguage, LanguageOption, TranslationDictionary } from './types';
import { pt } from './pt';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { it } from './it';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'pt', locale: 'pt-BR', name: 'Português', flag: '🇧🇷', label: 'Português (Brasil)' },
  { code: 'en', locale: 'en-US', name: 'English',   flag: '🇺🇸', label: 'English (US)' },
  { code: 'es', locale: 'es-ES', name: 'Español',   flag: '🇪🇸', label: 'Español' },
  { code: 'fr', locale: 'fr-FR', name: 'Français',  flag: '🇫🇷', label: 'Français' },
  { code: 'it', locale: 'it-IT', name: 'Italiano',  flag: '🇮🇹', label: 'Italiano' },
];

export const TRANSLATIONS: Record<SupportedLanguage, TranslationDictionary> = {
  pt,
  en,
  es,
  fr,
  it,
};

export * from './types';
