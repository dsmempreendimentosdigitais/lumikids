'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

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
  if (text.length <= 130) {
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
    } else if ((currentChunk + ' ' + cleanSentence).length <= 130) {
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
    const list: { text: string; imageUrl: string; originalIndex: number; subIndex: number; totalSubs: number }[] = [];
    story.content.paragraphs.forEach((p: any, pIndex: number) => {
      const img = p.imageUrl || story.nanoBananaImageUrl || 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=800&auto=format&fit=crop';
      const splits = splitParagraphIntoSubtitles(p.text, img);
      splits.forEach((sp, sIndex) => {
        list.push({
          text: sp.text,
          imageUrl: sp.imageUrl,
          originalIndex: pIndex,
          subIndex: sIndex,
          totalSubs: splits.length
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
      <div className="flex justify-center items-center py-20 min-h-screen bg-[#F0F2FF]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!story && !showNameForm && !generating) {
    return (
      <div className="p-6 text-center pt-20 bg-[#F0F2FF] min-h-screen">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">História não encontrada</h2>
        <Link href="/app/historias" className="text-blue-600 font-bold underline">Voltar para Biblioteca</Link>
      </div>
    );
  }

  if (showNameForm) {
    return (
      <div className="p-6 text-center pt-20 bg-[#F0F2FF] min-h-screen flex flex-col justify-center items-center font-sans">
        <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-[0_20px_50px_rgba(61,90,254,.15)] border border-blue-100 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-[0.65rem] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-md">
            Nova Aventura
          </div>
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#3D5AFE] to-[#5C6BC0] text-white flex items-center justify-center text-3xl mx-auto mb-6 mt-2 shadow-lg shadow-blue-500/20">
            ✨
          </div>
          <h2 className="text-2xl font-black text-[#283593] mb-2 leading-tight">Quem viverá a aventura?</h2>
          <p className="text-gray-500 font-semibold text-xs mb-6">
            Insira o nome da criança para personalizarmos a história ou use um nome tradicional brasileiro aleatório!
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); if (childNameInput.trim()) handleStartAdventure(childNameInput); }} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={childNameInput}
                onChange={(e) => setChildNameInput(e.target.value)}
                placeholder="Ex: Samuel, Naiara..."
                className="flex-1 bg-[#F5F7FF] border-none rounded-[16px] h-[52px] px-4 font-bold text-sm text-[#333] focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="px-4 h-[52px] rounded-[16px] bg-[#E8EAF6] text-[#3D5AFE] font-extrabold text-xs hover:bg-blue-100 transition-all whitespace-nowrap"
              >
                🎲 Aleatório
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!childNameInput.trim()}
              className="w-full h-[54px] rounded-[99px] font-extrabold text-white bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] shadow-lg shadow-blue-500/30 hover:-translate-y-[2px] active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm"
            >
              Criar História Mágica <i className="fas fa-wand-magic-sparkles ml-1"></i>
            </button>
          </form>
          
          <Link href="/app/historias" className="block mt-5 text-xs font-bold text-gray-400 hover:underline">
            Voltar para Biblioteca
          </Link>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-[#F0F2FF] text-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl animate-pulse">✨</div>
        </div>
        <h2 className="text-2xl font-black text-[#283593] mb-2 animate-pulse">Preparando magia...</h2>
        <p className="text-gray-500 text-sm font-semibold max-w-xs leading-relaxed">
          Nossa inteligência artificial está escrevendo as páginas, desenhando as ilustrações e gravando a narração da história! Aguarde um momento. 📖
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
  let fontStyleClass = "text-white font-bold text-xs md:text-sm leading-normal select-none tracking-wide";
  if (ageGroup === '2-4') {
    fontStyleClass = "text-white font-extrabold text-sm md:text-base leading-snug select-none tracking-wide";
  } else if (ageGroup === '8-10') {
    fontStyleClass = "text-white font-medium text-[0.7rem] md:text-xs leading-normal select-none tracking-wide";
  }

  const audioUrl = story.audio?.[story.language || 'pt-BR']?.url;

  return (
    <div className="bg-[#F0F2FF] min-h-screen font-sans pb-32">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatBalloon {
          0% { transform: translateY(120vh) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-120vh) translateX(30px) rotate(15deg); opacity: 0; }
        }
        .animate-balloon-slow {
          animation: floatBalloon 9s linear infinite;
        }
        @keyframes twinkleStar {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        .animate-star-twinkle {
          animation: twinkleStar 3s ease-in-out infinite;
        }
        @keyframes blowWind {
          0% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
          30% { opacity: 0.25; }
          70% { opacity: 0.25; }
          100% { transform: translateX(100%) skewX(-15deg); opacity: 0; }
        }
        .animate-wind {
          animation: blowWind 7s linear infinite;
        }
        @keyframes fallPetal {
          0% { transform: translateY(-10%) translateX(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(110%) translateX(-50px) rotate(180deg); opacity: 0; }
        }
        .animate-petal {
          animation: fallPetal 8s linear infinite;
        }
        @keyframes fallRain {
          0% { transform: translateY(-20%) translateX(0); opacity: 0.4; }
          100% { transform: translateY(120%) translateX(-20px); opacity: 0.4; }
        }
        .animate-rain {
          animation: fallRain 1.6s linear infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.2; transform: scale(1.0); }
          50% { opacity: 0.55; transform: scale(1.2); }
        }
        .animate-glow {
          animation: pulseGlow 4s ease-in-out infinite;
        }
        @keyframes sunbeamFlow {
          0%, 100% { opacity: 0.12; transform: skewX(-20deg) translateX(-10px); }
          50% { opacity: 0.28; transform: skewX(-20deg) translateX(15px); }
        }
        .animate-sunbeams {
          animation: sunbeamFlow 6s ease-in-out infinite;
        }
        @keyframes floatSparks {
          0% { transform: translateY(0) translateX(0) scale(0.8); opacity: 0.1; }
          50% { opacity: 0.85; transform: translateY(-35px) translateX(20px) scale(1.3); }
          100% { transform: translateY(-70px) translateX(-15px) scale(0.8); opacity: 0.1; }
        }
        .animate-sparks {
          animation: floatSparks 5s ease-in-out infinite;
        }
      `}} />

      <div className="bg-white rounded-b-[40px] p-6 pt-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-20 z-0"></div>
        <div className="relative z-10">
          <Link href="/app/historias" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F7FF] text-[#283593] mb-6 hover:bg-blue-100 transition-colors">
            <i className="fas fa-arrow-left"></i>
          </Link>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-xs font-bold text-[#3D5AFE] uppercase tracking-wider">{story.theme ? story.theme.split(' - ')[0] : 'Aventura Mágica'}</div>
            {story.isPremium && (
              <span className="bg-amber-100 text-amber-800 text-[0.6rem] font-black px-1.5 py-0.5 rounded-full border border-amber-200 uppercase">
                Premium 👑
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black text-[#283593] leading-tight mb-4">{story.title}</h1>
          <div className="flex items-center gap-4 text-xs font-bold text-[#666]">
            <span className="flex items-center gap-1"><i className="fas fa-child text-[#3D5AFE]"></i> {story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}</span>
            <span className="flex items-center gap-1"><i className="fas fa-clock text-[#3D5AFE]"></i> {story.durationMinutes || 5} min</span>
            <span className="flex items-center gap-1"><i className="fas fa-heart text-[#3D5AFE]"></i> {story.value || 'Valores'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-4 relative z-20">
        {audioUrl && (
          <div className="bg-white p-4 rounded-[20px] shadow-[0_8px_24px_rgba(61,90,254,.08)] mb-8 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#E8EAF6] text-[#3D5AFE] flex justify-center items-center flex-shrink-0 text-xl animate-pulse">
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

        {displayParagraphs.length > 0 ? (
          <div>
            {currentPageIndex === displayParagraphs.length ? (
              /* Slide Final: Moral da História & Missão */
              <div className="relative rounded-[32px] overflow-hidden shadow-[0_12px_36px_rgba(39,44,74,0.15)] bg-gradient-to-tr from-[#1a237e] via-[#283593] to-[#3f51b5] border border-blue-900/30 min-h-[385px] md:min-h-[450px] p-6 text-white flex flex-col justify-between">
                <div className="text-center mt-4">
                  <div className="text-5xl mb-2 animate-bounce">🌟</div>
                  <h2 className="text-2xl font-black tracking-tight text-yellow-300">Fim da Aventura!</h2>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mt-1">Parabéns por concluir esta leitura!</p>
                </div>

                <div className="my-6 space-y-4">
                  {(story.mission || story.content?.mission) && (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1.5 text-yellow-300 font-extrabold text-xs">
                        <i className="fas fa-star"></i>
                        <span>MISSÃO DO BEM: {story.mission?.title || 'Missão do Bem'}</span>
                      </div>
                      <p className="text-blue-50 text-xs leading-relaxed font-semibold">
                        {story.mission?.description || story.content?.mission}
                      </p>
                    </div>
                  )}

                  {story.reflection?.question && (
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-1.5 text-cyan-300 font-extrabold text-xs">
                        <i className="far fa-comments"></i>
                        <span>VAMOS CONVERSAR?</span>
                      </div>
                      <p className="text-blue-50 text-xs leading-relaxed font-semibold">
                        {story.reflection.question}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 mb-2">
                  <button 
                    onClick={() => setCurrentPageIndex(0)}
                    className="w-full h-11 rounded-full bg-white text-[#283593] font-black text-xs hover:bg-blue-50 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-redo"></i> Reler História
                  </button>
                  <Link 
                    href="/app/historias"
                    className="w-full h-11 rounded-full bg-[#3D5AFE] text-white font-black text-xs hover:bg-blue-600 transition-all shadow-md flex items-center justify-center gap-1.5 border border-blue-400/30"
                  >
                    <i className="fas fa-book-open"></i> Ver Outras Histórias
                  </Link>
                </div>
              </div>
            ) : (
              /* Página Ativa da História */
              (() => {
                const p = displayParagraphs[currentPageIndex];
                const activeEffects = getDynamicEffects(p.text);
                const playStateStyle = { animationPlayState: isVideoPaused ? 'paused' : 'running' } as React.CSSProperties;

                return (
                  <div className="relative rounded-[32px] overflow-hidden shadow-[0_12px_36px_rgba(39,44,74,0.15)] group bg-[#090b14] border border-gray-100/5 transition-all duration-300">
                    <div className="absolute inset-0 w-full h-full overflow-hidden">
                      <img 
                        src={p.imageUrl} 
                        alt={`Página ${currentPageIndex + 1}`} 
                        className="w-full h-full object-cover opacity-90"
                        onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=800&auto=format&fit=crop'; }}
                      />
                      {isVideoEnabledUser && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
                          <div className="absolute bottom-20 left-12 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping opacity-60" style={playStateStyle}></div>
                          <div className="absolute top-24 right-20 w-3 h-3 bg-white rounded-full animate-pulse opacity-40" style={playStateStyle}></div>
                          <div className="absolute bottom-28 right-16 w-2.5 h-2.5 bg-yellow-200 rounded-full animate-bounce opacity-50" style={playStateStyle}></div>
                          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse opacity-50" style={playStateStyle}></div>
                          {activeEffects.includes('balloon') && (
                            <>
                              <div className="absolute bottom-0 right-[25%] text-4xl animate-balloon-slow" style={{ ...playStateStyle, animationDelay: '0.8s' }}>🎈</div>
                              <div className="absolute bottom-0 left-[20%] text-3xl animate-balloon-slow" style={{ ...playStateStyle, animationDelay: '4.2s', animationDuration: '11s' }}>🎈</div>
                            </>
                          )}
                          {activeEffects.includes('stars') && (
                            <>
                              <div className="absolute top-[12%] left-[20%] text-yellow-300 text-lg animate-star-twinkle" style={playStateStyle}>⭐</div>
                              <div className="absolute top-[28%] right-[25%] text-yellow-200 text-sm animate-star-twinkle" style={{ ...playStateStyle, animationDelay: '1.2s' }}>⭐</div>
                              <div className="absolute top-[8%] right-[45%] text-yellow-100 text-xs animate-star-twinkle" style={{ ...playStateStyle, animationDelay: '0.7s' }}>⭐</div>
                            </>
                          )}
                          {activeEffects.includes('wind') && (
                            <>
                              <div className="absolute top-[25%] w-full h-[2px] bg-white/10 animate-wind" style={playStateStyle}></div>
                              <div className="absolute top-[45%] w-full h-[1px] bg-white/15 animate-wind" style={{ ...playStateStyle, animationDelay: '2.5s', animationDuration: '8s' }}></div>
                            </>
                          )}
                          {activeEffects.includes('petals') && (
                            <>
                              <div className="absolute top-0 left-[35%] text-pink-300 text-sm animate-petal" style={playStateStyle}>🌸</div>
                              <div className="absolute top-0 left-[65%] text-green-300 text-xs animate-petal" style={{ ...playStateStyle, animationDelay: '3.2s', animationDuration: '9s' }}>🍃</div>
                              <div className="absolute top-0 left-[50%] text-red-300/60 text-sm animate-petal" style={{ ...playStateStyle, animationDelay: '1.5s', animationDuration: '6.5s' }}>🌸</div>
                            </>
                          )}
                          {activeEffects.includes('ripples') && (
                            <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-blue-500/20 to-transparent backdrop-blur-[0.5px]">
                              <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-400/25 animate-pulse" style={playStateStyle}></div>
                            </div>
                          )}
                          {activeEffects.includes('rain') && (
                            <>
                              <div className="absolute inset-0 bg-blue-950/5"></div>
                              <div className="absolute top-0 left-[15%] text-blue-200/40 text-xs animate-rain" style={playStateStyle}>💧</div>
                              <div className="absolute top-0 left-[45%] text-blue-300/40 text-xs animate-rain" style={{ ...playStateStyle, animationDelay: '0.4s' }}>💧</div>
                              <div className="absolute top-0 left-[75%] text-blue-200/40 text-xs animate-rain" style={{ ...playStateStyle, animationDelay: '0.2s' }}>💧</div>
                            </>
                          )}
                          {activeEffects.includes('glow') && (
                            <div className="absolute top-[15%] left-[35%] w-36 h-36 rounded-full bg-yellow-300/10 blur-2xl animate-glow" style={playStateStyle}></div>
                          )}
                          {activeEffects.includes('sunbeams') && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-yellow-100/10 to-transparent pointer-events-none animate-sunbeams" style={playStateStyle}></div>
                          )}
                          {activeEffects.includes('magic_sparks') && (
                            <>
                              <div className="absolute bottom-[30%] left-[30%] w-2 h-2 bg-yellow-300 rounded-full shadow-[0_0_8px_#fde047] animate-sparks" style={playStateStyle}></div>
                              <div className="absolute bottom-[40%] right-[35%] w-2.5 h-2.5 bg-yellow-200 rounded-full shadow-[0_0_10px_#fef08a] animate-sparks" style={{ ...playStateStyle, animationDelay: '1.5s' }}></div>
                              <div className="absolute bottom-[25%] right-[20%] w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_6px_#fde68a] animate-sparks" style={{ ...playStateStyle, animationDelay: '3s' }}></div>
                            </>
                          )}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090b14]/90 via-[#0d1127]/20 to-transparent pointer-events-none"></div>
                    </div>
                    <div className="relative z-30 p-6 flex flex-col justify-between items-center min-h-[385px] md:min-h-[450px] w-full pointer-events-none">
                      <div className="w-full flex justify-between items-start pointer-events-none">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md text-white text-[0.62rem] font-bold uppercase tracking-wider border border-white/10 shadow-inner pointer-events-auto">
                          <i className="fas fa-book-open text-yellow-300"></i> Página {p.originalIndex + 1} {p.totalSubs > 1 ? `(${p.subIndex + 1}/${p.totalSubs})` : ''}
                        </div>

                        {isVideoEnabledUser ? (
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsVideoPaused(!isVideoPaused); }}
                            className={`cursor-pointer backdrop-blur-md text-[0.6rem] font-black px-3.5 py-1.5 rounded-full flex items-center gap-1.5 border transition-all hover:scale-105 active:scale-95 select-none pointer-events-auto shadow-lg z-50 ${
                              isVideoPaused 
                                ? 'bg-[#3D5AFE] text-white border-blue-400 shadow-blue-500/30' 
                                : 'bg-black/60 text-yellow-300 border-yellow-400/30'
                            }`}
                            title={isVideoPaused ? 'Clique para dar play no vídeo' : 'Clique para pausar o vídeo'}
                          >
                            {isVideoPaused ? (
                              <>
                                <i className="fas fa-play text-yellow-300 text-xs"></i>
                                <span>DAR PLAY NO VÍDEO</span>
                              </>
                            ) : (
                              <>
                                <i className="fas fa-pause text-gray-300 text-xs"></i>
                                <span>VÍDEO EM REPRODUÇÃO</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <div className="bg-black/60 backdrop-blur-sm text-[0.55rem] font-bold text-white px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 pointer-events-auto">
                            <i className="fas fa-lock text-yellow-400"></i>
                            VÍDEO (PREMIUM)
                          </div>
                        )}
                      </div>

                      <div className="w-full max-w-[92%] md:max-w-[85%] bg-black/75 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center mb-1 pointer-events-auto overflow-hidden flex items-center justify-center">
                        <p className={fontStyleClass}>{p.text}</p>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}

            {/* Controles de Navegação do Carrossel */}
            <div className="flex items-center justify-between mt-6 w-full gap-4">
              <button
                disabled={currentPageIndex === 0}
                onClick={() => setCurrentPageIndex(prev => prev - 1)}
                className="h-11 px-5 rounded-full font-bold text-xs flex items-center gap-2 border bg-white text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
              >
                <i className="fas fa-arrow-left"></i> Anterior
              </button>

              <div className="hidden sm:flex justify-center items-center gap-1.5">
                {Array.from({ length: displayParagraphs.length + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentPageIndex === idx 
                        ? 'w-5 bg-blue-600 shadow-md' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Ir para a página ${idx + 1}`}
                  />
                ))}
              </div>

              <span className="sm:hidden text-xs font-black text-[#283593] bg-[#E8EAF6] px-4 py-1.5 rounded-full shadow-inner">
                {currentPageIndex === displayParagraphs.length ? 'Final 🌟' : `${currentPageIndex + 1} / ${displayParagraphs.length}`}
              </span>

              <button
                onClick={() => {
                  if (currentPageIndex === displayParagraphs.length) {
                    setCurrentPageIndex(0); // Reset
                  } else {
                    setCurrentPageIndex(prev => prev + 1);
                  }
                }}
                className="h-11 px-6 rounded-full font-black text-xs flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                {currentPageIndex === displayParagraphs.length ? (
                  <>Reler <i className="fas fa-redo"></i></>
                ) : currentPageIndex === displayParagraphs.length - 1 ? (
                  <>Fim 🌟 <i className="fas fa-arrow-right"></i></>
                ) : (
                  <>Próximo <i className="fas fa-arrow-right"></i></>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Fallback quando não há parágrafos estruturados */
          <>
            {story.nanoBananaImageUrl && (
              <div className="mb-6 rounded-[24px] overflow-hidden shadow-sm">
                <img src={story.nanoBananaImageUrl} alt="Ilustração da história" className="w-full h-auto object-cover" />
              </div>
            )}
            <div className="bg-white p-6 rounded-[24px] shadow-sm mb-6 pb-8">
              <div className="prose prose-blue max-w-none text-[#444] leading-[1.8] text-[1.05rem]">
                {story.content?.text?.split('\n').filter((p: string) => p.trim() !== '').map((p: string, i: number) => (
                  <p key={i} className="mb-5 last:mb-0">{p}</p>
                ))}
              </div>
            </div>

            {(story.mission || story.content?.mission) && (
              <div className="bg-[linear-gradient(135deg,#3D5AFE,#5C6BC0)] text-white p-6 rounded-[24px] shadow-lg mb-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[10px] bg-white/20 flex items-center justify-center text-xl text-yellow-300">
                    <i className="fas fa-star"></i>
                  </div>
                  <h3 className="font-extrabold text-xl">{story.mission?.title || 'Missão do Bem'}</h3>
                </div>
                <p className="font-medium text-blue-50 leading-relaxed border-l-2 border-blue-400 pl-4">
                  {story.mission?.description || story.content?.mission}
                </p>
              </div>
            )}

            {story.reflection?.question && (
              <div className="bg-white p-6 rounded-[24px] shadow-sm border border-blue-100 text-center">
                <h4 className="font-extrabold text-[#283593] mb-2"><i className="far fa-comments text-blue-500 mr-2"></i>Vamos conversar?</h4>
                <p className="text-[#666] font-medium text-sm leading-relaxed">{story.reflection.question}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
