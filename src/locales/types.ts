export type SupportedLanguage = 'pt' | 'en' | 'es' | 'fr' | 'it';

export interface LanguageOption {
  code: SupportedLanguage;
  locale: string;
  name: string;
  flag: string;
  label: string;
}

export interface TranslationDictionary {
  // Navigation & BottomBar
  nav_home: string;
  nav_explore: string;
  nav_library: string;
  nav_profile: string;
  nav_create: string;

  // Header & Greetings
  greeting_good_night: string;
  greeting_what_read_today: string;
  age_2_4: string;
  age_5_7: string;
  age_8_10: string;

  // Journey Map & Trails
  portal_passage: string;
  trophies_earned: string;
  stars_collected: string;
  explorer_gems: string;
  my_album_progress: string;
  map_settings: string;
  manage_stories: string;
  save_and_close: string;

  // Trails
  trail_biblia_kids: string;
  trail_mitologia_grega: string;
  trail_fabulas_globais: string;
  trail_natureza_animais: string;
  trail_ciencia_espaco: string;
  trail_herois_virtuosos: string;
  trail_sono_tranquilo: string;
  trail_emocoes_sociais: string;

  // Reader Controls
  reader_page: string;
  reader_of: string;
  reader_listen: string;
  reader_listening: string;
  reader_pause: string;
  reader_prev_page: string;
  reader_next_page: string;
  reader_settings: string;
  reader_sound_effects: string;
  reader_sound_effects_desc: string;
  reader_audio_narration: string;
  reader_audio_narration_desc: string;
  reader_language: string;
  reader_language_desc: string;
  reader_finish: string;
  reader_opening_book: string;

  // Settings & Profile
  settings_title: string;
  settings_account: string;
  settings_my_plan: string;
  settings_plan_free: string;
  settings_upgrade: string;
  settings_install_pwa: string;
  settings_install_pwa_desc: string;
  settings_language: string;
  settings_language_desc: string;
  settings_logout: string;
  settings_sound_on: string;
  settings_sound_off: string;

  // Interactive Quiz
  quiz_title: string;
  quiz_subtitle: string;
  quiz_question: string;
  quiz_check_answer: string;
  quiz_correct: string;
  quiz_try_again: string;
  quiz_score: string;
  quiz_next: string;
}
