'use client';
import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface InteractiveShapeMatchProps {
  instruction?: string;
  targetShape?: 'star' | 'circle' | 'triangle' | 'square';
  onSuccess?: () => void;
}

export default function InteractiveShapeMatch({
  instruction = "Encaixe a forma geométrica correta no lugar mágico! 🧩",
  targetShape = 'star',
  onSuccess
}: InteractiveShapeMatchProps) {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const shapes = [
    { id: 'circle', name: 'Círculo', emoji: '🔴' },
    { id: 'star', name: 'Estrela', emoji: '⭐' },
    { id: 'square', name: 'Quadrado', emoji: '🟦' },
    { id: 'triangle', name: 'Triângulo', emoji: '🔺' }
  ];

  const handleShapeSelect = (shapeId: string) => {
    setSelectedShape(shapeId);
    if (shapeId === targetShape) {
      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } else {
      setIsSuccess(false);
    }
  };

  const handleReset = () => {
    setSelectedShape(null);
    setIsSuccess(false);
  };

  const targetInfo = shapes.find(s => s.id === targetShape);

  return (
    <div className="w-full bg-[#150F2D] border-2 border-purple-500/40 rounded-[28px] p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)] text-white relative overflow-hidden select-none my-4">
      {/* Header com Instrução */}
      <div className="flex items-center gap-2 mb-2 text-center justify-center">
        <Sparkles size={20} className="text-yellow-300 animate-spin" />
        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200">
          DESAFIO DE RACIOCÍNIO: FORMAS GEOMÉTRICAS! 🧩
        </span>
      </div>

      <p className="text-xs font-semibold text-purple-200/90 text-center mb-6 leading-relaxed">
        {instruction}
      </p>

      {/* Slots de Encaixe Visual */}
      <div className="flex flex-col items-center justify-center gap-4 py-5 bg-[#0B0819] rounded-2xl border border-purple-500/30">
        <div className="text-xs font-bold text-purple-300/80 uppercase tracking-widest mb-1">
          Encaixe aqui a forma: <strong className="text-yellow-300">{targetInfo?.name}</strong>
        </div>

        {/* Silhueta Alvo de Encaixe */}
        <div className={`w-24 h-24 rounded-2xl border-4 border-dashed flex items-center justify-center text-5xl transition-all ${
          isSuccess 
            ? 'border-green-400 bg-gradient-to-tr from-green-500 to-emerald-600 shadow-[0_0_30px_rgba(34,197,94,0.7)] scale-110' 
            : 'border-yellow-300/60 bg-purple-950/40 animate-pulse'
        }`}>
          {isSuccess ? targetInfo?.emoji : '❓'}
        </div>

        {/* Opções de Escolha */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          {shapes.map((s) => {
            const isSelected = selectedShape === s.id;
            const isCorrect = isSelected && isSuccess;
            const isWrong = isSelected && !isSuccess;

            return (
              <button
                key={s.id}
                onClick={() => handleShapeSelect(s.id)}
                disabled={isSuccess}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl transition-all transform active:scale-95 ${
                  isCorrect
                    ? 'bg-green-500 border-white scale-110 shadow-lg'
                    : isWrong
                    ? 'bg-red-500/40 border-red-400 opacity-60'
                    : 'bg-purple-900/40 border-purple-400/40 hover:bg-purple-800/60 hover:scale-105'
                }`}
              >
                {s.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Feedback Visual */}
      {selectedShape && !isSuccess && (
        <p className="text-xs font-bold text-pink-400 text-center mt-3 animate-shake">
          Quase lá! Tente outra forma geométrica! 💡
        </p>
      )}

      {/* Mensagem de Sucesso & Celebração */}
      {isSuccess && (
        <div className="mt-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/40 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={22} className="text-green-400" />
            <span className="text-xs font-black text-white">Parabéns! Encaixe perfeito! ✨</span>
          </div>
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-purple-900/60 text-purple-200 hover:text-white transition-colors"
            title="Jogar novamente"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
