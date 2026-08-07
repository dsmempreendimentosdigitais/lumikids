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
    <div className="p-6 font-sans bg-[#0B0819] text-white min-h-screen pb-36 relative overflow-x-hidden">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2 pt-4">
          <Link href="/app" className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/50 transition-colors">
            <i className="fas fa-arrow-left text-sm"></i>
          </Link>
          <h1 className="text-[2rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight drop-shadow-md">{pageTitle}</h1>
        </div>
        <p className="text-purple-200/70 font-semibold text-xs mb-6">
          {categoryFilter ? 'Explorando aventuras desta coleção.' : 'Todas as aventuras mágicas geradas.'}
        </p>

        {/* Seletor de Idades */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {['Todas', '2-4', '5-7', '8-10', '11-14'].map(age => (
            <button
              key={age}
              type="button"
              onClick={() => setActiveAge(age)}
              className={`px-4 h-[38px] rounded-full font-bold text-xs transition-all whitespace-nowrap ${
                activeAge === age
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md shadow-purple-500/30'
                  : 'bg-[#150F2D] text-purple-200/70 border border-purple-500/20 hover:bg-purple-900/30'
              }`}
            >
              {age === 'Todas' ? '⭐ Todas as Idades' : age === '2-4' ? '🍼 2-4 anos' : age === '5-7' ? '📚 5-7 anos' : age === '8-10' ? '🎓 8-10 anos' : '🗡️ 11-14 anos'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          </div>
        ) : displayedStories.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {displayedStories.map((story) => (
              <Link 
                href={`/app/historias/${story.id}`} 
                key={story.id} 
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-[22px] opacity-0 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#150F2D]/90 backdrop-blur-md border border-purple-500/20 rounded-[20px] p-4 flex gap-4 items-center shadow-lg transition-all hover:-translate-y-1">
                  <div 
                    className="w-[60px] h-[60px] rounded-[16px] flex-shrink-0 flex items-center justify-center text-3xl border border-purple-500/30 shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                    style={{ background: story.coverColor || 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.2))' }}
                  >
                    {story.coverEmoji || (story.ageGroups?.[0] === '2-4' ? '🍼' : story.ageGroups?.[0] === '8-10' ? '🎓' : story.ageGroups?.[0] === '11-14' ? '🗡️' : '📚')}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="text-[0.65rem] font-bold uppercase tracking-wider text-pink-400 truncate">{story.value || 'História Mágica'}</div>
                      {story.isPremium && (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[0.55rem] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          👑 PREMIUM
                        </span>
                      )}
                    </div>
                    <div className="font-extrabold text-white text-base leading-tight mb-1.5 truncate font-serif">{story.title || 'Incrível Aventura'}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-200/60 text-[0.7rem] font-bold">
                        {story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}
                      </span>
                      <span className="text-purple-500/40">•</span>
                      {story.isPlaceholder ? (
                        <span className="text-pink-400 font-extrabold text-[0.7rem] flex items-center gap-1 animate-pulse">
                          ✨ Inédita (Gerar)
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[0.7rem] font-bold flex items-center gap-1">
                          <i className="fas fa-check-circle"></i> Pronta para Ler
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-8 flex justify-end text-purple-400/50 group-hover:text-pink-400 transition-colors">
                    <i className="fas fa-chevron-right text-sm"></i>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-[#150F2D] rounded-[24px] p-8 text-center shadow-lg border border-purple-500/30 mt-4">
            <div className="text-5xl mb-4">📖</div>
            <h3 className="font-bold text-white text-lg mb-2">{categoryFilter ? 'Nenhuma história aqui ainda' : 'A biblioteca está vazia'}</h3>
            <p className="text-purple-200/60 text-xs mb-6">Comece a criar aventuras incríveis com Inteligência Artificial!</p>
            <Link href="/app/criar" className="inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white font-extrabold px-6 py-3 rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/30 text-sm">
              Criar primeira história ✨
            </Link>
          </div>
        )}
      </div>
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
