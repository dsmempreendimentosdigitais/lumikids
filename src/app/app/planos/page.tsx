'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/plans';
import { Check, Crown, ShieldCheck, Zap, ArrowLeft, QrCode, CreditCard } from 'lucide-react';

export default function PlanosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [selectedPlanId, setSelectedPlanId] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [loading, setLoading] = useState(false);

  const selectedPlan = SUBSCRIPTION_PLANS[selectedPlanId];

  const handleSubscribe = async () => {
    setLoading(true);
    // Simulação da chamada de preferência do Mercado Pago
    setTimeout(() => {
      alert(`Redirecionando para o Mercado Pago (${paymentMethod === 'pix' ? 'PIX Instantâneo' : 'Cartão de Crédito'})...\nPlano: ${selectedPlan.name} - R$ ${selectedPlan.priceTotal.toFixed(2).replace('.', ',')}`);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-36 relative overflow-x-hidden">
      <div className="relative z-10 max-w-xl mx-auto pt-2 sm:pt-4">
        
        {/* Topo: Voltar */}
        <div className="flex items-center justify-between mb-6">
          <button 
            type="button"
            onClick={() => router.back()} 
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs cursor-pointer"
            title="Voltar"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-300">
            Acesso Total Lumikids
          </span>
        </div>
        
        {/* Título e Chamada Emocional */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 text-[#F59E0B] border-2 border-amber-300 shadow-xs mb-3">
            <Crown size={28} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2 leading-tight">
            Desbloqueie Todas as Histórias
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-md mx-auto">
            Mais de 60 histórias com 991 ilustrações no estilo Puffin Rock, narração em áudio, quizzes de fixação e 5 idiomas.
          </p>
        </div>

        {/* Toggle Mensal / Anual */}
        <div className="bg-amber-100/60 p-1.5 rounded-full border border-amber-300/80 flex items-center justify-between mb-6 shadow-xs max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => setSelectedPlanId('monthly')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer ${
              selectedPlanId === 'monthly'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Mensal (R$ 29,90)
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedPlanId('yearly')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all relative cursor-pointer ${
              selectedPlanId === 'yearly'
                ? 'bg-[#0D9488] text-white shadow-sm'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Anual (R$ 19,90/mês)
            <span className="absolute -top-2.5 -right-1 bg-amber-400 text-amber-950 text-[0.6rem] font-black uppercase px-2 py-0.5 rounded-full shadow-xs border border-white">
              -33%
            </span>
          </button>
        </div>

        {/* Card do Plano Selecionado */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-md border-2 border-amber-300 relative mb-6">
          {selectedPlanId === 'yearly' && (
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 text-xs font-black uppercase tracking-wider py-1.5 px-4 text-center shadow-xs">
              ⭐ O Plano Mais Escolhido pelas Famílias ⭐
            </div>
          )}

          <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-amber-50/50 to-white">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mb-1">
              {selectedPlan.name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mb-4">
              {selectedPlan.description}
            </p>

            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-sm font-bold text-slate-400">R$</span>
              <span className="text-5xl font-serif font-black text-slate-900 tracking-tight">
                {selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[0]}
              </span>
              <span className="text-xl font-bold text-slate-400">
                ,{selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[1]}
              </span>
              <span className="text-xs text-slate-500 font-semibold">/mês</span>
            </div>

            {selectedPlanId === 'yearly' && (
              <p className="text-xs text-[#0D9488] font-bold mt-2">
                Cobrado anualmente: R$ 238,80 ou em até 12x de R$ 19,90
              </p>
            )}
          </div>

          {/* Lista de Benefícios */}
          <div className="p-6 space-y-3.5">
            {selectedPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Check size={12} strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Método de Pagamento com Mercado Pago */}
          <div className="px-6 pb-2">
            <div className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Forma de Pagamento (Mercado Pago)
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#0D9488] bg-teal-50 text-[#0D9488] ring-2 ring-teal-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <QrCode size={16} />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#0D9488] bg-teal-50 text-[#0D9488] ring-2 ring-teal-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CreditCard size={16} />
                <span>Cartão de Crédito</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full h-14 rounded-2xl font-black text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-lg shadow-teal-700/20 active:scale-98 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span className="animate-pulse">Processando Mercado Pago...</span>
              ) : (
                <>
                  <Zap size={18} />
                  <span>Liberar Acesso Total Agora</span>
                </>
              )}
            </button>
          </div>

          <div className="p-4 pt-2 text-center flex items-center justify-center gap-2 text-[0.68rem] font-bold text-slate-400">
            <ShieldCheck size={14} className="text-[#0D9488]" />
            <span>Pagamento 100% Seguro processado via Mercado Pago</span>
          </div>
        </div>

        {/* Garantia */}
        <div className="text-center text-xs text-slate-500 font-semibold px-4 space-y-1">
          <p>Cancele quando quiser com apenas 1 clique.</p>
          <p className="text-[0.68rem] text-slate-400">Menos de R$ 0,66 por dia para uma rotina noturna saudável com seus filhos.</p>
        </div>

      </div>
    </div>
  );
}
