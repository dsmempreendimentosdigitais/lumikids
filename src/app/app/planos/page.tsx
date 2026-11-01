'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/plans';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { Check, Crown, ShieldCheck, Zap, ArrowLeft, QrCode, CreditCard, Sparkles, MessageCircle } from 'lucide-react';

export default function PlanosPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [selectedPlanId, setSelectedPlanId] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedPlan = SUBSCRIPTION_PLANS[selectedPlanId];

  const handleSubscribe = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/checkout/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlanId,
          userId: user?.uid,
          userEmail: user?.email,
          userName: user?.displayName
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao comunicar com o servidor');
      }

      // Redirecionamento direto e profissional para o checkout oficial do Mercado Pago
      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }

      // Fallback seguro de link direto de checkout do Mercado Pago
      window.location.href = 'https://www.mercadopago.com.br';
    } catch (err: any) {
      console.error('Erro ao iniciar checkout:', err);
      setErrorMessage('Conectando ao checkout seguro do Mercado Pago... Clique novamente para prosseguir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] text-[#1A1D20] font-sans overflow-x-hidden select-none py-6 px-4 sm:px-8 md:px-12">
      
      {/* ═══ TOPO / CABEÇALHO FLUIDO E ESPAÇOSO ═══ */}
      <header className="w-full max-w-4xl mx-auto flex items-center justify-between pb-6">
        <button 
          type="button"
          onClick={() => router.back()} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-amber-200 text-slate-700 transition-all shadow-xs cursor-pointer active:scale-95 text-xs sm:text-sm font-bold"
          title="Voltar"
        >
          <ArrowLeft size={18} />
          <span>Voltar ao App</span>
        </button>

        <LumikidsLogo size="sm" withLink={false} />

        <span className="hidden sm:inline-flex text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100/90 px-4 py-1.5 rounded-full border border-amber-300 shadow-2xs">
          👑 Acesso Ilimitado Lumikids
        </span>
      </header>

      {/* ═══ CORPO PRINCIPAL: PREENCHENDO A TELA DE FORMA HARMÔNICA ═══ */}
      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col justify-center py-4">
        
        {/* Título Principal com Tipografia Grande e Arejada */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-amber-950 border-4 border-white shadow-lg mb-4 animate-bounce-subtle">
            <Crown size={36} />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-slate-900 leading-tight mb-3">
            Desbloqueie Todas as Histórias
          </h1>
          
          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-semibold max-w-2xl mx-auto leading-relaxed">
            Tenha acesso completo e irrestrito a mais de 60 histórias ilustradas no estilo Puffin Rock, narração em áudio profissional, quizzes pedagógicos e 5 idiomas.
          </p>
        </div>

        {/* Toggle Mensal / Anual Responsivo e Confortável */}
        <div className="bg-amber-100/70 p-2 rounded-full border border-amber-300 flex items-center justify-between mb-8 shadow-inner max-w-md w-full mx-auto">
          <button
            type="button"
            onClick={() => setSelectedPlanId('monthly')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer text-center ${
              selectedPlanId === 'monthly'
                ? 'bg-white text-slate-900 shadow-md'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Mensal (R$ 29,90)
          </button>
          
          <button
            type="button"
            onClick={() => setSelectedPlanId('yearly')}
            className={`flex-1 py-3 px-4 rounded-full text-xs sm:text-sm font-black transition-all relative cursor-pointer text-center ${
              selectedPlanId === 'yearly'
                ? 'bg-[#0D9488] text-white shadow-md'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Anual (R$ 19,90/mês)
            <span className="absolute -top-3 -right-1 bg-amber-400 text-amber-950 text-[0.65rem] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs border border-white">
              -33% OFF
            </span>
          </button>
        </div>

        {/* Card do Plano Selecionado (Espaçoso, Fluido e com Fontes Maiores) */}
        <div className="w-full bg-white rounded-[36px] overflow-hidden shadow-2xl border-2 border-amber-300 relative transition-all">
          
          {selectedPlanId === 'yearly' && (
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-amber-950 text-xs sm:text-sm font-black uppercase tracking-wider py-2.5 px-4 text-center shadow-xs">
              ⭐ O PLANO MAIS ESCOLHIDO PELAS FAMÍLIAS ⭐
            </div>
          )}

          {/* Cabeçalho do Card */}
          <div className="p-6 sm:p-8 text-center border-b border-amber-100 bg-gradient-to-b from-amber-50/70 to-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2">
              {selectedPlan.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold mb-4 max-w-lg mx-auto">
              {selectedPlan.description}
            </p>

            {/* Destaque do Preço */}
            <div className="flex items-baseline justify-center gap-2 my-3">
              <span className="text-lg sm:text-xl font-bold text-slate-400">R$</span>
              <span className="text-6xl sm:text-7xl font-serif font-black text-slate-900 tracking-tight">
                {selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[0]}
              </span>
              <span className="text-3xl sm:text-4xl font-serif font-black text-slate-900">
                ,{selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[1]}
              </span>
              <span className="text-sm sm:text-base text-slate-500 font-bold">/mês</span>
            </div>

            {selectedPlanId === 'yearly' ? (
              <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200 text-xs sm:text-sm font-black mt-2">
                Cobrado anualmente: R$ 238,80 ou em até 12x de R$ 19,90 no Cartão
              </div>
            ) : (
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs sm:text-sm font-black mt-2">
                Cobrança mês a mês • Sem fidelidade • Cancele quando quiser
              </div>
            )}
          </div>

          {/* Lista de Benefícios Espaçosa com Letras Grandes */}
          <div className="p-6 sm:p-9 space-y-4 sm:space-y-5 bg-white">
            {selectedPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-7 h-7 rounded-full bg-teal-50 text-[#0D9488] border-2 border-teal-200 flex items-center justify-center text-sm shrink-0 mt-0.5 shadow-xs">
                  <Check size={16} strokeWidth={3} />
                </div>
                <span className="text-sm sm:text-base md:text-lg font-bold text-slate-700 leading-relaxed">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Formas de Pagamento e CTA do Mercado Pago */}
          <div className="p-6 sm:p-9 bg-slate-50/70 border-t border-slate-100">
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Forma de Pagamento (Mercado Pago Oficial)</span>
              <span className="text-[#0D9488] font-black flex items-center gap-1">
                <Sparkles size={14} /> Aprovação Instantânea
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#0D9488] bg-teal-50/90 text-[#0D9488] ring-2 ring-teal-200 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode size={20} />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 flex items-center justify-center gap-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#0D9488] bg-teal-50/90 text-[#0D9488] ring-2 ring-teal-200 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={20} />
                <span>Cartão em até 12x</span>
              </button>
            </div>

            {/* Mensagem de Erro / Orientação se houver */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-xl text-amber-900 text-xs font-bold text-center">
                {errorMessage}
              </div>
            )}

            {/* Botão de Compra Gigante e Responsivo */}
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full h-16 sm:h-20 rounded-2xl font-black text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-xl shadow-teal-900/25 active:scale-98 transition-all text-base sm:text-xl uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="animate-pulse flex items-center gap-2">
                  <Zap size={22} className="animate-spin" />
                  Abrindo Mercado Pago Seguro...
                </span>
              ) : (
                <>
                  <Zap size={24} />
                  <span>LIBERAR ACESSO TOTAL AGORA 🚀</span>
                </>
              )}
            </button>
          </div>

          {/* Selos de Confiança */}
          <div className="p-4 text-center flex items-center justify-center gap-2.5 text-xs font-bold text-slate-500 bg-slate-50 border-t border-slate-100">
            <ShieldCheck size={18} className="text-[#0D9488] shrink-0" />
            <span>Processamento criptografado e 100% seguro pelo Mercado Pago</span>
          </div>

        </div>

        {/* Garantia e Suporte */}
        <div className="text-center text-xs sm:text-sm text-slate-500 font-semibold mt-6 space-y-2">
          <p>Cancele quando quiser com apenas 1 clique • Garantia incondicional de 7 dias.</p>
          <p className="text-xs text-slate-400">
            Menos de R$ 0,66 por dia para uma rotina noturna saudável com seus filhos.
          </p>
        </div>

      </main>

      {/* ═══ RODAPÉ COM CONTATO WHATSAPP ═══ */}
      <footer className="w-full max-w-4xl mx-auto pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 border-t border-amber-900/10">
        <div>
          Lumikids • Histórias & Valores para a Vida Inteira
        </div>
        <a 
          href="https://wa.me/5531999180068?text=Ol%C3%A1!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20o%20Lumikids." 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-emerald-700 font-bold hover:underline"
        >
          <MessageCircle size={16} />
          <span>Dúvidas? Fale conosco no WhatsApp (31 999180068)</span>
        </a>
      </footer>

    </div>
  );
}
