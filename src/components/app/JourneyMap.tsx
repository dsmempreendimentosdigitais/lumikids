'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
    bgColor: 'from-amber-100 via-orange-50 to-amber-200',
    pathColor: '#F59E0B',
    accentColor: '#D97706',
    badgeBg: 'bg-amber-100 border-amber-300',
    badgeText: 'text-amber-800',
    cloudsColor: '#FEF3C7',
    bgDecoration: '🏛️'
  },
  'biblia-kids': {
    themeName: 'Caminho da Fé & Promessa',
    bgColor: 'from-emerald-100 via-teal-50 to-teal-200',
    pathColor: '#0D9488',
    accentColor: '#0F766E',
    badgeBg: 'bg-teal-100 border-teal-300',
    badgeText: 'text-teal-900',
    cloudsColor: '#CCFBF1',
    bgDecoration: '🕊️'
  },
  'mulheres-fortes': {
    themeName: 'Castelo das Heroínas',
    bgColor: 'from-rose-100 via-pink-50 to-purple-100',
    pathColor: '#E11D48',
    accentColor: '#BE123C',
    badgeBg: 'bg-rose-100 border-rose-300',
    badgeText: 'text-rose-900',
    cloudsColor: '#FFE4E6',
    bgDecoration: '👑'
  },
  'biografias-historicas': {
    themeName: 'Terra dos Grandes Líderes',
    bgColor: 'from-indigo-100 via-blue-50 to-indigo-200',
    pathColor: '#6366F1',
    accentColor: '#4F46E5',
    badgeBg: 'bg-indigo-100 border-indigo-300',
    badgeText: 'text-indigo-900',
    cloudsColor: '#E0E7FF',
    bgDecoration: '🏰'
  },
  'contos-de-herois': {
    themeName: 'Floresta das Fábulas',
    bgColor: 'from-sky-100 via-cyan-50 to-blue-200',
    pathColor: '#0284C7',
    accentColor: '#0369A1',
    badgeBg: 'bg-sky-100 border-sky-300',
    badgeText: 'text-sky-900',
    cloudsColor: '#E0F2FE',
    bgDecoration: '🛡️'
  },
  'inventores-genios': {
    themeName: 'Oficina das Descobertas',
    bgColor: 'from-yellow-100 via-amber-50 to-yellow-200',
    pathColor: '#CA8A04',
    accentColor: '#A16207',
    badgeBg: 'bg-yellow-100 border-yellow-300',
    badgeText: 'text-yellow-900',
    cloudsColor: '#FEF9C3',
    bgDecoration: '🔬'
  },
  'virtudes-em-acao': {
    themeName: 'Vale do Caráter & Luz',
    bgColor: 'from-purple-100 via-fuchsia-50 to-purple-200',
    pathColor: '#9333EA',
    accentColor: '#7E22CE',
    badgeBg: 'bg-purple-100 border-purple-300',
    badgeText: 'text-purple-900',
    cloudsColor: '#F3E8FF',
    bgDecoration: '✨'
  },
  'natureza-animais': {
    themeName: 'Santuário da Vida Selvagem',
    bgColor: 'from-lime-100 via-emerald-50 to-green-200',
    pathColor: '#16A34A',
    accentColor: '#15803D',
    badgeBg: 'bg-lime-100 border-lime-300',
    badgeText: 'text-lime-900',
    cloudsColor: '#ECFCCB',
    bgDecoration: '🌿'
  }
};

