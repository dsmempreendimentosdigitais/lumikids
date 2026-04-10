'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function StoryReaderPage({ params }: { params: { id: string } }) {
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setStory({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error('Error fetching story:', err);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#F0F2FF]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="p-6 text-center pt-20 bg-[#F0F2FF] min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">História não encontrada</h2>
        <Link href="/app/historias" className="text-blue-600 font-bold underline">Voltar para Biblioteca</Link>
      </div>
    );
  }

  const audioUrl = story.audio?.[story.language || 'pt-BR']?.url;

  return (
    <div className="bg-[#F0F2FF] min-h-screen font-sans pb-32">
      <div className="bg-white rounded-b-[40px] p-6 pt-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-20 z-0"></div>
        <div className="relative z-10">
          <Link href="/app/historias" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F7FF] text-[#283593] mb-6 hover:bg-blue-100 transition-colors">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div className="text-xs font-bold text-[#3D5AFE] uppercase tracking-wider mb-2">{story.theme || 'Aventura Mágica'}</div>
          <h1 className="text-3xl font-black text-[#283593] leading-tight mb-4">{story.title}</h1>
          
          <div className="flex items-center gap-4 text-xs font-bold text-[#666]">
            <span className="flex items-center gap-1"><i className="fas fa-child text-[#3D5AFE]"></i> {story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}</span>
            <span className="flex items-center gap-1"><i className="fas fa-clock text-[#3D5AFE]"></i> 5 min</span>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4 relative z-20">
        {audioUrl && (
          <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_24px_rgba(61,90,254,.08)] mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8EAF6] text-[#3D5AFE] flex justify-center items-center flex-shrink-0 text-xl">
              <i className="fas fa-headphones"></i>
            </div>
            <div className="flex-1 w-full overflow-hidden">
              <div className="text-xs font-bold text-[#283593] mb-1">Ouvir história</div>
              <audio controls className="w-full h-8 custom-audio-player outline-none" controlsList="nodownload">
                <source src={audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 pb-8">
          <div className="prose prose-blue max-w-none text-[#444] leading-[1.8] text-[1.05rem]">
            {story.content?.text?.split('\n').filter((p: string) => p.trim() !== '').map((p: string, i: number) => (
              <p key={i} className="mb-5 last:mb-0">{p}</p>
            ))}
          </div>
        </div>

        {story.content?.mission && (
          <div className="bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] text-white p-6 rounded-[24px] shadow-lg">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[10px] bg-white/20 flex items-center justify-center text-xl text-yellow-300">
                <i className="fas fa-star"></i>
              </div>
              <h3 className="font-extrabold text-xl">Missão do Bem</h3>
            </div>
            <p className="font-medium text-blue-50 leading-relaxed border-l-2 border-blue-400 pl-4">
              {story.content.mission}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
