'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import InteractiveDragRescue from '@/components/educational/InteractiveDragRescue';
import InteractiveCounting from '@/components/educational/InteractiveCounting';
import InteractiveShapeMatch from '@/components/educational/InteractiveShapeMatch';
import InteractiveMoralChoice from '@/components/educational/InteractiveMoralChoice';

// Função para detectar efeitos visuais baseados nas palavras da história
function getDynamicEffects(text: string): string[] {
  const lowercaseText = (text || '').toLowerCase();
  const effects: string[] = [];

  if (lowercaseText.includes('balão') || lowercaseText.includes('balao')) {
    effects.push('balloon');
  }
  if (lowercaseText.includes('estrela') || lowercaseText.includes('céu') || lowercaseText.includes('ceu') || lowercaseText.includes('noite') || lowercaseText.includes('lua')) {
    effects.push('stars');
  }
  if (lowercaseText.includes('vento') || lowercaseText.includes('voa') || lowercaseText.includes('voou') || lowercaseText.includes('brisa') || lowercaseText.includes('ar')) {
    effects.push('wind');
  }
  if (lowercaseText.includes('flor') || lowercaseText.includes('jardim') || lowercaseText.includes('floresta') || lowercaseText.includes('árvore') || lowercaseText.includes('arvore') || lowercaseText.includes('folha') || lowercaseText.includes('verde') || lowercaseText.includes('mata')) {
    effects.push('petals');
    effects.push('sunbeams');
  }
  if (lowercaseText.includes('água') || lowercaseText.includes('agua') || lowercaseText.includes('rio') || lowercaseText.includes('lago') || lowercaseText.includes('mar') || lowercaseText.includes('peixe') || lowercaseText.includes('onda') || lowercaseText.includes('jacaré') || lowercaseText.includes('jacare')) {
    effects.push('ripples');
  }
  if (lowercaseText.includes('chuva') || lowercaseText.includes('chover') || lowercaseText.includes('gota') || lowercaseText.includes('tempestade')) {
    effects.push('rain');
  }
  if (lowercaseText.includes('luz') || lowercaseText.includes('brilho') || lowercaseText.includes('faísca') || lowercaseText.includes('faisca') || lowercaseText.includes('lâmpada') || lowercaseText.includes('lampada') || lowercaseText.includes('sol') || lowercaseText.includes('dia') || lowercaseText.includes('claridade')) {
    effects.push('glow');
    effects.push('sunbeams');
  }
  if (lowercaseText.includes('gentil') || lowercaseText.includes('amigo') || lowercaseText.includes('bicho') || lowercaseText.includes('animal') || lowercaseText.includes('magia') || lowercaseText.includes('fada') || lowercaseText.includes('feliz') || lowercaseText.includes('sorri') || lowercaseText.includes('alegria')) {
    effects.push('magic_sparks');
  }

  return effects;
}

// Função para quebrar parágrafos longos em legendas menores (até ~130 caracteres)
function splitParagraphIntoSubtitles(text: string, imageUrl: string) {
  if (!text) return [];
  if (text.length <= 400) {
    return [{ text, imageUrl }];
  }

  // Divide por pontos finais, exclamações ou interrogações para preservar sentido das frases
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  const chunks: { text: string; imageUrl: string }[] = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    const cleanSentence = sentence.trim();
    if (!cleanSentence) continue;

    if (!currentChunk) {
      currentChunk = cleanSentence;
    } else if ((currentChunk + ' ' + cleanSentence).length <= 400) {
      currentChunk += ' ' + cleanSentence;
    } else {
      chunks.push({ text: currentChunk, imageUrl });
      currentChunk = cleanSentence;
    }
  }

  if (currentChunk) {
    chunks.push({ text: currentChunk, imageUrl });
  }

  return chunks;
}

