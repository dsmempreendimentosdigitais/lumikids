'use client';

import React, { useState } from 'react';
import { Shield, Delete, X } from 'lucide-react';

interface ParentalPINProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ParentalPIN({ onSuccess, onCancel }: ParentalPINProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  // Exemplo simples: PIN fixo ou vindo do perfil do usuário
  const CORRECT_PIN = '1234'; 

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[500] bg-[rgba(26,35,126,0.95)] backdrop-blur-md flex flex-col items-center justify-center p-6 text-white">
      <button onClick={onCancel} className="absolute top-6 right-6 p-2 rounded-full bg-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.2)]">
        <X size={24} />
      </button>

      <div className="w-[60px] h-[60px] bg-[var(--gold)] rounded-2xl flex items-center justify-center text-[var(--blue-dark)] mb-6 shadow-lg">
        <Shield size={32} />
      </div>

      <h2 className="text-xl font-[900] mb-2 uppercase tracking-wider">Área dos Pais</h2>
      <p className="text-[rgba(255,255,255,0.7)] text-sm font-[600] mb-8 text-center max-w-[240px]">
        Digite seu código de segurança para acessar as configurações.
      </p>

      {/* PIN DOTS */}
      <div className={`flex gap-4 mb-12 ${error ? 'animate-shake' : ''}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 border-[rgba(255,255,255,0.3)] transition-all ${pin.length > i ? 'bg-[var(--gold)] border-[var(--gold)] scale-110 shadow-[0_0_12px_rgba(249,168,37,0.5)]' : ''}`}></div>
        ))}
      </div>

      {/* KEYPAD */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button 
            key={num}
            onClick={() => handlePress(num.toString())}
            className="h-[64px] rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-2xl font-[800] hover:bg-[rgba(255,255,255,0.15)] active:scale-90 transition-all"
          >
            {num}
          </button>
        ))}
        <div className="flex items-center justify-center text-[var(--gold)] font-[900] text-xs uppercase tracking-tighter opacity-40">Lumi</div>
        <button 
          onClick={() => handlePress('0')}
          className="h-[64px] rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-2xl font-[800] hover:bg-[rgba(255,255,255,0.15)] active:scale-90 transition-all"
        >
          0
        </button>
        <button 
          onClick={handleDelete}
          className="h-[64px] rounded-2xl bg-[rgba(255,255,255,0.08)] flex items-center justify-center text-[var(--gold)] hover:bg-[rgba(255,255,255,0.15)] active:scale-90 transition-all"
        >
          <Delete size={24} />
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-4px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
