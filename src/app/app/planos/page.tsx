'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function PlanosPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubscribe = () => {
    setLoading(true);
    // Simular delay de checkout
    setTimeout(() => {
      alert("Checkout Simulado com Sucesso!\n\n(No ambiente de produção isso abriria o portal de Stripe ou MercadoPago)");
      setLoading(false);
      router.push('/app/progresso');
    }, 2000);
  };

  return (
    <div className="p-6 font-sans bg-[#0B0819] text-white min-h-screen pb-36 relative overflow-x-hidden">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      <div className="relative z-10 max-w-2xl mx-auto pt-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/50 transition-colors">
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-2 leading-tight drop-shadow-md">Escolha seu Plano</h1>
          <p className="text-purple-200/70 text-xs font-semibold">Libere toda a magia e encanto do Lumikids</p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-[32px] opacity-75 blur-[3px]"></div>
          <div className="relative bg-[#150F2D] rounded-[30px] overflow-hidden shadow-2xl border border-purple-500/30">
            <div className="absolute top-0 right-0 bg-amber-400 text-black text-[0.65rem] font-black uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-md">30 Dias Grátis</div>
            <div className="p-6 text-center border-b border-purple-500/20">
              <h2 className="text-2xl font-serif font-black text-white mb-1">Lumikids Premium</h2>
              <div className="text-xs font-bold text-amber-300 mb-4 uppercase tracking-wide">Teste grátis por 30 dias</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-lg font-bold text-purple-300">R$</span>
                <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-300 font-serif">59</span>
                <span className="text-lg font-bold text-purple-300">,90</span>
                <span className="text-xs text-purple-200/60 font-medium">/mês após o teste</span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
                <span className="text-xs font-semibold text-purple-100">Ilustrações 3D Pixar Ilimitadas (Gerador IA)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
                <span className="text-xs font-semibold text-purple-100">Criação Ilimitada de Histórias Personalizadas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
                <span className="text-xs font-semibold text-purple-100">Narração em Áudio HD com Vozes Expressivas</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
                <span className="text-xs font-semibold text-purple-100">Acesso a todas as Faixas Etárias (2 a 14 anos)</span>
              </div>
            </div>
            
            <div className="p-6 pt-2">
              <button 
                onClick={handleSubscribe} 
                disabled={loading}
                className="w-full h-[54px] rounded-[18px] font-extrabold flex items-center justify-center gap-2 text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg shadow-purple-500/30 hover:opacity-90 transition-opacity text-sm"
              >
                {loading ? <span className="animate-pulse">Iniciando teste mágico...</span> : 'Começar Teste Grátis ✨'}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-[0.7rem] text-purple-200/50 font-medium px-8 leading-relaxed">A cobrança será feita automaticamente após os 30 dias de teste grátis. Cancele quando quiser diretamente no seu perfil.</p>
        </div>
      </div>
    </div>
  );
}
