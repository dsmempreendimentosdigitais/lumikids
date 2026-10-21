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
    <div className="relative w-full min-h-screen font-sans select-none overflow-x-hidden">
      {loadingStories ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#D4EAC8] p-8">
          <div className="w-12 h-12 border-4 border-teal-200 border-t-[#0D9488] rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-bold text-slate-700 animate-pulse">Carregando mapa dos mundos... 🗺️</span>
        </div>
      ) : (
        <JourneyMap 
          stories={allJourneyStories} 
          userPlan={dbUser?.plan || 'free'}
          isAdmin={dbUser?.role === 'admin'}
          userName={userName}
        />
      )}
    </div>
  );
}

