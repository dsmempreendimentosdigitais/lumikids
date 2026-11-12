'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/plans';
import {
  X,
  Sparkles,
  BookOpen,
  Volume2,
  Users,
  CheckCircle2,
  Compass,
  ShieldCheck,
  Loader2,
  Crown,
} from 'lucide-react';

type SubscriptionPlanId = 'monthly' | 'yearly';

export default function PlanosPage() {
  const router = useRouter();
  const { user, dbUser } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('yearly');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const hasActivePlan = Boolean(
    dbUser?.plan &&
      ['premium2', 'anual', 'mensal', 'familia', 'familia_plus', 'yearly', 'monthly'].includes(
        String(dbUser.plan).toLowerCase()
      )
  );

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
          userName: user?.displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao comunicar com o servidor');
      }

      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }

      window.location.href = 'https://www.mercadopago.com.br';
    } catch (err: any) {
      console.error('Erro ao iniciar checkout:', err);
      setErrorMessage(
        'Conectando ao checkout seguro do Mercado Pago... Clique novamente para prosseguir.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F3EDE0] text-[#1E293B] font-sans overflow-x-hidden select-none flex flex-col justify-between px-5 py-6 sm:p-8">
      {/* ═══ TOPO / BOTÃO FECHAR ═══ */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pb-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-11 h-11 rounded-full bg-white hover:bg-amber-50 text-slate-700 shadow-sm border border-[#E6DEC8] flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Fechar"
        >
          <X size={20} />
        </button>

        <span className="text-xs font-extrabold text-[#0F766E] bg-teal-50 px-4 py-1.5 rounded-full border border-teal-200 flex items-center gap-1.5 shadow-2xs">
          <ShieldCheck size={15} className="text-[#0D9488]" />
          Garantia incondicional de 7 dias
        </span>
      </div>

      {/* ═══ CORPO PRINCIPAL DO PAYWALL (Sem coruja roxa, identidade Contos & Virtudes) ═══ */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-2 space-y-4">
        {/* Cabeçalho Nobre Contos & Virtudes Plus */}
        <div className="text-center flex flex-col items-center pt-1 pb-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-300 via-amber-400 to-[#D97706] text-white shadow-md shadow-amber-500/20 border-2 border-amber-200 flex items-center justify-center mb-3">
            <Crown size={32} className="text-white drop-shadow-xs" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Contos <span className="text-[#0D9488]">&</span>{' '}
            <span className="text-[#D97706]">Virtudes</span> Plus
          </h1>
          <p className="text-slate-600 font-semibold text-sm sm:text-base max-w-xs mx-auto mt-1.5 leading-relaxed">
            Todos os níveis, 60+ histórias ilustradas, narração acolhedora e virtudes.
          </p>

          {hasActivePlan && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-extrabold shadow-2xs">
              <CheckCircle2 size={16} className="text-[#0D9488] shrink-0" />
              <span>Sua assinatura Plus já está ativa nesta conta!</span>
            </div>
          )}
        </div>

        {/* ═══ CARD 1: ROTINA SEMANAL (7 DIAS DA SEMANA) ═══ */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#EAE0C8]">
          <div className="flex items-center justify-between max-w-[330px] mx-auto mb-4">
            {[
              { day: 'S', active: true },
              { day: 'T', active: true },
              { day: 'Q', active: true },
              { day: 'Q', active: true },
              { day: 'S', active: true },
              { day: 'S', active: true },
              { day: 'D', active: true },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm shadow-xs transition-transform ${
                    item.active
                      ? 'bg-[#0D9488] text-white shadow-teal-600/20'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <BookOpen size={17} />
                </div>
                <span className="text-xs font-extrabold text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg leading-snug">
              Uma história por noite, 5 a 7 min
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
              Rotina saudável de sono, conexão e valores para toda a semana
            </p>
          </div>
        </div>

        {/* ═══ CARD 2: LISTA DE BENEFÍCIOS (IDENTIDADE TEAL & DOURADO) ═══ */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#EAE0C8] space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Compass size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                8 reinos, 60+ ilhas e histórias desbloqueadas
              </h4>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Bíblia, Mitologia, Mulheres Fortes e Grandes Líderes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Narração acolhedora em voz humana suave
              </h4>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Leitura pausada e fluida perfeita para a hora de dormir
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                Até 4 crianças · 100% livre de anúncios
              </h4>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Ambiente seguro, calmo e sem algoritmos frenéticos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D97706] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={20} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                5 idiomas, quizzes educativos e virtudes
              </h4>
              <p className="text-slate-500 text-xs font-semibold mt-0.5">
                Português, Inglês, Espanhol, Francês e Italiano com 1 toque
              </p>
            </div>
          </div>
        </div>

        {/* ═══ CARD 3: SELETOR DE PLANOS LADO A LADO (MENSAL VS ANUAL) ═══ */}
        <div className="grid grid-cols-2 gap-3.5 pt-2">
          {/* Card Mensal */}
          <div
            onClick={() => setSelectedPlanId('monthly')}
            className={`rounded-3xl p-4 sm:p-5 border-2 transition-all cursor-pointer text-center relative flex flex-col justify-between min-h-[132px] ${
              selectedPlanId === 'monthly'
                ? 'border-[#0D9488] bg-teal-50/70 shadow-md ring-2 ring-teal-500/20'
                : 'border-[#E6DEC8] bg-white hover:border-teal-300'
            }`}
          >
            <div>
              <span className="font-extrabold text-sm text-slate-700 block">Mensal</span>
              <div className="my-1.5">
                <span className="text-2xl sm:text-[1.65rem] font-black text-[#0D9488]">
                  R$ 29,90
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-500 font-semibold block leading-tight">
              cobrado mensalmente
            </span>
          </div>

          {/* Card Anual (Com badge MELHOR VALOR) */}
          <div
            onClick={() => setSelectedPlanId('yearly')}
            className={`rounded-3xl p-4 sm:p-5 border-2 transition-all cursor-pointer text-center relative flex flex-col justify-between min-h-[132px] ${
              selectedPlanId === 'yearly'
                ? 'border-[#0D9488] bg-teal-50/70 shadow-md ring-2 ring-teal-500/20'
                : 'border-[#E6DEC8] bg-white hover:border-teal-300'
            }`}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#D97706] text-white font-extrabold text-[0.68rem] px-3 py-1 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
              MELHOR VALOR
            </div>

            <div>
              <span className="font-extrabold text-sm text-slate-700 block mt-0.5">Anual</span>
              <div className="my-1.5">
                <span className="text-2xl sm:text-[1.65rem] font-black text-slate-900">
                  R$ 199,90
                </span>
              </div>
            </div>
            <div>
              <span className="text-xs text-slate-500 font-semibold block leading-tight">
                cobrado anualmente
              </span>
              <span className="text-xs font-extrabold text-[#0D9488] block mt-1">
                R$ 16,65 por mês
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-xs sm:text-sm font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* ═══ BOTÃO PRINCIPAL CTA ═══ */}
        <div className="pt-1">
          {hasActivePlan ? (
            <button
              type="button"
              onClick={() => router.push('/app')}
              className="w-full min-h-[58px] py-4 px-6 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98"
            >
              <CheckCircle2 size={20} />
              <span>Voltar para as Histórias (Plano Ativo)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={loading}
              className="w-full min-h-[58px] py-4 px-6 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin" />
              ) : (
                <span>Começar Contos & Virtudes Plus</span>
              )}
            </button>
          )}
        </div>

        {/* Texto Legal & Continuar Grátis (EXIBIDO SOMENTE SE NÃO TIVER PLANO ATIVO - Item 10) */}
        <div className="text-center pt-1 pb-4">
          <p className="text-xs text-slate-500 font-semibold">
            {selectedPlanId === 'yearly'
              ? 'R$ 16,65/mês no plano anual (R$ 199,90/ano). Renovação automática. Cancele quando quiser.'
              : 'R$ 29,90/mês. Renovação automática. Cancele quando quiser nas configurações.'}
          </p>

          {!hasActivePlan && (
            <button
              type="button"
              onClick={() => router.back()}
              className="text-slate-600 text-sm font-extrabold underline mt-3 py-2 px-4 hover:text-slate-900 cursor-pointer"
            >
              Continuar grátis por enquanto
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
