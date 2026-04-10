'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-[#F0F2FF] flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-nunito), "Nunito", sans-serif' }}>
      <div className="max-w-[400px] w-full bg-white rounded-[24px] p-8 text-center" style={{ boxShadow: '0 12px 40px rgba(61,90,254,.17)' }}>
        
        <div className="flex justify-center mb-6">
          <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-white text-[1.2rem]" style={{ background: 'linear-gradient(135deg, #3D5AFE, #5C6BC0)' }}>
             ✦
          </div>
        </div>
        
        <h1 className="text-[1.8rem] font-black text-[#283593] leading-[1.15] tracking-[-1px] mb-2">Bem-vindo ao<br/>Lumi<em>kids</em></h1>
        <p className="text-[#666] text-[0.95rem] font-semibold mb-8">
          Entre na sua conta para criar novas histórias e acompanhar o progresso.
        </p>

        <button 
          onClick={signInWithGoogle}
          disabled={loading}
          className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] transition-all hover:-translate-y-[2px]"
          style={{ 
            background: 'linear-gradient(135deg, var(--gold, #F9A825), #FFB300)', 
            color: '#283593', 
            boxShadow: '0 4px 16px rgba(249,168,37,.35)'
          }}
        >
          {loading ? 'Carregando...' : (
            <>
              <i className="fab fa-google"></i>
              Entrar com Google
            </>
          )}
        </button>

        <div className="mt-6 text-[#999] text-[0.75rem] font-bold">
          Ao entrar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </div>
      </div>
    </div>
  );
}
