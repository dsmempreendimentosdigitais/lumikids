'use client';
import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface InteractiveCountingProps {
  instruction?: string;
  targetCount?: number;
  itemEmoji?: string;
  onSuccess?: () => void;
}

export default function InteractiveCounting({
  instruction = "Ajude a contar 3 maçãs para a vovó! Toque em cada maçã 🍎",
  targetCount = 3,
  itemEmoji = "🍎",
  onSuccess
}: InteractiveCountingProps) {
  const [clickedIndices, setClickedIndices] = useState<number[]>([]);

  const items = Array.from({ length: targetCount });

  const handleItemClick = (index: number) => {
    if (clickedIndices.includes(index)) return;
    
    const updated = [...clickedIndices, index];
    setClickedIndices(updated);

    if (updated.length === targetCount) {
      if (onSuccess) onSuccess();
    }
  };

  const handleReset = () => {
    setClickedIndices([]);
  };

  const isCompleted = clickedIndices.length === targetCount;

  return (
    <div className="w-full bg-[#150F2D] border-2 border-purple-500/40 rounded-[28px] p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)] text-white relative overflow-hidden select-none my-4">
      {/* Header com Instrução */}
      <div className="flex items-center gap-2 mb-2 text-center justify-center">
        <Sparkles size={20} className="text-yellow-300 animate-spin" />
        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200">
          DESAFIO DE MATEMÁTICA: CONTAGEM! 🧮
        </span>
      </div>

      <p className="text-xs font-semibold text-purple-200/90 text-center mb-6 leading-relaxed">
        {instruction}
      </p>

      {/* Grid de Itens para Contar */}
      <div className="flex flex-wrap items-center justify-center gap-4 py-4 bg-[#0B0819] rounded-2xl border border-purple-500/30">
        {items.map((_, idx) => {
          const isClicked = clickedIndices.includes(idx);
          const clickOrder = clickedIndices.indexOf(idx) + 1;

          return (
            <button
              key={idx}
              onClick={() => handleItemClick(idx)}
              className={`relative w-20 h-20 rounded-2xl border-2 transition-all transform flex items-center justify-center text-4xl ${
                isClicked
                  ? 'bg-gradient-to-tr from-green-500 to-emerald-600 border-white scale-110 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                  : 'bg-purple-950/60 border-purple-500/40 hover:scale-105 active:scale-95 shadow-md'
              }`}
            >
              {itemEmoji}

              {/* Número contado */}
              {isClicked && (
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-yellow-300 text-purple-950 font-black text-sm flex items-center justify-center shadow-lg border border-white animate-bounce">
                  {clickOrder}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Contador numérico de progresso */}
      <div className="mt-4 text-center">
        <span className="text-xs font-black text-purple-200 uppercase tracking-widest">
          Contados: <strong className="text-yellow-300 text-base">{clickedIndices.length}</strong> de <strong className="text-white text-base">{targetCount}</strong>
        </span>
      </div>

      {/* Mensagem de Sucesso & Celebração */}
      {isCompleted && (
        <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={22} className="text-green-400" />
            <span className="text-xs font-black text-white">Incrível! Você contou tudo certinho! 🌟</span>
          </div>
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-purple-900/60 text-purple-200 hover:text-white transition-colors"
            title="Contar novamente"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
