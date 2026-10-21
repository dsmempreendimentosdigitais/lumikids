'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Crown, Shield, Landmark, Lightbulb, HeartHandshake, Trees, Compass } from 'lucide-react';

export const KNOWLEDGE_TRAILS = [
  { 
    id: 'mitologia-grega', 
    emoji: '🏛️', 
    title: 'Mitologia Grega', 
    desc: 'Hércules, Perseu e lições clássicas de coragem', 
    gradient: 'from-amber-500 to-orange-600', 
    borderColor: 'border-amber-500/30',
    icon: 'Landmark' 
  },
  { 
    id: 'biblia-kids', 
    emoji: '📖', 
    title: 'Histórias da Bíblia', 
    desc: 'Davi, Arca de Noé, Parábolas e fé viva', 
    gradient: 'from-emerald-400 to-teal-600', 
    borderColor: 'border-emerald-500/30',
    icon: 'BookOpen' 
  },
  { 
    id: 'mulheres-fortes', 
    emoji: '👑', 
    title: 'Mulheres Fortes', 
    desc: 'Joana d\'Arc, Princesa Isabel e bravura', 
    gradient: 'from-pink-500 to-rose-600', 
    borderColor: 'border-pink-500/30',
    icon: 'Crown' 
  },
  { 
    id: 'biografias-historicas', 
    emoji: '🏰', 
    title: 'Biografias Inspiradoras', 
    desc: 'São Luís IX, Santos Dumont e grandes líderes', 
    gradient: 'from-indigo-500 to-purple-600', 
    borderColor: 'border-indigo-500/30',
    icon: 'Compass' 
  },
  { 
    id: 'contos-de-herois', 
    emoji: '🛡️', 
    title: 'Contos & Fábulas', 
    desc: 'Fábulas de Esopo, Nárnia e São Jorge', 
    gradient: 'from-blue-500 to-cyan-600', 
    borderColor: 'border-blue-500/30',
    icon: 'Shield' 
  },
  { 
    id: 'inventores-genios', 
    emoji: '🔬', 
    title: 'Inventores & Ciência', 
    desc: 'Grandes mentes e descobertas do mundo', 
    gradient: 'from-yellow-400 to-amber-600', 
    borderColor: 'border-yellow-500/30',
    icon: 'Lightbulb' 
  },
  { 
    id: 'virtudes-em-acao', 
    emoji: '✨', 
    title: 'Virtudes em Ação', 
    desc: 'Verdade, paciência, autonomia e respeito aos pais', 
    gradient: 'from-purple-400 to-pink-500', 
    borderColor: 'border-purple-500/30',
    icon: 'HeartHandshake' 
  },
  { 
    id: 'natureza-animais', 
    emoji: '🌿', 
    title: 'Natureza & Animais', 
    desc: 'Explorações do Pantanal e vida selvagem', 
    gradient: 'from-lime-400 to-emerald-600', 
    borderColor: 'border-lime-500/30',
    icon: 'Trees' 
  },
];

const ICON_MAP: Record<string, any> = {
  Landmark,
  BookOpen,
  Crown,
  Compass,
  Shield,
  Lightbulb,
  HeartHandshake,
  Trees
};

export default function CollectionsGrid() {
  return (
    <div className="mb-8 font-sans">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span>✨</span> Trilhas de Conhecimento & Virtudes
          </h4>
          <p className="text-[0.7rem] text-slate-500 font-medium mt-0.5">Histórias inteligentes adaptadas para formar mentes brilhantes</p>
        </div>
        <Link href="/app/historias" className="text-xs text-[#0D9488] font-bold hover:underline whitespace-nowrap">Ver todas</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KNOWLEDGE_TRAILS.map((trail) => {
          const IconComp = ICON_MAP[trail.icon] || BookOpen;
          return (
            <Link 
              key={trail.id} 
              href={`/app/historias?cat=${trail.id}`}
              className="group block"
            >
              <div className="bg-white border border-slate-200/90 rounded-[22px] p-4 h-full flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#0D9488]/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{trail.emoji}</span>
                    <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0D9488]">
                      <IconComp size={14} />
                    </div>
                  </div>
                  <h5 className="font-serif font-bold text-slate-900 text-sm mb-1 leading-snug">{trail.title}</h5>
                  <p className="text-[0.68rem] text-slate-500 leading-snug line-clamp-2 font-medium">{trail.desc}</p>
                </div>
                <div className="mt-3.5 flex items-center justify-between text-[0.65rem] font-bold text-[#0D9488] group-hover:translate-x-0.5 transition-transform">
                  <span>Explorar Trilha</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
