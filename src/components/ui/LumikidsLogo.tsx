import React from 'react';
import Link from 'next/link';

interface LumikidsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  withLink?: boolean;
}

export default function LumikidsLogo({
  className = '',
  size = 'md',
  variant = 'dark',
  withLink = true,
}: LumikidsLogoProps) {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-base sm:text-lg', badge: 'hidden' },
    md: { icon: 'w-9 h-9', text: 'text-lg sm:text-xl md:text-2xl', badge: 'text-[0.62rem]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl sm:text-3xl', badge: 'text-[0.7rem]' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl sm:text-4xl', badge: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Ícone da Estrelinha Dourada / Farol de Luz */}
      <div className={`relative ${currentSize.icon} shrink-0 drop-shadow-md rounded-2xl overflow-hidden`}>
        <img 
          src="/icons/lumikids-star-logo.svg" 
          alt="Contos & Virtudes Estrela" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Tipografia da Marca Contos & Virtudes */}
      <div className="flex flex-col leading-tight">
        <div className={`font-serif font-black tracking-tight ${currentSize.text} ${variant === 'light' ? 'text-white' : 'text-slate-900'}`}>
          <span>Contos </span>
          <span className="text-[#0D9488] font-sans font-bold">&</span>
          <span className="text-[#D97706]"> Virtudes</span>
        </div>
        <span className={`font-sans font-semibold uppercase tracking-widest text-[0.58rem] sm:text-[0.62rem] ${variant === 'light' ? 'text-amber-200/80' : 'text-slate-400'}`}>
          Histórias com Valores
        </span>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="hover:opacity-95 transition-opacity inline-block" title="Contos & Virtudes - Início">
        {content}
      </Link>
    );
  }

  return content;
}
