'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      // Se não contiver '@', assumimos que é um nome de usuário e completamos com @lumikids.app
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
    <div className="min-h-[100dvh] bg-[#F0F2FF] flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-nunito), "Nunito", sans-serif' }}>
      <div className="max-w-[400px] w-full bg-white rounded-[24px] p-8" style={{ boxShadow: '0 12px 40px rgba(61,90,254,.17)' }}>
        
        <div className="text-center mb-6">
          <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-white text-[1.2rem] mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #3D5AFE, #5C6BC0)' }}>
             ✦
          </div>
          <h1 className="text-[1.8rem] font-black text-[#283593] leading-[1.15] tracking-[-1px] mb-2">Bem-vindo ao<br/>Lumi<em>kids</em></h1>
          <p className="text-[#666] text-[0.85rem] font-semibold">
            Entre na sua conta para criar novas histórias.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-[12px] text-xs font-bold text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">E-MAIL OU USUÁRIO</label>
            <input 
              type="text" 
              required 
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:font-normal text-sm"
              placeholder="Ex: lumikids ou seu@email.com"
              value={emailOrUsername} 
              onChange={e => setEmailOrUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">SENHA</label>
            <input 
              type="password" 
              required 
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:font-normal text-sm"
              placeholder="Sua senha"
              value={password} 
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={authLoading || isLoggingIn}
            className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] text-white shadow-[0_4px_16px_rgba(61,90,254,.35)] hover:-translate-y-[2px] transition-all mt-6 cursor-pointer"
          >
            {isLoggingIn ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">OU</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          disabled={authLoading || isLoggingIn} 
          type="button"
          className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] transition-all hover:-translate-y-[2px] bg-white border-2 border-gray-100 text-gray-600 cursor-pointer"
        >
          <i className="fab fa-google text-red-500"></i> Entrar com Google
        </button>

        <div className="mt-6 text-center text-[0.8rem] text-gray-500 font-bold">
          Não tem conta? <Link href="/cadastro" className="text-blue-600">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
