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
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
        
        {/* ═══ BARRA SUPERIOR FLUTUANTE (Identidade Visual Contos & Virtudes) ═══ */}
        <div className="sticky top-2 z-40 mb-4 py-1">
          <div className="flex items-center justify-between gap-3 bg-white/95 backdrop-blur-md rounded-full px-4 py-2.5 shadow-md border border-[#E6DEC8] max-w-md mx-auto">
            
            {/* Lado Esquerdo: Avatar + Nome + Bandeira + Meta */}
            <div className="flex items-center gap-3 min-w-0">
              <Link 
                href="/app/progresso" 
                className="w-11 h-11 rounded-full bg-amber-100 border-2 border-amber-300 shadow-xs overflow-hidden flex items-center justify-center shrink-0 hover:scale-105 transition-transform" 
                title="Meu Perfil"
              >
                <img src="/icons/lumikids-star-logo.svg" alt="Contos & Virtudes" className="w-full h-full object-cover" />
              </Link>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate max-w-[120px] sm:max-w-[150px]">
                  {userName}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold mt-0.5">
                  <span className="inline-flex items-center gap-1">🇧🇷 Português</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[#0D9488] font-extrabold inline-flex items-center gap-0.5">
                    🎯 {completedCount}/{trailStories.length || 4}
                  </span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Estrelas + Botão Família / Perfil */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Pill de Estrelas */}
              <div className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs">
                <span>⭐</span>
                <span>{totalStarsCount}</span>
              </div>

              {/* Botão de Família / Perfil */}
              <Link
                href="/app/progresso"
                onClick={() => playSound(480)}
                className="w-9 h-9 rounded-full bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[#0D9488] flex items-center justify-center text-sm shadow-2xs transition-all cursor-pointer"
                title="Família & Progresso"
              >
                👥
              </Link>

              {isAdmin && (
                <Link
                  href="/app/admin"
                  className="px-2.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-xs"
                  title="Admin"
                >
                  👑
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* ═══ CARD FLUTUANTE: PRÓXIMA ILHA / HISTÓRIA (Identidade Teal & Dourado) ═══ */}
        {trailStories.length > 0 && (
          <div className="max-w-md mx-auto mb-4 px-1">
            {(() => {
              const nextStory = trailStories.find(s => !s.isCompleted) || trailStories[0];
              const completedInCurrent = trailStories.filter(s => s.isCompleted || (s.stars && s.stars > 0)).length;
              const totalInCurrent = trailStories.length || 4;

              return (
                <Link
                  href={`/app/historias/${nextStory.id}`}
                  onClick={() => playSound(640)}
                  className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-4.5 shadow-md border-2 border-[#E6DEC8] flex items-center justify-between gap-3.5 group hover:border-[#0D9488] hover:shadow-lg transition-all block text-left"
                >
                  {/* Anel de Progresso Circular */}
                  <div className="relative w-13 h-13 rounded-full bg-teal-50 border-2 border-[#0D9488] flex items-center justify-center shrink-0">
                    <span className="font-extrabold text-xs sm:text-sm text-[#0F766E]">
                      {completedInCurrent}/{totalInCurrent}
                    </span>
                  </div>

                  {/* Textos da Próxima Ilha */}
                  <div className="flex-1 min-w-0 py-0.5">
                    <span className="text-[0.68rem] font-extrabold text-[#D97706] uppercase tracking-wider block mb-0.5">
                      ✨ Próxima Aventura
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base truncate leading-snug group-hover:text-[#0D9488] transition-colors">
                      {nextStory.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold truncate mt-0.5">
                      {activeTrail.title} • 5–7 min • {nextStory.value || 'Sabedoria'}
                    </p>
                  </div>

                  {/* Botão de Ação Teal com Play/Sparkle */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#0D9488] to-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-md shadow-teal-900/20 group-hover:scale-105 active:scale-95 transition-transform">
                    <Sparkles size={19} />
                  </div>
                </Link>
              );
            })()}
          </div>
        )}

        {/* ═══ PILL DE NÍVEL / TRILHA ATIVA ═══ */}
        <div className="max-w-md mx-auto mb-6 flex justify-center sm:justify-start px-2">
          <button
            type="button"
            onClick={() => setIsCatalogOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D9488] text-white font-extrabold text-xs sm:text-sm shadow-sm hover:bg-[#0F766E] transition-colors cursor-pointer"
          >
            <span>🎓</span>
            <span>Trilha: {activeTrail.title}</span>
            <span className="text-teal-100 text-xs ml-1">Trocar ▾</span>
          </button>
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
                className={`relative w-full max-w-lg mx-auto flex flex-col items-center pt-8 pb-20 px-4 mb-10 rounded-[44px] bg-gradient-to-b ${config.bgColor} border-2 border-white/80 shadow-[0_16px_40px_rgba(45,33,20,0.08)] overflow-hidden transition-all scroll-mt-28`}
              >
                {/* ═══ FUNDO ILUSTRADO CENOGRÁFICO DE CADA REINO (Colinas, Árvores, Rio e Caminho Dourado) ═══ */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 500 1200" preserveAspectRatio="none">
                    {/* Sol / Brilho Suave no Topo */}
                    <circle cx="410" cy="85" r="55" fill="#FEF08A" opacity="0.55" />
                    {/* Colinas distantes em aquarela */}
                    <path d="M0,220 Q130,150 260,210 T500,190 L500,1200 L0,1200 Z" fill="#D9F0D6" opacity="0.55" />
                    <path d="M0,480 Q160,400 320,470 T500,440 L500,1200 L0,1200 Z" fill="#C2E7BF" opacity="0.55" />
                    {/* Riacho cristalino cruzando o jardim */}
                    <path d="M-20,660 C140,610 340,720 520,650 L520,705 C340,775 140,665 -20,715 Z" fill="#7DD3FC" opacity="0.5" />
                    <path d="M0,860 Q140,790 290,850 T500,820 L500,1200 L0,1200 Z" fill="#A7DCA5" opacity="0.5" />
                    {/* Estrada sinuosa dourada de pedrinhas ao centro */}
                    <path
                      d="M250,180 C150,280 150,360 250,450 C350,540 350,640 250,730 C150,820 150,920 250,1020 C330,1090 280,1150 250,1190"
                      fill="none"
                      stroke="#E7CFA1"
                      strokeWidth="42"
                      strokeLinecap="round"
                      opacity="0.7"
                    />
                    <path
                      d="M250,180 C150,280 150,360 250,450 C350,540 350,640 250,730 C150,820 150,920 250,1020 C330,1090 280,1150 250,1190"
                      fill="none"
                      stroke="#FFFDF7"
                      strokeWidth="6"
                      strokeDasharray="14 14"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>

                  {/* Elementos Decorativos Botânicos e Arquitetônicos nas Laterais da Trilha */}
                  <div className="absolute top-10 left-5 text-3xl opacity-75">☁️</div>
                  <div className="absolute top-16 right-6 text-4xl opacity-80">☁️</div>
                  <div className="absolute top-52 left-4 text-3xl opacity-85">🌲🌳</div>
                  <div className="absolute top-72 right-5 text-3xl opacity-80">🌿🌻</div>
                  <div className="absolute top-[430px] left-5 text-3xl opacity-80">🏮✨</div>
                  <div className="absolute top-[560px] right-4 text-3xl opacity-85">🌳🐿️</div>
                  <div className="absolute top-[720px] left-4 text-3xl opacity-80">🌉🦢</div>
                  <div className="absolute bottom-24 right-5 text-3xl opacity-85">🌲🌸</div>
                </div>

                {/* PORTAL / ARCO CENOGRÁFICO DO MUNDO */}
                <div className="text-center mb-10 relative z-10">
                  <div className="text-5xl mb-2.5 filter drop-shadow-md select-none">{config.bgDecoration}</div>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${config.badgeBg} ${config.badgeText} border text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xs mb-2.5`}>
                    <span>{trail.emoji}</span>
                    <span>{config.themeName}</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 drop-shadow-2xs">
                    {trail.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 font-bold max-w-xs mx-auto mt-1.5 leading-relaxed">
                    {trail.desc || (trail as any).description}
                  </p>
                </div>

                {/* NÓS DA TRILHA DESTE MUNDO EM ZIGUE-ZAGUE */}
                <div className="relative z-10 w-full flex flex-col items-center gap-16">
                  {worldStories.length === 0 ? (
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 text-center border-2 border-dashed border-slate-300 max-w-xs mx-auto shadow-sm">
                      <span className="text-3xl block mb-1">🧭</span>
                      <h4 className="font-bold text-slate-800 text-xs mb-1">Novas histórias a caminho!</h4>
                      <p className="text-[0.68rem] text-slate-500">As histórias deste reino estão sendo mapeadas para os pequenos exploradores.</p>
                    </div>
                  ) : (
                    worldStories.map((story, index) => {
                      const positions = ['-translate-x-12 sm:-translate-x-16', 'translate-x-0', 'translate-x-12 sm:translate-x-16'];
                      const posClass = positions[index % 3];
                      const isFirstInApp = worldIdx === 0 && index === 0;
                      const isLocked = !isFirstInApp && story.isLocked;

                      return (
                        <div key={story.id} className={`relative flex flex-col items-center transition-all ${posClass}`}>
                          
                          {/* PEDRINHAS DOURADAS DE PASSAGEM (STEPPING STONES) CONECTANDO OS NÓS */}
                          {index < worldStories.length - 1 && (
                            <div className="absolute top-28 flex flex-col items-center gap-2.5 -z-10 pointer-events-none">
                              <div className="w-5 h-3.5 rounded-full bg-[#DFC38D] border-2 border-[#B89758] shadow-xs"></div>
                              <div className="w-4 h-3 rounded-full bg-[#DFC38D] border-2 border-[#B89758] shadow-xs"></div>
                              <div className="w-5 h-3.5 rounded-full bg-[#DFC38D] border-2 border-[#B89758] shadow-xs"></div>
                            </div>
                          )}

                          {/* LINK DA ILHA DE HISTÓRIA */}
                          <Link
                            href={`/app/historias/${story.id}`}
                            onClick={() => playSound(640)}
                            className="group relative flex flex-col items-center focus:outline-none"
                          >
                            {/* ILHA FLUTUANTE ILUSTRADA */}
                            <div className={`relative w-26 h-26 sm:w-30 sm:h-30 rounded-full p-1.5 bg-white border-4 border-amber-300 shadow-[0_12px_26px_rgba(45,33,20,0.18)] flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-108 ${
                              isLocked ? 'grayscale opacity-75' : ''
                            }`}>
                              <div className="w-full h-full rounded-full overflow-hidden bg-amber-50 flex items-center justify-center">
                                {story.coverImageUrl ? (
                                  <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                ) : (
                                  <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-125">
                                    {story.coverEmoji || trail.emoji}
                                  </span>
                                )}
                              </div>

                              {/* BADGE DE CADEADO OU ESTRELA NO CANTO DA ILHA */}
                              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center text-xs shadow-md border-2 border-amber-200">
                                {isLocked ? (
                                  <Lock size={14} className="text-slate-600" />
                                ) : (
                                  <Star size={14} className="text-amber-500 fill-amber-500" />
                                )}
                              </div>
                            </div>

                            {/* ETIQUETA / PILL BRANCA COM ESPAÇAMENTO AMPLO ABAIXO DA ILHA */}
                            <div className="mt-3 bg-white/98 px-4 py-2 rounded-full border-2 border-[#E6DEC8] shadow-md max-w-[220px] text-center group-hover:border-[#0D9488] transition-colors">
                              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 leading-snug truncate">
                                {story.title}
                              </h4>
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

      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODAL: GRANDE LIVRO DE HISTÓRIAS (TODAS AS TRILHAS DISPONÍVEIS)
          ═════════════════════════════════════════════════════════════ */}
      {isCatalogOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
          onClick={() => setIsCatalogOpen(false)}
        >
          <div 
            className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-2 border-[#D8C29D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Pedra Entalhada Superior */}
            <div className="stone-banner py-3.5 px-6 flex items-center justify-between text-white shrink-0">
              <button
                type="button"
                onClick={() => setIsCatalogOpen(false)}
                className="btn-round-action w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Fechar"
              >
                ✕
              </button>
              <div className="text-center">
                <h3 className="font-serif font-black text-base sm:text-lg tracking-wide uppercase drop-shadow-md">
                  📖 Grande Livro de Histórias
                </h3>
                <p className="text-[0.68rem] text-amber-200 font-bold uppercase tracking-wider">
                  Todas as Trilhas do Contos & Virtudes
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/30">
                📚
              </div>
            </div>

            {/* Atalhos Rápidos das 8 Trilhas no Topo do Modal */}
            <div className="bg-[#EEDBB8] border-b border-[#D8C29D] px-3.5 py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[0.62rem] font-black uppercase text-[#6D4C2B] shrink-0 mr-1">
                Ir para:
              </span>
              {KNOWLEDGE_TRAILS.map((trail) => (
                <button
                  key={trail.id}
                  type="button"
                  onClick={() => {
                    playSound(460);
                    const el = document.getElementById(`catalog-trail-${trail.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/85 hover:bg-white text-[#2D2114] text-[0.68rem] font-bold border border-[#D8C29D] shadow-2xs shrink-0 flex items-center gap-1 active:scale-95 transition-all cursor-pointer"
                >
                  <span>{trail.emoji}</span>
                  <span className="whitespace-nowrap">{trail.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Pergaminho com Todas as Trilhas e Suas Histórias */}
            <div className="parchment-sheet p-4 sm:p-6 space-y-6 overflow-y-auto text-[#2D2114]">
              {KNOWLEDGE_TRAILS.map((trail) => {
                const storiesOfTrail = stories.filter(s => s.category === trail.id);
                return (
                  <div key={trail.id} id={`catalog-trail-${trail.id}`} className="space-y-3 scroll-mt-3">
                    
                    {/* Cabeçalho da Trilha */}
                    <div className="flex items-center justify-between border-b-2 border-amber-900/15 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl">{trail.emoji}</span>
                        <div>
                          <h4 className="font-serif font-black text-base sm:text-lg text-[#2D2114] leading-tight">
                            {trail.title}
                          </h4>
                          <p className="text-[0.68rem] text-[#6D4C2B] font-semibold">
                            {storiesOfTrail.length} histórias disponíveis
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCatalogOpen(false);
                          scrollToWorld(trail.id);
                        }}
                        className="px-2.5 py-1 rounded-full bg-white border border-[#D8C29D] text-[#6D4C2B] text-[0.65rem] font-black uppercase tracking-wider hover:bg-amber-50 shadow-2xs cursor-pointer shrink-0"
                        title="Ver este mundo no mapa de aventura"
                      >
                        Ver no Mapa 🗺️
                      </button>
                    </div>

                    {/* Grade das Histórias da Trilha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {storiesOfTrail.map((s) => (
                        <Link
                          key={s.id}
                          href={`/app/historias/${s.id}`}
                          onClick={() => {
                            playSound(600);
                            setIsCatalogOpen(false);
                          }}
                          className="wood-plank rounded-2xl p-3 flex items-center justify-between gap-3 text-white shadow-md hover:scale-[1.02] active:scale-98 transition-all group"
                        >
                          {/* Capa Miniatura */}
                          <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-300 shadow-md shrink-0 bg-slate-900 flex items-center justify-center">
                            {s.coverImageUrl ? (
                              <img src={s.coverImageUrl} alt={s.title} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-xl">{s.coverEmoji || trail.emoji}</span>
                            )}
                          </div>

                          {/* Título e Valor */}
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif font-black text-xs sm:text-sm leading-tight drop-shadow-sm truncate group-hover:text-amber-200 transition-colors">
                              {s.title}
                            </h5>
                            <p className="text-amber-100/90 text-[0.68rem] font-semibold truncate mt-0.5">
                              ⭐ {s.value || 'Valores Morais'} • ⏱️ {s.durationMinutes || 7} min
                            </p>
                          </div>

                          {/* Botão de Leitura */}
                          <div className="w-8 h-8 rounded-full bg-[#0284C7] text-white flex items-center justify-center text-xs shadow-md shrink-0 group-hover:bg-[#0369A1]">
                            📖
                          </div>
                        </Link>
                      ))}
                    </div>

                  </div>
                );
              })}
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
              <div className="flex items-center justify-between gap-3 p-4 bg-amber-50/70 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3.5">
                  <span className="text-2xl">🔔</span>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base block leading-tight">{t('reader_sound_effects', 'Efeitos Sonoros')}</span>
                    <span className="text-xs text-[#6B5A45] font-semibold block mt-0.5">{t('reader_sound_effects_desc', 'Sons de mapa e botões')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className={`btn-round-action px-5 py-2.5 min-w-[96px] h-11 rounded-full flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all cursor-pointer shrink-0 ${
                    soundEnabled ? 'bg-[#0284C7]' : 'bg-gray-400 opacity-60'
                  }`}
                >
                  <span>{soundEnabled ? t('settings_sound_on', 'Ligado') : t('settings_sound_off', 'Mudo')}</span>
                </button>
              </div>

              {/* Seletor de Idiomas */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#4A3B2C] mb-1">
                  🌍 {t('settings_language', 'Idioma do Aplicativo')}
                </div>
                <div className="text-xs text-[#6B5A45] font-semibold mb-3">
                  {t('settings_language_desc', 'Mudar para Inglês, Espanhol, Francês ou Italiano')}
                </div>
                <LanguageSelector variant="list" />
              </div>

              <div className="pt-2 space-y-3">
                <Link
                  href="/app/historias"
                  className="w-full min-h-[54px] py-3.5 px-5 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-amber-50 transition-colors"
                >
                  <span>{t('manage_stories', '📚 Biblioteca de Histórias')}</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full min-h-[54px] py-3.5 px-6 rounded-2xl bg-[#0D9488] text-white font-extrabold text-sm uppercase tracking-wider shadow-md hover:bg-[#0F766E] transition-all active:scale-98 flex items-center justify-center cursor-pointer"
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

