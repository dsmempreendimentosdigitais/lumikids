'use client';

import React, { useState } from 'react';
import { Sparkles, Trophy, Star, CheckCircle, HelpCircle, Gift } from 'lucide-react';

interface StoryQuizProps {
  storyTitle: string;
  reflectionQuestion?: string;
  value?: string;
  onComplete: (score: number) => void;
}

export default function StoryEndActivity({
  storyTitle,
  reflectionQuestion,
  value,
  onComplete
}: StoryQuizProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);

  // Pergunta lúdica de virtude para fixar a história (estilo Bible App for Kids)
  const questionData = {
    question: `Qual foi a lição e valor mais importante que aprendemos com "${storyTitle}"?`,
    options: [
      { text: value ? `Praticar a ${value} e fazer o bem` : 'Ajudar os outros com amor e paciência', correct: true },
      { text: 'Ficar bravo e desistir logo no começo', correct: false },
      { text: 'Guardar tudo só para nós mesmos', correct: false }
    ]
  };

  const handleSelect = (idx: number, isCorrect: boolean) => {
    if (hasAnswered) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = isCorrect ? 'triangle' : 'sawtooth';
          osc.frequency.setValueAtTime(isCorrect ? 523.25 : 220, ctx.currentTime);
          if (isCorrect) {
            osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
            osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3);
          }
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch (e) {}
    }

    if (isCorrect) {
      onComplete(3);
    }
  };

  const handleClaimSticker = () => {
    setClaimedReward(true);
    if (typeof window !== 'undefined') {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.2);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        }
      } catch (e) {}
    }
  };

  return (
    <div className="w-full bg-white rounded-[28px] border-2 border-amber-300/80 p-5 shadow-sm text-left my-4 relative overflow-hidden select-none font-sans">
      <div className="absolute top-0 right-0 bg-amber-400 text-amber-950 text-[0.65rem] font-black uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
        <Sparkles size={12} /> Desafio Bíblia Kids
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
          <HelpCircle size={18} />
        </div>
        <h4 className="font-bold text-slate-900 text-sm">Pergunta Rápida</h4>
      </div>

      <p className="text-xs text-slate-700 font-medium mb-3">
        {questionData.question}
      </p>

      {/* Opções de Resposta Ilustradas */}
      <div className="space-y-2 mb-4">
        {questionData.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          let btnStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

          if (hasAnswered) {
            if (opt.correct) {
              btnStyle = 'bg-emerald-50 border-emerald-400 text-emerald-800 font-bold';
            } else if (isSelected && !opt.correct) {
              btnStyle = 'bg-rose-50 border-rose-300 text-rose-700';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={hasAnswered}
              onClick={() => handleSelect(idx, opt.correct)}
              className={`w-full text-left p-3 rounded-2xl border-2 text-xs transition-all flex items-center justify-between active:scale-[0.99] ${btnStyle}`}
            >
              <span>{opt.text}</span>
              {hasAnswered && opt.correct && (
                <span className="text-emerald-600 font-bold text-sm">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Caixa de Recompensa de Adesivo / Diamante */}
      {hasAnswered && (
        <div className="pt-2 border-t border-slate-100 animate-in fade-in duration-300">
          {!claimedReward ? (
            <button
              type="button"
              onClick={handleClaimSticker}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-black text-xs shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Gift size={16} />
              <span>Coletar Meu Adesivo do Álbum! ⭐</span>
            </button>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-center">
              <span className="text-3xl block mb-1">🏅</span>
              <h5 className="font-bold text-xs text-amber-900">Adesivo Desbloqueado!</h5>
              <p className="text-[0.68rem] text-amber-700 font-medium">Você ganhou o selo de Virtude desta história para o seu Álbum do Explorador!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
