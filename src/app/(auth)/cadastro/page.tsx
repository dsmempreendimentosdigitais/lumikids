'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/ui/Logo';

export default function CadastroPage() {
  const { signUpWithEmail, signInWithGoogle, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await signInWithGoogle();
      router.push('/app');
    } catch (err: any) {
      console.error('Erro no Google Login:', err);
      if (err.code === 'auth/unauthorized-domain') {
        setError('Erro: Este domínio (ou IP) não está autorizado no Firebase.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('O login foi cancelado.');
      } else {
        setError('Ocorreu um erro ao entrar com o Google.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpWithEmail) return;

    setError('');
    setIsSubmitting(true);

    try {
      await signUpWithEmail(formData.email, formData.password, formData.name, formData.phone);
      router.push('/app');
    } catch (err: any) {
      const errorCode = err.code || '';
      const errorMessage = err.message || '';
      
      if (errorCode === 'auth/email-already-in-use' || errorMessage.includes('email-already-in-use')) {
        setError('Este e-mail já está em uso. Tente fazer login.');
      } else if (errorCode === 'auth/weak-password' || errorMessage.includes('weak-password')) {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else if (errorCode === 'auth/operation-not-allowed' || errorMessage.includes('operation-not-allowed')) {
        setError('O login com e-mail e senha não está ativado no Firebase.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0819] flex items-center justify-center p-4 text-white relative overflow-hidden font-sans">
      {/* Background Starry Glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25), transparent 70%)' }}></div>

      <div className="max-w-[420px] w-full bg-[#150F2D] border border-purple-500/40 rounded-[32px] p-8 shadow-[0_0_50px_rgba(139,92,246,0.4)] backdrop-blur-xl relative z-10">
        
        <div className="text-center mb-6 flex flex-col items-center">
          <Logo size="lg" className="mb-4" />
          <h1 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-1">
            Crie sua conta mágica
          </h1>
          <p className="text-purple-200/80 text-xs font-semibold">Junte-se ao Lumikids hoje mesmo.</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-200 p-3 rounded-2xl text-xs font-bold text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">NOME COMPLETO</label>
            <input 
              type="text" required 
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[48px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="Ex: João da Silva"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">E-MAIL</label>
            <input 
              type="email" required 
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[48px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="seu@email.com"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">TELEFONE (WHATSAPP)</label>
            <input 
              type="tel" required 
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[48px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="(11) 99999-9999"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-purple-200 ml-2 block mb-1">SENHA</label>
            <input 
              type="password" required minLength={6}
              className="w-full bg-[#1A133A] border border-purple-500/30 h-[48px] rounded-[16px] px-4 font-bold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 outline-none transition-all text-sm"
              placeholder="Mínimo 6 caracteres"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting || loading}
            className="w-full h-[54px] rounded-[99px] font-extrabold flex items-center justify-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-[1.02] active:scale-95 transition-all mt-5 cursor-pointer border border-pink-400/30 text-sm"
          >
            {isSubmitting ? 'Criando conta...' : 'Começar Grátis ✨'}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-purple-500/30"></div>
          <span className="flex-shrink-0 mx-4 text-purple-300/60 text-xs font-bold">OU</span>
          <div className="flex-grow border-t border-purple-500/30"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} disabled={loading} type="button"
          className="w-full h-[50px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] bg-[#1F183D] border border-purple-400/30 text-white hover:scale-[1.02] active:scale-95 transition-all text-sm"
        >
          <i className="fab fa-google text-red-400"></i> Entrar com Google
        </button>

        <div className="mt-5 text-center text-xs text-purple-200/80 font-semibold">
          Já tem uma conta? <Link href="/login" className="text-pink-300 font-bold hover:underline">Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}
