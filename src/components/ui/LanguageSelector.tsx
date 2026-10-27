'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/locales/types';
import { Globe, Check } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'pill' | 'list' | 'modal';
  onSelect?: () => void;
  className?: string;
}

export default function LanguageSelector({ variant = 'pill', onSelect, className = '' }: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: SupportedLanguage) => {
    setLanguage(code);
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  const current = languages.find(l => l.code === language) || languages[0];

  // Variant: embedded list (ideal for settings parchment / config page)
  if (variant === 'list') {
    return (
      <div className={`space-y-2 w-full ${className}`}>
        {languages.map((item) => {
          const isSelected = item.code === language;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'bg-amber-100/70 border-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300/40'
                  : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{item.flag}</span>
                <div>
                  <div className="text-sm leading-tight font-bold">{item.name}</div>
                  <div className="text-[0.7rem] text-slate-500 font-medium">{item.label}</div>
                </div>
              </div>
              {isSelected ? (
                <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-xs">
                  <Check size={14} strokeWidth={3} />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border border-slate-300" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Variant: compact pill (for top headers or floating action bars)
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 border border-slate-200 shadow-xs text-xs font-bold transition-all active:scale-95 cursor-pointer backdrop-blur-md"
        title="Alterar idioma / Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase text-[0.7rem] tracking-wider text-slate-700">{current.code}</span>
        <Globe size={13} className="text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
              Idioma / Language
            </div>
            {languages.map((item) => {
              const isSelected = item.code === language;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                    isSelected ? 'bg-amber-50 text-amber-950 font-black' : 'text-slate-700 hover:bg-slate-100 font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{item.flag}</span>
                    <span>{item.name}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-[#0D9488]" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
