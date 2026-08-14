'use client';
import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface InteractiveMoralChoiceProps {
  question?: string;
  optionA?: { text: string; isCorrect: boolean; feedback: string };
  optionB?: { text: string; isCorrect: boolean; feedback: string };
  onSuccess?: () => void;
}

export default function InteractiveMoralChoice({
  question = "O amiguinho do Samuel caiu no parque e ficou triste. O que o Samuel deve fazer?",
  optionA = {
    text: "🤝 Correr para dar a mão e ajudar a levantar",
    isCorrect: true,
    feedback: "Excelente escolha! Ajudar o próximo reflete o amor de Deus no nosso coração! ❤️"
  },
  optionB = {
    text: "🏃 Continuar correndo sozinho sem olhar",
    isCorrect: false,
    feedback: "Pensar no amiguinho traz mais alegria do que brincar sozinho! Tente a outra opção!"
  },
  onSuccess
}: InteractiveMoralChoiceProps) {
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const handleSelect = (choice: 'A' | 'B') => {
    setSelectedOption(choice);
    const chosen = choice === 'A' ? optionA : optionB;

    if (chosen.isCorrect && onSuccess) {
      onSuccess();
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
  };

  const currentFeedback = selectedOption === 'A' ? optionA.feedback : selectedOption === 'B' ? optionB.feedback : '';
  const isCompleted = selectedOption === 'A' ? optionA.isCorrect : selectedOption === 'B' ? optionB.isCorrect : false;

  return (
    <div className="w-full bg-[#150F2D] border-2 border-purple-500/40 rounded-[28px] p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)] text-white relative overflow-hidden select-none my-4">
      {/* Header com Instrução */}
      <div className="flex items-center gap-2 mb-2 text-center justify-center">
        <Heart size={20} className="text-pink-400 animate-pulse fill-pink-400" />
        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200">
          VALORES & EMPATIA: ESCOLHA DO BEM! ✝️
        </span>
      </div>

      <p className="text-xs font-semibold text-purple-200/90 text-center mb-6 leading-relaxed">
        {question}
      </p>

      {/* Opções de Escolha Moral */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => handleSelect('A')}
          className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-bold transition-all transform active:scale-98 flex items-center justify-between ${
            selectedOption === 'A'
              ? optionA.isCorrect
                ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-red-500/30 border-red-400 text-white'
              : 'bg-[#0B0819] border-purple-500/30 text-purple-100 hover:border-purple-400/60 hover:bg-purple-900/30'
          }`}
        >
          <span>{optionA.text}</span>
          {selectedOption === 'A' && optionA.isCorrect && <CheckCircle2 size={18} className="text-green-400" />}
        </button>

        <button
          onClick={() => handleSelect('B')}
          className={`w-full p-4 rounded-2xl border-2 text-left text-xs font-bold transition-all transform active:scale-98 flex items-center justify-between ${
            selectedOption === 'B'
              ? optionB.isCorrect
                ? 'bg-gradient-to-r from-green-500/30 to-emerald-600/30 border-green-400 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]'
                : 'bg-red-500/30 border-red-400 text-white'
              : 'bg-[#0B0819] border-purple-500/30 text-purple-100 hover:border-purple-400/60 hover:bg-purple-900/30'
          }`}
        >
          <span>{optionB.text}</span>
          {selectedOption === 'B' && optionB.isCorrect && <CheckCircle2 size={18} className="text-green-400" />}
        </button>
      </div>

      {/* Feedback Educativo */}
      {selectedOption && (
        <div className={`mt-4 p-3 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
          isCompleted 
            ? 'bg-green-500/20 border-green-400/40 text-green-200' 
            : 'bg-pink-500/20 border-pink-400/40 text-pink-200'
        }`}>
          <span>{currentFeedback}</span>
          <button 
            onClick={handleReset}
            className="p-1 rounded bg-purple-900/60 text-purple-200 hover:text-white transition-colors ml-2"
            title="Escolher novamente"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
