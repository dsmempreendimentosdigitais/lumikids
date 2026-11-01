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
    sm: { icon: 'w-7 h-7', text: 'text-lg', badge: 'text-[0.6rem]' },
    md: { icon: 'w-9 h-9', text: 'text-2xl', badge: 'text-[0.65rem]' },
    lg: { icon: 'w-12 h-12', text: 'text-3xl', badge: 'text-xs' },
    xl: { icon: 'w-16 h-16', text: 'text-4xl', badge: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Ícone da Estrelinha Sorridente */}
      <div className={`relative ${currentSize.icon} shrink-0 drop-shadow-md rounded-2xl overflow-hidden`}>
        <img 
          src="/icons/lumikids-star-logo.svg" 
          alt="Lumikids Estrela" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Tipografia da Marca */}
      <div className="flex flex-col leading-none">
        <div className={`font-serif font-black tracking-tight ${currentSize.text} ${variant === 'light' ? 'text-white' : 'text-slate-900'}`}>
          <span>Lumi</span>
          <span className="text-[#F59E0B]">kids</span>
        </div>
      </div>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="hover:opacity-95 transition-opacity inline-block" title="Lumikids - Início">
        {content}
      </Link>
    );
  }

  return content;
}
