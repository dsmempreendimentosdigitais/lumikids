'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Play, ChevronRight, Crown, Wand2, Target, BookOpen, Moon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import CollectionsGrid from '@/components/app/CollectionsGrid';
import JourneyMap from '@/components/app/JourneyMap';

const ageData = {
  '2-4':   { title: 'O Leãozinho Corajoso', meta: '🍼 Bebês • 3 min • 2–4 anos' },
  '5-7':   { title: 'O Pão que Alimentou a Multidão', meta: '📖 Bíblia • 5 min • 5–7 anos' },
  '8-10':  { title: 'A Menina que Inventou a Luz', meta: '🔬 Inventores • 8 min • 8–10 anos' },
  '11-14': { title: 'O Enigma da Estela Perdida', meta: '🗡️ Jovem • 12 min • 11–14 anos' },
};


export default function AppDashboard() {
  const { user, dbUser } = useAuth();
  const [allJourneyStories, setAllJourneyStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(50));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllJourneyStories(data);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Explorador(a)';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="relative min-h-screen pb-12 font-sans bg-[#F8F7F2] text-[#1A1D20] select-none">
      
      {/* ═══ BARRA SUPERIOR FLUTUANTE LUMIKIDS ═══ */}
      <div className="pt-3 px-4 sm:px-6 pb-2 max-w-5xl mx-auto flex justify-between items-center">
        <Logo size="md" />

        <div className="flex items-center gap-2">
          {/* Acesso Admin Discreto se for Admin */}
          {dbUser?.role === 'admin' && (
            <Link 
              href="/app/admin" 
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs hover:bg-amber-200"
              title="Painel Administrativo"
            >
              👑 <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-modal'))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs"
            title="Instalar aplicativo"
          >
            📲 <span className="hidden sm:inline">Baixar App</span>
          </button>

          <Link
            href="/app/progresso"
            className="w-9 h-9 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold text-sm shadow-xs hover:scale-105 transition-transform"
            title={`Perfil de ${userName}`}
          >
            {userInitial}
          </Link>
        </div>
      </div>

      {/* ═══ MAPA DE AVENTURA DOS MUNDOS (100% Estilo Bible App for Kids) ═══ */}
      <div className="px-3 sm:px-6 max-w-5xl mx-auto mt-2">
        {loadingStories ? (
          <div className="flex flex-col items-center justify-center min-h-[500px] bg-white rounded-[36px] border border-slate-200 p-8 shadow-sm">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-[#0D9488] rounded-full animate-spin mb-3"></div>
            <span className="text-xs font-bold text-slate-500 animate-pulse">Carregando mapa dos mundos... 🗺️</span>
          </div>
        ) : (
          <JourneyMap stories={allJourneyStories} userPlan={dbUser?.plan || 'free'} />
        )}
      </div>

    </div>
  );
}

