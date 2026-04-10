'use client';

import React from 'react';
import { Play } from 'lucide-react';

interface StoryDayCardProps {
  title: string;
  category: string;
  duration: string;
  ageGroup: string;
}

export default function StoryDayCard({ title, category, duration, ageGroup }: StoryDayCardProps) {
  return (
    <div className="story-day-card bg-gradient-to-br from-[var(--blue-dark)] via-[#3949AB] to-[#5C6BC0] rounded-[var(--radius)] p-[20px] mb-[18px] relative overflow-hidden shadow-[var(--shadow-lg)] group">
      {/* Decorative stars */}
      <div className="absolute right-[16px] top-[14px] text-[1.3rem] text-[rgba(249,168,37,0.45)]">✦</div>
      <div className="absolute right-[36px] top-[28px] text-[0.65rem] text-[rgba(249,168,37,0.3)]">✦</div>
      
      <div className="sdc-tag inline-flex items-center gap-[5px] bg-[rgba(249,168,37,0.22)] border border-[rgba(249,168,37,0.4)] rounded-full px-[11px] py-[4px] text-[0.68rem] font-[800] text-[var(--gold)] tracking-[0.5px] uppercase mb-[10px]">
        ✦ História do dia
      </div>
      
      <h3 className="sdc-title text-white text-[1.1rem] font-[900] leading-[1.3] mb-[8px] max-w-[200px]">
        {title}
      </h3>
      
      <div className="sdc-meta flex items-center gap-[6px] text-[rgba(255,255,255,0.75)] text-[0.72rem] font-[700] mb-[14px]">
        <span>📖 {category}</span>
        <span className="opacity-50 text-[10px]">•</span>
        <span>{duration}</span>
        <span className="opacity-50 text-[10px]">•</span>
        <span>{ageGroup}</span>
      </div>
      
      <button className="sdc-play inline-flex items-center gap-[8px] bg-[var(--gold)] text-[var(--blue-dark)] border-none rounded-full px-[20px] py-[10px] font-[900] text-[0.85rem] cursor-pointer transition-all hover:scale-[1.04] shadow-[0_4px_14px_rgba(249,168,37,0.4)] active:scale-95">
        <div className="play-circle w-[22px] h-[22px] bg-[var(--blue-dark)] rounded-full flex items-center justify-center text-[0.62rem] text-[var(--gold)]">
          <Play size={10} fill="currentColor" />
        </div>
        Ouvir agora
      </button>
    </div>
  );
}
