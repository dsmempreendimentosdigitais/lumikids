'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import { 
  Sparkles, 
  Star, 
  Lock, 
  CheckCircle2, 
  Play, 
  Award, 
  MapPin, 
  Compass, 
  ChevronRight,
  Flame,
  Volume2
} from 'lucide-react';
import { KNOWLEDGE_TRAILS } from '@/components/app/CollectionsGrid';

export interface JourneyStory {
  id: string;
  title: string;
  category: string;
  coverEmoji: string;
  coverColor: string;
  coverImageUrl?: string;
  durationMinutes?: number;
  value?: string;
  isCompleted?: boolean;
  stars?: number; // 0 a 3
  isLocked?: boolean;
}

interface JourneyWorldProps {
  stories: JourneyStory[];
  userPlan?: string;
  isAdmin?: boolean;
  userName?: string;
}

const WORLD_CONFIGS: Record<string, {
  themeName: string;
  bgColor: string;
  pathColor: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  cloudsColor: string;
  bgDecoration: string;
}> = {
  'mitologia-grega': {
    themeName: 'Reino do Olimpo',
    bgColor: 'from-[#FFF7ED] via-[#FEF3C7] to-[#FDE68A]',
    pathColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-800',
    cloudsColor: '#FEF3C7',
    bgDecoration: '🏛️'
  },
  'biblia-kids': {
    themeName: 'Caminho da Fé & Promessa',
    bgColor: 'from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]',
    pathColor: '#0D9488',
    accentColor: '#0F766E',
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-900',
    cloudsColor: '#CCFBF1',
    bgDecoration: '🕊️'
  },
  'mulheres-fortes': {
    themeName: 'Castelo das Heroínas',
    bgColor: 'from-[#FFF1F2] via-[#FFE4E6] to-[#FECDD3]',
    pathColor: '#E11D48',
    accentColor: '#BE123C',
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-900',
    cloudsColor: '#FFE4E6',
    bgDecoration: '👑'
  },
  'biografias-historicas': {
    themeName: 'Terra dos Grandes Líderes',
    bgColor: 'from-[#EEF2FF] via-[#E0E7FF] to-[#C7D2FE]',
    pathColor: '#6366F1',
    accentColor: '#4F46E5',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900',
    cloudsColor: '#E0E7FF',
    bgDecoration: '🏰'
  },
  'contos-de-herois': {
    themeName: 'Floresta das Fábulas',
    bgColor: 'from-[#F0F9FF] via-[#E0F2FE] to-[#BAE6FD]',
    pathColor: '#0284C7',
    accentColor: '#0369A1',
    badgeBg: 'bg-sky-100 border-sky-300',
    badgeText: 'text-sky-900',
    cloudsColor: '#E0F2FE',
    bgDecoration: '🛡️'
  },
  'inventores-genios': {
    themeName: 'Oficina das Descobertas',
    bgColor: 'from-[#FEFCE8] via-[#FEF9C3] to-[#FEF08A]',
    pathColor: '#CA8A04',
    accentColor: '#A16207',
    badgeBg: 'bg-yellow-100 border-yellow-300',
    badgeText: 'text-yellow-900',
    cloudsColor: '#FEF9C3',
    bgDecoration: '🔬'
  },
  'virtudes-em-acao': {
    themeName: 'Vale do Caráter & Luz',
    bgColor: 'from-[#FAF5FF] via-[#F3E8FF] to-[#E9D5FF]',
    pathColor: '#9333EA',
    accentColor: '#7E22CE',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900',
    cloudsColor: '#F3E8FF',
    bgDecoration: '✨'
  },
  'natureza-animais': {
    themeName: 'Santuário da Vida Selvagem',
    bgColor: 'from-[#F7FEE7] via-[#ECFCCB] to-[#D9F99D]',
    pathColor: '#16A34A',
    accentColor: '#15803D',
    badgeBg: 'bg-lime-100 border-lime-300',
    badgeText: 'text-lime-900',
    cloudsColor: '#ECFCCB',
    bgDecoration: '🌿'
  }
};

