'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, MapPin } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  // Redireciona automaticamente para o app principal em caso de rota não encontrada
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/app');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDF8EC] text-[#2D2114] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden font-sans">
      {/* Suave textura de fundo ensolarada */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 50% 20%, #FDE68A 0%, transparent 60%)' 
        }}
      />

      <div className="relative z-10 max-w-md w-full bg-[#FFFDF7] border-2 border-[#EAD7B7] rounded-[32px] p-8 shadow-[0_15px_35px_rgba(45,33,20,0.08)] flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] flex items-center justify-center text-white text-3xl mb-5 shadow-md shadow-sky-500/20">
          <BookOpen size={36} className="text-white" />
        </div>

        <h1 className="text-2xl font-serif font-black text-[#2D2114] mb-2">
          Voltando à Trilha de Histórias
        </h1>

        <p className="text-[#6B5A45] text-sm font-medium mb-6">
          Esta página não foi encontrada. Estamos guiando você de volta ao seu mapa de aventuras...
        </p>

        <Link
          href="/app"
          className="w-full h-[52px] rounded-full bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-600/25 transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
        >
          <MapPin size={18} /> Voltar ao Mapa de Aventuras
        </Link>
      </div>
    </div>
  );
}
