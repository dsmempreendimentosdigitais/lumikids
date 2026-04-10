'use client';

import React from 'react';

interface AppHeaderProps {
  userName: string;
  childName: string;
}

export default function AppHeader({ userName, childName }: AppHeaderProps) {
  return (
    <div className="app-header bg-gradient-to-br from-[var(--blue)] to-[var(--blue2)] p-[36px_22px_76px] rounded-b-[32px] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-50px] right-[-40px] w-[160px] h-[160px] bg-[rgba(255,255,255,0.07)] rounded-full"></div>
      <div className="absolute bottom-[-20px] left-[-30px] w-[110px] h-[110px] bg-[rgba(255,255,255,0.05)] rounded-full"></div>
      
      <div className="header-top flex justify-between items-center mb-[18px] relative z-10">
        <div className="header-logo text-[1.32rem] font-[900] text-white tracking-[-0.5px]">
          Lumi<em className="font-normal text-[var(--gold)] not-italic">kids</em>
        </div>
        <div className="header-avatar w-[38px] h-[38px] bg-[var(--gold)] rounded-full flex items-center justify-center font-[900] text-[0.95rem] text-[var(--blue-dark)] shadow-[0_2px_10px_rgba(249,168,37,0.4)] cursor-pointer hover:scale-105 transition-transform">
          {childName.charAt(0)}
        </div>
      </div>
      
      <div className="header-greeting text-[rgba(255,255,255,0.8)] text-[0.88rem] font-[700] mb-[3px] relative z-10">
        Boa noite, {childName} 👋
      </div>
      <div className="header-title text-white text-[1.5rem] font-[900] tracking-[-0.5px] leading-[1.2] relative z-10">
        O que vamos<br />ler hoje?
      </div>
      
      <div className="age-selector mt-[16px] flex gap-[8px] flex-wrap relative z-10">
        <div className="age-pill inline-flex items-center gap-[5px] px-[13px] py-[6px] rounded-full text-[0.75rem] font-[800] cursor-pointer border-2 border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.18)] text-[rgba(255,255,255,0.9)] transition-all hover:bg-[rgba(255,255,255,0.3)]">
          🍼 2–4 anos
        </div>
        <div className="age-pill active inline-flex items-center gap-[5px] px-[13px] py-[6px] rounded-full text-[0.75rem] font-[800] cursor-pointer border-2 border-white bg-white text-[var(--blue)] shadow-[0_2px_10px_rgba(0,0,0,0.12)]">
          📚 5–7 anos
        </div>
        <div className="age-pill inline-flex items-center gap-[5px] px-[13px] py-[6px] rounded-full text-[0.75rem] font-[800] cursor-pointer border-2 border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.18)] text-[rgba(255,255,255,0.9)] transition-all hover:bg-[rgba(255,255,255,0.3)]">
          🎓 8–10 anos
        </div>
      </div>
    </div>
  );
}