export default function JourneyMap({ stories, userPlan = 'free', isAdmin = false, userName = 'Explorador' }: JourneyWorldProps) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('mitologia-grega');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const themeScrollRef = React.useRef<HTMLDivElement>(null);
  const activeTrail = KNOWLEDGE_TRAILS.find(t => t.id === selectedCategory) || KNOWLEDGE_TRAILS[0];
  const trailStories = stories.filter(s => s.category === selectedCategory);

  // Totais do pequeno explorador
  const completedCount = stories.filter(s => s.isCompleted || (s.stars && s.stars > 0)).length || 1;
  const totalStarsCount = stories.reduce((acc, s) => acc + (s.stars || 0), 0) || 3;
  const diamondCount = completedCount * 5;

  // Efeito sonoro suave lúdico ao tocar nos botões (estilo Bible App for Kids)
  const playSound = (freq = 440) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  // Rolagem suave até a seção de um mundo específico no mapa contínuo
  const scrollToWorld = (trailId: string) => {
    setSelectedCategory(trailId);
    playSound(520);
    const element = document.getElementById(`world-${trailId}`);
    if (element) {
      const yOffset = -110;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Rolar carrossel de temas no topo para a direita ou esquerda
  const scrollThemeRow = (direction: 'left' | 'right') => {
    playSound(460);
    if (themeScrollRef.current) {
      const scrollAmount = direction === 'right' ? 180 : -180;
      themeScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Detector de qual mundo está no campo de visão conforme o explorador rola a tela
  React.useEffect(() => {
    const observers: IntersectionObserver[] = [];

    KNOWLEDGE_TRAILS.forEach((trail) => {
      const el = document.getElementById(`world-${trail.id}`);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setSelectedCategory(trail.id);

              // Centraliza o botão correspondente no carrossel do topo
              const btnEl = document.getElementById(`theme-btn-${trail.id}`);
              if (btnEl && themeScrollRef.current) {
                const container = themeScrollRef.current;
                const scrollLeft = btnEl.offsetLeft - container.offsetWidth / 2 + btnEl.offsetWidth / 2;
                container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
              }
            }
          });
        },
        { threshold: 0.2, rootMargin: '-100px 0px -40% 0px' }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-[#FFF7ED] via-[#FEF3C7] via-[#DCFCE7] via-[#FFE4E6] via-[#EEF2FF] via-[#E0F2FE] via-[#FEF9C3] via-[#FAF5FF] to-[#ECFCCB] select-none font-sans overflow-x-hidden flex flex-col justify-between">
      
      {/* ═════════════════════════════════════════════════════════════
          PLANO DE FUNDO CENOGRÁFICO 100% FULL-BLEED (Colinas, Rio e Céu)
          ═════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Curvas de Colinas Verdes em SVG (Relevo autêntico de jogo) */}
        <svg className="absolute bottom-0 left-0 w-full h-[70%] min-h-[600px] opacity-25" viewBox="0 0 1440 1200" preserveAspectRatio="none">
          <path d="M0,480 C320,280 480,520 800,380 C1120,240 1280,460 1440,340 L1440,1200 L0,1200 Z" fill="#84CC16" />
          <path d="M0,680 C260,560 520,780 840,640 C1160,500 1320,700 1440,620 L1440,1200 L0,1200 Z" fill="#65A30D" />
          {/* Rio sinuoso que cruza o mapa */}
          <path d="M-50,800 C300,720 600,880 950,760 C1200,680 1350,820 1500,780 L1500,860 C1350,900 1200,760 950,840 C600,960 300,800 -50,880 Z" fill="#38BDF8" opacity="0.6" />
        </svg>

        {/* Nuvens fofas flutuantes espalhadas pelo céu do mapa */}
        <div className="absolute top-8 left-12 text-6xl opacity-75 animate-pulse">☁️</div>
        <div className="absolute top-24 right-16 text-7xl opacity-65 animate-pulse" style={{ animationDelay: '2s' }}>☁️</div>
        <div className="absolute top-96 left-1/4 text-5xl opacity-40 animate-pulse" style={{ animationDelay: '3.5s' }}>☁️</div>
        <div className="absolute top-[800px] right-12 text-6xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>☁️</div>
        <div className="absolute top-[1400px] left-10 text-6xl opacity-45 animate-pulse" style={{ animationDelay: '4s' }}>☁️</div>

        {/* Elementos cenográficos lúdicos ao longo da aventura */}
        <div className="absolute top-36 right-8 text-7xl opacity-40">🏔️ ⛰️</div>
        <div className="absolute top-80 left-8 text-5xl opacity-50">🌲 🌳</div>
        <div className="absolute top-[650px] right-10 text-6xl opacity-45">🕊️ 🌾</div>
        <div className="absolute top-[1100px] left-8 text-6xl opacity-40">👑 🏰</div>
        <div className="absolute top-[1600px] right-12 text-6xl opacity-45">🛡️ 🏕️</div>
        <div className="absolute top-[2100px] left-10 text-6xl opacity-40">🔭 💡</div>
        <div className="absolute top-[2600px] right-8 text-6xl opacity-45">✨ 🌸</div>
        <div className="absolute bottom-52 left-12 text-6xl opacity-40">🌊 ⛵ 🐠</div>
      </div>

      {/* ═══ CONTEÚDO PRINCIPAL DO MAPA ═══ */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-28">
        
        {/* BARRA SUPERIOR LUMIKIDS (Logo e Acesso Admin) */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black text-2xl tracking-tight text-[#0D9488] drop-shadow-xs">
              Lumi<span className="text-amber-500">kids</span>
            </span>
            <span className="text-xs bg-white/80 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold text-slate-600 shadow-xs">
              ✨ Aventura Contínua
            </span>
          </div>

          {isAdmin && (
            <Link
              href="/app/admin"
              className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md border-2 border-white flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform"
              title="Painel Administrativo"
            >
              <span>👑</span>
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* ═══ BARRA DE CONTROLES DO TOPO (Ícones Bem Grandes com Indicador de Rolagem) ═══ */}
        <div className="sticky top-2 z-40 mb-8 backdrop-blur-xs py-1">
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            
            {/* BOTÃO DE LIVRO / HISTÓRIAS (GRANDE E VIBRANTE, PRINT 2) */}
            <button
              type="button"
              onClick={() => {
                playSound(580);
                setIsCatalogOpen(true);
              }}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-white text-[#0284C7] shadow-[0_8px_25px_rgba(2,132,199,0.35)] border-3 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl hover:scale-105 active:scale-95 transition-all shrink-0 cursor-pointer"
              title="Abrir Catálogo de Histórias em Madeira"
            >
              📖
            </button>

            {/* SELETOR DE MUNDOS COM ÍCONES GRANDES E INDICADOR DE ROLAGEM */}
            <div className="flex-1 relative flex items-center justify-center min-w-0 max-w-2xl">
              
              {/* Botão de Rolar para Esquerda (Desktop) */}
              <button
                type="button"
                onClick={() => scrollThemeRow('left')}
                className="hidden md:flex absolute -left-3 z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                title="Rolar temas para a esquerda"
              >
                ◀
              </button>

              {/* Contêiner de rolagem horizontal dos mundos */}
              <div 
                ref={themeScrollRef}
                className="w-full flex overflow-x-auto py-2 px-3 scrollbar-none scroll-smooth"
              >
                <div className="inline-flex items-center gap-2.5 p-1.5 sm:p-2 bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-white/90">
                  {KNOWLEDGE_TRAILS.map((trail) => {
                    const isSelected = trail.id === selectedCategory;
                    return (
                      <button
                        key={trail.id}
                        id={`theme-btn-${trail.id}`}
                        onClick={() => scrollToWorld(trail.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full font-black transition-all shrink-0 active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D9488] text-white shadow-md scale-105 ring-2 ring-emerald-300'
                            : 'text-slate-700 hover:bg-slate-100/90'
                        }`}
                        title={trail.title}
                      >
                        <span className="text-3xl sm:text-4xl">{trail.emoji}</span>
                        <span className="text-xs sm:text-sm font-black tracking-tight whitespace-nowrap">
                          {trail.title.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Botão de Rolar para Direita (Indicador visual de mais temas) */}
              <button
                type="button"
                onClick={() => scrollThemeRow('right')}
                className="flex absolute -right-2 sm:-right-3 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-400 text-slate-950 font-black shadow-lg border-2 border-white items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-pointer animate-pulse"
                title="Ver mais mundos à direita 👉"
              >
                <ChevronRight size={22} className="stroke-[3]" />
              </button>
            </div>

            {/* BOTÃO DE TROFÉU / ÁLBUM (GRANDE E DOURADO, PRINT 2) */}
            <Link
              href="/app/progresso"
              onClick={() => playSound(480)}
              className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-white text-amber-500 shadow-[0_8px_25px_rgba(245,158,11,0.35)] border-3 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl md:text-4xl hover:scale-105 active:scale-95 transition-all shrink-0"
              title="Álbum do Explorador"
            >
              🏆
            </Link>
          </div>

          {/* Dica lúdica animada no mobile indicando rolagem lateral dos mundos */}
          <div className="flex items-center justify-center mt-1.5 sm:hidden">
            <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold text-slate-600 bg-white/80 px-3 py-0.5 rounded-full border border-slate-200/80 shadow-2xs animate-pulse">
              <span>Arraste para os lados para ver todos os mundos</span>
              <span>👉</span>
            </span>
          </div>
        </div>

        {/* ═══ MAPA DE AVENTURA CONTÍNUO (TODOS OS MUNDOS INTEGRADOS NA MESMA TRILHA) ═══ */}
        <div className="relative z-10 w-full flex flex-col items-center">
          {KNOWLEDGE_TRAILS.map((trail, worldIdx) => {
            const worldStories = stories.filter(s => s.category === trail.id);
            const config = WORLD_CONFIGS[trail.id] || WORLD_CONFIGS['mitologia-grega'];

            return (
              <section 
                key={trail.id} 
                id={`world-${trail.id}`}
                className="w-full max-w-md mx-auto flex flex-col items-center pt-6 pb-16 transition-all scroll-mt-28"
              >
                {/* PORTAL / ARCO CENOGRÁFICO DO MUNDO */}
                <div className="text-center mb-8 relative">
                  <div className="text-5xl mb-2 filter drop-shadow-md select-none">{config.bgDecoration}</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${config.badgeBg} ${config.badgeText} border text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm mb-2`}>
                    <span>{trail.emoji}</span>
                    <span>{config.themeName}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 drop-shadow-xs">
                    {trail.title}
                  </h2>
                  <p className="text-xs text-slate-600 font-bold max-w-xs mx-auto mt-1 leading-snug">
                    {trail.desc || (trail as any).description}
                  </p>
                </div>

                {/* NÓS DA TRILHA DESTE MUNDO EM ZIGUE-ZAGUE */}
                <div className="relative w-full flex flex-col items-center gap-14">
                  {worldStories.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 text-center border-2 border-dashed border-slate-300 max-w-xs mx-auto shadow-sm">
                      <span className="text-3xl block mb-1">🧭</span>
                      <h4 className="font-bold text-slate-800 text-xs mb-1">Novas histórias a caminho!</h4>
                      <p className="text-[0.68rem] text-slate-500">As histórias deste reino estão sendo mapeadas para os pequenos exploradores.</p>
                    </div>
                  ) : (
                    worldStories.map((story, index) => {
                      const positions = ['-translate-x-14 md:-translate-x-20', 'translate-x-0', 'translate-x-14 md:translate-x-20'];
                      const posClass = positions[index % 3];
                      const isFirstInApp = worldIdx === 0 && index === 0;
                      const isLocked = !isFirstInApp && story.isLocked;
                      const starsCount = story.stars || (isFirstInApp ? 3 : 0);

                      const activityTags = [
                        { emoji: '🧩', bg: 'bg-pink-500' },
                        { emoji: '🎨', bg: 'bg-purple-500' },
                        { emoji: '🌟', bg: 'bg-amber-500' },
                        { emoji: '👑', bg: 'bg-blue-500' }
                      ];
                      const tag = activityTags[index % activityTags.length];

                      return (
                        <div key={story.id} className={`relative flex flex-col items-center transition-all ${posClass}`}>
                          
                          {/* PONTILHADO DOURADO CONECTANDO OS NÓS */}
                          {index < worldStories.length - 1 && (
                            <div className="absolute top-20 flex flex-col items-center gap-1.5 -z-0 pointer-events-none opacity-80">
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-xs"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-xs"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-xs"></div>
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500 shadow-xs"></div>
                            </div>
                          )}

                          {/* LINK DO NÓ DE HISTÓRIA */}
                          <Link
                            href={`/app/historias/${story.id}`}
                            onClick={() => playSound(640)}
                            className="group relative flex flex-col items-center focus:outline-none"
                          >
                            {/* NÓ METÁLICO 3D */}
                            <div className={`metallic-node-rim relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer ${
                              isLocked ? 'grayscale opacity-75' : ''
                            }`}>
                              <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                {story.coverImageUrl ? (
                                  <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                  <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-125">
                                    {story.coverEmoji || trail.emoji}
                                  </span>
                                )}
                              </div>

                              {/* Mini-Badge de Atividade no Canto Superior Direito */}
                              <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full ${tag.bg} text-white flex items-center justify-center text-xs shadow-md border-2 border-white`}>
                                <span>{tag.emoji}</span>
                              </div>

                              {/* PEDESTAL DAS 3 ESTRELAS NA BASE INFERIOR */}
                              <div className="stars-pedestal absolute -bottom-3 z-10 px-3 py-0.5 rounded-full flex items-center gap-1">
                                {[1, 2, 3].map((s) => (
                                  <Star
                                    key={s}
                                    size={12}
                                    className={`${
                                      s <= starsCount
                                        ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                                        : 'text-slate-300 fill-slate-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* TÍTULO DA HISTÓRIA EM CARTÃO LÚDICO */}
                            <div className="mt-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-slate-200/90 shadow-sm max-w-[170px] text-center">
                              <h4 className="font-serif font-bold text-xs text-slate-900 leading-tight line-clamp-2">
                                {story.title}
                              </h4>
                              {story.value && (
                                <span className="text-[0.62rem] font-bold text-[#0D9488] uppercase block mt-0.5 truncate">
                                  ⭐ {story.value}
                                </span>
                              )}
                            </div>
                          </Link>

                        </div>
                      );
                    })
                  )}
                </div>

                {/* PORTAL MÁGICO DE PASSAGEM ENTRE MUNDOS */}
                {worldIdx < KNOWLEDGE_TRAILS.length - 1 && (
                  <div className="mt-16 mb-4 flex flex-col items-center gap-2 pointer-events-none">
                    <div className="flex flex-col items-center gap-2 opacity-80">
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-xs animate-pulse"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-xs animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-xs animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-amber-300 shadow-md flex items-center gap-2 text-xs font-black text-amber-900">
                      <span>✨ Portal de Passagem ✨</span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-amber-400 border border-amber-500 shadow-xs animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* ═══ BARRA FLUTUANTE DE STATS NO CANTO INFERIOR ESQUERDO (Estilo Bible App) ═══ */}
        <div className="fixed bottom-5 sm:bottom-8 left-4 sm:left-8 z-30 bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 sm:px-6 sm:py-3 border-2 border-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 font-black text-amber-700 text-sm sm:text-base" title="Troféus conquistados">
            <span className="text-xl sm:text-2xl">🏆</span>
            <span className="text-base sm:text-lg">{completedCount}</span>
          </div>
          <div className="flex items-center gap-2 font-black text-amber-500 text-sm sm:text-base" title="Estrelas coletadas">
            <span className="text-xl sm:text-2xl">⭐</span>
            <span className="text-base sm:text-lg">{totalStarsCount}</span>
          </div>
          <div className="flex items-center gap-2 font-black text-cyan-600 text-sm sm:text-base" title="Gemas do explorador">
            <span className="text-xl sm:text-2xl">💎</span>
            <span className="text-base sm:text-lg">{diamondCount}</span>
          </div>
        </div>

        {/* ═══ BOTÕES FLUTUANTES DE AÇÃO NO CANTO INFERIOR DIREITO (Estilo Bible App) ═══ */}
        <div className="fixed bottom-5 sm:bottom-8 right-4 sm:right-8 z-30 flex items-center gap-3 sm:gap-4">
          {/* Botão de Perfil / Álbum */}
          <Link
            href="/app/progresso"
            onClick={() => playSound(480)}
            className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full bg-white text-[#0284C7] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-3 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl hover:scale-105 active:scale-95 transition-transform"
            title="Meu Álbum & Progresso"
          >
            👤
          </Link>

          {/* Botão de Configurações */}
          <button
            type="button"
            onClick={() => {
              playSound(520);
              setIsSettingsOpen(true);
            }}
            className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full bg-white text-[#0284C7] shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-3 sm:border-4 border-white flex items-center justify-center font-black text-2xl sm:text-3xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Configurações do Mapa"
          >
            ⚙️
          </button>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODAL DE HISTÓRIAS EM TÁBUAS DE MADEIRA (Estilo Bible App)
          ═════════════════════════════════════════════════════════════ */}
      {isCatalogOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsCatalogOpen(false)}
        >
          <div 
            className="w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Pedra Entalhada */}
            <div className="stone-banner py-4 px-6 flex items-center justify-between text-white">
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="btn-round-action w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow-xs"
              >
                ←
              </button>
              <h3 className="font-serif font-black text-xl tracking-wide uppercase drop-shadow-md">
                Histórias
              </h3>
              <div className="w-9 h-9"></div>
            </div>

            {/* Lista em Pergaminho com Tábuas de Madeira */}
            <div className="parchment-sheet p-5 space-y-3.5 max-h-[70vh] overflow-y-auto">
              {trailStories.length === 0 ? (
                <div className="text-center py-8 text-[#6D4C2B]">
                  <p className="font-bold text-sm">Carregando histórias do mundo...</p>
                </div>
              ) : (
                trailStories.map((s) => (
                  <Link
                    key={s.id}
                    href={`/app/historias/${s.id}`}
                    onClick={() => {
                      playSound(600);
                      setIsCatalogOpen(false);
                    }}
                    className="wood-plank rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 text-white shadow-lg block"
                  >
                    {/* Miniatura com moldura metálica */}
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200 shadow-md shrink-0 bg-slate-900 flex items-center justify-center">
                      {s.coverImageUrl ? (
                        <img src={s.coverImageUrl} alt={s.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">{s.coverEmoji || activeTrail.emoji}</span>
                      )}
                    </div>

                    {/* Título e Descrição */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif font-black text-sm sm:text-base leading-tight drop-shadow-sm truncate">
                        {s.title}
                      </h4>
                      <p className="text-amber-100/90 text-xs font-semibold truncate mt-0.5">
                        {s.value || 'História de Sabedoria'}
                      </p>
                    </div>

                    {/* Botão Redondo Azul Tátil */}
                    <div className="btn-round-action w-10 h-10 rounded-full flex items-center justify-center text-white text-base shadow-md shrink-0">
                      📖
                    </div>
                  </Link>
                ))
              )}
            </div>

          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════
          MODAL DE CONFIGURAÇÕES ESTILO BIBLE APP (Pedra + Pergaminho)
          ═════════════════════════════════════════════════════════════ */}
      {isSettingsOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="w-full max-w-[420px] max-h-[92vh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-2 border-[#D8C29D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Pedra Entalhada */}
            <div className="stone-banner py-3.5 px-6 flex items-center justify-between text-white shrink-0">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="btn-round-action w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Voltar"
              >
                ←
              </button>
              <h3 className="font-serif font-black text-base tracking-wider uppercase drop-shadow-md">
                {t('map_settings', 'Configurações')}
              </h3>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white border border-white/30">
                ⚙️
              </div>
            </div>

            {/* Corpo em Pergaminho Dobrado */}
            <div className="parchment-sheet p-5 sm:p-6 space-y-4 text-[#2D2114] overflow-y-auto">
              {/* Efeitos Sonoros */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/60 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔔</span>
                  <div>
                    <span className="font-black text-sm block leading-tight">{t('reader_sound_effects', 'Efeitos Sonoros')}</span>
                    <span className="text-[0.7rem] text-[#6B5A45] font-semibold">{t('reader_sound_effects_desc', 'Sons de mapa e botões')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className={`btn-round-action px-3.5 h-9 rounded-full flex items-center gap-1.5 text-white text-xs font-black shadow-xs transition-all cursor-pointer ${
                    soundEnabled ? 'bg-[#0284C7]' : 'bg-gray-400 opacity-60'
                  }`}
                >
                  <span>{soundEnabled ? t('settings_sound_on', 'Ligado') : t('settings_sound_off', 'Mudo')}</span>
                </button>
              </div>

              {/* Seletor de Idiomas */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="text-xs font-black uppercase tracking-wider text-[#4A3B2C] mb-1">
                  🌍 {t('settings_language', 'Idioma do Aplicativo')}
                </div>
                <div className="text-[0.7rem] text-[#6B5A45] font-semibold mb-2.5">
                  {t('settings_language_desc', 'Mudar para Inglês, Espanhol, Francês ou Italiano')}
                </div>
                <LanguageSelector variant="list" />
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  href="/app/historias"
                  className="w-full py-2.5 px-4 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-amber-50 transition-colors"
                >
                  <span>{t('manage_stories', '📚 Gerenciar Histórias')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full h-12 rounded-2xl bg-[#0D9488] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#0F766E] transition-all active:scale-98 flex items-center justify-center cursor-pointer"
                >
                  {t('save_and_close', 'Salvar e Fechar')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

