'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PLANS } from '@/config/plans';

type SubscriptionPlanId = 'monthly' | 'yearly';
import { 
  X, 
  Crown, 
  Sparkles, 
  BookOpen, 
  Volume2, 
  Users, 
  Check, 
  Award, 
  Compass, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';

export default function PlanosPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlanId>('yearly');
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

      if (data.init_point) {
        window.location.href = data.init_point;
        return;
      }

      window.location.href = 'https://www.mercadopago.com.br';
    } catch (err: any) {
      console.error('Erro ao iniciar checkout:', err);
      setErrorMessage('Conectando ao checkout seguro do Mercado Pago... Clique novamente para prosseguir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#F3F0FF] via-[#F8F6FF] to-white text-[#1E1B4B] font-sans overflow-x-hidden select-none flex flex-col justify-between p-4 sm:p-6 md:p-8">
      
      {/* ═══ TOPO / BOTÃO FECHAR ESTILO APP LUMI KIDS ═══ */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between pt-1 pb-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200/60 flex items-center justify-center transition-all cursor-pointer active:scale-95"
          title="Fechar"
        >
          <X size={20} />
        </button>

        <span className="text-[0.68rem] font-bold text-[#6C47FF] bg-purple-100/80 px-3 py-1 rounded-full border border-purple-200 flex items-center gap-1">
          <ShieldCheck size={13} />
          Garantia de 7 dias
        </span>
      </div>

      {/* ═══ CORPO PRINCIPAL DO PAYWALL ═══ */}
      <main className="w-full max-w-md mx-auto flex-1 flex flex-col justify-center py-2">
        
        {/* Mascote Ilustrado (Corujinha Sábia com Baú de Tesouro & Estrelas) */}
        <div className="text-center mb-3 flex flex-col items-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 mb-1 drop-shadow-md">
            {/* SVG da Corujinha Sábia com Estrelas & Tesouro */}
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              {/* Brilhos de fundo */}
              <circle cx="60" cy="60" r="50" fill="#EDE9FE" opacity="0.6"/>
              <path d="M60 12L63 22H73L65 28L68 38L60 32L52 38L55 28L47 22H57L60 12Z" fill="#FBBF24"/>
              <path d="M98 42L100 48H106L101 52L103 58L98 54L93 58L95 52L90 48H96L98 42Z" fill="#FBBF24" opacity="0.8"/>
              <path d="M22 45L23.5 50H28L24.5 53L26 58L22 55L18 58L19.5 53L16 50H20.5L22 45Z" fill="#FBBF24" opacity="0.8"/>

              {/* Corpo da Corujinha */}
              <ellipse cx="60" cy="68" rx="26" ry="30" fill="#7C5CFC"/>
              {/* Peito da Corujinha */}
              <ellipse cx="60" cy="74" rx="18" ry="20" fill="#FEF3C7"/>
              {/* Asas */}
              <path d="M34 62C30 70 32 84 40 88C37 80 36 70 38 62Z" fill="#5B36F0"/>
              <path d="M86 62C90 70 88 84 80 88C83 80 84 70 82 62Z" fill="#5B36F0"/>
              {/* Orelhas / Peninhas */}
              <polygon points="42,42 48,50 36,52" fill="#5B36F0"/>
              <polygon points="78,42 72,50 84,52" fill="#5B36F0"/>
              {/* Olhos Grandes Expressivos */}
              <circle cx="48" cy="54" r="11" fill="#FFFFFF"/>
              <circle cx="72" cy="54" r="11" fill="#FFFFFF"/>
              <circle cx="49" cy="54" r="6.5" fill="#1E1B4B"/>
              <circle cx="71" cy="54" r="6.5" fill="#1E1B4B"/>
              <circle cx="51" cy="52" r="2.2" fill="#FFFFFF"/>
              <circle cx="73" cy="52" r="2.2" fill="#FFFFFF"/>
              {/* Bico */}
              <polygon points="56,60 64,60 60,67" fill="#F59E0B"/>
              {/* Bochechinhas rosadas */}
              <ellipse cx="40" cy="62" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.7"/>
              <ellipse cx="80" cy="62" rx="4" ry="2.5" fill="#FCA5A5" opacity="0.7"/>
              {/* Patinhas segurando baú */}
              <ellipse cx="50" cy="98" rx="5" ry="3" fill="#F59E0B"/>
              <ellipse cx="70" cy="98" rx="5" ry="3" fill="#F59E0B"/>
              {/* Baú de ouro */}
              <rect x="42" y="94" width="36" height="18" rx="4" fill="#D97706"/>
              <rect x="44" y="90" width="32" height="6" rx="2" fill="#FBBF24"/>
              <circle cx="60" cy="98" r="2.5" fill="#FEF3C7"/>
            </svg>
          </div>

          {/* Título Oficial Estilo Lumi Plus */}
          <div className="flex items-center justify-center gap-2 mb-0.5">
            <span className="text-2xl sm:text-3xl">👑</span>
            <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
              Contos & Virtudes Plus
            </h1>
          </div>
          <p className="text-slate-500 font-semibold text-xs sm:text-sm max-w-xs mx-auto">
            Acesso ilimitado. Todas as 60+ histórias, narração e virtudes.
          </p>
        </div>

        {/* ═══ CARD 1: ROTINA SEMANAL (7 DIAS DA SEMANA) ═══ */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-purple-100/90 mb-3.5">
          {/* Círculos dos dias da semana */}
          <div className="flex items-center justify-between max-w-[320px] mx-auto mb-3">
            {[
              { day: 'S', active: true },
              { day: 'T', active: true },
              { day: 'Q', active: true },
              { day: 'Q', active: true },
              { day: 'S', active: true },
              { day: 'S', active: true },
              { day: 'D', active: true }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm shadow-2xs transition-transform ${
                  item.active 
                    ? 'bg-[#6C47FF] text-white shadow-purple-500/20' 
                    : 'bg-purple-100 text-purple-600'
                }`}>
                  <BookOpen size={16} />
                </div>
                <span className="text-[0.62rem] font-bold text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h3 className="font-serif font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Uma história por noite, 5 a 7 min
            </h3>
            <p className="text-slate-500 text-xs font-semibold mt-0.5">
              Rotina saudável de sono, conexão e valores para a criança
            </p>
          </div>
        </div>

        {/* ═══ CARD 2: LISTA DE BENEFÍCIOS (ÍCONES ROXOS) ═══ */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-purple-100/90 mb-4 space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C47FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Compass size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                8 reinos, 60+ histórias desbloqueadas
              </h4>
              <p className="text-slate-500 text-[0.68rem] font-semibold">
                Bíblia, Mitologia, Mulheres Fortes e Grandes Líderes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C47FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Volume2 size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                Narração acolhedora em voz humana suave
              </h4>
              <p className="text-slate-500 text-[0.68rem] font-semibold">
                Perfeita para relaxar na hora de dormir
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C47FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Users size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                Até 4 crianças · 100% livre de anúncios
              </h4>
              <p className="text-slate-500 text-[0.68rem] font-semibold">
                Ambiente seguro, sem algoritmos frenéticos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6C47FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                Quizzes educativos e virtudes para a vida
              </h4>
              <p className="text-slate-500 text-[0.68rem] font-semibold">
                Perguntas reflexivas que estimulam o bom caráter
              </p>
            </div>
          </div>
        </div>

        {/* ═══ CARD 3: SELETOR DE PLANOS LADO A LADO (MENSAL VS ANUAL) ═══ */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Card Mensal */}
          <div
            onClick={() => setSelectedPlanId('monthly')}
            className={`rounded-3xl p-3.5 sm:p-4 border-2 transition-all cursor-pointer text-center relative flex flex-col justify-between ${
              selectedPlanId === 'monthly'
                ? 'border-[#6C47FF] bg-[#F5F2FF] shadow-sm'
                : 'border-slate-200 bg-white hover:border-purple-200'
            }`}
          >
            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-700 block">Mensal</span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-serif font-black text-[#6C47FF]">R$ 29,90</span>
              </div>
            </div>
            <span className="text-[0.65rem] text-slate-500 font-semibold block leading-tight">
              cobrado mensalmente
            </span>
          </div>

          {/* Card Anual (Com badge MELHOR VALOR) */}
          <div
            onClick={() => setSelectedPlanId('yearly')}
            className={`rounded-3xl p-3.5 sm:p-4 border-2 transition-all cursor-pointer text-center relative flex flex-col justify-between ${
              selectedPlanId === 'yearly'
                ? 'border-[#6C47FF] bg-[#F5F2FF] shadow-sm'
                : 'border-slate-200 bg-white hover:border-purple-200'
            }`}
          >
            {/* Badge Flutuante */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C48C] text-white font-black text-[0.62rem] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs whitespace-nowrap">
              MELHOR VALOR
            </div>

            <div>
              <span className="font-bold text-xs sm:text-sm text-slate-700 block mt-0.5">Anual</span>
              <div className="my-1">
                <span className="text-xl sm:text-2xl font-serif font-black text-slate-900">R$ 199,90</span>
              </div>
            </div>
            <div>
              <span className="text-[0.65rem] text-slate-500 font-semibold block leading-tight">
                cobrado anualmente
              </span>
              <span className="text-[0.68rem] font-black text-[#00C48C] block mt-0.5">
                R$ 16,65 por mês
              </span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-xs font-bold text-center mb-3">
            {errorMessage}
          </div>
        )}

        {/* ═══ BOTÃO PRINCIPAL CTA ═══ */}
        <button
          type="button"
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full h-14 rounded-2xl bg-[#6C47FF] hover:bg-[#5B36F0] text-white font-black text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <span>Começar Contos & Virtudes Plus</span>
          )}
        </button>

        {/* Texto Legal & Continuar Grátis */}
        <div className="text-center mt-3">
          <p className="text-[0.65rem] text-slate-500 font-medium">
            R$ 16,65/mês no plano anual. Cancele a qualquer momento nas configurações.
          </p>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-slate-600 text-xs font-bold underline mt-2 hover:text-slate-900 cursor-pointer"
          >
            Continuar grátis por enquanto
          </button>
        </div>

      </main>

    </div>
  );
}
