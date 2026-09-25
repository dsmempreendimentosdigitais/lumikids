const fs = require('fs');
const path = 'src/components/app/CollectionsGrid.tsx';
const content = `'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, Crown, Shield, Landmark, Lightbulb, HeartHandshake, Trees, Compass } from 'lucide-react';

export const KNOWLEDGE_TRAILS = [
  { 
    id: 'mitologia-grega', 
    emoji: '???', 
    title: 'Mitologia Grega', 
    desc: 'Hércules, Perseu e lições clássicas de coragem', 
    gradient: 'from-amber-500 to-orange-600', 
    borderColor: 'border-amber-500/30',
    icon: Landmark 
  },
  { 
    id: 'biblia-kids', 
    emoji: '??', 
    title: 'Histórias da Bíblia', 
    desc: 'Davi, Arca de Noé, Parábolas e fé viva', 
    gradient: 'from-emerald-400 to-teal-600', 
    borderColor: 'border-emerald-500/30',
    icon: BookOpen 
  },
  { 
    id: 'mulheres-fortes', 
    emoji: '??', 
    title: 'Mulheres Fortes', 
    desc: 'Joana d\'Arc, Princesa Isabel e bravura', 
    gradient: 'from-pink-500 to-rose-600', 
    borderColor: 'border-pink-500/30',
    icon: Crown 
  },
  { 
    id: 'biografias-historicas', 
    emoji: '??', 
    title: 'Biografias Inspiradoras', 
    desc: 'São Luís IX, Santos Dumont e grandes líderes', 
    gradient: 'from-indigo-500 to-purple-600', 
    borderColor: 'border-indigo-500/30',
    icon: Compass 
  },
  { 
    id: 'contos-de-herois', 
    emoji: '???', 
    title: 'Contos & Fábulas', 
    desc: 'Fábulas de Esopo, Nárnia e São Jorge', 
    gradient: 'from-blue-500 to-cyan-600', 
    borderColor: 'border-blue-500/30',
    icon: Shield 
  },
  { 
    id: 'inventores-genios', 
    emoji: '??', 
    title: 'Inventores & Ciência', 
    desc: 'Grandes mentes e descobertas do mundo', 
    gradient: 'from-yellow-400 to-amber-600', 
    borderColor: 'border-yellow-500/30',
    icon: Lightbulb 
  },
  { 
    id: 'virtudes-em-acao', 
    emoji: '?', 
    title: 'Virtudes em Ação', 
    desc: 'Verdade, paciência, autonomia e respeito aos pais', 
    gradient: 'from-purple-400 to-pink-500', 
    borderColor: 'border-purple-500/30',
    icon: HeartHandshake 
  },
  { 
    id: 'natureza-animais', 
    emoji: '??', 
    title: 'Natureza & Animais', 
    desc: 'Explorações do Pantanal e vida selvagem', 
    gradient: 'from-lime-400 to-emerald-600', 
    borderColor: 'border-lime-500/30',
    icon: Trees 
  },
];

export default function CollectionsGrid() {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest flex items-center gap-2">
            <span>?</span> Trilhas de Conhecimento & Virtudes
          </h4>
          <p className="text-[0.68rem] text-purple-200/50 font-medium">Histórias inteligentes e educativas adaptadas para formar grandes mentes</p>
        </div>
        <Link href="/app/historias" className="text-xs text-blue-400 font-bold hover:text-blue-300">Ver todas</Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {KNOWLEDGE_TRAILS.map((trail) => {
          const IconComp = trail.icon;
          return (
            <Link 
              key={trail.id} 
              href={`/app/historias?cat=${trail.id}`}
              className="relative group block"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-br ${trail.gradient} rounded-[22px] opacity-40 blur-[2px] group-hover:opacity-100 transition duration-300`}></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[20px] p-3.5 h-full flex flex-col justify-between backdrop-blur-md transition-all hover:-translate-y-1">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{trail.emoji}</span>
                    <div className={`w-7 h-7 rounded-lg bg-white/5 border ${trail.borderColor} flex items-center justify-center text-white/70 group-hover:text-white transition-colors`}>
                      <IconComp size={14} />
                    </div>
                  </div>
                  <h5 className="font-bold text-white text-xs mb-1 leading-tight">{trail.title}</h5>
                  <p className="text-[0.63rem] text-purple-200/50 leading-snug line-clamp-2 font-medium">{trail.desc}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[0.6rem] font-bold text-pink-400 group-hover:translate-x-1 transition-transform">
                  <span>Explorar Trilha</span>
                  <span>?</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(path, content, 'utf-8');
console.log('CollectionsGrid updated successfully!');
