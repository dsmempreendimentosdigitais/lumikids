'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function HistoriasList() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('cat');
  
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Filtragem em memória para evitar a necessidade imediata de Composite Indexes no Firestore
        let filteredData = data;
        if (categoryFilter) {
          filteredData = data.filter((s: any) => s.category === categoryFilter);
        }
        
        setStories(filteredData);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, [categoryFilter]);

  const pageTitle = categoryFilter 
    ? `Coleção: ${categoryFilter.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}` 
    : 'Minhas Histórias';

  return (
    <div className="p-6 font-sans bg-[#F0F2FF] min-h-screen pb-32">
      <h1 className="text-[1.8rem] font-black text-[#283593] mb-2 leading-tight">{pageTitle}</h1>
      <p className="text-[#666] font-semibold text-sm mb-8">
        {categoryFilter ? 'Explorando aventuras desta coleção.' : 'Todas as aventuras mágicas geradas.'}
      </p>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : stories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {stories.map((story) => (
            <Link href={`/app/historias/${story.id}`} key={story.id} className="bg-white rounded-[20px] p-4 flex gap-4 items-center shadow-[0_8px_24px_rgba(61,90,254,.08)] transition-all hover:-translate-y-1">
              <div className="w-[60px] h-[60px] rounded-[14px] flex-shrink-0 flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)' }}>
                {story.ageGroups?.[0] === '2-4' ? '🍼' : story.ageGroups?.[0] === '8-10' ? '🎓' : '📚'}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[0.65rem] font-bold uppercase tracking-wider text-blue-500 mb-1 truncate">{story.theme || 'História Mágica'}</div>
                <div className="font-extrabold text-[#283593] text-sm leading-tight mb-1 truncate">{story.title || 'Incrível Aventura'}</div>
                <div className="text-[#999] text-xs font-semibold">
                  {story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'} • Nova
                </div>
              </div>
              <div className="w-8 flex justify-end text-gray-300">
                <i className="fas fa-chevron-right"></i>
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
