'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function HistoriasList() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  const { user, loading: authLoading } = useAuth();
  
  const [stories, setStories] = useState<any[]>([]);
  const [activeAge, setActiveAge] = useState<string>('Todas');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      if (!user) {
        if (!authLoading) setLoading(false);
        return;
      }
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filtragem em memória: exibe histórias públicas (!generatedForUid) ou geradas pelo próprio usuário
        let filteredData = data.filter((s: any) => !s.generatedForUid || s.generatedForUid === user.uid);
        if (categoryFilter) {
          filteredData = filteredData.filter((s: any) => s.category === categoryFilter);
        }

        // Ordenação inteligente: histórias já geradas/lidas primeiro, depois placeholders ordenados por título
        filteredData.sort((a: any, b: any) => {
          const aPlace = a.isPlaceholder ? 1 : 0;
          const bPlace = b.isPlaceholder ? 1 : 0;
          if (aPlace !== bPlace) return aPlace - bPlace;
          return (a.title || '').localeCompare(b.title || '');
        });
        
        setStories(filteredData);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [categoryFilter, user, authLoading]);

  const displayedStories = activeAge === 'Todas'
    ? stories
    : stories.filter((s: any) => s.ageGroups && s.ageGroups.includes(activeAge));

  const pageTitle = categoryFilter 
    ? `Coleção: ${categoryFilter.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` 
    : 'Minhas Histórias';

  return (
    <div className="p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-32 max-w-2xl mx-auto">
      {/* Cabeçalho de Barra de Pedra Entalhada Estilo Bible App for Kids */}
      <div className="stone-banner rounded-[28px] py-4 px-6 text-white mb-6 flex items-center justify-between shadow-lg">
        <Link 
          href="/app"
          className="btn-round-action w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xs"
          title="Voltar ao mapa"
        >
          ←
        </Link>
        <h1 className="text-xl sm:text-2xl font-serif font-black tracking-wide uppercase drop-shadow-md">
          {pageTitle}
        </h1>
        <Link href="/app/criar" className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-md hover:bg-amber-500 transition-all">
          + Criar
        </Link>
      </div>

      {/* Seletor de Idades / Trilhas */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['Todas', '2-4', '5-7', '8-10', '11-14'].map(age => (
          <button
            key={age}
            type="button"
            onClick={() => setActiveAge(age)}
            className={`px-4 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap shadow-xs ${
              activeAge === age
                ? 'bg-[#0D9488] text-white shadow-md scale-105'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {age === 'Todas' ? '⭐ Todas as Idades' : age === '2-4' ? '🍼 2-4 anos' : age === '5-7' ? '📚 5-7 anos' : age === '8-10' ? '🎓 8-10 anos' : '🗡️ 11-14 anos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
        </div>
      ) : displayedStories.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
          {displayedStories.map((story) => (
            <Link 
              href={`/app/historias/${story.id}`} 
              key={story.id} 
              className="wood-plank rounded-2xl p-3.5 sm:p-4 flex gap-4 items-center text-white shadow-lg group transition-transform"
            >
              {/* Miniatura com aro metálico 3D */}
              <div 
                className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center text-2xl shadow-md overflow-hidden border-2 border-slate-200 bg-slate-900" 
              >
                {story.coverImageUrl ? (
                  <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                ) : (
                  story.coverEmoji || '📖'
                )}
              </div>

              {/* Título e Valor moral em relevo */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[0.65rem] font-black uppercase tracking-wider text-amber-200 truncate">
                    {story.value || story.category || 'História de Luz'}
                  </span>
                  {story.isPremium && (
                    <span className="inline-flex items-center px-2 py-0.2 rounded-full text-[0.55rem] font-black bg-amber-400 text-slate-900 shadow-xs">
                      👑 PREMIUM
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-black text-white text-base sm:text-lg leading-snug truncate drop-shadow-sm">
                  {story.title || 'Incrível Aventura'}
                </h3>
                <div className="flex items-center gap-2 text-amber-100/80 text-xs font-semibold mt-0.5">
                  <span>{story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}</span>
                  <span>•</span>
                  <span>⏱️ {story.durationMinutes || 5} min</span>
                </div>
              </div>

              {/* Botão Redondo Azul Tátil */}
              <div className="btn-round-action w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-base shadow-md shrink-0">
                📖
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="parchment-sheet rounded-[28px] p-8 text-center shadow-md border border-amber-300 mt-4 text-[#2D2114]">
          <div className="text-5xl mb-3">📖</div>
          <h3 className="font-serif font-black text-xl mb-1">{categoryFilter ? 'Nenhuma história aqui ainda' : 'A biblioteca está vazia'}</h3>
          <p className="text-xs mb-6 font-semibold text-[#6D4C2B]">Comece a criar aventuras incríveis com Inteligência Artificial!</p>
          <Link href="/app/criar" className="btn-round-action inline-block text-white font-black px-6 py-3 rounded-full text-xs uppercase tracking-wider">
            Criar Primeira História ✨
          </Link>
        </div>
      )}
    </div>
  );
}

export default function HistoriasPage() {
  return (
    <Suspense fallback={<div className="p-6">Carregando biblioteca...</div>}>
      <HistoriasList />
    </Suspense>
  );
}
