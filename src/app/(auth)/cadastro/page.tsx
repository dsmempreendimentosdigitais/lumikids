'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      router.push('/app'); // Redirecionar após criar a conta logada
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full bg-white rounded-[24px] p-8" style={{ boxShadow: '0 12px 40px rgba(61,90,254,.17)' }}>
        <div className="text-center mb-6">
          <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-white text-[1.2rem] mx-auto mb-4" style={{ background: 'linear-gradient(135deg, #3D5AFE, #5C6BC0)' }}>
             ✦
          </div>
          <h1 className="text-[1.8rem] font-black text-[#283593] leading-[1.15] tracking-[-1px] mb-2">Crie sua contaa</h1>
          <p className="text-[#666] text-[0.85rem] font-semibold">Junte-se ao Lumikids hoje.</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-[12px] text-sm font-bold text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">NOME COMPLETO</label>
            <input 
              type="text" required 
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Ex: João da Silva"
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">E-MAIL</label>
            <input 
              type="email" required 
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="seu@email.com"
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">TELEFONE (WHATSAPP)</label>
            <input 
              type="tel" required 
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="(11) 99999-9999"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#283593] ml-2 block mb-1">SENHA</label>
            <input 
              type="password" required minLength={6}
              className="w-full bg-[#f8f9ff] border-2 border-transparent h-[48px] rounded-[14px] px-4 font-bold text-[#333] focus:border-blue-500 focus:bg-white outline-none transition-all"
              placeholder="Mínimo 6 caracteres"
              value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit" disabled={isSubmitting || loading}
            className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] text-white shadow-[0_4px_16px_rgba(61,90,254,.35)] hover:-translate-y-[2px] transition-all mt-6"
          >
            {isSubmitting ? 'Criando...' : 'Começar Grátis'}
          </button>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold">OU</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button 
          onClick={handleGoogleLogin} disabled={loading} type="button"
          className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] bg-white border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-all font-sans"
        >
          <i className="fab fa-google text-red-500"></i> Entrar com Google
        </button>

        <div className="mt-6 text-center text-[0.8rem] text-gray-500 font-bold">
          Já tem conta? <Link href="/login" className="text-blue-600">Fazer Login</Link>
        </div>
      </div>
    </div>
  );
}