export default function JourneyMap({ stories, userPlan = 'free' }: JourneyWorldProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('mitologia-grega');
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeTrail = KNOWLEDGE_TRAILS.find(t => t.id === selectedCategory) || KNOWLEDGE_TRAILS[0];
  const worldConfig = WORLD_CONFIGS[selectedCategory] || WORLD_CONFIGS['mitologia-grega'];

  // Histórias da trilha selecionada
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

  return (
    <div className="w-full select-none font-sans">
      
      {/* ═══ MAPA PANORÂMICO DE AVENTURA ESTILO BIBLE APP FOR KIDS ═══ */}
      <div className={`relative w-full rounded-[36px] overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-b ${worldConfig.bgColor} p-4 sm:p-6 min-h-[700px]`}>
        
        {/* ELEMENTOS CENOGRÁFICOS DO RELEVO (Colinas, Lago, Montanhas, Céu) */}
        <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden">
          {/* Montanhas ao fundo */}
          <div className="absolute top-10 right-4 text-7xl opacity-30">🏔️</div>
          <div className="absolute top-20 right-28 text-6xl opacity-20">⛰️</div>
          {/* Nuvens fofas */}
          <div className="absolute top-6 left-8 text-5xl opacity-60 animate-pulse">☁️</div>
          <div className="absolute top-16 right-12 text-6xl opacity-50 animate-pulse" style={{ animationDelay: '1.5s' }}>☁️</div>
          {/* Árvores, ovelhas e lago */}
          <div className="absolute top-52 left-6 text-4xl opacity-30">🌲 🌳</div>
          <div className="absolute top-80 right-10 text-4xl opacity-25">🏕️ 🐑</div>
          <div className="absolute bottom-28 left-8 text-5xl opacity-25">🌊 ⛵</div>
          <div className="absolute bottom-48 right-6 text-5xl opacity-20">🏜️ 🐪</div>
        </div>

        {/* ═══ BARRA SUPERIOR INTEGRADA DO MAPA (Sem sobreposições) ═══ */}
        <div className="relative z-20 flex items-center justify-between gap-3 mb-8">
          {/* Botão de Livro / Catálogo de Histórias (Branco com ícone azul, Print 2) */}
          <button
            type="button"
            onClick={() => {
              playSound(580);
              setIsCatalogOpen(true);
            }}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-[#0284C7] shadow-lg border-2 border-slate-100 flex items-center justify-center font-bold text-xl hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="Abrir Catálogo de Histórias"
          >
            📖
          </button>

          {/* Seletor Temático do Mundo Atual em Pílula Elegante */}
          <div className="flex-1 flex justify-center overflow-x-auto py-1 scrollbar-none max-w-md">
            <div className="inline-flex items-center gap-1.5 p-1 bg-white/90 backdrop-blur-md rounded-full shadow-md border border-slate-200">
              {KNOWLEDGE_TRAILS.map((trail) => {
                const isSelected = trail.id === selectedCategory;
                return (
                  <button
                    key={trail.id}
                    onClick={() => {
                      setSelectedCategory(trail.id);
                      playSound(520);
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[#0D9488] text-white shadow-xs scale-105'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    title={trail.title}
                  >
                    <span>{trail.emoji}</span>
                    <span className="hidden sm:inline">{trail.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Troféu do Mundo no Canto Superior Direito */}
          <Link
            href="/app/progresso"
            onClick={() => playSound(480)}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-amber-500 shadow-lg border-2 border-slate-100 flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-transform shrink-0"
            title="Álbum de Figurinhas"
          >
            🏆
          </Link>
        </div>

        {/* Título do Mundo Ativo (Discreto e Limpo) */}
        <div className="relative z-10 text-center mb-10">
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full ${worldConfig.badgeBg} ${worldConfig.badgeText} border text-[0.7rem] font-black uppercase tracking-wider shadow-xs mb-1`}>
            <span>{activeTrail.emoji}</span>
            <span>{worldConfig.themeName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 drop-shadow-xs">
            {activeTrail.title}
          </h2>
        </div>

        {/* ═══ TRILHA SINUOSA COM PONTILHADO DOURADO & NÓS METÁLICOS ═══ */}
        <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center gap-14 pb-20">
          {trailStories.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center border-2 border-dashed border-slate-300 max-w-xs mx-auto my-12 shadow-sm">
              <span className="text-4xl block mb-2">🧭</span>
              <h4 className="font-bold text-slate-800 text-sm mb-1">Novos caminhos chegando!</h4>
              <p className="text-xs text-slate-500">As histórias deste mundo estão sendo mapeadas para os pequenos exploradores.</p>
            </div>
          ) : (
            trailStories.map((story, index) => {
              // Posicionamento sinuoso em zigue-zague (esquerda, centro, direita) estilo Bible App
              const positions = ['-translate-x-14 md:-translate-x-20', 'translate-x-0', 'translate-x-14 md:translate-x-20'];
              const posClass = positions[index % 3];
              
              const isFirst = index === 0;
              const isLocked = !isFirst && story.isLocked;
              const starsCount = story.stars || (isFirst ? 3 : 0);

              // Tags de atividade no canto do nó (adesivo, pincel, personagem)
              const activityTags = [
                { emoji: '🧩', bg: 'bg-pink-500' },
                { emoji: '🎨', bg: 'bg-purple-500' },
                { emoji: '🌟', bg: 'bg-amber-500' },
                { emoji: '👑', bg: 'bg-blue-500' }
              ];
              const tag = activityTags[index % activityTags.length];

              return (
                <div key={story.id} className={`relative flex flex-col items-center transition-all ${posClass}`}>
                  
                  {/* PONTILHADO DOURADO CONECTANDO OS NÓS (Estilo Bible App for Kids) */}
                  {index < trailStories.length - 1 && (
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
                    {/* NÓ METÁLICO 3D (Aro prateado circular com sombra) */}
                    <div className={`metallic-node-rim relative w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center cursor-pointer ${
                      isLocked ? 'grayscale opacity-75' : ''
                    }`}>
                      {/* Miniatura / Ilustração 2D da História */}
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                        {story.coverImageUrl ? (
                          <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                        ) : (
                          <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-125">
                            {story.coverEmoji || activeTrail.emoji}
                          </span>
                        )}
                      </div>

                      {/* Mini-Badge de Atividade no Canto Superior Direito do Nó */}
                      <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full ${tag.bg} text-white flex items-center justify-center text-xs shadow-md border-2 border-white`}>
                        <span>{tag.emoji}</span>
                      </div>

                      {/* PEDESTAL DAS 3 ESTRELAS NA BASE INFERIOR (Estilo Bible App for Kids) */}
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

        {/* ═══ BARRA FLUTUANTE DE STATS NO CANTO INFERIOR ESQUERDO (Estilo Bible App) ═══ */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-md rounded-full px-4 py-2 border-2 border-slate-200/90 shadow-xl flex items-center gap-3.5">
          <div className="flex items-center gap-1.5 font-black text-amber-700 text-xs sm:text-sm" title="Troféus de histórias completadas">
            <span className="text-base">🏆</span>
            <span>{completedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-amber-500 text-xs sm:text-sm" title="Estrelas coletadas">
            <span className="text-base">⭐</span>
            <span>{totalStarsCount}</span>
          </div>
          <div className="flex items-center gap-1.5 font-black text-cyan-600 text-xs sm:text-sm" title="Gemas do explorador">
            <span className="text-base">💎</span>
            <span>{diamondCount}</span>
          </div>
        </div>

        {/* ═══ BOTÕES FLUTUANTES DE AÇÃO NO CANTO INFERIOR DIREITO (Estilo Bible App) ═══ */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2.5">
          {/* Botão de Perfil / Álbum */}
          <Link
            href="/app/progresso"
            onClick={() => playSound(480)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#0284C7] shadow-lg border-2 border-slate-100 flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
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
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-[#0284C7] shadow-lg border-2 border-slate-100 flex items-center justify-center font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsSettingsOpen(false)}
        >
          <div 
            className="w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra de Pedra Entalhada */}
            <div className="stone-banner py-4 px-6 flex items-center justify-between text-white">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="btn-round-action w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shadow-xs"
              >
                ←
              </button>
              <h3 className="font-serif font-black text-lg tracking-wide uppercase drop-shadow-md">
                Configurações
              </h3>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white border border-white/40">
                i
              </div>
            </div>

            {/* Corpo em Pergaminho Dobrado */}
            <div className="parchment-sheet p-6 space-y-4 text-[#2D2114]">
              <div className="flex items-center justify-between py-2 border-b border-amber-900/10">
                <span className="font-bold text-sm">Sound Effects</span>
                <button
                  type="button"
                  onClick={() => setSoundEnabled(prev => !prev)}
                  className={`btn-round-action w-10 h-10 rounded-full flex items-center justify-center text-white text-base ${
                    soundEnabled ? 'opacity-100' : 'opacity-40 grayscale'
                  }`}
                >
                  {soundEnabled ? '🔊' : '🔇'}
                </button>
              </div>

              <div className="pt-3 space-y-2.5">
                <Link
                  href="/app/historias"
                  className="w-full py-3 rounded-full bg-white border-2 border-amber-400 text-[#2D2114] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs hover:bg-amber-50"
                >
                  <span>📚 Gerenciar Histórias</span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-3 rounded-full bg-[#0D9488] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#0F766E]"
                >
                  Salvar & Fechar ✨
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

