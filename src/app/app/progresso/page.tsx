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
    <div className="p-6 font-sans bg-[#F0F2FF] min-h-screen pb-32">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-[54px] h-[54px] rounded-full overflow-hidden shadow-md border-4 border-white">
          <img src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" className="w-[100%] h-[100%] object-cover" />
        </div>
        <div>
          <h1 className="text-[1.5rem] font-black text-[#283593] leading-tight break-all pr-4">{user?.displayName || 'Aventureiro'}</h1>
          <p className={`text-xs font-bold flex items-center gap-1 ${planColor}`}>
            <i className="fas fa-crown"></i> {planName}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-6 shadow-sm mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-[#283593] text-xl mb-1">Total de Leituras</h3>
          <p className="text-[#666] text-xs font-semibold">Histórias geradas no Lumikids</p>
        </div>
        <div className="text-4xl font-black text-[#3D5AFE]">
          {loading ? '...' : stats.totalStories}
        </div>
      </div>

      <h2 className="text-lg font-black text-[#283593] mb-4">Uso do Plano IA</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-50 rounded-full blur-xl"></div>
          <div className="text-3xl mb-1">📅</div>
          <div className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider text-center">Nesta Semana</div>
          <div className="text-3xl font-black text-[#283593] mt-2">
            {loading ? '-' : stats.weekCount} <span className="text-sm text-gray-400 font-semibold">{stats.plan === 'free' ? '/ 2' : ''}</span>
          </div>
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-sm relative overflow-hidden flex flex-col items-center justify-center min-h-[140px]">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-purple-50 rounded-full blur-xl"></div>
          <div className="text-3xl mb-1">🗓️</div>
          <div className="text-gray-500 text-[0.65rem] font-bold uppercase tracking-wider text-center">Neste Mês</div>
          <div className="text-3xl font-black text-[#283593] mt-2">
            {loading ? '-' : stats.monthCount}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] text-white p-6 rounded-[24px] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-lg">Lumikids Premium</h3>
          <i className="fas fa-rocket text-yellow-300 text-2xl animate-pulse"></i>
        </div>
        <p className="font-medium text-blue-100 text-sm leading-relaxed mb-6">
          Desbloqueie infinitas criações, trilhas de valores cristãos completas e áudios super detalhados.
        </p>
        <Link href="/app/planos" className="w-full flex items-center justify-center bg-white text-[#3D5AFE] font-extrabold h-[48px] rounded-[14px] shadow-md hover:bg-gray-50 transition-colors">
          Fazer Upgrade
        </Link>
      </div>
    </div>
  );
}
