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
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Ícone Squircle Teal & Gold */}
      <div className={`${iconSizes[size]} bg-[#0D9488] flex items-center justify-center text-amber-300 shadow-xs border border-teal-600/20 flex-shrink-0`}>
        <Sparkles size={starSizes[size]} className="fill-amber-300 text-amber-300" />
      </div>

      {showText && (
        <span className={`${textSizes[size]} font-serif font-extrabold tracking-tight text-slate-900`}>
          Lumi<span className="text-[#0D9488]">kids</span>
        </span>
      )}
    </div>
  );
}
