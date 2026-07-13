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
    <div className="p-6 font-sans bg-[#F0F2FF] min-h-screen pb-32">
      <div className="flex items-center gap-3 mb-2">
        <Link href="/app" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#283593] shadow-sm hover:bg-blue-50 transition-colors">
          <i className="fas fa-arrow-left text-sm"></i>
        </Link>
        <h1 className="text-[1.8rem] font-black text-[#283593] leading-tight">{pageTitle}</h1>
      </div>
      <p className="text-[#666] font-semibold text-sm mb-6">
        {categoryFilter ? 'Explorando aventuras desta coleção.' : 'Todas as aventuras mágicas geradas.'}
      </p>

      {/* Seletor de Idades com design limpo e responsivo */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {['Todas', '2-4', '5-7', '8-10'].map(age => (
          <button
            key={age}
            type="button"
            onClick={() => setActiveAge(age)}
            className={`px-4 h-[38px] rounded-full font-bold text-xs transition-all whitespace-nowrap ${
              activeAge === age
                ? 'bg-[#3D5AFE] text-white shadow-md shadow-blue-500/20'
                : 'bg-white text-[#666] border border-gray-200 hover:bg-blue-50/50'
            }`}
          >
            {age === 'Todas' ? '⭐ Todas as Idades' : age === '2-4' ? '🍼 2-4 anos' : age === '5-7' ? '📚 5-7 anos' : '🎓 8-10 anos'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : displayedStories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displayedStories.map((story) => (
            <Link 
              href={`/app/historias/${story.id}`} 
              key={story.id} 
              className="bg-white rounded-[20px] p-4 flex gap-4 items-center shadow-[0_8px_24px_rgba(61,90,254,.08)] transition-all hover:-translate-y-1 hover:shadow-md border border-transparent hover:border-blue-100"
            >
              <div 
                className="w-[60px] h-[60px] rounded-[14px] flex-shrink-0 flex items-center justify-center text-3xl" 
                style={{ background: story.coverColor || 'linear-gradient(135deg, #E8EAF6, #C5CAE9)' }}
              >
                {story.coverEmoji || (story.ageGroups?.[0] === '2-4' ? '🍼' : story.ageGroups?.[0] === '8-10' ? '🎓' : '📚')}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="text-[0.65rem] font-bold uppercase tracking-wider text-blue-500 truncate">{story.value || 'História Mágica'}</div>
                  {story.isPremium && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[0.55rem] font-black bg-amber-100 text-amber-800 border border-amber-200">
                      👑 PREMIUM
                    </span>
                  )}
                </div>
                <div className="font-extrabold text-[#283593] text-sm leading-tight mb-1.5 truncate">{story.title || 'Incrível Aventura'}</div>
                <div className="flex items-center gap-2">
                  <span className="text-[#999] text-[0.7rem] font-bold">
                    {story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}
                  </span>
                  <span className="text-[#ddd]">•</span>
                  {story.isPlaceholder ? (
                    <span className="text-blue-500 font-extrabold text-[0.7rem] flex items-center gap-1 animate-pulse">
                      ✨ Inédita (Gerar)
                    </span>
                  ) : (
                    <span className="text-green-500 text-[0.7rem] font-bold flex items-center gap-1">
                      <i className="fas fa-check-circle"></i> Pronta para Ler
                    </span>
                  )}
                </div>
              </div>
              <div className="w-8 flex justify-end text-gray-300">
                <i className="fas fa-chevron-right text-sm"></i>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-8 text-center shadow-lg border-2 border-dashed border-blue-200">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="font-bold text-[#283593] mb-2">{categoryFilter ? 'Nenhuma história aqui ainda' : 'A biblioteca está vazia'}</h3>
          <p className="text-[#666] text-sm mb-6">Comece a criar aventuras incríveis com Inteligência Artificial!</p>
          <Link href="/app/criar" className="inline-block bg-[#3D5AFE] text-white font-bold px-6 py-3 rounded-full hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">
            Criar primeira história <i className="fas fa-wand-magic-sparkles ml-2"></i>
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
