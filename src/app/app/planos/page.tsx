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
    <div className="p-6 font-sans bg-[#F0F2FF] min-h-screen pb-32">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#283593] shadow-sm hover:bg-blue-50 transition-colors">
          <i className="fas fa-arrow-left"></i>
        </button>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-[#283593] mb-2 leading-tight">Escolha seu Plano</h1>
        <p className="text-[#666] font-medium">Libere toda a magia do Lumikids</p>
      </div>

      <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(61,90,254,.12)] relative border-2 border-[#3D5AFE]">
        <div className="absolute top-0 right-0 bg-[#FFC107] text-black text-[0.65rem] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-lg">30 Dias Grátis</div>
        <div className="p-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-extrabold text-[#283593] mb-1">Premium2</h2>
          <div className="text-sm font-bold text-[#FF9800] mb-2 uppercase tracking-wide">Teste grátis por 30 dias</div>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-xl font-bold text-gray-400">R$</span>
            <span className="text-5xl font-black text-[#3D5AFE]">59</span>
            <span className="text-xl font-bold text-gray-400">,90</span>
            <span className="text-sm text-gray-400 font-medium">/mês após o teste</span>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50/50 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
            <span className="text-sm font-semibold text-gray-700">Mini animações exclusivas (Imagens por IA)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
            <span className="text-sm font-semibold text-gray-700">Criação Ilimitada de Histórias</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
            <span className="text-sm font-semibold text-gray-700">Prioridade na fila da IA e Guias para Pais</span>
          </div>
        </div>
        
        <div className="p-6">
          <button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="w-full h-[54px] rounded-[16px] font-extrabold flex items-center justify-center gap-2 text-white bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] shadow-lg hover:-translate-y-1 transition-all"
          >
            {loading ? <span className="animate-pulse">Iniciando teste...</span> : 'Começar Teste Grátis'}
          </button>
        </div>
      </div>
      
      <div className="text-center mt-6">
        <p className="text-xs text-gray-400 font-medium px-8">A cobrança será feita automaticamente após os 30 dias de teste grátis. Cancele quando quiser diretamente no seu perfil.</p>
      </div>
    </div>
  );
}