export default function StoryReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('free');
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  
  const [childNameInput, setChildNameInput] = useState('');
  const [showNameForm, setShowNameForm] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(true);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 45) {
      // Arrastar para a esquerda -> Próxima página
      if (currentPageIndex < displayParagraphs.length) {
        setCurrentPageIndex(prev => prev + 1);
      }
    } else if (diffX < -45) {
      // Arrastar para a direita -> Página anterior
      if (currentPageIndex > 0) {
        setCurrentPageIndex(prev => prev - 1);
      }
    }
    setTouchStartX(null);
  };

  const traditionalNames = [
    'João', 'Maria', 'Carlos', 'Roberto', 'Naiara', 'Pedro', 'Ana', 'Lucas', 'Julia', 
    'Gabriel', 'Mariana', 'Mateus', 'Beatriz', 'Felipe', 'Larissa', 'Thiago', 'Camila', 
    'Gustavo', 'Isabela', 'Daniel', 'Manuela', 'Arthur', 'Sophia', 'Heitor', 'Valentina',
    'Rafael', 'Alice', 'Eduardo', 'Beatriz', 'Leonardo', 'Helena', 'Bruno', 'Laura'
  ];

  const handleRandomName = () => {
    const randomIndex = Math.floor(Math.random() * traditionalNames.length);
    setChildNameInput(traditionalNames[randomIndex]);
  };

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;
      try {
        const uSnap = await getDoc(doc(db, 'users', user.uid));
        if (uSnap.exists()) {
          setUserPlan(uSnap.data().plan || 'free');
        }
      } catch (err) {
        console.error('Error fetching user plan:', err);
      }
    };
    fetchUserPlan();
  }, [user]);

  // useMemo DEVE estar antes de qualquer return condicional (Rules of Hooks)
  const displayParagraphs = useMemo(() => {
    if (!story?.content?.paragraphs) return [];
    const list: { text: string; imageUrl: string; originalIndex: number; subIndex: number; totalSubs: number; interactiveChallenge?: any }[] = [];
    story.content.paragraphs.forEach((p: any, pIndex: number) => {
      const img = p.imageUrl || story.nanoBananaImageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23150F2D"/><stop offset="100%" stop-color="%230B0819"/></linearGradient></defs><rect width="800" height="800" fill="url(%23g)"/><circle cx="400" cy="350" r="120" fill="%238B5CF6" opacity="0.3"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23F3E8FF" font-size="72" font-family="serif">✨</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23D8B4FE" font-size="28" font-family="sans-serif" font-weight="bold">Ilustração Lumikids</text></svg>';
      const splits = splitParagraphIntoSubtitles(p.text, img);
      splits.forEach((sp, sIndex) => {
        list.push({
          text: sp.text,
          imageUrl: sp.imageUrl,
          originalIndex: pIndex,
          subIndex: sIndex,
          totalSubs: splits.length,
          interactiveChallenge: p.interactiveChallenge
        });
      });
    });
    return list;
  }, [story?.content?.paragraphs, story?.nanoBananaImageUrl]);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setStory({ id: docSnap.id, ...data });
          
          if (data?.isPlaceholder) {
            setShowNameForm(true);
            if (user?.displayName) {
              setChildNameInput(user.displayName.split(' ')[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching story:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchStory();
    }
  }, [id, user]);

  const handleStartAdventure = async (chosenName: string) => {
    if (!user) return;
    setShowNameForm(false);
    setGenerating(true);
    setGenerationError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/ai/gerar-historia-biblioteca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          storyId: id,
          childName: chosenName
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar conteúdo mágico.');
      setStory(data.story);
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || 'Falha ao materializar a história.');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 min-h-screen bg-[#0B0819] text-white">
        <div className="w-12 h-12 rounded-full border-4 border-purple-900/30 border-t-pink-500 animate-spin mb-4 drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]"></div>
        <span className="text-sm font-bold text-purple-200/80 animate-pulse">Carregando magia... ✨</span>
      </div>
    );
  }

  if (!story && !showNameForm && !generating) {
    return (
      <div className="p-6 text-center pt-28 bg-[#0B0819] min-h-screen text-white flex flex-col items-center justify-center">
        <div className="max-w-md w-full bg-[#150F2D] border border-purple-500/30 rounded-[32px] p-8 shadow-[0_0_40px_rgba(139,92,246,0.3)] backdrop-blur-xl">
          <h2 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-4">
            História não encontrada
          </h2>
          <Link href="/app/historias" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-500 to-blue-500 text-white font-extrabold text-sm shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all hover:scale-105">
            Voltar para Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  if (showNameForm) {
    return (
      <div className="p-6 text-center pt-20 bg-[#0B0819] min-h-screen flex flex-col justify-center items-center font-sans text-white relative overflow-hidden">
        {/* Background Starry Glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.25), transparent 70%)' }}></div>

        <div className="bg-[#150F2D] rounded-[32px] p-8 max-w-md w-full shadow-[0_0_50px_rgba(139,92,246,0.4)] border border-purple-500/40 relative z-10 backdrop-blur-xl">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-[0.65rem] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-[0_0_12px_rgba(217,70,239,0.6)]">
            Nova Aventura
          </div>
          
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-pink-500 to-purple-600 text-white flex items-center justify-center text-3xl mx-auto mb-6 mt-2 shadow-[0_0_20px_rgba(217,70,239,0.5)]">
            ✨
          </div>

          <h2 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-2 leading-tight">
            Quem viverá a aventura?
          </h2>

          <p className="text-purple-200/80 font-semibold text-xs mb-6">
            Insira o nome da criança para personalizarmos a história ou use um nome tradicional brasileiro aleatório!
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); if (childNameInput.trim()) handleStartAdventure(childNameInput); }} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={childNameInput}
                onChange={(e) => setChildNameInput(e.target.value)}
                placeholder="Ex: Samuel, Manuela..."
                className="flex-1 bg-[#1A133A] border border-purple-500/30 rounded-[16px] h-[52px] px-4 font-bold text-sm text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-400 transition-all outline-none"
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="px-4 h-[52px] rounded-[16px] bg-purple-500/20 border border-purple-400/40 text-purple-200 font-extrabold text-xs hover:bg-purple-500/30 transition-all whitespace-nowrap"
              >
                🎲 Aleatório
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!childNameInput.trim()}
              className="w-full h-[54px] rounded-[99px] font-extrabold text-white bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 shadow-[0_0_20px_rgba(217,70,239,0.5)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              Criar História Mágica ✨
            </button>
          </form>
          
          <Link href="/app/historias" className="block mt-5 text-xs font-bold text-purple-300/60 hover:text-purple-200 hover:underline transition-colors">
            Voltar para Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-[#0B0819] text-center relative overflow-hidden">
        {/* Background Starry Glows */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></div>
        <div className="absolute top-[40%] right-[20%] w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_rgba(216,180,254,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] left-[25%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_12px_rgba(147,197,253,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="relative mb-8 z-10">
          <div className="w-24 h-24 border-4 border-purple-900/30 border-t-pink-500 rounded-full animate-spin drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
          <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">✨</div>
        </div>
        <h2 className="text-[2.2rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-4 animate-pulse drop-shadow-md z-10">
          Preparando Magia...
        </h2>
        <p className="text-purple-200/80 text-sm font-bold max-w-sm leading-relaxed z-10">
          Nossa inteligência artificial está escrevendo as páginas, renderizando ilustrações 3D e gravando a narração da história! Aguarde só mais um pouquinho. 📖
        </p>
      </div>
    );
  }

  if (generationError) {
    return (
      <div className="p-6 text-center pt-20 bg-[#F0F2FF] min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white rounded-[24px] p-6 max-w-md shadow-lg border border-red-100">
          <div className="text-red-500 text-5xl mb-4"><i className="fas fa-exclamation-triangle"></i></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">A magia falhou temporariamente</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">{generationError}</p>
          <Link href="/app/historias" className="inline-block py-3 px-6 bg-[#3D5AFE] text-white font-bold rounded-full shadow-md shadow-blue-500/20">
            Voltar para Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  const isPremiumUser = ['familia', 'familia_plus', 'premium2'].includes(userPlan);
  const isVideoEnabledUser = ['familia_plus', 'premium2'].includes(userPlan);
  const isAllowed = !story.isPremium || isPremiumUser;

  if (!isAllowed) {
    return (
      <div className="p-6 text-center pt-20 bg-[#F0F2FF] min-h-screen flex flex-col justify-center items-center">
        <div className="bg-white rounded-[32px] p-8 max-w-md shadow-[0_20px_50px_rgba(61,90,254,.15)] border-2 border-amber-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-400 text-black text-[0.65rem] font-bold uppercase tracking-wider py-1 px-4 rounded-bl-lg">🔒 Exclusivo</div>
          <div className="text-6xl mb-6">👑</div>
          <h2 className="text-2xl font-black text-[#283593] mb-4">Aventura Premium</h2>
          <p className="text-gray-600 font-semibold text-sm mb-6 leading-relaxed">
            Esta história faz parte da biblioteca exclusiva do Lumikids. Assine para liberar o acesso total ao catálogo!
          </p>
          <div className="bg-amber-50/50 rounded-[20px] p-4 text-left mb-6 border border-amber-100">
            <div className="flex items-center gap-2 mb-2"><i className="fas fa-check text-amber-600 text-xs"></i><span className="text-xs font-bold text-amber-900">Acesso a 900+ Histórias Inéditas</span></div>
            <div className="flex items-center gap-2 mb-2"><i className="fas fa-check text-amber-600 text-xs"></i><span className="text-xs font-bold text-amber-900">Ilustrações Animadas em Vídeo</span></div>
            <div className="flex items-center gap-2"><i className="fas fa-check text-amber-600 text-xs"></i><span className="text-xs font-bold text-amber-900">Vozes Premium e Narração Inteligente</span></div>
          </div>
          <Link href="/app/planos" className="block w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold rounded-full hover:scale-[1.02] transition-transform shadow-lg shadow-orange-500/20">
            Assinar Premium Grátis 🚀
          </Link>
          <Link href="/app/historias" className="block mt-4 text-[#3D5AFE] font-bold text-xs hover:underline">
            Voltar para Histórias Gratuitas
          </Link>
        </div>
      </div>
    );
  }

  const ageGroup = story.ageGroups?.[0] || '5-7';
  const audioUrl = story.audio?.[story.language || 'pt-BR']?.url;
  const totalPagesCount = displayParagraphs.length + 2; // Cover (1) + Pages (displayParagraphs.length) + End (1)

  return (
    <div className="bg-[#F8F7F2] min-h-screen font-sans pb-28 text-[#1A1D20] flex flex-col justify-between select-none">
      {/* ═══ TOP HEADER (Estilo Readmio) ═══ */}
      <div className="bg-[#F8F7F2]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-40 border-b border-slate-200/60">
        <Link 
          href="/app/historias" 
          className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors text-base font-bold"
          title="Fechar leitor"
        >
          ✕
        </Link>

        <div className="text-sm font-bold text-slate-600 font-sans tracking-wide">
          {currentPageIndex === 0 
            ? `1 / ${totalPagesCount}` 
            : currentPageIndex === displayParagraphs.length + 1 
              ? `${totalPagesCount} / ${totalPagesCount}` 
              : `${currentPageIndex + 1} / ${totalPagesCount}`
          }
        </div>

        <div className="flex items-center gap-3 text-slate-700">
          <button 
            type="button"
            onClick={() => setIsVideoPaused(!isVideoPaused)}
            className="w-9 h-9 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center transition-colors text-sm"
            title="Ouvir Narração"
          >
            🔊
          </button>
          <span className="text-sm font-serif font-bold text-slate-700 cursor-pointer px-1">AA</span>
        </div>
      </div>

      {/* ═══ CONTEÚDO PRINCIPAL DO LEITOR (Estilo Livro Infantil Impresso) ═══ */}
      <div className="flex-1 max-w-xl w-full mx-auto px-6 py-4 flex flex-col justify-center" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        
        {/* SLIDE 1: CAPA COM TÍTULO (Página 1 / Total) */}
        {currentPageIndex === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[480px] text-center px-4 py-8 bg-[#FAF9F5] rounded-[32px] border border-slate-200/80 shadow-sm relative overflow-hidden">
            <div className="w-24 h-[3px] bg-[#0D9488] mb-8 rounded-full"></div>
            
            <span className="text-xs font-bold text-[#0D9488] uppercase tracking-widest mb-3">
              {story.category ? story.category.replace('-', ' ') : 'História Infantil'}
            </span>

            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 leading-tight mb-8 max-w-md">
              {story.title}
            </h1>

            <div className="w-24 h-[3px] bg-[#0D9488] mb-12 rounded-full"></div>

            <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 mb-8">
              <span>⏱️ {story.durationMinutes || 5} min</span>
              <span>•</span>
              <span>❤️ {story.value || 'Valores Morais'}</span>
            </div>

            <p className="text-xs font-sans text-slate-400 animate-pulse flex items-center gap-1">
              Deslize para a direita e boa leitura 👈
            </p>
          </div>
        )}

        {/* SLIDES DA HISTÓRIA (Página 2 a N-1) - 1 Imagem 2D por Página + Texto Serif com Drop Cap */}
        {currentPageIndex > 0 && currentPageIndex <= displayParagraphs.length && (
          (() => {
            const pIndex = currentPageIndex - 1;
            const p = displayParagraphs[pIndex];
            const isFirstStoryPage = pIndex === 0;

            // Extrai a primeira letra para o Drop Cap da primeira página da história
            const firstLetter = p.text ? p.text.charAt(0) : '';
            const restOfText = p.text ? p.text.slice(1) : '';

            return (
              <div className="flex flex-col gap-6">
                {/* 1 ILUSTRAÇÃO 2D DE LIVRO IMPRESSO POR PÁGINA */}
                <div className="w-full rounded-[24px] overflow-hidden shadow-sm border border-slate-200/70 bg-white aspect-square max-h-[350px] mx-auto flex items-center justify-center">
                  <img 
                    src={p.imageUrl} 
                    alt={`Ilustração Página ${currentPageIndex}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="%23F3F1EA"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%230D9488" font-size="32" font-family="serif">✨ Ilustração Lumikids</text></svg>'; }}
                  />
                </div>

                {/* TEXTO ESTILO LIVRO IMPRESSO (Com Capitular na 1ª página) */}
                <div className="w-full bg-[#FAF9F5] p-6 md:p-8 rounded-[28px] border border-slate-200/70 shadow-sm min-h-[140px] flex items-center">
                  <p className="font-serif text-lg md:text-xl text-slate-900 leading-relaxed select-none w-full">
                    {isFirstStoryPage ? (
                      <>
                        <span className="float-left text-5xl md:text-6xl font-serif font-bold text-[#0D9488] pr-3 pb-1 leading-none font-bold">
                          {firstLetter}
                        </span>
                        {restOfText}
                      </>
                    ) : (
                      p.text
                    )}
                  </p>
                </div>

                {/* Desafios Educativos Interativos se houver */}
                {p.interactiveChallenge && (
                  <div className="w-full">
                    {p.interactiveChallenge.type === 'drag_rescue' && (
                      <InteractiveDragRescue 
                        instruction={p.interactiveChallenge.instruction}
                        itemEmoji={p.interactiveChallenge.itemEmoji}
                        targetEmoji={p.interactiveChallenge.targetEmoji}
                      />
                    )}
                    {p.interactiveChallenge.type === 'counting' && (
                      <InteractiveCounting 
                        instruction={p.interactiveChallenge.instruction}
                        targetCount={p.interactiveChallenge.targetCount}
                        itemEmoji={p.interactiveChallenge.itemEmoji}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })()
        )}

        {/* SLIDE FINAL: FIM DA HISTÓRIA & AVALIAÇÃO (Estilo Readmio Image 5) */}
        {currentPageIndex === displayParagraphs.length + 1 && (
          <div className="flex flex-col items-center justify-between min-h-[480px] text-center p-6 bg-[#FAF9F5] rounded-[32px] border border-slate-200/80 shadow-sm">
            <div>
              {/* Miniatura da Capa */}
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md mx-auto mb-4 border border-slate-200">
                <img src={story.coverImageUrl || displayParagraphs[0]?.imageUrl} alt={story.title} className="w-full h-full object-cover" />
              </div>

              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-1">Fim da História</h2>
              <p className="text-xs text-slate-500 font-sans mb-4">O que achou desta aventura?</p>

              {/* Avaliação em Estrelas (Estilo Readmio) */}
              <div className="flex justify-center gap-2 text-2xl text-[#F59E0B] mb-6">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>

            {/* Seção "O que fazer agora?" */}
            <div className="w-full my-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">O que fazer agora?</h3>

              {story.reflection?.question && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-left shadow-xs">
                  <div className="flex items-center gap-2 text-[#0D9488] font-bold text-xs mb-1">
                    <span>💬 Conversar em Família</span>
                  </div>
                  <p className="text-xs font-serif text-slate-700 leading-relaxed">
                    {story.reflection.question}
                  </p>
                </div>
              )}

              {story.mission?.description && (
                <div className="bg-white p-4 rounded-2xl border border-slate-200/80 text-left shadow-xs">
                  <div className="flex items-center gap-2 text-[#F59E0B] font-bold text-xs mb-1">
                    <span>🌟 Missão do Bem</span>
                  </div>
                  <p className="text-xs font-sans text-slate-700 leading-relaxed font-semibold">
                    {story.mission.description}
                  </p>
                </div>
              )}
            </div>

            {/* Botões de Ação Finais */}
            <div className="w-full flex flex-col gap-3">
              <button 
                onClick={() => setCurrentPageIndex(0)}
                className="w-full py-3.5 rounded-full bg-[#0D9488] text-white font-bold text-sm hover:bg-[#0F766E] transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🔄 Reler História</span>
              </button>
              
              <Link 
                href="/app/historias"
                className="w-full py-3.5 rounded-full bg-[#F59E0B] text-slate-900 font-bold text-sm hover:bg-amber-600 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>🚀 Explorar Outras Histórias</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ═══ CONTROLES DE NAVEGAÇÃO DO LEITOR (Botões Voltar e Próxima) ═══ */}
      <div className="max-w-xl w-full mx-auto px-6 py-2 flex items-center justify-between">
        <button
          disabled={currentPageIndex === 0}
          onClick={() => setCurrentPageIndex(prev => prev - 1)}
          className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-all flex items-center gap-1.5"
        >
          <span>👈 Anterior</span>
        </button>

        <button
          disabled={currentPageIndex === displayParagraphs.length + 1}
          onClick={() => setCurrentPageIndex(prev => prev + 1)}
          className="px-6 py-2.5 rounded-full bg-[#0D9488] text-white font-bold text-xs hover:bg-[#0F766E] disabled:opacity-30 disabled:pointer-events-none transition-all shadow-md flex items-center gap-1.5"
        >
          <span>Próxima 👉</span>
        </button>
      </div>
    </div>
  );
}
