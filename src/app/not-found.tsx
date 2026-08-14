'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sparkles, Home } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  // Redireciona automaticamente para o app principal em caso de rota não encontrada
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/app');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0819] text-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25), transparent 70%)' }}></div>

      <div className="relative z-10 max-w-md w-full bg-[#150F2D] border border-purple-500/30 rounded-[32px] p-8 shadow-[0_0_50px_rgba(139,92,246,0.3)] backdrop-blur-xl flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-4xl mb-6 shadow-[0_0_25px_rgba(217,70,239,0.5)] animate-bounce">
          ✨
        </div>

        <h1 className="text-3xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-3">
          Caminho Mágico
        </h1>

        <p className="text-purple-200/80 text-sm font-medium mb-6">
          Redirecionando você de volta ao seu painel de histórias...
        </p>

        <Link
          href="/app"
          className="w-full h-[54px] rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(217,70,239,0.5)] transition-all hover:scale-105 active:scale-95"
        >
          <Home size={18} /> Voltar para Minhas Histórias
        </Link>
      </div>
    </div>
  );
}
