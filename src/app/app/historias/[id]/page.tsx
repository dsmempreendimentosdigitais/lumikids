'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';
import InteractiveDragRescue from '@/components/educational/InteractiveDragRescue';
import InteractiveCounting from '@/components/educational/InteractiveCounting';
import InteractiveShapeMatch from '@/components/educational/InteractiveShapeMatch';
import InteractiveMoralChoice from '@/components/educational/InteractiveMoralChoice';
import StoryEndActivity from '@/components/app/StoryEndActivity';

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

const LOCALE_BY_LANG: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  it: 'it-IT',
};

export default function StoryReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { user } = useAuth();
  const { language, t } = useLanguage();
  
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
  const [interactivePop, setInteractivePop] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const [starsReward, setStarsReward] = useState<number>(3);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [activeWordIndex, setActiveWordIndex] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [soundEffectsEnabled, setSoundEffectsEnabled] = useState(true);

  // Cache para traduções dinâmicas de histórias
  const [translatedParagraphs, setTranslatedParagraphs] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Referências para o áudio profissional humanizado
  const audioElementRef = React.useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = React.useRef<Map<string, string>>(new Map());

  // Narração Imersiva: Áudio Realista com IA e Sincronização
  const stopNarration = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsAudioLoading(false);
    setActiveWordIndex(null);
  };

  const fallbackSpeechSynthesis = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setIsAudioLoading(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const targetLocale = LOCALE_BY_LANG[language] || 'pt-BR';
    utterance.lang = targetLocale;
    utterance.rate = 0.92;
    utterance.pitch = 1.05;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => 
      v.lang.toLowerCase().replace('_', '-').startsWith(language) ||
      v.lang.toLowerCase().includes(targetLocale.toLowerCase())
    );
    if (matchedVoice) utterance.voice = matchedVoice;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIdx = event.charIndex;
        const textBefore = text.slice(0, charIdx);
        const wordCount = textBefore.trim() ? textBefore.trim().split(/\s+/).length : 0;
        setActiveWordIndex(wordCount);
      }
    };

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsAudioLoading(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setActiveWordIndex(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsAudioLoading(false);
      setActiveWordIndex(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const speakText = async (text: string) => {
    stopNarration();
    if (!text || !text.trim()) return;

    setIsAudioLoading(true);

    try {
      let audioBlobUrl = audioCacheRef.current.get(text);

      if (!audioBlobUrl) {
        const res = await fetch('/api/ai/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice: 'Aoede' })
        });

        if (res.ok) {
          const blob = await res.blob();
          audioBlobUrl = URL.createObjectURL(blob);
          audioCacheRef.current.set(text, audioBlobUrl);
        }
      }

      if (audioBlobUrl) {
        const audio = new Audio(audioBlobUrl);
        audioElementRef.current = audio;

        const words = text.trim().split(/\s+/);
        audio.ontimeupdate = () => {
          if (audio.duration && audio.duration > 0) {
            const progress = audio.currentTime / audio.duration;
            const currentWord = Math.min(
              words.length - 1,
              Math.floor(progress * words.length)
            );
            setActiveWordIndex(currentWord);
          }
        };

        audio.onplay = () => {
          setIsSpeaking(true);
          setIsAudioLoading(false);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          setActiveWordIndex(null);
        };

        audio.onerror = () => {
          console.warn('Falha no playback de áudio, usando fallback');
          fallbackSpeechSynthesis(text);
        };

        await audio.play();
        return;
      }
    } catch (e) {
      console.warn('Erro ao chamar API de narração, usando sintetizador nativo', e);
    }

    fallbackSpeechSynthesis(text);
  };

  // Para narração ao mudar de página
  useEffect(() => {
    stopNarration();
  }, [currentPageIndex]);

  // Som suave de sininho e reação tátil estilo Bible App for Kids
  const triggerKidReaction = (e?: React.MouseEvent | React.TouchEvent) => {
    let clickX = 50;
    let clickY = 50;
    if (e && 'clientX' in e) {
      clickX = (e as React.MouseEvent).clientX;
      clickY = (e as React.MouseEvent).clientY;
    }
    setInteractivePop({ x: clickX, y: clickY, active: true });
    setTimeout(() => setInteractivePop(prev => ({ ...prev, active: false })), 800);

    if (!soundEffectsEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      // Som de sino feliz (notas C5 e G5)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (err) {}
  };

  // Efeito sonoro suave de página de livro virando (estilo Bible App for Kids)
  const playPageFlipSound = () => {
    if (!soundEffectsEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Cria som de "whoosh" suave de papel
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.12);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  const handleNextPage = () => {
    if (currentPageIndex < displayParagraphs.length + 1) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      playPageFlipSound();
      setCurrentPageIndex(prev => prev - 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;

    if (diffX > 45) {
      // Arrastar para a esquerda -> Próxima página
      handleNextPage();
    } else if (diffX < -45) {
      // Arrastar para a direita -> Página anterior
      handlePrevPage();
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

  const totalStoryPages = displayParagraphs.length;

  // Tradução dinâmica sob demanda quando o usuário seleciona en, es, fr, it
  useEffect(() => {
    if (!story || language === 'pt') return;

    const currentParagraph = currentPageIndex > 0 && currentPageIndex <= totalStoryPages 
      ? displayParagraphs[currentPageIndex - 1]?.text 
      : story?.title;

    if (!currentParagraph || !currentParagraph.trim()) return;
    const cacheKey = `${language}:${currentParagraph.slice(0, 40)}`;
    if (translatedParagraphs[cacheKey]) return;

    let isMounted = true;
    setIsTranslating(true);
    fetch('/api/ai/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: currentParagraph, targetLang: language })
    })
      .then(r => r.json())
      .then(data => {
        if (isMounted && data.translatedText) {
          setTranslatedParagraphs(prev => ({
            ...prev,
            [cacheKey]: data.translatedText
          }));
        }
      })
      .catch(err => console.warn('Falha na tradução automática:', err))
      .finally(() => {
        if (isMounted) setIsTranslating(false);
      });

    return () => { isMounted = false; };
  }, [language, currentPageIndex, story, totalStoryPages, displayParagraphs, translatedParagraphs]);

  const getActiveText = (rawText: string) => {
    if (language === 'pt' || !rawText) return rawText;
    const cacheKey = `${language}:${rawText.slice(0, 40)}`;
    return translatedParagraphs[cacheKey] || rawText;
  };

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
      <div className="flex flex-col justify-center items-center py-20 min-h-screen bg-[#FDF8EC] text-[#2D2114]">
        <div className="w-12 h-12 rounded-full border-4 border-[#EAD7B7] border-t-[#0284C7] animate-spin mb-4"></div>
        <span className="text-sm font-bold text-[#6B5A45] animate-pulse">Abrindo seu livro de histórias...</span>
      </div>
    );
  }

  if (!story && !showNameForm && !generating) {
    return (
      <div className="p-6 text-center pt-28 bg-[#FDF8EC] min-h-screen text-[#2D2114] flex flex-col items-center justify-center font-sans">
        <div className="max-w-md w-full bg-[#FFFDF7] border-2 border-[#EAD7B7] rounded-[32px] p-8 shadow-md">
          <h2 className="text-2xl font-serif font-black text-[#2D2114] mb-3">
            História não encontrada
          </h2>
          <p className="text-[#6B5A45] text-sm font-medium mb-6">
            Não encontramos a história solicitada. Que tal explorar outras aventuras?
          </p>
          <Link href="/app/historias" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0284C7] text-white font-extrabold text-sm shadow-md transition-all hover:scale-105">
            Voltar para o Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (showNameForm) {
    return (
      <div className="p-6 text-center pt-20 bg-[#FDF8EC] min-h-screen flex flex-col justify-center items-center font-sans text-[#2D2114] relative overflow-hidden">
        <div className="bg-[#FFFDF7] rounded-[32px] p-8 max-w-md w-full shadow-[0_15px_35px_rgba(45,33,20,0.08)] border-2 border-[#EAD7B7] relative z-10">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#0284C7] text-white text-[0.65rem] font-black uppercase tracking-wider py-1 px-4 rounded-full shadow-sm">
            Nova Aventura
          </div>
          
          <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-[#0284C7] to-[#38BDF8] text-white flex items-center justify-center text-3xl mx-auto mb-5 mt-2 shadow-md shadow-sky-500/20">
            📖
          </div>

          <h2 className="text-2xl font-serif font-black text-[#2D2114] mb-2 leading-tight">
            Quem viverá a aventura?
          </h2>

          <p className="text-[#6B5A45] font-semibold text-xs mb-6">
            Insira o nome da criança para personalizarmos a história ou use um nome tradicional brasileiro!
          </p>
          
          <form onSubmit={(e) => { e.preventDefault(); if (childNameInput.trim()) handleStartAdventure(childNameInput); }} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={childNameInput}
                onChange={(e) => setChildNameInput(e.target.value)}
                placeholder="Ex: Samuel, Manuela..."
                className="flex-1 bg-white border-2 border-[#EAD7B7] rounded-[16px] h-[52px] px-4 font-bold text-sm text-[#2D2114] placeholder-[#A89885] focus:border-[#0284C7] transition-all outline-none"
              />
              <button
                type="button"
                onClick={handleRandomName}
                className="px-4 h-[52px] rounded-[16px] bg-[#F4E9D8] border border-[#EAD7B7] text-[#2D2114] font-extrabold text-xs hover:bg-[#EBDDC8] transition-all whitespace-nowrap"
              >
                🎲 Aleatório
              </button>
            </div>
            
            <button
              type="submit"
              disabled={!childNameInput.trim()}
              className="w-full h-[54px] rounded-full font-extrabold text-white bg-[#0284C7] shadow-md shadow-sky-600/25 hover:bg-[#0369A1] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none text-sm uppercase tracking-wider"
            >
              Iniciar Leitura
            </button>
          </form>
          
          <Link href="/app/historias" className="block mt-5 text-xs font-bold text-[#6B5A45] hover:text-[#2D2114] hover:underline transition-colors">
            Voltar para o Catálogo
          </Link>
        </div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="flex flex-col justify-center items-center p-6 min-h-screen bg-[#FDF8EC] text-center relative overflow-hidden font-sans">
        <div className="w-16 h-16 border-4 border-[#EAD7B7] border-t-[#0284C7] rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-serif font-black text-[#2D2114] mb-3">
          Preparando sua História...
        </h2>
        <p className="text-[#6B5A45] text-sm font-semibold max-w-sm leading-relaxed">
          Estamos organizando as páginas, preparando as ilustrações e ajustando a narração para uma leitura incrível! 📖
        </p>
      </div>
    );
  }

  if (generationError) {
    return (
      <div className="p-6 text-center pt-20 bg-[#FDF8EC] min-h-screen flex flex-col justify-center items-center font-sans">
        <div className="bg-[#FFFDF7] rounded-[24px] p-6 max-w-md shadow-md border-2 border-amber-200">
          <div className="text-amber-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-[#2D2114] mb-2">Não foi possível carregar a história</h2>
          <p className="text-[#6B5A45] text-sm mb-6 leading-relaxed">{generationError}</p>
          <Link href="/app/historias" className="inline-block py-3 px-6 bg-[#0284C7] text-white font-bold rounded-full shadow-md">
            Voltar para o Catálogo
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
  const totalPagesCount = totalStoryPages + 2; // Cover (0) + Pages (1..N) + End (N+1)

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#2C3E50] overflow-x-hidden select-none relative font-sans">
      
      {/* ═════════════════════════════════════════════════════════════
          LADO ESQUERDO: PERGAMINHO DA HISTÓRIA (Estilo Bíblia Kids)
          ═════════════════════════════════════════════════════════════ */}
      <div 
        className="parchment-sheet parchment-border-right w-full md:w-[44%] lg:w-[40%] shrink-0 min-w-0 flex flex-col justify-between px-6 sm:px-10 md:px-12 py-6 sm:py-8 z-10 shadow-2xl relative min-h-[45vh] md:min-h-screen overflow-y-auto"
        style={{ paddingLeft: 'max(1.75rem, calc(env(safe-area-inset-left) + 1.25rem))' }}
      >
        
        {/* Topo do Pergaminho: Botão de Voltar Redondo Azul, Seletor de Idioma e Controles */}
        <div className="flex items-center justify-between mb-4 w-full">
          {currentPageIndex === 0 ? (
            <Link 
              href="/app/historias" 
              className="btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md active:scale-95"
              title={t('reader_prev_page', 'Voltar para a biblioteca')}
            >
              ←
            </Link>
          ) : (
            <button 
              type="button"
              onClick={handlePrevPage}
              className="btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-md active:scale-95 cursor-pointer"
              title={t('reader_prev_page', 'Página anterior')}
            >
              ←
            </button>
          )}

          {/* Seletor Rápido de Idioma da Leitura */}
          <div className="flex items-center gap-2">
            <LanguageSelector variant="pill" />
          </div>

          {/* Botão de Narração em Voz Alta estilo Bíblia Kids */}
          <button 
            type="button"
            onClick={() => {
              if (isSpeaking || isAudioLoading) {
                stopNarration();
              } else {
                const currentText = currentPageIndex > 0 && currentPageIndex <= totalStoryPages
                  ? getActiveText(displayParagraphs[currentPageIndex - 1].text)
                  : getActiveText(story.title);
                speakText(currentText);
              }
            }}
            className={`btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm shadow-md transition-all cursor-pointer ${
              isSpeaking ? 'ring-4 ring-amber-300 animate-pulse' : ''
            }`}
            title={isSpeaking ? t('reader_pause', 'Pausar') : isAudioLoading ? '...' : t('reader_listen', 'Ouvir')}
          >
            {isAudioLoading ? '⏳' : isSpeaking ? '🔊' : '🔈'}
          </button>
        </div>

        {/* ═══ CONTEÚDO DO PERGAMINHO ═══ */}
        <div className="flex-1 flex flex-col justify-center my-auto py-4 w-full px-1 sm:px-2">
          
          {/* CASO 1: CAPA DA HISTÓRIA (Página 0) */}
          {currentPageIndex === 0 && (
            <div className="text-left space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[0.7rem] font-black uppercase tracking-wider shadow-xs">
                {story.category ? story.category.replace('-', ' ') : 'História Infantil'}
              </span>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-black text-[#2D2114] leading-tight drop-shadow-xs">
                {getActiveText(story.title)}
              </h1>

              <div className="flex items-center gap-3 text-xs font-bold text-[#6D4C2B] pt-1">
                <span>⏱️ {story.durationMinutes || 5} min</span>
                <span>•</span>
                <span>⭐ {story.value || 'Valores Morais'}</span>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="w-full py-4 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 border-2 border-white/60 cursor-pointer"
                >
                  <span>{t('reader_finish', 'Abrir História 📖')}</span>
                </button>
              </div>
            </div>
          )}

          {/* CASO 2: CENAS DA HISTÓRIA (Páginas 1 até N) */}
          {currentPageIndex > 0 && currentPageIndex <= totalStoryPages && (
            (() => {
              const pIndex = currentPageIndex - 1;
              const p = displayParagraphs[pIndex];
              const isFirstStoryPage = pIndex === 0;
              const activeContent = getActiveText(p.text);
              const firstLetter = activeContent ? activeContent.charAt(0) : '';
              const restOfText = activeContent ? activeContent.slice(1) : '';

              return (
                <div className="space-y-4">
                  {isTranslating && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[0.68rem] font-bold text-amber-900 animate-pulse">
                      <span>🌍</span>
                      <span>Traduzindo...</span>
                    </div>
                  )}

                  {/* Texto no pergaminho com formatação calorosa e nítida */}
                  <div className="text-[#2D2114] font-serif text-lg sm:text-xl md:text-2xl leading-relaxed font-bold select-none">
                    {isFirstStoryPage && !isSpeaking ? (
                      <>
                        <span className="float-left text-5xl sm:text-6xl font-serif font-black text-[#0D9488] pr-3 pb-1 leading-none">
                          {firstLetter}
                        </span>
                        {restOfText}
                      </>
                    ) : isSpeaking ? (
                      activeContent.split(/\s+/).map((word: string, wIdx: number) => {
                        const isCurrentWord = activeWordIndex === wIdx;
                        return (
                          <span
                            key={wIdx}
                            className={`transition-all duration-150 inline-block mr-1.5 ${
                              isCurrentWord
                                ? 'bg-amber-300 text-slate-950 font-black px-1.5 py-0.5 rounded-lg shadow-sm scale-105'
                                : 'text-[#2D2114]'
                            }`}
                          >
                            {word}
                          </span>
                        );
                      })
                    ) : (
                      activeContent
                    )}
                  </div>

                  {/* Desafios Educativos Interativos no Pergaminho */}
                  {p.interactiveChallenge && (
                    <div className="pt-2">
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

          {/* CASO 3: FIM DA HISTÓRIA (Página N+1) */}
          {currentPageIndex === totalPagesCount - 1 && (
            <div className="space-y-4 text-center">
              <span className="text-5xl block animate-bounce-subtle">🏆</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-black text-[#2D2114]">
                Fim da Aventura!
              </h2>
              <p className="text-xs sm:text-sm font-bold text-[#6D4C2B]">
                Você completou esta história com honra e sabedoria.
              </p>

              {/* Atividade de Fixação & Selo da Trilha */}
              <StoryEndActivity 
                storyTitle={story.title}
                reflectionQuestion={story.reflection?.question}
                value={story.value}
                onComplete={(score) => {
                  setStarsReward(score);
                }}
              />

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    playPageFlipSound();
                    setCurrentPageIndex(0);
                  }}
                  className="w-full py-3.5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm shadow-md active:scale-95 transition-transform"
                >
                  🔄 Reler História
                </button>

                <Link
                  href="/app/historias"
                  className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md active:scale-95 transition-transform block text-center"
                >
                  🗺️ Voltar ao Mapa
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Rodapé do Pergaminho: Pedras de Marco / Progresso de Capítulos */}
        <div className="pt-4 border-t border-amber-900/15 flex items-center justify-between">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {Array.from({ length: totalPagesCount }).map((_, idx) => {
              const isCurrent = idx === currentPageIndex;
              const isPast = idx < currentPageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    playPageFlipSound();
                    setCurrentPageIndex(idx);
                  }}
                  className={`transition-all rounded-full ${
                    isCurrent
                      ? 'w-6 h-3 bg-amber-400 ring-2 ring-amber-500 shadow-sm'
                      : isPast
                        ? 'w-3 h-3 bg-emerald-600'
                        : 'w-2.5 h-2.5 bg-[#C9B68F]'
                  }`}
                  title={`Página ${idx + 1}`}
                />
              );
            })}
          </div>

          <span className="text-[10px] font-black uppercase text-[#6D4C2B] tracking-wider shrink-0 ml-2">
            {currentPageIndex === 0 
              ? 'Capa' 
              : currentPageIndex === totalPagesCount - 1 
                ? 'Fim' 
                : `Cena ${currentPageIndex} / ${totalStoryPages}`}
          </span>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════════
          LADO DIREITO: ILUSTRAÇÃO 2D EXPANDIDA (Estilo Bíblia Kids)
          ═════════════════════════════════════════════════════════════ */}
      <div 
        className="w-full md:w-[56%] lg:w-[60%] flex-1 relative min-w-0 h-[55vh] md:h-screen overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer select-none"
        onClick={triggerKidReaction}
      >
        {/* Imagem de Fundo em 2D Cartoon Panorâmica */}
        <img 
          src={
            currentPageIndex === 0
              ? story.coverImageUrl || displayParagraphs[0]?.imageUrl
              : currentPageIndex > 0 && currentPageIndex <= totalStoryPages
                ? displayParagraphs[currentPageIndex - 1].imageUrl
                : story.coverImageUrl || displayParagraphs[0]?.imageUrl
          } 
          alt={story.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          onError={(e) => { 
            e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="%2387CEEB"/><circle cx="400" cy="300" r="100" fill="%23FFD700"/><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23FFFFFF" font-size="32" font-family="serif">✨ Ilustração Lumikids</text></svg>'; 
          }}
        />

        {/* Efeito Visual de Estrelinhas e Faíscas Mágicas ao Tocar na Cena */}
        {interactivePop.active && (
          <div className="absolute inset-0 bg-white/10 pointer-events-none flex items-center justify-center animate-ping z-20">
            <span className="text-7xl drop-shadow-2xl">✨ ⭐ ✨</span>
          </div>
        )}

        {/* Badge Lúdico de Interatividade */}
        {currentPageIndex > 0 && currentPageIndex <= totalStoryPages && (
          <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-[0.7rem] font-black text-white shadow-lg flex items-center gap-1.5 pointer-events-none border border-white/20">
            <span>👆 Toque na cena!</span>
          </div>
        )}

        {/* BOTÃO PRÓXIMA PÁGINA (Seta Azul Redonda no Canto Superior Direito) */}
        {currentPageIndex < totalPagesCount - 1 && (
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNextPage();
            }}
            className="btn-round-action w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl absolute top-5 right-5 z-20 active:scale-95"
            title="Próxima página"
          >
            →
          </button>
        )}

        {/* BOTÃO DE MENU (Ícone Redondo de 3 Barras no Canto Inferior Direito) */}
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(true);
          }}
          className="btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-black text-xl shadow-xl absolute bottom-5 right-5 z-20 active:scale-95"
          title="Opções da História"
        >
          ☰
        </button>

      </div>

      {/* ═════════════════════════════════════════════════════════════
          MODAL DE CONFIGURAÇÕES ESTILO BIBLE APP (Pedra + Pergaminho)
          ═════════════════════════════════════════════════════════════ */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
          onClick={() => setIsMenuOpen(false)}
        >
          <div 
            className="w-full max-w-[420px] max-h-[92vh] flex flex-col rounded-[28px] overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 border-2 border-[#D8C29D]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabeçalho de Barra de Pedra Entalhada */}
            <div className="stone-banner py-3.5 px-6 flex items-center justify-between text-white shrink-0">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="btn-round-action w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-base shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                title="Voltar"
              >
                ←
              </button>
              <h3 className="font-serif font-black text-base tracking-wider uppercase drop-shadow-md">
                {t('reader_settings', 'Ajustes de Leitura')}
              </h3>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white border border-white/30">
                ⚙️
              </div>
            </div>

            {/* Corpo em Pergaminho Dobrado com Toggles */}
            <div className="parchment-sheet p-5 sm:p-6 space-y-3.5 text-[#2D2114] overflow-y-auto">
              {/* Opção Efeitos Sonoros */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/60 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🔔</span>
                  <div>
                    <span className="font-black text-sm block leading-tight">{t('reader_sound_effects', 'Efeitos Sonoros')}</span>
                    <span className="text-[0.7rem] text-[#6B5A45] font-semibold">{t('reader_sound_effects_desc', 'Sons de virar página e toques')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEffectsEnabled(prev => !prev)}
                  className={`btn-round-action px-3.5 h-9 rounded-full flex items-center gap-1.5 text-white text-xs font-black shadow-xs transition-all cursor-pointer ${
                    soundEffectsEnabled ? 'bg-[#0284C7]' : 'bg-gray-400 opacity-60'
                  }`}
                >
                  <span>{soundEffectsEnabled ? t('settings_sound_on', 'Ligado') : t('settings_sound_off', 'Mudo')}</span>
                </button>
              </div>

              {/* Opção Narração */}
              <div className="flex items-center justify-between p-3.5 bg-amber-50/60 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🗣️</span>
                  <div>
                    <span className="font-black text-sm block leading-tight">{t('reader_audio_narration', 'Narração em Áudio')}</span>
                    <span className="text-[0.7rem] text-[#6B5A45] font-semibold">{t('reader_audio_narration_desc', 'Leitura realista em voz alta')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (isSpeaking) {
                      stopNarration();
                    } else {
                      const currentText = currentPageIndex > 0 && currentPageIndex <= totalStoryPages
                        ? getActiveText(displayParagraphs[currentPageIndex - 1].text)
                        : getActiveText(story.title);
                      speakText(currentText);
                    }
                  }}
                  className={`btn-round-action px-3.5 h-9 rounded-full flex items-center gap-1.5 text-white text-xs font-black shadow-xs transition-all cursor-pointer ${
                    isSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-[#0284C7]'
                  }`}
                >
                  <span>{isSpeaking ? t('reader_pause', 'Pausar') : t('reader_listen', 'Ouvir')}</span>
                </button>
              </div>

              {/* Idioma da História */}
              <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="text-xs font-black uppercase tracking-wider text-[#4A3B2C] mb-1">
                  🌍 {t('reader_language', 'Idioma da História')}
                </div>
                <div className="text-[0.7rem] text-[#6B5A45] font-semibold mb-2.5">
                  {t('reader_language_desc', 'Alterne o idioma de leitura e narração')}
                </div>
                <LanguageSelector variant="list" />
              </div>

              {/* Botões de Ação com Espaçamento Amplo */}
              <div className="pt-2 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/app"
                    className="py-2.5 px-3 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-black text-[0.75rem] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:bg-amber-50 text-center"
                  >
                    <span>🗺️ {t('nav_home', 'Mapa')}</span>
                  </Link>

                  <Link
                    href="/app/historias"
                    className="py-2.5 px-3 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-black text-[0.75rem] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs hover:bg-amber-50 text-center"
                  >
                    <span>📚 {t('nav_library', 'Catálogo')}</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full h-12 rounded-2xl bg-[#0D9488] text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-[#0F766E] transition-all active:scale-98 flex items-center justify-center cursor-pointer"
                >
                  {t('save_and_close', 'Salvar e Fechar')}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
