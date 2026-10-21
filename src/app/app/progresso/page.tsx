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

      {/* Álbum do Explorador: Adesivos das Trilhas (Estilo Bible App for Kids) */}
      <div className="mb-8 bg-gradient-to-br from-amber-50 to-teal-50 border-2 border-amber-200/90 rounded-[28px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm">Álbum de Adesivos & Mundos</h3>
              <p className="text-[0.68rem] text-slate-500 font-medium">Colete um selo dourado ao completar cada trilha</p>
            </div>
          </div>
          <span className="text-[0.65rem] font-black uppercase px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 shadow-xs">
            {stats.totalStories} / 8 Selos
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 pt-2">
          {[
            { id: 'mitologia-grega', emoji: '🏛️', name: 'Olimpo', unlocked: true },
            { id: 'biblia-kids', emoji: '📖', name: 'Bíblia', unlocked: stats.totalStories >= 1 },
            { id: 'mulheres-fortes', emoji: '👑', name: 'Heroínas', unlocked: stats.totalStories >= 2 },
            { id: 'biografias-historicas', emoji: '🏰', name: 'Líderes', unlocked: stats.totalStories >= 3 },
            { id: 'contos-de-herois', emoji: '🛡️', name: 'Fábulas', unlocked: stats.totalStories >= 4 },
            { id: 'inventores-genios', emoji: '🔬', name: 'Oficina', unlocked: stats.totalStories >= 5 },
            { id: 'virtudes-em-acao', emoji: '✨', name: 'Virtudes', unlocked: stats.totalStories >= 6 },
            { id: 'natureza-animais', emoji: '🌿', name: 'Natureza', unlocked: stats.totalStories >= 7 },
          ].map((sticker) => (
            <div 
              key={sticker.id}
              className={`rounded-2xl p-2.5 text-center flex flex-col items-center justify-center transition-all ${
                sticker.unlocked
                  ? 'bg-white border-2 border-amber-300 shadow-xs scale-100'
                  : 'bg-slate-100/70 border border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-1">
                {sticker.emoji}
              </div>
              <span className="text-[0.62rem] font-bold text-slate-800 truncate w-full">
                {sticker.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Conquistas Recentes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-serif font-bold text-slate-900">Medalhas de Leitura</h3>
          <span className="text-xs font-bold text-[#0D9488]">Todas</span>
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
