'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.push('/app');
    }
  }, [user, authLoading, router]);

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError('Erro ao entrar com Google: ' + err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const email = emailOrUsername.includes('@') 
        ? emailOrUsername.trim().toLowerCase()
        : `${emailOrUsername.trim().toLowerCase()}@lumikids.app`;

      await signInWithEmail(email, password);
      router.push('/app');
    } catch (err: any) {
      console.error('Erro no login via email:', err);
      const errorCode = err.code || '';
      if (errorCode === 'auth/invalid-credential' || errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
        setError('E-mail/usuário ou senha incorretos.');
      } else if (errorCode === 'auth/invalid-email') {
        setError('Formato de e-mail inválido.');
      } else {
        setError('Erro ao entrar. Por favor, verifique suas credenciais.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8F7F2] flex items-center justify-center p-4 text-[#1A1D20] relative overflow-hidden font-sans">
      <div className="max-w-[420px] w-full bg-white border border-slate-200/90 rounded-[32px] p-8 shadow-sm relative z-10">
        
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">
            Bem-vindo de volta!
          </h1>
          <p className="text-slate-500 text-xs font-semibold">
            Entre na sua conta para criar novas histórias mágicas.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-2xl text-xs font-bold text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-600 ml-1 block mb-1">E-MAIL OU USUÁRIO</label>
            <input 
              type="text" 
              required 
              className="w-full bg-[#FAF9F5] border border-slate-300 h-[50px] rounded-[16px] px-4 font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0D9488] outline-none transition-all text-sm"
              placeholder="Ex: lumikids ou seu@email.com"
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 ml-1 block mb-1">SENHA</label>
            <input 
              type="password" 
              required 
              className="w-full bg-[#FAF9F5] border border-slate-300 h-[50px] rounded-[16px] px-4 font-bold text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#0D9488] outline-none transition-all text-sm"
              placeholder="Sua senha"
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={authLoading || isLoggingIn}
            className="w-full h-[52px] rounded-full font-bold flex items-center justify-center bg-[#0D9488] hover:bg-[#0F766E] text-white shadow-md transition-all mt-6 cursor-pointer text-sm"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold">OU</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={authLoading || isLoggingIn} 
          type="button"
          className="w-full h-[50px] rounded-full font-bold flex items-center justify-center gap-2 transition-all bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs text-sm"
        >
          <i className="fab fa-google text-red-500"></i> Entrar com Google
        </button>

        <div className="mt-6 text-center text-xs text-slate-500 font-semibold">
          Não tem uma conta? <Link href="/cadastro" className="text-[#0D9488] font-bold hover:underline">Cadastre-se grátis</Link>
        </div>
      </div>
    </div>
  );
}
