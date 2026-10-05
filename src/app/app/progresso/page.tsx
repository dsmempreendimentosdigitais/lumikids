'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';

export default function ProgressoPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStories: 0,
    weekCount: 0,
    monthCount: 0,
    plan: 'free'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Obter contagem de uso do plano
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();
        
        // Obter total de histórias geradas pelo usuário
        const q = query(collection(db, 'stories'), where('generatedForUid', '==', user.uid));
        const snap = await getDocs(q);
        
        setStats({
          totalStories: snap.size,
          weekCount: userData?.aiUsage?.weekCount || 0,
          monthCount: userData?.aiUsage?.monthCount || 0,
          plan: userData?.plan || 'free'
        });
      } catch (err) {
        console.error('Erro ao buscar progresso:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const planName = stats.plan === 'free' ? 'Plano Básico' : stats.plan === 'familia' ? 'Plano Família' : 'Plano Premium';
  const planColor = stats.plan === 'free' ? 'text-gray-500' : 'text-gold-500';

  return (
    <div className="p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-32 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pt-2 mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Perfil</h1>
        <Link href="/app/configuracoes" className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs hover:bg-slate-50 transition-all" title="Configurações">
          ⚙️
        </Link>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-[24px] border border-slate-200/80 p-5 shadow-xs mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#0D9488] shadow-xs flex-shrink-0">
          <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-serif font-bold text-slate-900">{user?.displayName || 'Aventureiro Lumikids'}</h2>
          <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full mt-0.5">
            👑 {planName}
          </span>
        </div>
      </div>

      {/* Stats Row (Estilo Readmio Image 8) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempo de Leitura</div>
          <div className="text-xl font-bold font-sans text-slate-900">{stats.totalStories * 5} <span className="text-xs text-slate-500 font-normal">min</span></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">🗓️</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Semanas de Leitura</div>
          <div className="text-xl font-bold font-sans text-slate-900">1</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">📕</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Histórias Lidas</div>
          <div className="text-xl font-bold font-sans text-slate-900">{loading ? '...' : stats.totalStories}</div>
        </div>
      </div>

      {/* Seção Conquistas Recentes (Estilo Readmio Image 8) */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-serif font-bold text-slate-900">Conquistas Recentes</h3>
          <span className="text-xs font-bold text-[#0D9488] cursor-pointer">Ver todas</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🏅', title: 'Semana Perfeita' },
            { icon: '🌱', title: 'Primeiros Brotos' },
            { icon: '🌸', title: 'Flor dos Contos' },
            { icon: '✨', title: 'Três Desejos' },
            { icon: '🌳', title: 'Carvalho Mítico' },
            { icon: '📖', title: 'Virador de Páginas' },
            { icon: '📜', title: 'Buscador' },
            { icon: '📚', title: 'Devorador' },
            { icon: '👑', title: 'Mestre dos Contos' },
          ].map((medal, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-amber-200 flex items-center justify-center text-2xl mb-2 shadow-xs">
                {medal.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">{medal.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
