'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/plans';
import { Check, Crown, ShieldCheck, Zap, ArrowLeft, QrCode, CreditCard, Sparkles, X, ExternalLink, HelpCircle } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function PlanosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const [selectedPlanId, setSelectedPlanId] = useState<'yearly' | 'monthly'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [loading, setLoading] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [testActivated, setTestActivated] = useState(false);

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

      // Se o Mercado Pago já tiver o Access Token configurado
      if (data.isConfigured && data.init_point) {
        // Redireciona para o checkout oficial do Mercado Pago
        window.location.href = data.init_point;
        return;
      }

      // Se ainda não estiver com a chave de produção configurada no .env.local
      setShowConfigModal(true);
    } catch (err: any) {
      console.error('Erro ao iniciar checkout:', err);
      setErrorMessage(err.message || 'Não foi possível iniciar o checkout.');
      setShowConfigModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Permite ativar o plano de teste imediatamente na conta do usuário
  const handleTestActivation = async () => {
    if (!user?.uid) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        plan: 'premium2',
        planType: selectedPlanId,
        planStatus: 'active',
        updatedAt: new Date()
      });
      setTestActivated(true);
      setTimeout(() => {
        router.push('/app/progresso');
      }, 1500);
    } catch (e: any) {
      console.error('Erro na ativação de teste:', e);
      alert('Erro ao ativar teste: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] text-[#1A1D20] font-sans overflow-x-hidden select-none">
      
      {/* ═══ TOPO / CABEÇALHO FLUIDO ═══ */}
      <header className="w-full max-w-2xl mx-auto px-4 sm:px-6 pt-4 pb-2 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => router.back()} 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 border border-amber-200/80 text-slate-700 hover:bg-white transition-all shadow-xs cursor-pointer active:scale-95 text-xs font-bold"
          title="Voltar"
        >
          <ArrowLeft size={16} />
          <span>Voltar ao App</span>
        </button>

        <span className="text-[0.68rem] font-black uppercase tracking-wider text-amber-900 bg-amber-100/90 px-3.5 py-1 rounded-full border border-amber-300 shadow-2xs">
          👑 Acesso Ilimitado Lumikids
        </span>
      </header>

      {/* ═══ CORPO PRINCIPAL RESPONSIVO ═══ */}
      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-4 flex-1 flex flex-col justify-center">
        
        {/* Título e Proposta de Valor */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 border-2 border-white shadow-md mb-2.5 animate-bounce-subtle">
            <Crown size={30} />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-slate-900 mb-1.5 leading-tight">
            Desbloqueie Todas as Histórias
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-lg mx-auto leading-relaxed">
            Tenha acesso completo a 60+ histórias com 991 ilustrações cinematográficas no estilo Puffin Rock, áudio em alta definição, quizzes pedagógicos e 5 idiomas.
          </p>
        </div>

        {/* Toggle Mensal / Anual Responsivo */}
        <div className="bg-amber-100/70 p-1.5 rounded-full border border-amber-300 flex items-center justify-between mb-5 shadow-inner max-w-md w-full mx-auto">
          <button
            type="button"
            onClick={() => setSelectedPlanId('monthly')}
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
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
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-black transition-all relative cursor-pointer text-center ${
              selectedPlanId === 'yearly'
                ? 'bg-[#0D9488] text-white shadow-md'
                : 'text-amber-900 hover:text-slate-900'
            }`}
          >
            Anual (R$ 19,90/mês)
            <span className="absolute -top-2.5 -right-1 bg-amber-400 text-amber-950 text-[0.62rem] font-black uppercase px-2 py-0.5 rounded-full shadow-xs border border-white">
              -33% OFF
            </span>
          </button>
        </div>

        {/* Card do Plano Selecionado (Espaçoso e Fluido) */}
        <div className="w-full bg-white rounded-[32px] overflow-hidden shadow-xl border-2 border-amber-300 relative">
          
          {selectedPlanId === 'yearly' && (
            <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider py-2 px-4 text-center shadow-xs">
              ⭐ O Plano Mais Escolhido pelas Famílias ⭐
            </div>
          )}

          <div className="p-5 sm:p-7 text-center border-b border-amber-100 bg-gradient-to-b from-amber-50/60 to-white">
            <h2 className="text-xl sm:text-2xl font-serif font-black text-slate-900 mb-1">
              {selectedPlan.name}
            </h2>
            <p className="text-xs text-slate-500 font-semibold mb-3">
              {selectedPlan.description}
            </p>

            <div className="flex items-baseline justify-center gap-1.5 my-2">
              <span className="text-base sm:text-lg font-bold text-slate-400">R$</span>
              <span className="text-5xl sm:text-6xl font-serif font-black text-slate-900 tracking-tight">
                {selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[0]}
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
                ,{selectedPlan.priceMonthlyEquivalent.toFixed(2).split('.')[1]}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-bold">/mês</span>
            </div>

            {selectedPlanId === 'yearly' ? (
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#0D9488] border border-emerald-200 text-xs font-bold mt-1">
                Cobrado anualmente: R$ 238,80 ou em até 12x de R$ 19,90
              </div>
            ) : (
              <div className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mt-1">
                Cobrança mensal sem fidelidade • Cancele quando quiser
              </div>
            )}
          </div>

          {/* Lista de Benefícios com espaçamento harmonioso */}
          <div className="p-5 sm:p-7 space-y-3 bg-white">
            {selectedPlan.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-2xs">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 leading-snug">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Seleção do Meio de Pagamento via Mercado Pago */}
          <div className="px-5 sm:px-7 pb-4 bg-slate-50/60 pt-4 border-t border-slate-100">
            <div className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center justify-between">
              <span>Forma de Pagamento (Mercado Pago)</span>
              <span className="text-[#0D9488] text-[0.65rem] font-black">Aprovação Imediata</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#0D9488] bg-teal-50/80 text-[#0D9488] ring-2 ring-teal-200 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <QrCode size={18} />
                <span>PIX Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3.5 rounded-2xl border-2 flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-[#0D9488] bg-teal-50/80 text-[#0D9488] ring-2 ring-teal-200 shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CreditCard size={18} />
                <span>Cartão em até 12x</span>
              </button>
            </div>

            {/* Botão de Ação CTA Principal */}
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full h-14 sm:h-16 rounded-2xl font-black text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-lg shadow-teal-800/25 active:scale-98 transition-all text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Conectando ao Mercado Pago...</span>
              ) : (
                <>
                  <Zap size={20} />
                  <span>Liberar Acesso Total Agora 🚀</span>
                </>
              )}
            </button>
          </div>

          {/* Selos de Confiança e Segurança */}
          <div className="p-3.5 text-center flex items-center justify-center gap-2 text-[0.68rem] font-bold text-slate-500 bg-slate-50 border-t border-slate-100">
            <ShieldCheck size={15} className="text-[#0D9488] shrink-0" />
            <span>Processamento criptografado e 100% seguro pelo Mercado Pago</span>
          </div>

        </div>

        {/* Garantia incondicional */}
        <div className="text-center text-xs text-slate-500 font-semibold mt-4 space-y-1">
          <p>Cancele quando quiser com apenas 1 clique • Garantia incondicional de 7 dias.</p>
          <p className="text-[0.68rem] text-slate-400">
            Menos de R$ 0,66 por dia para cultivar uma rotina noturna saudável com seus filhos.
          </p>
        </div>

      </main>

      {/* Espaçamento inferior fluido */}
      <footer className="w-full max-w-2xl mx-auto px-4 py-4 text-center text-[0.7rem] text-slate-400 font-medium">
        Lumikids • Histórias & Valores para toda a família
      </footer>

      {/* ═══ MODAL DE CONFIGURAÇÃO E TESTE DO MERCADO PAGO ═══ */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] w-full max-w-lg rounded-[32px] border-2 border-amber-300 shadow-2xl overflow-hidden p-6 text-left">
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                <h3 className="text-lg font-serif font-black text-slate-900">
                  Configuração do Mercado Pago
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 font-medium leading-relaxed">
              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950">
                <p className="font-bold mb-1">Como ativar pagamentos reais na sua conta:</p>
                <p>
                  O código de checkout e webhook já está 100% pronto no Lumikids! Para receber os pagamentos na sua conta Mercado Pago, basta inserir seu <strong>Access Token</strong> no arquivo <code className="bg-amber-200/60 px-1 py-0.5 rounded font-mono">.env.local</code>:
                </p>
                <div className="mt-2 bg-slate-900 text-emerald-400 p-2.5 rounded-xl font-mono text-[0.7rem]">
                  MERCADOPAGO_ACCESS_TOKEN=APP_USR-...
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 text-teal-950">
                <p className="font-bold mb-1">🎁 Quer testar a liberação agora mesmo?</p>
                <p>
                  Clique no botão abaixo para ativar o <strong>Plano Premium</strong> na sua conta de usuário e validar a liberação de todas as histórias e quizzes imediatamente!
                </p>
              </div>

              {testActivated && (
                <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-center animate-pulse">
                  ✓ Plano Premium ativado com sucesso! Redirecionando para o Perfil...
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleTestActivation}
                disabled={loading || testActivated}
                className="w-full py-3 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles size={16} />
                <span>Ativar Plano de Teste no Perfil</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
