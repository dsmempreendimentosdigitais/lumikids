'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Play, ChevronRight, Crown, Wand2, Target, BookOpen, Moon } from 'lucide-react';

const ageData = {
  '2-4':   { title: 'O Leãozinho Corajoso', meta: '🍼 Bebês • 3 min • 2–4 anos' },
  '5-7':   { title: 'O Pão que Alimentou a Multidão', meta: '📖 Bíblia • 5 min • 5–7 anos' },
  '8-10':  { title: 'A Menina que Inventou a Luz', meta: '🔬 Inventores • 8 min • 8–10 anos' },
  '11-14': { title: 'O Enigma da Estela Perdida', meta: '🗡️ Jovem • 12 min • 11–14 anos' },
};

export default function AppDashboard() {
  const { user, dbUser } = useAuth();
  const [activeAge, setActiveAge] = useState<'2-4'|'5-7'|'8-10'|'11-14'>('5-7');
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(3));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentStories(data);
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
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="relative min-h-screen pb-36 font-sans">
      {/* Dynamic Background Overlays */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      {/* Header Area */}
      <div className="pt-8 px-6 pb-6 relative z-10 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 font-serif drop-shadow-lg flex items-center gap-2">
            Lumi<em className="not-italic text-yellow-300">kids</em>
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.6)]">
            {userInitial}
          </div>
        </div>

        <div className="text-purple-200/80 text-sm font-bold tracking-wide mb-1">{greeting}, {userName}</div>
        <div className="text-[2.2rem] text-white font-black leading-tight drop-shadow-md mb-6 font-serif">
          O que vamos<br/>ler hoje?
        </div>

        <div className="flex gap-2 flex-wrap mb-4">
          {['2-4', '5-7', '8-10', '11-14'].map(age => (
            <button 
              key={age}
              onClick={() => setActiveAge(age as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                activeAge === age 
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' 
                : 'bg-[#150F2D] border border-purple-500/30 text-purple-200/70 hover:bg-purple-900/30'
              }`}
            >
              {age === '2-4' ? '🍼' : age === '5-7' ? '📚' : age === '8-10' ? '🎓' : '🗡️'} {age} anos
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 relative z-10 max-w-2xl mx-auto space-y-8">
        {/* Story of the day */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[32px] opacity-60 blur-sm group-hover:opacity-100 transition duration-500"></div>
          <div className="relative bg-[#150F2D]/90 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 overflow-hidden">
            <div className="absolute right-4 top-4 text-5xl text-white/5 rotate-12"><Sparkles /></div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-[0.65rem] font-bold uppercase tracking-wider mb-3">
              <Sparkles size={12} /> História do dia
            </div>
            <h3 className="text-xl text-white font-black mb-2 max-w-[240px] leading-tight drop-shadow-md">
              {ageData[activeAge].title}
            </h3>
            <p className="text-purple-200/70 text-xs font-bold mb-6">
              {ageData[activeAge].meta}
            </p>
            <Link href={recentStories.length > 0 ? `/app/historias/${recentStories[0].id}` : '/app/criar'} className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-blue-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all text-white font-bold text-sm px-5 py-3 rounded-full">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center"><Play size={12} className="ml-0.5" fill="currentColor" /></div>
              Ouvir agora
            </Link>
          </div>
        </div>

        {/* Admin Panel (If Admin User) */}
        {dbUser?.role === 'admin' && (
          <Link href="/app/admin" className="relative group block">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[24px] opacity-70 blur-[2px] transition duration-300"></div>
             <div className="relative bg-[#150F2D] border border-white/10 rounded-[22px] p-5 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]"><Crown size={24} /></div>
               <div>
                 <h5 className="font-bold text-white text-base mb-0.5">Painel Admin</h5>
                 <p className="text-xs text-purple-200/60 font-medium">Controle de Usuários e Métricas</p>
               </div>
             </div>
          </Link>
        )}

        {/* Categories Section */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest">Explorar Mágica</h4>
            <Link href="/app/historias" className="text-xs text-blue-400 font-bold hover:text-blue-300">Ver todas</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Link href="/app/criar" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-pink-500 to-purple-500 rounded-[22px] opacity-60 blur-[2px] group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[20px] p-4 text-center h-full flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-10 h-10 mb-2 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"><Wand2 size={20} /></div>
                <h5 className="font-bold text-white text-sm mb-0.5">Criar com IA</h5>
                <p className="text-[0.65rem] text-purple-200/50">Histórias únicas</p>
              </div>
            </Link>
            
            <Link href="/app/progresso" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[22px] opacity-60 blur-[2px] group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[20px] p-4 text-center h-full flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-10 h-10 mb-2 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"><Target size={20} /></div>
                <h5 className="font-bold text-white text-sm mb-0.5">Missão do Bem</h5>
                <p className="text-[0.65rem] text-purple-200/50">Tarefas diárias</p>
              </div>
            </Link>

            <Link href="/app/historias?cat=biblia-kids" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[22px] opacity-60 blur-[2px] group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[20px] p-4 text-center h-full flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-10 h-10 mb-2 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"><BookOpen size={20} /></div>
                <h5 className="font-bold text-white text-sm mb-0.5">Trilha Bíblica</h5>
                <p className="text-[0.65rem] text-purple-200/50">Aprenda a Palavra</p>
              </div>
            </Link>

            <Link href="/app/historias?cat=hora-de-dormir" className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-[22px] opacity-60 blur-[2px] group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[20px] p-4 text-center h-full flex flex-col items-center justify-center min-h-[110px]">
                <div className="w-10 h-10 mb-2 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"><Moon size={20} fill="currentColor" /></div>
                <h5 className="font-bold text-white text-sm mb-0.5">Hora de Dormir</h5>
                <p className="text-[0.65rem] text-purple-200/50">Sonos tranquilos</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-xs font-black text-purple-300 uppercase tracking-widest">Recentes</h4>
            <Link href="/app/historias" className="text-xs text-blue-400 font-bold hover:text-blue-300">Ver todas</Link>
          </div>

          <div className="flex flex-col gap-4">
            {loadingStories ? (
              <div className="p-6 text-sm text-purple-300/50 text-center w-full animate-pulse bg-[#150F2D] rounded-[24px] border border-white/5">
                Conjurando histórias...
              </div>
            ) : recentStories.length > 0 ? (
              recentStories.map((story) => (
                <Link href={`/app/historias/${story.id}`} key={story.id} className="group relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[22px] opacity-0 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-[#150F2D]/80 backdrop-blur-sm border border-purple-500/20 rounded-[20px] p-4 flex items-center gap-4 transition-all">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                      {story.ageGroups?.[0] === '2-4' ? '🍼' : story.ageGroups?.[0] === '8-10' ? '🎓' : story.ageGroups?.[0] === '11-14' ? '🗡️' : '📚'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[0.65rem] font-black text-pink-400 uppercase tracking-widest mb-1 truncate">{story.theme || 'Aventura Mágica'}</div>
                      <div className="font-bold text-white truncate text-sm mb-1">{story.title || 'História Encantada'}</div>
                      <div className="text-xs text-purple-200/50 font-medium">⭐ Criada com IA</div>
                    </div>
                    <ChevronRight className="text-purple-500/50 group-hover:text-pink-400 transition-colors" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-6 text-sm text-purple-200/50 text-center w-full bg-[#150F2D] rounded-[24px] border border-white/5 flex flex-col items-center gap-2">
                <Sparkles className="text-purple-500/50 mb-2" />
                Nenhuma história mágica ainda. 
                <Link href="/app/criar" className="text-pink-400 font-bold hover:underline">Comece a criar!</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
