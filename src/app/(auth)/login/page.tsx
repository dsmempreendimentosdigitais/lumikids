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
    <div className="min-h-[100dvh] bg-[#0B0819] flex items-center justify-center p-4 text-white relative overflow-hidden font-sans">
      {/* Background Starry Glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25), transparent 70%)' }}></div>
      <div className="absolute top-[10%] left-[10%] w-2 h-2 bg-pink-400 rounded-full shadow-[0_0_12px_rgba(244,114,182,0.8)] animate-pulse"></div>
      <div className="absolute bottom-[20%] right-[15%] w-3 h-3 bg-purple-400 rounded-full shadow-[0_0_15px_rgba(192,132,252,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-[420px] w-full bg-[#150F2D] border border-purple-500/40 rounded-[32px] p-8 shadow-[0_0_50px_rgba(139,92,246,0.4)] backdrop-blur-xl relative z-10">
        
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-1">
            Bem-vindo de volta!
          </h1>
          <p className="text-purple-200/80 text-xs font-semibold">
            Entre na sua conta para criar novas histórias mágicas.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-2xl text-xs font-bold text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">E-MAIL OU USUÁRIO</label>
            <input 
              type="text" 
              required 
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[50px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="Ex: lumikids ou seu@email.com"
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">SENHA</label>
            <input 
              type="password" 
              required 
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[50px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="Sua senha"
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={authLoading || isLoggingIn}
            className="w-full h-[54px] rounded-[99px] font-extrabold flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-[1.02] active:scale-95 transition-all mt-6 cursor-pointer border border-pink-400/30 text-sm"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar na Conta'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-purple-500/30"></div>
          <span className="flex-shrink-0 mx-4 text-purple-300/60 text-xs font-bold">OU</span>
          <div className="flex-grow border-t border-purple-500/30"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={authLoading || isLoggingIn} 
          type="button"
          className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] transition-all hover:scale-[1.02] active:scale-95 bg-[#1F183D] border border-purple-400/30 text-white cursor-pointer shadow-md text-sm"
        >
          <i className="fab fa-google text-red-400"></i> Entrar com Google
        </button>

        <div className="mt-6 text-center text-xs text-purple-200/80 font-semibold">
          Não tem uma conta? <Link href="/cadastro" className="text-pink-300 font-bold hover:underline">Cadastre-se grátis</Link>
        </div>
      </div>
    </div>
  );
}
