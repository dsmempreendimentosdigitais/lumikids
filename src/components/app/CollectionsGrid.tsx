'use client';

import React from 'react';

const COLLECTIONS = [
  { emoji: "✝️", title: "Vida de Jesus", count: "12 histórias", color: "ci-blue" },
  { emoji: "💤", title: "Hora de dormir", count: "28 histórias", color: "ci-teal" },
  { emoji: "❤️", title: "Sentimentos", count: "18 histórias", color: "ci-pink" },
  { emoji: "👸", title: "Mulheres Fortes", count: "15 histórias", color: "ci-gold" },
  { emoji: "🔬", title: "Inventores", count: "20 histórias", color: "ci-green" },
  { emoji: "📚", title: "Clássicos", count: "24 histórias", color: "ci-orange" },
];

export default function CollectionsGrid() {
  return (
    <div className="mb-[20px]">
      <div className="sec-lbl flex justify-between items-center text-[0.72rem] font-[900] text-[var(--blue-dark)] uppercase tracking-[1px] mb-[11px]">
        Coleções <a href="#" className="text-[0.7rem] text-[var(--blue)] font-[800] no-underline opacity-80">Ver todas</a>
      </div>
      <div className="cols-grid grid grid-cols-3 gap-[10px]">
        {COLLECTIONS.map((c, i) => (
          <div key={i} className="col-card bg-[var(--card)] rounded-[var(--radius-sm)] p-[14px_10px] text-center shadow-[var(--shadow)] cursor-pointer transition-all border-[1.5px] border-transparent hover:-translate-y-[3px] hover:border-[var(--blue)] active:scale-95">
            <div className={`col-icon w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-[1.2rem] mx-auto mb-[8px] ${c.color}`}>
              {c.emoji}
            </div>
            <h4 className="text-[0.73rem] font-[900] text-[var(--blue-dark)] mb-[2px] leading-[1.25]">{c.title}</h4>
            <span className="text-[0.62rem] text-[#aaa] font-[700]">{c.count}</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ci-blue{background:#E8EAF6} .ci-teal{background:#E0F2F1} .ci-pink{background:#FCE4EC}
        .ci-gold{background:#FFF8E1} .ci-green{background:#E8F5E9} .ci-purp{background:#EDE7F6}
        .ci-orange{background:#FFF3E0}
      `}</style>
    </div>
  );
}
