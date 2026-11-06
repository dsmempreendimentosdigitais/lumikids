'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase/config';
import { signInWithCustomToken } from 'firebase/auth';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { CheckCircle2, Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Crown, Loader2 } from 'lucide-react';

function SucessoContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentId = searchParams.get('payment_id') || searchParams.get('collection_id');
  const planParam = searchParams.get('plan') || 'anual';

  const [loading, setLoading] = useState(true);
  const [successData, setSuccessData] = useState<{ email: string; plan: string; token: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Formulário para definir senha
  const [password, setPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  // Formulário manual (se acessou sem payment_id no link)
  const [manualEmail, setManualEmail] = useState('');
  const [manualPassword, setManualPassword] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

  // 1. Verificação automática quando há payment_id na URL
  useEffect(() => {
    let isMounted = true;

    const verifyPayment = async () => {
      if (!paymentId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/checkout/claim-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentId })
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Não foi possível confirmar o pagamento automaticamente.');
        }

        if (isMounted) {
          setSuccessData(data);
          // Efetua login instantâneo no Firebase
          if (data.token) {
            try {
              await signInWithCustomToken(auth, data.token);
              console.log('Login com Custom Token realizado com sucesso!');
            } catch (authErr) {
              console.error('Erro no signInWithCustomToken:', authErr);
            }
          }
        }
      } catch (err: any) {
        console.error('Erro na validação do pagamento:', err);
        if (isMounted) setErrorMessage(err.message || 'Erro ao validar pagamento.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verifyPayment();

    return () => { isMounted = false; };
  }, [paymentId]);

  // 2. Salvar senha no usuário conectado
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await fetch('/api/checkout/claim-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentId || undefined,
          email: successData?.email,
          password
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao salvar senha.');

      setPasswordSaved(true);
      setTimeout(() => {
        router.push('/app');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Falha ao salvar senha.');
    } finally {
      setSavingPassword(false);
    }
  };

  // 3. Ativação manual por e-mail (caso o cliente acerte o e-mail da compra)
  const handleManualClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail) return;

    setManualLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/checkout/claim-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: manualEmail,
          password: manualPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Nenhum pagamento localizado para este e-mail.');

      setSuccessData(data);
      if (data.token) {
        await signInWithCustomToken(auth, data.token);
      }
      if (manualPassword && manualPassword.length >= 6) {
        setPasswordSaved(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao localizar pagamento.');
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] text-[#1A1D20] font-sans flex flex-col items-center justify-between p-4 sm:p-8">
      
      {/* Topo com Logo */}
      <header className="w-full max-w-xl flex items-center justify-between pb-6 pt-2">
        <LumikidsLogo size="sm" withLink={false} />
        <span className="text-[0.7rem] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-emerald-600" />
          Acesso Seguro Oficial
        </span>
      </header>

      {/* Card Central */}
      <main className="w-full max-w-lg bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-8 border border-amber-200/80 shadow-[0_20px_50px_rgba(45,33,20,0.08)] my-auto">
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-4 animate-spin">
              <Loader2 size={32} />
            </div>
            <h2 className="text-xl font-serif font-black text-slate-900 mb-1">
              Confirmando seu pagamento...
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xs">
              Conectando aos servidores do Mercado Pago e preparando sua biblioteca de virtudes.
            </p>
          </div>
        ) : successData ? (
          <div>
            {/* Ícone de Sucesso */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 border-4 border-emerald-50 flex items-center justify-center mx-auto mb-3 shadow-md">
                <CheckCircle2 size={40} />
              </div>
              <span className="text-[0.68rem] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-flex items-center gap-1 mb-2">
                <Crown size={12} className="text-amber-500" />
                Assinatura Premium Ativada
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 leading-tight">
                Seja bem-vindo ao Contos & Virtudes!
              </h1>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Pagamento confirmado com sucesso para o e-mail:
              </p>
              <div className="inline-block mt-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono font-bold text-amber-950">
                {successData.email}
              </div>
            </div>

            {/* Caixa de Criação de Senha */}
            {!passwordSaved ? (
              <form onSubmit={handleSavePassword} className="bg-[#FAF9F5] border border-amber-200/70 rounded-2xl p-5 mb-5 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-sm">
                  <Lock size={16} className="text-amber-600" />
                  <span>Defina sua senha de acesso</span>
                </div>
                <p className="text-[0.72rem] text-slate-600 font-semibold leading-relaxed">
                  Para poder entrar no celular, tablet ou computador a qualquer momento, crie uma senha para este e-mail:
                </p>

                <div>
                  <input 
                    type="password"
                    required
                    minLength={6}
                    placeholder="Crie sua senha (mínimo 6 dígitos)"
                    className="w-full bg-white border border-slate-300 h-11 rounded-xl px-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0D9488] outline-none"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPassword}
                  className="w-full h-11 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {savingPassword ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>Salvar Senha & Acessar Histórias</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-xs font-bold text-center mb-5 animate-in fade-in">
                ✨ Senha gravada com sucesso! Redirecionando para as histórias...
              </div>
            )}

            {/* Botão de Pular / Acesso Imediato */}
            <div className="text-center">
              <Link
                href="/app"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
              >
                <span>Acessar aplicativo agora sem criar senha</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          /* Formulário de Busca por E-mail (quando não veio payment_id na URL) */
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Crown size={28} />
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                Ativar Acesso da Assinatura
              </h1>
              <p className="text-xs text-slate-600 font-semibold mt-1">
                Já realizou o pagamento? Digite o e-mail que você usou no Mercado Pago ou PIX para liberar seu acesso imediato:
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-xs font-bold text-center mb-4">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleManualClaim} className="space-y-3.5">
              <div>
                <label className="text-[0.68rem] font-bold text-slate-600 ml-1 block mb-1">
                  E-MAIL USADO NO PAGAMENTO
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input 
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full bg-[#FAF9F5] border border-slate-300 h-11 rounded-xl pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0D9488] outline-none"
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-[0.68rem] font-bold text-slate-600 ml-1 block mb-1">
                  CRIE UMA SENHA PARA ENTRAR
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input 
                    type="password"
                    minLength={6}
                    placeholder="Sua senha de acesso (mínimo 6 dígitos)"
                    className="w-full bg-[#FAF9F5] border border-slate-300 h-11 rounded-xl pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0D9488] outline-none"
                    value={manualPassword}
                    onChange={e => setManualPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={manualLoading}
                className="w-full h-11 rounded-xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {manualLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>Liberar Meu Acesso Agora</span>
                    <Sparkles size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-200/70 text-center">
              <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900">
                Já tem conta com senha? <strong className="text-[#0D9488]">Fazer Login</strong>
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Rodapé Seguro */}
      <footer className="w-full max-w-xl text-center pt-4 text-[0.68rem] text-slate-500 font-medium">
        Contos & Virtudes • Pagamentos protegidos via Mercado Pago com criptografia de ponta a ponta.
      </footer>

    </div>
  );
}

export default function SucessoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F7F2] flex items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-teal-200 border-t-[#0D9488] rounded-full animate-spin"></div>
      </div>
    }>
      <SucessoContent />
    </Suspense>
  );
}
