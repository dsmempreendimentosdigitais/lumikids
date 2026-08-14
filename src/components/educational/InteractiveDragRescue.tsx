'use client';
import React, { useState, useRef } from 'react';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface InteractiveDragRescueProps {
  instruction?: string;
  itemEmoji?: string;
  targetEmoji?: string;
  onSuccess?: () => void;
}

export default function InteractiveDragRescue({
  instruction = "Ajude a resgatar o gatinho! Arraste a mãozinha até o alto da árvore 🐾",
  itemEmoji = "🖐️",
  targetEmoji = "🐱",
  onSuccess
}: InteractiveDragRescueProps) {
  const [completed, setCompleted] = useState(false);
  const [dragY, setDragY] = useState(0); // 0 (em baixo) até -160 (no topo)
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (completed) return;
    isDraggingRef.current = true;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY - dragY;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current || completed) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newY = Math.min(0, Math.max(-170, clientY - startYRef.current));
    setDragY(newY);

    // Se chegou perto do topo (-140px ou mais)
    if (newY <= -140 && !completed) {
      setCompleted(true);
      isDraggingRef.current = false;
      if (onSuccess) onSuccess();
    }
  };

  const handleTouchEnd = () => {
    if (completed) return;
    isDraggingRef.current = false;
    // Se não completou, volta suavemente para baixo
    if (dragY > -140) {
      setDragY(0);
    }
  };

  const handleReset = () => {
    setCompleted(false);
    setDragY(0);
  };

  return (
    <div className="w-full bg-[#150F2D] border-2 border-purple-500/40 rounded-[28px] p-5 shadow-[0_0_30px_rgba(139,92,246,0.3)] text-white relative overflow-hidden select-none my-4">
      {/* Header com Instrução */}
      <div className="flex items-center gap-2 mb-4 text-center justify-center">
        <Sparkles size={20} className="text-yellow-300 animate-spin" />
        <span className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200">
          DESAFIO INTERATIVO: RESGATE!
        </span>
      </div>

      <p className="text-xs font-semibold text-purple-200/90 text-center mb-6 leading-relaxed">
        {instruction}
      </p>

      {/* Área de Resgate Vertical */}
      <div 
        className="relative w-full h-56 bg-[#0B0819] rounded-2xl border border-purple-500/30 overflow-hidden flex flex-col justify-between items-center p-4"
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Alvo no Topo (Ex: Gatinho / Árvore / Ponto de Destino) */}
        <div className={`relative z-10 flex flex-col items-center transition-transform ${completed ? 'scale-125' : 'animate-bounce'}`}>
          <div className="w-16 h-16 rounded-full bg-purple-900/40 border border-yellow-300/50 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(253,224,71,0.4)]">
            {targetEmoji}
          </div>
          <span className="text-[0.65rem] font-bold text-yellow-300 mt-1 uppercase tracking-wider">
            {completed ? 'Resgatado! 🎉' : 'Precisa de Ajuda!'}
          </span>
        </div>

        {/* Linha Guiada Pontilhada */}
        <div className="absolute inset-y-10 left-1/2 w-0.5 border-l-2 border-dashed border-purple-400/40 -translate-x-1/2 pointer-events-none"></div>

        {/* Elemento Arrastável (Mãozinha / Escada / Gancho) */}
        <div
          onMouseDown={handleTouchStart}
          onTouchStart={handleTouchStart}
          style={{ transform: `translateY(${dragY}px)` }}
          className={`relative z-20 cursor-grab active:cursor-grabbing touch-none transition-all ${
            completed ? 'scale-110' : ''
          }`}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 border-2 border-white flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(217,70,239,0.6)] animate-pulse">
            {completed ? '🌟' : itemEmoji}
          </div>
          {!completed && (
            <div className="text-[0.6rem] font-black text-center text-pink-300 mt-1 uppercase tracking-wider animate-pulse">
              Arraste para cima ⬆️
            </div>
          )}
        </div>
      </div>

      {/* Mensagem de Sucesso & Celebração */}
      {completed && (
        <div className="mt-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/40 rounded-xl p-3 flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={22} className="text-green-400" />
            <span className="text-xs font-black text-white">Muito bem! Você salvou o amiguinho! 🎉</span>
          </div>
          <button 
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-purple-900/60 text-purple-200 hover:text-white transition-colors"
            title="Tentar novamente"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
