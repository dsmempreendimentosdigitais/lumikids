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
  const [interactiveSound, setInteractiveSound] = useState(false);

  const activeTrail = KNOWLEDGE_TRAILS.find(t => t.id === selectedCategory) || KNOWLEDGE_TRAILS[0];
  const worldConfig = WORLD_CONFIGS[selectedCategory] || WORLD_CONFIGS['mitologia-grega'];

  // Histórias da trilha selecionada
  const trailStories = stories.filter(s => s.category === selectedCategory);

  // Efeito sonoro suave lúdico ao tocar nos botões (estilo Bible App for Kids)
  const playSound = (freq = 440) => {
    if (typeof window === 'undefined') return;
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
    } catch (e) {
      // Ignorar caso navegador bloqueie
    }
  };

  return (
    <div className="w-full select-none font-sans">
      {/* ═══ BARRA SUPERIOR DE TRILHAS (Seleção de Mundos do Mapa) ═══ */}
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <div>
              <h3 className="font-bold text-slate-800 text-sm tracking-tight flex items-center gap-1.5">
                Mundos de Aprendizado
                <span className="text-[0.65rem] font-black uppercase px-2 py-0.5 rounded-full bg-teal-100 text-[#0D9488]">
                  Trilha Interativa
                </span>
              </h3>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500">
            {trailStories.length} histórias
          </span>
        </div>

        {/* Pílulas de Seleção de Mundos estilo Carrossel Lúdico */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 px-1 scrollbar-none">
          {KNOWLEDGE_TRAILS.map((trail) => {
            const isSelected = trail.id === selectedCategory;
            return (
              <button
                key={trail.id}
                onClick={() => {
                  setSelectedCategory(trail.id);
                  playSound(520);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl transition-all duration-200 shrink-0 font-bold text-xs shadow-xs active:scale-95 border-2 ${
                  isSelected
                    ? 'bg-white border-[#0D9488] text-slate-900 shadow-md scale-105'
                    : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-white'
                }`}
              >
                <span className="text-lg">{trail.emoji}</span>
                <span>{trail.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ MAPA EM PERSPECTIVA ESTILO BIBLE APP FOR KIDS ═══ */}
      <div className={`relative w-full rounded-[36px] overflow-hidden border-4 border-white shadow-xl bg-gradient-to-b ${worldConfig.bgColor} p-6 min-h-[580px]`}>
        
        {/* Nuvens e elementos decorativos no céu */}
        <div className="absolute top-4 left-6 text-4xl opacity-50 pointer-events-none animate-pulse">☁️</div>
        <div className="absolute top-12 right-8 text-5xl opacity-40 pointer-events-none animate-pulse" style={{ animationDelay: '1.2s' }}>☁️</div>
        <div className="absolute top-28 left-1/2 -translate-x-1/2 text-6xl opacity-20 pointer-events-none">
          {worldConfig.bgDecoration}
        </div>

        {/* Título do Mundo Atual */}
        <div className="relative z-10 text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${worldConfig.badgeBg} ${worldConfig.badgeText} border text-xs font-black uppercase tracking-wider shadow-xs mb-2`}>
            <span>{activeTrail.emoji}</span>
            <span>{worldConfig.themeName}</span>
          </div>
          <h2 className="text-2xl font-serif font-black text-slate-900">
            {activeTrail.title}
          </h2>
          <p className="text-xs font-medium text-slate-600 max-w-xs mx-auto mt-1">
            {activeTrail.desc}
          </p>
        </div>

        {/* Linha Curva do Caminho Sinuoso (Path de pedras do mapa) */}
        <div className="relative z-10 max-w-sm mx-auto flex flex-col items-center gap-12 pb-12">
          {trailStories.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 text-center border-2 border-dashed border-slate-300 max-w-xs mx-auto my-12">
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

              return (
                <div key={story.id} className={`relative flex flex-col items-center transition-all ${posClass}`}>
                  
                  {/* Ponto / Conector com a próxima história */}
                  {index < trailStories.length - 1 && (
                    <div className="absolute top-16 w-1.5 h-14 border-l-4 border-dashed border-amber-400/80 -z-0"></div>
                  )}

                  {/* Card do Marco no Caminho */}
                  <Link
                    href={`/app/historias/${story.id}`}
                    onClick={() => playSound(640)}
                    className="group relative flex flex-col items-center focus:outline-none"
                  >
                    {/* Badge flutuante do número da fase */}
                    <div className="absolute -top-3 z-20 bg-white border-2 border-amber-400 text-amber-900 font-black text-[0.65rem] px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <span>Nível {index + 1}</span>
                    </div>

                    {/* Botão circular de grande destaque estilo ilha (Touch target grande para crianças) */}
                    <div className={`relative w-24 h-24 rounded-full border-4 shadow-xl flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 active:scale-95 ${
                      isLocked
                        ? 'bg-slate-200 border-slate-400 text-slate-400 opacity-80'
                        : 'bg-white border-amber-400 hover:border-[#0D9488] shadow-amber-500/20'
                    }`}>
                      {/* Ilustração ou Emoji da História */}
                      {story.coverImageUrl ? (
                        <div className="w-full h-full rounded-full overflow-hidden">
                          <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <span className="text-4xl drop-shadow-sm transition-transform group-hover:scale-125">
                          {story.coverEmoji || activeTrail.emoji}
                        </span>
                      )}

                      {/* Efeito Glow / Borda animada quando desbloqueado */}
                      {!isLocked && (
                        <div className="absolute -inset-1 rounded-full border-2 border-amber-300/60 animate-ping pointer-events-none opacity-40"></div>
                      )}

                      {/* Ícone de Play / Lock */}
                      <div className="absolute -bottom-2 -right-1 w-8 h-8 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs shadow-md border-2 border-white">
                        {isLocked ? <Lock size={14} /> : <Play size={14} className="fill-white ml-0.5" />}
                      </div>
                    </div>

                    {/* Estrelinhas de Recompensa (0 a 3 estrelas estilo Bible App for Kids) */}
                    <div className="flex gap-1 mt-2.5">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={`${
                            s <= starsCount
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Nome da História em Caixa Lúdica */}
                    <div className="mt-2 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-2xl border border-slate-200/90 shadow-sm max-w-[170px] text-center">
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

        {/* Base do Mapa: Banner de Conquista da Trilha */}
        <div className="relative z-10 bg-white/95 backdrop-blur-md rounded-3xl p-4 border border-slate-200 shadow-md flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-xs">
              🏆
            </div>
            <div>
              <h5 className="font-bold text-slate-900 text-xs">Troféu do Mundo</h5>
              <p className="text-[0.7rem] text-slate-500 font-medium">Complete todas para desbloquear o distintivo de ouro!</p>
            </div>
          </div>
          <Link
            href="/app/progresso"
            className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors shrink-0"
          >
            Ver Álbum
          </Link>
        </div>

      </div>
    </div>
  );
}
