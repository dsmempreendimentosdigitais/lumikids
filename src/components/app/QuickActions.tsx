'use client';

import React from 'react';
import { Bot, Target, BookOpen, Moon } from 'lucide-react';

const ACTIONS = [
  { icon: <Bot size={22} />, title: "Criar com IA", desc: "Sua história em segundos", color: "qa-blue" },
  { icon: <Target size={22} />, title: "Missão do Bem", desc: "Tarefa de hoje", color: "qa-gold" },
  { icon: <BookOpen size={22} />, title: "Trilha Bíblica", desc: "Continue sua jornada", color: "qa-green" },
  { icon: <Moon size={22} />, title: "Hora de Dormir", desc: "Histórias calmas", color: "qa-coral" },
];

export default function QuickActions() {
  return (
    <div className="mb-[20px]">
      <div className="sec-lbl flex justify-between items-center text-[0.72rem] font-[900] text-[var(--blue-dark)] uppercase tracking-[1px] mb-[11px]">
        Criar & Explorar
      </div>
      <div className="quick-grid grid grid-cols-2 gap-[10px]">
        {ACTIONS.map((a, i) => (
          <div key={i} className={`qa-card rounded-[var(--radius-sm)] p-[16px_14px] cursor-pointer transition-all hover:-translate-y-[3px] active:scale-95 ${a.color} shadow-sm`}>
            <div className="qa-icon mb-[7px]">{a.icon}</div>
            <h4 className="text-[0.8rem] font-[900] mb-[2px]">{a.title}</h4>
            <p className="text-[0.67rem] font-[700] opacity-80 leading-[1.3]">{a.desc}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .qa-blue{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff}
        .qa-gold{background:linear-gradient(135deg,var(--gold),#FFB300);color:var(--blue-dark)}
        .qa-green{background:linear-gradient(135deg,var(--green),#66BB6A);color:#fff}
        .qa-coral{background:linear-gradient(135deg,var(--coral),#FF8A65);color:#fff}
      `}</style>
    </div>
  );
}
