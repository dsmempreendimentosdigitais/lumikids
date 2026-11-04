'use client';
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-[10px]',
    md: 'w-9 h-9 rounded-[14px]',
    lg: 'w-12 h-12 rounded-[18px]'
  };

  const textSizes = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Ícone Estrela Contos & Virtudes */}
      <div className={`${iconSizes[size]} bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 flex items-center justify-center p-1 shadow-xs border border-amber-300/40 shrink-0`}>
        <img 
          src="/icons/lumikids-star-logo.svg" 
          alt="Contos & Virtudes" 
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${textSizes[size]} font-serif font-black tracking-tight text-slate-900`}>
            Contos <span className="text-[#0D9488]">&</span> <span className="text-[#D97706]">Virtudes</span>
          </span>
          {size === 'lg' && (
            <span className="font-sans font-semibold uppercase tracking-widest text-[0.6rem] text-slate-400">
              Histórias com Valores
            </span>
          )}
        </div>
      )}
    </div>
  );
}
