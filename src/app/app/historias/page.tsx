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
      <div className="pt-2 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-serif font-bold text-slate-900">{pageTitle}</h1>
          <Link href="/app/criar" className="px-4 py-2 rounded-full bg-[#0D9488] text-white font-bold text-xs shadow-sm hover:bg-[#0F766E] transition-all">
            + Criar Nova
          </Link>
        </div>
        <p className="text-slate-500 font-sans text-xs">
          {categoryFilter ? 'Explorando aventuras desta coleção.' : 'Descubra e leia histórias infantis repletas de virtudes e ensinamentos.'}
        </p>
      </div>

      {/* Seletor de Idades / Trilhas */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['Todas', '2-4', '5-7', '8-10', '11-14'].map(age => (
          <button
            key={age}
            type="button"
            onClick={() => setActiveAge(age)}
            className={`px-4 py-2 rounded-full font-bold text-xs transition-all whitespace-nowrap ${
              activeAge === age
                ? 'bg-[#0D9488] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
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
        <div className="grid grid-cols-1 gap-3">
          {displayedStories.map((story) => (
            <Link 
              href={`/app/historias/${story.id}`} 
              key={story.id} 
              className="bg-white border border-slate-200/80 rounded-[20px] p-4 flex gap-4 items-center shadow-xs hover:shadow-md transition-all group"
            >
              <div 
                className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center text-2xl shadow-xs overflow-hidden" 
                style={{ background: story.coverColor || '#F3F1EA' }}
              >
                {story.coverImageUrl ? (
                  <img src={story.coverImageUrl} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                  story.coverEmoji || '📖'
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#0D9488] truncate">{story.value || story.category || 'História Clássica'}</span>
                  {story.isPremium && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.55rem] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      👑 PREMIUM
                    </span>
                  )}
                </div>
                <h3 className="font-serif font-bold text-slate-900 text-base leading-snug mb-1 truncate">{story.title || 'Incrível Aventura'}</h3>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                  <span>{story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}</span>
                  <span>•</span>
                  <span>⏱️ {story.durationMinutes || 5} min</span>
                </div>
              </div>
              <div className="w-8 flex justify-end text-slate-300 group-hover:text-[#0D9488] transition-colors">
                <i className="fas fa-chevron-right text-sm"></i>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-8 text-center shadow-xs border border-slate-200 mt-4">
          <div className="text-4xl mb-3">📖</div>
          <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">{categoryFilter ? 'Nenhuma história aqui ainda' : 'A biblioteca está vazia'}</h3>
          <p className="text-slate-500 text-xs mb-6 font-sans">Comece a criar aventuras incríveis com Inteligência Artificial!</p>
          <Link href="/app/criar" className="inline-block bg-[#0D9488] text-white font-bold px-6 py-3 rounded-full hover:bg-[#0F766E] transition-all shadow-md text-xs">
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
