'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { SupportedLanguage } from '@/locales/types';
import { Check, X } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'pill' | 'list' | 'modal';
  onSelect?: () => void;
  className?: string;
}

export default function LanguageSelector({
  variant = 'pill',
  onSelect,
  className = '',
}: LanguageSelectorProps) {
  const { language, setLanguage, languages } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (code: SupportedLanguage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLanguage(code);
    setIsOpen(false);
    if (onSelect) onSelect();
  };

  const current = languages.find((l) => l.code === language) || languages[0];

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
              onClick={(e) => handleSelect(item.code, e)}
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

  // Variant: compact pill (para barras superiores e navegação)
  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className="h-8.5 sm:h-9 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-white/95 hover:bg-white text-slate-900 border border-white/60 shadow-md text-xs font-black transition-all active:scale-95 cursor-pointer shrink-0 select-none"
        title="Alterar idioma / Change language"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="uppercase text-[0.72rem] tracking-wider text-slate-800 font-black">
          {current.code}
        </span>
        <span className="text-[9px] text-slate-400">▼</span>
      </button>

      {/* Modal / Dialog Seguro contra clipping de overflow-hidden */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🌍</span> Idioma da História
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Alterne a tradução e narração da história
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
                title="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              {languages.map((item) => {
                const isSelected = item.code === language;
                return (
                  <button
                    key={item.code}
                    type="button"
                    onClick={(e) => handleSelect(item.code, e)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-left transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-400 text-amber-950 font-black shadow-xs ring-2 ring-amber-300/40'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl leading-none">{item.flag}</span>
                      <div>
                        <div className="text-sm font-bold leading-tight">{item.name}</div>
                        <div className="text-[0.68rem] text-slate-500">{item.label}</div>
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

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
              className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
