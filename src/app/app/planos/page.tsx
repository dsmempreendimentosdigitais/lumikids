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
    <div className="p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-36 relative overflow-x-hidden">
      <div className="relative z-10 max-w-2xl mx-auto pt-4">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs">
            <i className="fas fa-arrow-left"></i>
          </button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2 leading-tight">Escolha seu Plano</h1>
          <p className="text-slate-500 text-xs font-semibold">Libere toda a magia e encanto do Lumikids</p>
        </div>

        <div className="bg-white rounded-[28px] overflow-hidden shadow-sm border border-slate-200 relative">
          <div className="absolute top-0 right-0 bg-[#F59E0B] text-slate-900 text-[0.65rem] font-bold uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-xs">30 Dias Grátis</div>
          <div className="p-6 text-center border-b border-slate-100">
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">Lumikids Premium</h2>
            <div className="text-xs font-bold text-[#F59E0B] mb-4 uppercase tracking-wide">Teste grátis por 30 dias</div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-lg font-bold text-slate-400">R$</span>
              <span className="text-5xl font-serif font-bold text-slate-900">59</span>
              <span className="text-lg font-bold text-slate-400">,90</span>
              <span className="text-xs text-slate-400 font-medium">/mês após o teste</span>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
              <span className="text-xs font-semibold text-slate-700">Ilustrações 2D Estilo Livro Impresso Ilimitadas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
              <span className="text-xs font-semibold text-slate-700">Criação Ilimitada de Histórias Personalizadas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
              <span className="text-xs font-semibold text-slate-700">Narração em Áudio HD com Vozes Expressivas</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
              <span className="text-xs font-semibold text-slate-700">Acesso a todas as Faixas Etárias (2 a 14 anos)</span>
            </div>
          </div>
          
          <div className="p-6 pt-2">
            <button 
              onClick={handleSubscribe} 
              disabled={loading}
              className="w-full h-[54px] rounded-full font-bold flex items-center justify-center gap-2 text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-md transition-all text-sm"
            >
              {loading ? <span className="animate-pulse">Iniciando teste...</span> : 'Começar Teste Grátis ✨'}
            </button>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-[0.7rem] text-slate-400 font-medium px-8 leading-relaxed">A cobrança será feita automaticamente após os 30 dias de teste grátis. Cancele quando quiser diretamente no seu perfil.</p>
        </div>
      </div>
    </div>
  );
}
