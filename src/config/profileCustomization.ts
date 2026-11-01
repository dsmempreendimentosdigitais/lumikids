export interface AvatarOption {
  id: string;
  name: string;
  category: 'animais' | 'herois' | 'aventura' | 'classicos';
  svg: string;
}

export interface CoverOption {
  id: string;
  name: string;
  gradient: string;
  icon: string;
  pattern: string;
}

// Avatares SVG limpos, vetoriais, leves e amigáveis para crianças
export const AVATAR_OPTIONS: AvatarOption[] = [
  // ═══ ANIMAIS SÁBIOS DAS FÁBULAS ═══
  {
    id: 'lion',
    name: 'Leãozinho Corajoso',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FDE68A"/>
      <!-- Juba -->
      <circle cx="50" cy="50" r="38" fill="#F59E0B"/>
      <!-- Orelhas -->
      <circle cx="28" cy="28" r="10" fill="#F59E0B"/>
      <circle cx="28" cy="28" r="6" fill="#FCD34D"/>
      <circle cx="72" cy="28" r="10" fill="#F59E0B"/>
      <circle cx="72" cy="28" r="6" fill="#FCD34D"/>
      <!-- Rosto -->
      <circle cx="50" cy="52" r="28" fill="#FEF3C7"/>
      <!-- Olhos felizes -->
      <circle cx="41" cy="48" r="3.5" fill="#1F2937"/>
      <circle cx="42" cy="46.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="59" cy="48" r="3.5" fill="#1F2937"/>
      <circle cx="60" cy="46.5" r="1.2" fill="#FFFFFF"/>
      <!-- Focinho e bochechas -->
      <ellipse cx="50" cy="56" rx="4" ry="3" fill="#B45309"/>
      <path d="M47 60C48.5 62 51.5 62 53 60" stroke="#B45309" stroke-width="2" stroke-linecap="round"/>
      <circle cx="34" cy="54" r="3" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="66" cy="54" r="3" fill="#FCA5A5" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'owl',
    name: 'Corujinha Sábia',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#E0E7FF"/>
      <!-- Corpo -->
      <ellipse cx="50" cy="54" rx="32" ry="34" fill="#6366F1"/>
      <!-- Orelhas pontudas -->
      <path d="M26 28L38 42L24 46Z" fill="#4F46E5"/>
      <path d="M74 28L62 42L76 46Z" fill="#4F46E5"/>
      <!-- Peito -->
      <ellipse cx="50" cy="62" rx="20" ry="22" fill="#EEF2FF"/>
      <!-- Penas do peito -->
      <path d="M44 56C47 58 53 58 56 56" stroke="#818CF8" stroke-width="2" stroke-linecap="round"/>
      <path d="M42 63C46 65 54 65 58 63" stroke="#818CF8" stroke-width="2" stroke-linecap="round"/>
      <!-- Olhos grandes -->
      <circle cx="37" cy="44" r="11" fill="#FFFFFF"/>
      <circle cx="63" cy="44" r="11" fill="#FFFFFF"/>
      <circle cx="38" cy="44" r="5.5" fill="#1E1B4B"/>
      <circle cx="62" cy="44" r="5.5" fill="#1E1B4B"/>
      <circle cx="39.5" cy="42.5" r="1.8" fill="#FFFFFF"/>
      <circle cx="63.5" cy="42.5" r="1.8" fill="#FFFFFF"/>
      <!-- Bico -->
      <path d="M47 48L53 48L50 55Z" fill="#F59E0B"/>
    </svg>`
  },
  {
    id: 'fox',
    name: 'Raposinha Curiosa',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FFEDD5"/>
      <!-- Orelhas grandes -->
      <path d="M22 20L42 42L20 46Z" fill="#EA580C"/>
      <path d="M24 25L38 40L23 43Z" fill="#FFFFFF"/>
      <path d="M78 20L58 42L80 46Z" fill="#EA580C"/>
      <path d="M76 25L62 40L77 43Z" fill="#FFFFFF"/>
      <!-- Cabeça -->
      <ellipse cx="50" cy="55" rx="32" ry="28" fill="#EA580C"/>
      <path d="M20 54C22 70 38 78 50 78C62 78 78 70 80 54C72 64 62 68 50 64C38 68 28 64 20 54Z" fill="#FFFFFF"/>
      <!-- Olhos e focinho -->
      <circle cx="36" cy="50" r="3.5" fill="#1F2937"/>
      <circle cx="64" cy="50" r="3.5" fill="#1F2937"/>
      <ellipse cx="50" cy="65" rx="3.5" ry="2.5" fill="#1F2937"/>
      <circle cx="28" cy="58" r="3" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="72" cy="58" r="3" fill="#FCA5A5" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'bunny',
    name: 'Coelhinho Gentil',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FCE7F3"/>
      <!-- Orelhas compridas -->
      <ellipse cx="38" cy="26" rx="8" ry="20" fill="#FFFFFF"/>
      <ellipse cx="38" cy="26" rx="4.5" ry="14" fill="#F472B6" opacity="0.7"/>
      <ellipse cx="62" cy="26" rx="8" ry="20" fill="#FFFFFF"/>
      <ellipse cx="62" cy="26" rx="4.5" ry="14" fill="#F472B6" opacity="0.7"/>
      <!-- Cabeça -->
      <circle cx="50" cy="58" r="28" fill="#FFFFFF"/>
      <!-- Olhos meigos -->
      <circle cx="41" cy="54" r="3.5" fill="#374151"/>
      <circle cx="42" cy="52.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="59" cy="54" r="3.5" fill="#374151"/>
      <circle cx="60" cy="52.5" r="1.2" fill="#FFFFFF"/>
      <!-- Narizinho e boquinha -->
      <polygon points="48,60 52,60 50,63" fill="#EC4899"/>
      <path d="M47 64C48.5 66 51.5 66 53 64" stroke="#9CA3AF" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="34" cy="60" r="3.5" fill="#F472B6" opacity="0.4"/>
      <circle cx="66" cy="60" r="3.5" fill="#F472B6" opacity="0.4"/>
    </svg>`
  },
  {
    id: 'bear',
    name: 'Ursinho Protetor',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FEF3C7"/>
      <!-- Orelhas redondas -->
      <circle cx="28" cy="30" r="10" fill="#92400E"/>
      <circle cx="28" cy="30" r="5" fill="#D97706"/>
      <circle cx="72" cy="30" r="10" fill="#92400E"/>
      <circle cx="72" cy="30" r="5" fill="#D97706"/>
      <!-- Rosto -->
      <circle cx="50" cy="56" r="30" fill="#B45309"/>
      <!-- Focinho claro -->
      <ellipse cx="50" cy="64" rx="15" ry="12" fill="#FDE68A"/>
      <!-- Nariz e boca -->
      <ellipse cx="50" cy="59" rx="4.5" ry="3" fill="#451A03"/>
      <path d="M50 62L50 67" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>
      <path d="M46 67C48 69 52 69 54 67" stroke="#451A03" stroke-width="2" stroke-linecap="round"/>
      <!-- Olhos -->
      <circle cx="39" cy="50" r="3.5" fill="#1F2937"/>
      <circle cx="40" cy="48.5" r="1.2" fill="#FFFFFF"/>
      <circle cx="61" cy="50" r="3.5" fill="#1F2937"/>
      <circle cx="62" cy="48.5" r="1.2" fill="#FFFFFF"/>
    </svg>`
  },

  // ═══ HERÓIS & VIRTUDES ═══
  {
    id: 'prince',
    name: 'Pequeno Príncipe / Davi',
    category: 'herois',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#EFF6FF"/>
      <!-- Cabelo e Coroa -->
      <path d="M30 40C30 26 40 18 50 18C60 18 70 26 70 40C70 45 68 50 68 50L32 50C32 50 30 45 30 40Z" fill="#B45309"/>
      <!-- Coroa dourada -->
      <path d="M36 28L42 20L50 26L58 20L64 28Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.5"/>
      <circle cx="50" cy="22" r="2" fill="#EF4444"/>
      <!-- Rosto -->
      <circle cx="50" cy="54" r="24" fill="#FED7AA"/>
      <!-- Franja -->
      <path d="M32 42C40 44 48 40 54 44C60 40 66 43 68 42C68 36 64 32 50 32C36 32 32 36 32 42Z" fill="#92400E"/>
      <!-- Olhos confiantes -->
      <circle cx="42" cy="52" r="3" fill="#1E293B"/>
      <circle cx="43" cy="51" r="1" fill="#FFFFFF"/>
      <circle cx="58" cy="52" r="3" fill="#1E293B"/>
      <circle cx="59" cy="51" r="1" fill="#FFFFFF"/>
      <!-- Sorriso -->
      <path d="M46 62C48 64 52 64 54 62" stroke="#9A3412" stroke-width="2" stroke-linecap="round"/>
      <circle cx="36" cy="57" r="2.5" fill="#FCA5A5" opacity="0.6"/>
      <circle cx="64" cy="57" r="2.5" fill="#FCA5A5" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'princess',
    name: 'Princesa / Rainha Ester',
    category: 'herois',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#FAF5FF"/>
      <!-- Cabelo longo ondulado -->
      <path d="M26 44C24 60 26 78 34 82C40 76 34 58 34 44Z" fill="#78350F"/>
      <path d="M74 44C76 60 74 78 66 82C60 76 66 58 66 44Z" fill="#78350F"/>
      <ellipse cx="50" cy="40" rx="26" ry="24" fill="#78350F"/>
      <!-- Diadema de princesa -->
      <path d="M38 26C45 22 55 22 62 26L50 18Z" fill="#F59E0B"/>
      <circle cx="50" cy="20" r="2.5" fill="#38BDF8"/>
      <!-- Rosto -->
      <circle cx="50" cy="52" r="22" fill="#FED7AA"/>
      <!-- Franjinha -->
      <path d="M34 40C42 42 46 38 50 40C54 38 58 42 66 40C64 34 58 30 50 30C42 30 36 34 34 40Z" fill="#78350F"/>
      <!-- Olhos doces e brilhantes -->
      <ellipse cx="43" cy="50" rx="3.5" ry="3.8" fill="#1E1B4B"/>
      <circle cx="44" cy="48.5" r="1.3" fill="#FFFFFF"/>
      <ellipse cx="57" cy="50" rx="3.5" ry="3.8" fill="#1E1B4B"/>
      <circle cx="58" cy="48.5" r="1.3" fill="#FFFFFF"/>
      <!-- Sorriso carinhoso -->
      <path d="M46 59C48.5 61.5 51.5 61.5 54 59" stroke="#C2410C" stroke-width="2" stroke-linecap="round"/>
      <circle cx="36" cy="54" r="3" fill="#FDA4AF" opacity="0.6"/>
      <circle cx="64" cy="54" r="3" fill="#FDA4AF" opacity="0.6"/>
    </svg>`
  },

  // ═══ AVENTUREIROS DO SABER ═══
  {
    id: 'astronaut',
    name: 'Astronauta das Estrelas',
    category: 'aventura',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#0F172A"/>
      <!-- Estrelinhas de fundo -->
      <circle cx="24" cy="26" r="1.5" fill="#FDE047"/>
      <circle cx="76" cy="22" r="1.5" fill="#FDE047"/>
      <circle cx="82" cy="72" r="1.2" fill="#FDE047"/>
      <!-- Capacete espacial -->
      <circle cx="50" cy="52" r="32" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="2"/>
      <!-- Viseira com reflexo cósmico -->
      <ellipse cx="50" cy="52" rx="22" ry="18" fill="#0284C7"/>
      <ellipse cx="50" cy="52" rx="20" ry="16" fill="#0369A1"/>
      <path d="M36 44C42 40 54 40 62 44" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
      <!-- Rosto sorridente dentro do capacete -->
      <circle cx="44" cy="52" r="2.5" fill="#FFFFFF"/>
      <circle cx="56" cy="52" r="2.5" fill="#FFFFFF"/>
      <path d="M47 57C48.5 59 51.5 59 53 57" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'explorer',
    name: 'Explorador da Natureza',
    category: 'aventura',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#ECFDF5"/>
      <!-- Chapéu de explorador -->
      <ellipse cx="50" cy="38" rx="36" ry="10" fill="#B45309"/>
      <path d="M32 38C32 24 40 18 50 18C60 18 68 24 68 38Z" fill="#D97706"/>
      <rect x="32" y="34" width="36" height="5" fill="#047857"/>
      <!-- Rosto -->
      <circle cx="50" cy="56" r="22" fill="#FED7AA"/>
      <!-- Cabelinho saindo -->
      <path d="M30 46C28 52 30 58 32 60" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
      <path d="M70 46C72 52 70 58 68 60" stroke="#78350F" stroke-width="3" stroke-linecap="round"/>
      <!-- Olhos aventureiros -->
      <circle cx="42" cy="54" r="3" fill="#1E293B"/>
      <circle cx="58" cy="54" r="3" fill="#1E293B"/>
      <path d="M45 63C48 66 52 66 55 63" stroke="#9A3412" stroke-width="2" stroke-linecap="round"/>
      <!-- Pintinhas nas bochechas -->
      <circle cx="36" cy="58" r="1.2" fill="#B45309" opacity="0.6"/>
      <circle cx="38" cy="60" r="1.2" fill="#B45309" opacity="0.6"/>
      <circle cx="64" cy="58" r="1.2" fill="#B45309" opacity="0.6"/>
      <circle cx="62" cy="60" r="1.2" fill="#B45309" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'scientist',
    name: 'Pequena Cientista / Galileu',
    category: 'aventura',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#F0FDFA"/>
      <!-- Cabelo com coque/estilo -->
      <circle cx="50" cy="24" r="12" fill="#475569"/>
      <ellipse cx="50" cy="42" rx="26" ry="20" fill="#475569"/>
      <!-- Rosto -->
      <circle cx="50" cy="54" r="22" fill="#FED7AA"/>
      <!-- Óculos redondos de cientista -->
      <circle cx="40" cy="52" r="8" fill="#FFFFFF" fill-opacity="0.3" stroke="#0D9488" stroke-width="2.5"/>
      <circle cx="60" cy="52" r="8" fill="#FFFFFF" fill-opacity="0.3" stroke="#0D9488" stroke-width="2.5"/>
      <line x1="48" y1="52" x2="52" y2="52" stroke="#0D9488" stroke-width="2.5"/>
      <!-- Olhos espertos -->
      <circle cx="40" cy="52" r="3" fill="#0F172A"/>
      <circle cx="41" cy="51" r="1" fill="#FFFFFF"/>
      <circle cx="60" cy="52" r="3" fill="#0F172A"/>
      <circle cx="61" cy="51" r="1" fill="#FFFFFF"/>
      <!-- Sorriso -->
      <path d="M46 63C48 65 52 65 54 63" stroke="#9A3412" stroke-width="2" stroke-linecap="round"/>
      <circle cx="34" cy="59" r="2.5" fill="#FCA5A5" opacity="0.5"/>
      <circle cx="66" cy="59" r="2.5" fill="#FCA5A5" opacity="0.5"/>
    </svg>`
  },
  {
    id: 'puffin',
    name: 'Pinguim Navegador',
    category: 'animais',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="48" fill="#E0F2FE"/>
      <!-- Corpo preto e branco -->
      <ellipse cx="50" cy="54" rx="30" ry="32" fill="#0F172A"/>
      <ellipse cx="50" cy="58" rx="22" ry="24" fill="#FFFFFF"/>
      <!-- Olhos e bochechas -->
      <circle cx="39" cy="46" r="3.5" fill="#0F172A"/>
      <circle cx="40" cy="45" r="1.2" fill="#FFFFFF"/>
      <circle cx="61" cy="46" r="3.5" fill="#0F172A"/>
      <circle cx="62" cy="45" r="1.2" fill="#FFFFFF"/>
      <!-- Bico laranja estilo Puffin Rock -->
      <polygon points="44,50 56,50 50,60" fill="#F97316"/>
      <polygon points="46,50 54,50 50,56" fill="#FBBF24"/>
      <!-- Bochechas rosadas -->
      <circle cx="33" cy="52" r="3.5" fill="#FDA4AF" opacity="0.7"/>
      <circle cx="67" cy="52" r="3.5" fill="#FDA4AF" opacity="0.7"/>
    </svg>`
  }
];

