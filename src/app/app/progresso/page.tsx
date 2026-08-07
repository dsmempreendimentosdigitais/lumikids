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
    <div className="p-6 font-sans bg-[#0B0819] text-white min-h-screen pb-36 relative overflow-x-hidden">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      <div className="relative z-10 max-w-2xl mx-auto pt-4">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-[58px] h-[58px] rounded-full overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.5)] border-2 border-purple-400 flex-shrink-0">
            <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" className="w-[100%] h-[100%] object-cover" />
          </div>
          <div>
            <h1 className="text-[1.6rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight break-all pr-4">{user?.displayName || 'Aventureiro'}</h1>
            <p className="text-xs font-bold flex items-center gap-1.5 text-amber-300">
              <i className="fas fa-crown"></i> {planName}
            </p>
          </div>
        </div>

        <div className="bg-[#150F2D] border border-purple-500/30 rounded-[28px] p-6 shadow-lg mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-xl mb-1 font-serif">Total de Leituras</h3>
            <p className="text-purple-200/60 text-xs font-semibold">Histórias geradas no Lumikids</p>
          </div>
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
            {loading ? '...' : stats.totalStories}
          </div>
        </div>

        <h2 className="text-sm font-black text-purple-300 uppercase tracking-widest mb-4">Uso do Plano IA</h2>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#150F2D] border border-purple-500/20 rounded-[24px] p-5 shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
            <div className="text-3xl mb-1">📅</div>
            <div className="text-purple-200/60 text-[0.65rem] font-bold uppercase tracking-wider text-center">Nesta Semana</div>
            <div className="text-3xl font-black text-white mt-2 font-serif">
              {loading ? '-' : stats.weekCount} <span className="text-sm text-purple-300/50 font-semibold">{stats.plan === 'free' ? '/ 2' : ''}</span>
            </div>
          </div>

          <div className="bg-[#150F2D] border border-purple-500/20 rounded-[24px] p-5 shadow-lg relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
            <div className="text-3xl mb-1">🗓️</div>
            <div className="text-purple-200/60 text-[0.65rem] font-bold uppercase tracking-wider text-center">Neste Mês</div>
            <div className="text-3xl font-black text-white mt-2 font-serif">
              {loading ? '-' : stats.monthCount}
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300"></div>
          <div className="relative bg-[#150F2D] text-white p-6 rounded-[26px] shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-black text-xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">Lumikids Premium</h3>
              <i className="fas fa-rocket text-yellow-300 text-2xl animate-pulse"></i>
            </div>
            <p className="font-medium text-purple-200/80 text-xs leading-relaxed mb-6">
              Desbloqueie infinitas criações, trilhas de valores cristãos completas e áudios super detalhados.
            </p>
            <Link href="/app/planos" className="w-full flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold h-[50px] rounded-[16px] shadow-md hover:opacity-90 transition-opacity text-sm">
              Fazer Upgrade ✨
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
