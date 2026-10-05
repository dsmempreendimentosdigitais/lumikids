'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Play, ChevronRight, Crown, Wand2, Target, BookOpen, Moon } from 'lucide-react';
import Logo from '@/components/ui/Logo';
import CollectionsGrid from '@/components/app/CollectionsGrid';

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
    <div className="relative min-h-screen pb-32 font-sans bg-[#F8F7F2] text-[#1A1D20]">
      {/* Header Area */}
      <div className="pt-6 px-6 pb-4 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Logo size="md" />
          
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-modal'))}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-xs"
              title="Instalar aplicativo no celular ou tablet"
            >
              📲 <span className="hidden sm:inline">Baixar App</span>
            </button>
            
            <div className="w-9 h-9 rounded-full bg-[#0D9488] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {userInitial}
            </div>
          </div>
        </div>

        <div className="text-slate-500 text-xs font-bold tracking-wide mb-1">{greeting}, {userName}</div>
        <h1 className="text-3xl font-serif font-bold text-slate-900 leading-tight mb-6">
          O que vamos<br/>ler hoje?
        </h1>

        <div className="flex gap-2 flex-wrap mb-4">
          {['2-4', '5-7', '8-10', '11-14'].map(age => (
            <button 
              key={age}
              onClick={() => setActiveAge(age as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeAge === age 
                ? 'bg-[#0D9488] text-white shadow-xs' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {age === '2-4' ? '🍼' : age === '5-7' ? '📚' : age === '8-10' ? '🎓' : '🗡️'} {age} anos
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 max-w-2xl mx-auto space-y-6">
        {/* Story of the day Card (Estilo Readmio Image 1) */}
        <div className="bg-white rounded-[28px] border border-slate-200/80 p-5 shadow-xs relative overflow-hidden">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#F59E0B] text-[0.65rem] font-bold uppercase tracking-wider mb-3">
            <Sparkles size={12} /> História em Destaque
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900 mb-2 leading-snug">
            {ageData[activeAge].title}
          </h3>
          <p className="text-slate-500 text-xs font-medium mb-6">
            {ageData[activeAge].meta}
          </p>
          <div className="flex gap-3">
            <Link 
              href={recentStories.length > 0 ? `/app/historias/${recentStories[0].id}` : '/app/criar'} 
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#0D9488] hover:bg-[#0F766E] transition-all text-white font-bold text-sm px-5 py-3 rounded-full shadow-xs"
            >
              <BookOpen size={16} />
              <span>Ler História</span>
            </Link>
          </div>
        </div>

        {/* Admin Panel (If Admin User) */}
        {dbUser?.role === 'admin' && (
          <Link href="/app/admin" className="block">
             <div className="bg-white border border-slate-200/80 rounded-[22px] p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition-all">
               <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center"><Crown size={20} /></div>
               <div>
                 <h5 className="font-bold text-slate-900 text-sm mb-0.5">Painel Admin</h5>
                 <p className="text-xs text-slate-500 font-medium">Controle de Usuários e Métricas</p>
               </div>
             </div>
          </Link>
        )}

        {/* Trilhas de Conhecimento */}
        <CollectionsGrid />

        {/* Quick Actions Section */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ações Rápidas</h4>
            <Link href="/app/historias" className="text-xs text-[#0D9488] font-bold hover:underline">Ver todas</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/app/criar" className="bg-white border border-slate-200/80 rounded-[20px] p-4 text-center flex flex-col items-center justify-center min-h-[100px] shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 mb-2 rounded-xl bg-teal-50 text-[#0D9488] flex items-center justify-center"><Wand2 size={18} /></div>
              <h5 className="font-bold text-slate-900 text-sm mb-0.5">Criar com IA</h5>
              <p className="text-[0.65rem] text-slate-400">Histórias únicas</p>
            </Link>
            
            <Link href="/app/progresso" className="bg-white border border-slate-200/80 rounded-[20px] p-4 text-center flex flex-col items-center justify-center min-h-[100px] shadow-xs hover:shadow-md transition-all">
              <div className="w-9 h-9 mb-2 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Target size={18} /></div>
              <h5 className="font-bold text-slate-900 text-sm mb-0.5">Missão do Bem</h5>
              <p className="text-[0.65rem] text-slate-400">Tarefas diárias</p>
            </Link>
          </div>
        </div>

        {/* Recent Stories List */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recentes</h4>
            <Link href="/app/historias" className="text-xs text-[#0D9488] font-bold hover:underline">Ver todas</Link>
          </div>

          <div className="flex flex-col gap-3">
            {loadingStories ? (
              <div className="p-6 text-xs text-slate-400 text-center w-full animate-pulse bg-white rounded-[20px] border border-slate-200">
                Carregando histórias...
              </div>
            ) : recentStories.length > 0 ? (
              recentStories.map((story) => (
                <Link href={`/app/historias/${story.id}`} key={story.id} className="bg-white border border-slate-200/80 rounded-[20px] p-4 flex items-center gap-4 shadow-xs hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF9F5] border border-slate-200 flex items-center justify-center text-xl overflow-hidden">
                    {story.coverImageUrl ? (
                      <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                    ) : (
                      story.coverEmoji || '📖'
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[0.65rem] font-bold text-[#0D9488] uppercase tracking-wider mb-0.5 block truncate">{story.value || 'História Clássica'}</span>
                    <h5 className="font-serif font-bold text-slate-900 truncate text-sm mb-0.5">{story.title || 'Incrível Aventura'}</h5>
                    <span className="text-[0.7rem] text-slate-400 font-medium">⏱️ {story.durationMinutes || 5} min</span>
                  </div>
                  <ChevronRight className="text-slate-300 group-hover:text-[#0D9488] transition-colors" size={18} />
                </Link>
              ))
            ) : (
              <div className="p-6 text-xs text-slate-500 text-center w-full bg-white rounded-[20px] border border-slate-200 flex flex-col items-center gap-2">
                Nenhuma história gerada ainda. 
                <Link href="/app/criar" className="text-[#0D9488] font-bold hover:underline">Comece a criar!</Link>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
