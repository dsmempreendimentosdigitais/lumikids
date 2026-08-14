'use client';
import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-[10px] text-xs',
    md: 'w-9 h-9 rounded-[14px] text-sm',
    lg: 'w-12 h-12 rounded-[18px] text-lg'
  };

  const starSizes = {
    sm: 14,
    md: 18,
    lg: 24
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Ícone Squircle Gradiente Rosa-Roxo com Estrelas Douradas (Estilo Anexo) */}
      <div className={`${iconSizes[size]} bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-yellow-300 shadow-[0_0_15px_rgba(217,70,239,0.5)] border border-pink-400/30 flex-shrink-0 animate-pulse`}>
        <Sparkles size={starSizes[size]} className="fill-yellow-300 text-yellow-300 drop-shadow-[0_0_6px_rgba(253,224,71,0.8)]" />
      </div>

      {showText && (
        <span className={`${textSizes[size]} font-serif font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-purple-100 to-blue-200 drop-shadow-md`}>
          Lumi<em className="not-italic text-yellow-300">kids</em>
        </span>
      )}
    </div>
  );
}