// Capas de Perfil (Banners temáticos para o cabeçalho)
export const COVER_OPTIONS: CoverOption[] = [
  {
    id: 'night_stars',
    name: 'Céu Estrelado da Noite',
    gradient: 'from-[#0F172A] via-[#1E1B4B] to-[#312E81]',
    icon: '✨',
    pattern: 'radial-gradient(circle at 20% 30%, rgba(253, 224, 71, 0.25) 0%, transparent 40%), radial-gradient(circle at 80% 60%, rgba(129, 140, 248, 0.25) 0%, transparent 40%)'
  },
  {
    id: 'puffin_forest',
    name: 'Floresta Encantada',
    gradient: 'from-[#064E3B] via-[#047857] to-[#10B981]',
    icon: '🌿',
    pattern: 'radial-gradient(circle at 30% 20%, rgba(253, 230, 138, 0.3) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(6, 78, 59, 0.4) 0%, transparent 45%)'
  },
  {
    id: 'golden_sunset',
    name: 'Pôr do Sol Dourado',
    gradient: 'from-[#78350F] via-[#D97706] to-[#F59E0B]',
    icon: '🌅',
    pattern: 'radial-gradient(circle at 50% 90%, rgba(254, 243, 199, 0.4) 0%, transparent 60%)'
  },
  {
    id: 'galaxy_dreams',
    name: 'Galáxia dos Sonhos',
    gradient: 'from-[#4C1D95] via-[#7C3AED] to-[#EC4899]',
    icon: '🪐',
    pattern: 'radial-gradient(circle at 80% 20%, rgba(244, 114, 182, 0.35) 0%, transparent 45%), radial-gradient(circle at 20% 80%, rgba(56, 189, 248, 0.3) 0%, transparent 45%)'
  },
  {
    id: 'ocean_calm',
    name: 'Mar da Calmaria',
    gradient: 'from-[#0C4A6E] via-[#0284C7] to-[#38BDF8]',
    icon: '⛵',
    pattern: 'radial-gradient(circle at 50% 10%, rgba(224, 242, 254, 0.35) 0%, transparent 50%)'
  },
  {
    id: 'royal_castle',
    name: 'Castelo Real das Virtudes',
    gradient: 'from-[#831843] via-[#BE185D] to-[#F43F5E]',
    icon: '👑',
    pattern: 'radial-gradient(circle at 50% 30%, rgba(253, 230, 138, 0.3) 0%, transparent 50%)'
  }
];
