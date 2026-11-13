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
import StoryQuiz from '@/components/app/StoryQuiz';

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

function isHighQualityVoice(name: string): boolean {
  const n = name.toLowerCase();
  return (
    n.includes('natural') ||
    n.includes('neural') ||
    n.includes('online') ||
    n.includes('google') ||
    n.includes('siri') ||
    n.includes('premium') ||
    n.includes('enhanced') ||
    n.includes('francisca') ||
    n.includes('antonio') ||
    n.includes('luciana') ||
    n.includes('felipe') ||
    n.includes('denise') ||
    n.includes('henri') ||
    n.includes('elvira') ||
    n.includes('alvaro') ||
    n.includes('dalia') ||
    n.includes('jorge') ||
    n.includes('elsa') ||
    n.includes('cosimo') ||
    n.includes('jenny') ||
    n.includes('guy') ||
    n.includes('aria')
  );
}

function selectBestSpeechVoice(voices: SpeechSynthesisVoice[], language: string): SpeechSynthesisVoice | null {
  if (!voices || voices.length === 0) return null;

  const targetLocale = (LOCALE_BY_LANG[language] || 'pt-BR').toLowerCase();

  // ═══ 1. PORTUGUÊS DO BRASIL: PROIBIDO SOTAQUE DE PORTUGAL (pt-PT) ═══
  if (language === 'pt' || targetLocale.includes('br')) {
    // 1a. Buscar vozes neurais / naturais brasileiras (ex: Francisca, Antonio, Google português do Brasil, Luciana)
    const naturalBr = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();
      const isBr = vLang === 'pt-br' || vLang.includes('br') || vName.includes('brazil') || vName.includes('brasil');
      const isNotPortugal = !vLang.includes('pt-pt') && !vName.includes('portugal') && !vName.includes('helia');
      return isBr && isNotPortugal && isHighQualityVoice(vName);
    });
    if (naturalBr) return naturalBr;

    // 1b. Qualquer voz pt-BR do sistema (excluindo rigorosamente qualquer voz de Portugal)
    const anyBr = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();
      const isBr = vLang === 'pt-br' || vLang.includes('br') || vName.includes('brazil') || vName.includes('brasil');
      const isNotPortugal = !vLang.includes('pt-pt') && !vName.includes('portugal') && !vName.includes('helia');
      return isBr && isNotPortugal;
    });
    if (anyBr) return anyBr;

    // 1c. Se só houver voz 'pt' genérica, certifique-se que não é Portugal
    const genericPt = voices.find(v => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();
      return vLang.startsWith('pt') && !vLang.includes('pt-pt') && !vName.includes('portugal');
    });
    if (genericPt) return genericPt;
  }

  // ═══ 2. DEMAIS IDIOMAS (Francês, Espanhol, Italiano, Inglês) ═══
  // 2a. Voz neural / natural com locale exato (ex: fr-FR, es-ES, it-IT, en-US)
  const naturalExact = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    const vName = v.name.toLowerCase();
    return vLang.startsWith(targetLocale) && isHighQualityVoice(vName);
  });
  if (naturalExact) return naturalExact;

  // 2b. Qualquer voz com locale exato
  const anyExact = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang.startsWith(targetLocale);
  });
  if (anyExact) return anyExact;

  // 2c. Qualquer voz que comece com o código do idioma
  const anyLang = voices.find(v => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    return vLang.startsWith(language);
  });
  if (anyLang) return anyLang;

  return null;
}

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
  const [isNightMode, setIsNightMode] = useState(false);

  // Cache para traduções dinâmicas de histórias
  const [translatedParagraphs, setTranslatedParagraphs] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Referências para o áudio e sincronização de fala
  const audioElementRef = React.useRef<HTMLAudioElement | null>(null);
  const audioBlobCacheRef = React.useRef<Record<string, string>>({});
  const wordIntervalRef = React.useRef<any>(null);

  // Pré-aquecimento das vozes neurais instaladas no navegador / sistema operacional
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
      };
    }
  }, []);

  // Narração Imersiva: Áudio Realista com IA e Sincronização
  const stopNarration = () => {
    if (wordIntervalRef.current) {
      clearInterval(wordIntervalRef.current);
      wordIntervalRef.current = null;
    }
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

  const speakWithBrowserFallback = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setIsAudioLoading(false);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      const targetLocale = LOCALE_BY_LANG[language] || 'pt-BR';
      utterance.lang = targetLocale;
      utterance.rate = 0.85;
      utterance.pitch = 1.02;

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = selectBestSpeechVoice(voices, language);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      }

      const words = text.trim().split(/\s+/);
      let boundaryTriggered = false;

      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          boundaryTriggered = true;
          const charIdx = event.charIndex;
          const textBefore = text.slice(0, charIdx);
          const wordCount = textBefore.trim() ? textBefore.trim().split(/\s+/).length : 0;
          setActiveWordIndex(wordCount);
        }
      };

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsAudioLoading(false);

        setTimeout(() => {
          if (!boundaryTriggered && words.length > 0) {
            let currentW = 0;
            wordIntervalRef.current = setInterval(() => {
              currentW++;
              if (currentW < words.length) {
                setActiveWordIndex(currentW);
              } else if (wordIntervalRef.current) {
                clearInterval(wordIntervalRef.current);
                wordIntervalRef.current = null;
              }
            }, 390);
          }
        }, 400);
      };

      utterance.onend = () => {
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current);
          wordIntervalRef.current = null;
        }
        setIsSpeaking(false);
        setIsAudioLoading(false);
        setActiveWordIndex(null);
      };

      utterance.onerror = () => {
        if (wordIntervalRef.current) {
          clearInterval(wordIntervalRef.current);
          wordIntervalRef.current = null;
        }
        setIsSpeaking(false);
        setIsAudioLoading(false);
        setActiveWordIndex(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Erro ao reproduzir voz fallback:', e);
      setIsSpeaking(false);
      setIsAudioLoading(false);
    }
  };

  const speakText = async (text: string) => {
    stopNarration();
    const cleanText = text?.trim();
    if (!cleanText) return;

    setIsAudioLoading(true);
    const words = cleanText.split(/\s+/);
    const cacheKey = `${language}:${cleanText}`;

    try {
      let audioUrl = audioBlobCacheRef.current[cacheKey];

      if (!audioUrl) {
        const res = await fetch('/api/ai/narrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            lang: language,
            voice: 'Aoede',
          }),
        });

        if (!res.ok) {
          throw new Error(`Narrate API status ${res.status}`);
        }

        const blob = await res.blob();
        if (blob.size < 100) {
          throw new Error('Empty audio blob');
        }
        audioUrl = URL.createObjectURL(blob);
        audioBlobCacheRef.current[cacheKey] = audioUrl;
      }

      const audio = new Audio(audioUrl);
      // Cadência levemente mais suave para leitura infantil acolhedora
      audio.playbackRate = 0.96;
      audioElementRef.current = audio;

      audio.onplay = () => {
        setIsAudioLoading(false);
        setIsSpeaking(true);
        setActiveWordIndex(0);
      };

      audio.ontimeupdate = () => {
        if (audio.duration && words.length > 0) {
          const progress = Math.min(1, audio.currentTime / (audio.duration * 0.96));
          const idx = Math.min(words.length - 1, Math.floor(progress * words.length));
          setActiveWordIndex(idx);
        }
      };

      audio.onended = () => {
        setIsSpeaking(false);
        setIsAudioLoading(false);
        setActiveWordIndex(null);
      };

      audio.onerror = () => {
        speakWithBrowserFallback(cleanText);
      };

      await audio.play();
    } catch (err) {
      console.warn('Usando fallback de voz local:', err);
      speakWithBrowserFallback(cleanText);
    }
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
    if (isLockedByPaywall) return;
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

    // Se houver tradução gravada no banco de dados para o idioma ativo, utiliza diretamente
    const preTranslatedParagraphs = story?.translations?.[language]?.paragraphs;

    const list: { text: string; imageUrl: string; originalIndex: number; subIndex: number; totalSubs: number; interactiveChallenge?: any }[] = [];
    story.content.paragraphs.forEach((p: any, pIndex: number) => {
      const img = p.imageUrl || story.nanoBananaImageUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23150F2D"/><stop offset="100%" stop-color="%230B0819"/></linearGradient></defs><rect width="800" height="800" fill="url(%23g)"/><circle cx="400" cy="350" r="120" fill="%238B5CF6" opacity="0.3"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" fill="%23F3E8FF" font-size="72" font-family="serif">✨</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23D8B4FE" font-size="28" font-family="sans-serif" font-weight="bold">Ilustração Contos & Virtudes</text></svg>';
      const rawText = (preTranslatedParagraphs && preTranslatedParagraphs[pIndex]) ? preTranslatedParagraphs[pIndex] : p.text;
      const splits = splitParagraphIntoSubtitles(rawText, img);
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
  }, [story?.content?.paragraphs, story?.translations, story?.nanoBananaImageUrl, language]);

  const totalStoryPages = displayParagraphs.length;

  // Tradução dinâmica sob demanda apenas se a história ainda não tiver tradução gravada no banco
  useEffect(() => {
    if (!story || language === 'pt') return;
    // Se já estiver gravado no documento da história no banco, não precisa de fetch sob demanda
    if (story?.translations?.[language]) return;

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

    // 1. Verifica se a história tem tradução gravada no banco de dados (zero delay)
    if (story?.translations?.[language]) {
      const tr = story.translations[language];
      if (rawText === story.title && tr.title) return tr.title;
      if (rawText === story.description && tr.description) return tr.description;
    }

    // 2. Cache em memória / dinâmica sob demanda
    const cacheKey = `${language}:${rawText.slice(0, 40)}`;
    return translatedParagraphs[cacheKey] || rawText;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStory = async () => {
      try {
        const docRef = doc(db, 'stories', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (isMounted) {
            setStory({ id: docSnap.id, ...data });
            if (data?.isPlaceholder) {
              setShowNameForm(true);
              if (user?.displayName) {
                setChildNameInput(user.displayName.split(' ')[0]);
              }
            }
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Client getDoc failed, trying server API:', err);
      }

      // Fallback via API do servidor (funciona para visitantes não-logados)
      try {
        const res = await fetch(`/api/stories/${id}`);
        if (res.ok) {
          const json = await res.json();
          if (json.story && isMounted) {
            setStory(json.story);
            if (json.story.isPlaceholder) {
              setShowNameForm(true);
              if (user?.displayName) {
                setChildNameInput(user.displayName.split(' ')[0]);
              }
            }
          }
        }
      } catch (apiErr) {
        console.error('Error fetching story via server API:', apiErr);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (id) {
      fetchStory();
    }
    return () => { isMounted = false; };
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

  const isPremiumUser = ['familia', 'familia_plus', 'premium2', 'anual', 'mensal'].includes(userPlan);
  // 1 história livre por trilha liberada por completo (ou identificador isFreeComplete)
  const isFreeCompleteStory = Boolean(story.isFreeComplete || story.isFree || story.orderIndex === 0);
  // Paywall híbrido: não-assinantes leem as primeiras 4 cenas; a partir da cena 5, surge o paywall de continuação
  const isLockedByPaywall = !isPremiumUser && !isFreeCompleteStory && currentPageIndex >= 5;

  const ageGroup = story.ageGroups?.[0] || '5-7';
  const audioUrl = story.audio?.[story.language || 'pt-BR']?.url;
  const totalPagesCount = totalStoryPages + 2; // Cover (0) + Pages (1..N) + End (N+1)

  // ═══ TELA CHEIA IMERSIVA DE PRÉVIA GRATUITA ENCERRADA (Grande, Legível & Botão Amplo) ═══
  if (isLockedByPaywall) {
    const paywallBackgroundImg = (displayParagraphs.length >= 4 && displayParagraphs[3]?.imageUrl) || story.coverImageUrl;

    return (
      <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-4 sm:p-8 overflow-x-hidden select-none font-sans bg-slate-950">
        
        {/* Fundo com Ilustração da História Suavemente Desfocada */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <img 
            src={paywallBackgroundImg} 
            alt="Cena da História" 
            className="w-full h-full object-cover filter blur-xl scale-110 opacity-30 brightness-75 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-amber-950/25 to-black/85" />
        </div>

        {/* Topo Flutuante */}
        <div className="relative z-20 w-full max-w-xl flex items-center justify-between pt-2 sm:pt-4 mb-2">
          <button 
            type="button"
            onClick={() => {
              playPageFlipSound();
              setCurrentPageIndex(4);
            }}
            className="btn-round-action w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-xl shadow-lg active:scale-95 cursor-pointer"
            title="Voltar para a página anterior"
          >
            ←
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-amber-200 bg-amber-900/60 px-4 py-1.5 rounded-full border border-amber-500/40 shadow-sm backdrop-blur-md">
            🔒 Prévia Gratuita Encerrada
          </span>

          <Link 
            href="/app"
            className="btn-round-action w-12 h-12 rounded-full text-white flex items-center justify-center font-black text-xl shadow-lg active:scale-95 cursor-pointer"
            title="Voltar ao Mapa de Aventuras"
          >
            🗺️
          </Link>
        </div>

        {/* Card Centralizado, Espaçoso e com Tipografia Grande */}
        <div className="relative z-20 w-full max-w-xl my-auto py-4">
          <div className="bg-[#FFFDF7]/98 border-2 border-amber-300 rounded-[32px] p-6 sm:p-9 shadow-2xl text-center space-y-5 backdrop-blur-md">
            
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 text-amber-950 border-2 border-white shadow-md flex items-center justify-center mx-auto text-3xl sm:text-4xl animate-bounce-subtle">
              👑
            </div>

            <div>
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black uppercase tracking-wider mb-2.5">
                Capítulo Bloqueado
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-[#2D2114] leading-snug">
                O que acontece em seguida? 📖
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#6D4C2B] mt-2.5 max-w-md mx-auto leading-relaxed">
                Você acompanhou o início desta jornada emocionante! Descubra o desfecho vitorioso de <strong className="text-[#2D2114]">{getActiveText(story.title)}</strong> e liberte mais de 60 histórias completas no Contos & Virtudes.
              </p>
            </div>

            {/* Vantagens em destaque com fonte expandida */}
            <div className="bg-amber-50/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-200 text-left space-y-2.5 shadow-xs">
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#2D2114]">
                <span className="text-[#0D9488] text-base font-black">✓</span>
                <span>Acesso ilimitado a todas as páginas e cenas em altíssima definição</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#2D2114]">
                <span className="text-[#0D9488] text-base font-black">✓</span>
                <span>Narração de voz profissional, trilha sonora e quizzes interativos</span>
              </div>
              <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-[#2D2114]">
                <span className="text-[#0D9488] text-base font-black">✓</span>
                <span>Por apenas <strong className="text-[#0D9488]">R$ 19,90/mês</strong> no plano anual (ou 12x de R$ 19,90)</span>
              </div>
            </div>

            {/* BOTÃO GRANDE NA PARTE INFERIOR (Chamada Principal) */}
            <div className="pt-2 flex flex-col gap-3">
              <Link
                href="/app/planos"
                className="w-full h-15 sm:h-18 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm sm:text-lg uppercase tracking-wider shadow-xl shadow-teal-900/30 active:scale-98 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>DESBLOQUEAR HISTÓRIA COMPLETA 🚀</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  playPageFlipSound();
                  setCurrentPageIndex(4);
                }}
                className="w-full py-3 rounded-full bg-white border border-[#D8C29D] text-[#6D4C2B] font-bold text-xs sm:text-sm hover:bg-amber-50 transition-colors cursor-pointer"
              >
                ← Rever Páginas Anteriores Gratuitas
              </button>
            </div>

          </div>
        </div>

        {/* Rodapé Flutuante */}
        <div className="relative z-20 pb-2 text-center text-xs text-amber-200/60 font-semibold">
          Contos & Virtudes • Histórias & Valores para a Vida Inteira
        </div>

      </div>
    );
  }

  // ═══ TELA CHEIA IMERSIVA DO QUIZ & FIM DA AVENTURA (Com imagem de fundo desfocada) ═══
  if (currentPageIndex === totalPagesCount - 1) {
    const endBackgroundImg = (displayParagraphs.length > 0 && displayParagraphs[displayParagraphs.length - 1]?.imageUrl) || story.coverImageUrl;

    return (
      <div className="relative min-h-screen w-full flex flex-col justify-between items-center p-3 sm:p-6 overflow-x-hidden select-none font-sans bg-slate-950">
        
        {/* Fundo Cenográfico da História Desfocado (Estilo Contos & Virtudes) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <img 
            src={endBackgroundImg} 
            alt="Cena da História" 
            className="w-full h-full object-cover filter blur-lg scale-110 opacity-40 brightness-75 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-amber-950/20 to-black/75" />
        </div>

        {/* Topo Flutuante: Botão Voltar para Última Página, Idioma e Mapa */}
        <div className="relative z-20 w-full max-w-2xl flex items-center justify-between pt-2 sm:pt-4 mb-3 sm:mb-4">
          <button 
            type="button"
            onClick={() => {
              playPageFlipSound();
              setCurrentPageIndex(totalStoryPages);
            }}
            className="btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-black text-xl shadow-lg active:scale-95 cursor-pointer"
            title="Página anterior"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            <LanguageSelector variant="pill" />
          </div>

          <Link 
            href="/app"
            className="btn-round-action w-11 h-11 sm:w-12 sm:h-12 rounded-full text-white flex items-center justify-center font-black text-xl shadow-lg active:scale-95 cursor-pointer"
            title="Voltar ao Mapa de Aventuras"
          >
            🗺️
          </Link>
        </div>

        {/* Card Centralizado: Medalha da Virtude + Pergunta do Travesseiro + Quiz Pedagógico */}
        <div className="relative z-20 w-full max-w-2xl my-auto py-2 space-y-4">
          {/* Cartão Ritual Familiar: Medalha & Pergunta do Travesseiro */}
          <div className="bg-[#FFFDF7]/95 backdrop-blur-md border-2 border-amber-300 rounded-[28px] p-5 sm:p-6 shadow-xl text-[#2D2114]">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-300 to-[#D97706] text-white flex items-center justify-center text-2xl shadow-md border-2 border-white shrink-0">
                🏅
              </div>
              <div>
                <span className="text-[0.68rem] font-extrabold uppercase tracking-wider text-[#0D9488] block">
                  ✨ Virtude Conquistada Hoje
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                  Guardião de {story.value || 'Sabedoria & Coragem'}
                </h3>
              </div>
            </div>

            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#D97706] mb-1">
                💬 Pergunta do Travesseiro (Para conversar com seu filho)
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-800 leading-relaxed">
                &ldquo;Qual foi a atitude mais bonita que vimos em <strong>{getActiveText(story.title)}</strong> e como podemos praticar <strong>{(story.value || 'essa virtude').toLowerCase()}</strong> amanhã em casa?&rdquo;
              </p>
            </div>
          </div>

          <StoryQuiz 
            storyTitle={getActiveText(story.title)}
            storyCategory={story.category}
            storyValue={story.value}
            storySummary={getActiveText(story.description || story.title)}
            onReread={() => {
              playPageFlipSound();
              setCurrentPageIndex(0);
            }}
            onComplete={({ correctCount, earnedPoints }) => {
              setStarsReward(Math.min(3, Math.max(1, correctCount)));
              if (user?.uid) {
                try {
                  const userStatsKey = `contosevirtudes_stats_${user.uid}`;
                  const current = JSON.parse(localStorage.getItem(userStatsKey) || '{"storiesRead":0,"correctAnswers":0,"streak":1}');
                  current.storiesRead = (current.storiesRead || 0) + 1;
                  current.correctAnswers = (current.correctAnswers || 0) + correctCount;
                  localStorage.setItem(userStatsKey, JSON.stringify(current));
                } catch (e) {}
              }
            }}
          />
        </div>

        {/* Espaçamento Inferior */}
        <div className="relative z-20 pb-2" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden select-none relative font-sans transition-colors duration-300 ${
        isNightMode ? 'bg-[#140F0A]' : 'bg-[#2C3E50]'
      }`}
    >
      {/* ═════════════════════════════════════════════════════════════
          ILUSTRAÇÃO 2D AMPLIADA (No topo no celular, lado direito no desktop)
          Com Botão de Áudio Flutuante no Canto Superior Direito
          ═════════════════════════════════════════════════════════════ */}
      <div
        className="order-1 md:order-2 w-full md:w-[60%] lg:w-[62%] relative min-w-0 h-[54vh] sm:h-[60vh] md:h-screen overflow-hidden bg-slate-900 flex items-center justify-center cursor-pointer select-none shrink-0"
        onClick={triggerKidReaction}
      >
        {/* Imagem de Fundo em 2D Cartoon Panorâmica Maior */}
        <img
          src={
            currentPageIndex === 0
              ? story.coverImageUrl || displayParagraphs[0]?.imageUrl
              : currentPageIndex > 0 && currentPageIndex <= totalStoryPages
                ? displayParagraphs[currentPageIndex - 1].imageUrl
                : story.coverImageUrl || displayParagraphs[0]?.imageUrl
          }
          alt={story.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLockedByPaywall ? 'blur-md scale-105 opacity-60' : 'hover:scale-103'
          } ${isNightMode ? 'brightness-85 sepia-[0.18]' : ''}`}
          onError={(e) => {
            e.currentTarget.src =
              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="%230D9488"/><circle cx="400" cy="300" r="100" fill="%23F59E0B"/><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" fill="%23FFFFFF" font-size="32" font-family="sans-serif">✨ Ilustração Contos & Virtudes</text></svg>';
          }}
        />

        {/* Gradiente sutil apenas na faixa superior para destacar os botões flutuantes */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/45 to-transparent pointer-events-none z-10" />

        {/* TOPO FLUTUANTE SOBRE A IMAGEM: Voltar + Modo Sono + Tradução + OUVIR em linha */}
        <div
          className="absolute top-3 inset-x-3 sm:top-5 sm:inset-x-5 z-30 flex items-center justify-between gap-2 pointer-events-none"
        >
          <div
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-1 max-w-full pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Voltar / Mapa */}
            {currentPageIndex === 0 ? (
              <Link
                href="/app"
                className="h-9 px-3 rounded-full bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs shadow-md border border-white/60 flex items-center gap-1.5 active:scale-95 transition-all shrink-0"
                title="Voltar para o Mapa"
              >
                <span>←</span>
                <span>Mapa</span>
              </Link>
            ) : (
              <button
                type="button"
                onClick={handlePrevPage}
                className="h-9 px-3 rounded-full bg-white/95 hover:bg-white text-slate-900 font-extrabold text-xs shadow-md border border-white/60 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0"
                title="Página anterior"
              >
                <span>←</span>
                <span>Voltar</span>
              </button>
            )}

            {/* 2. Toggle Modo Sono (Luz Azul Zero / Sépia Noturno) */}
            <button
              type="button"
              onClick={() => setIsNightMode((prev) => !prev)}
              className={`h-9 px-3 rounded-full font-extrabold text-xs shadow-md border transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0 ${
                isNightMode
                  ? 'bg-[#2C2014] border-amber-400 text-amber-300'
                  : 'bg-white/95 border-white/60 text-slate-800 hover:bg-white'
              }`}
              title="Alternar Modo Hora do Sono"
            >
              <span>{isNightMode ? '☀️' : '🌙'}</span>
              <span>{isNightMode ? 'Modo Sono: On' : 'Modo Sono'}</span>
            </button>

            {/* 3. Tradução / Idioma */}
            <div className="shrink-0">
              <LanguageSelector variant="pill" />
            </div>

            {/* 4. BOTÃO OUVIR (Exatamente à direita da escolha de tradução com o design solicitado) */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (isSpeaking || isAudioLoading) {
                  stopNarration();
                } else {
                  const currentText =
                    currentPageIndex > 0 && currentPageIndex <= totalStoryPages
                      ? getActiveText(displayParagraphs[currentPageIndex - 1].text)
                      : getActiveText(story.title);
                  speakText(currentText);
                }
              }}
              className={`h-9 pl-3 pr-1 rounded-full bg-black hover:bg-neutral-900 text-white border border-white/30 shadow-lg flex items-center gap-2 font-black text-xs tracking-wider uppercase transition-all cursor-pointer active:scale-95 shrink-0 select-none ${
                isSpeaking ? 'ring-2 ring-amber-400' : ''
              }`}
              title={
                isSpeaking
                  ? t('reader_pause', 'Pausar narração')
                  : isAudioLoading
                    ? 'Carregando voz...'
                    : t('reader_listen', 'Ouvir história')
              }
            >
              <span className="font-black text-white text-[0.72rem] tracking-wider leading-none">
                {isSpeaking ? 'PAUSAR' : 'OUVIR'}
              </span>
              <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 border border-black/15 shadow-2xs">
                {isSpeaking ? (
                  <svg className="w-3.5 h-3.5 text-[#DC2626] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  </svg>
                ) : isAudioLoading ? (
                  <span className="text-[10px] leading-none animate-spin">⏳</span>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[#DC2626]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Efeito Visual de Estrelinhas ao Tocar na Cena */}
        {interactivePop.active && (
          <div className="absolute inset-0 bg-white/10 pointer-events-none flex items-center justify-center animate-ping z-20">
            <span className="text-7xl drop-shadow-2xl">✨ ⭐ ✨</span>
          </div>
        )}

        {/* BOTÃO DE AJUSTES (Canto Inferior Direito da Imagem) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(true);
          }}
          className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-30 w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/40 text-white flex items-center justify-center text-base shadow-lg active:scale-95 cursor-pointer"
          title="Ajustes de Leitura"
        >
          ⚙️
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════
          PERGAMINHO DA HISTÓRIA (Abaixo da imagem no celular, esquerda no desktop)
          ═════════════════════════════════════════════════════════════ */}
      <div
        className={`order-2 md:order-1 w-full md:w-[40%] lg:w-[38%] shrink-0 min-w-0 flex flex-col justify-between px-5 sm:px-8 md:px-10 py-5 sm:py-7 z-10 shadow-2xl relative min-h-[46vh] md:min-h-screen overflow-y-auto transition-colors duration-300 ${
          isNightMode
            ? 'bg-[#1D160F] text-[#F5E6C8] border-t-2 md:border-t-0 md:border-r-2 border-[#3E2E1E]'
            : 'parchment-sheet parchment-border-right text-[#2D2114]'
        }`}
      >
        {/* ═══ CONTEÚDO DO PERGAMINHO ═══ */}
        <div className="flex-1 flex flex-col justify-center my-auto py-2 w-full">
          {/* CASO 1: CAPA DA HISTÓRIA (Página 0) */}
          {currentPageIndex === 0 && (
            <div className="text-left space-y-4">
              <span
                className={`inline-block px-3.5 py-1 rounded-full border text-xs font-extrabold uppercase tracking-wider shadow-2xs ${
                  isNightMode
                    ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {story.category ? story.category.replace('-', ' ') : 'História Infantil'}
              </span>

              <h1
                className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight ${
                  isNightMode ? 'text-[#FEF3C7]' : 'text-[#2D2114]'
                }`}
              >
                {getActiveText(story.title)}
              </h1>

              <div
                className={`flex items-center gap-3 text-xs sm:text-sm font-bold pt-1 ${
                  isNightMode ? 'text-amber-300/80' : 'text-[#6D4C2B]'
                }`}
              >
                <span>⏱️ {story.durationMinutes || 5} min</span>
                <span>•</span>
                <span>⭐ {story.value || 'Valores Morais'}</span>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="w-full min-h-[54px] py-3.5 px-6 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-base shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 border-2 border-white/50 cursor-pointer"
                >
                  <span>{t('reader_start_reading', 'Iniciar História 📖')}</span>
                </button>
              </div>
            </div>
          )}

          {/* CASO 2: CENAS DA HISTÓRIA (Páginas 1 até N) */}
          {currentPageIndex > 0 &&
            currentPageIndex <= totalStoryPages &&
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
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-xs font-bold text-amber-900 animate-pulse">
                      <span>🌍</span>
                      <span>Traduzindo...</span>
                    </div>
                  )}

                  {/* Texto no pergaminho com formatação calorosa e nítida */}
                  <div
                    className={`text-lg sm:text-xl md:text-2xl leading-relaxed font-bold select-none ${
                      isNightMode ? 'text-[#F5E6C8]' : 'text-[#2D2114]'
                    }`}
                  >
                    {isFirstStoryPage && !isSpeaking ? (
                      <>
                        <span className="float-left text-4xl sm:text-5xl font-black text-[#0D9488] pr-3 pb-1 leading-none">
                          {firstLetter}
                        </span>
                        {restOfText}
                      </>
                    ) : isSpeaking ? (
                      activeContent.split(/\s+/).map((word: string, wIdx: number) => {
                        const isCurrentWord = activeWordIndex === wIdx;
                        return (
                          <React.Fragment key={wIdx}>
                            <span
                              className={`transition-all duration-150 inline-block rounded-md px-1 -mx-0.5 ${
                                isCurrentWord
                                  ? 'bg-amber-300 text-slate-950 font-black shadow-xs scale-105'
                                  : isNightMode
                                    ? 'text-[#F5E6C8]'
                                    : 'text-[#2D2114]'
                              }`}
                            >
                              {word}
                            </span>{' '}
                          </React.Fragment>
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
            })()}
        </div>

        {/* Rodapé do Pergaminho: Botões Anterior / Próxima Página + Progresso */}
        <div
          className={`pt-4 mt-3 border-t space-y-3 ${
            isNightMode ? 'border-amber-900/30' : 'border-amber-900/15'
          }`}
        >
          {currentPageIndex > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrevPage}
                className={`flex-1 min-h-[48px] py-3 px-4 rounded-full font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 ${
                  isNightMode
                    ? 'bg-[#2A2016] border-[#4A3826] text-amber-200 hover:bg-[#35281C]'
                    : 'bg-white border-[#D8C29D] text-[#2D2114] hover:bg-amber-50 shadow-xs'
                }`}
              >
                <span>← Anterior</span>
              </button>

              <button
                type="button"
                onClick={handleNextPage}
                className="flex-[1.35] min-h-[48px] py-3 px-5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>
                  {currentPageIndex === totalStoryPages
                    ? 'Concluir & Quiz ✨'
                    : 'Próxima Página →'}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
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
                    className={`transition-all rounded-full cursor-pointer ${
                      isCurrent
                        ? 'w-6 h-2.5 bg-amber-400 ring-2 ring-amber-500 shadow-sm'
                        : isPast
                          ? 'w-2.5 h-2.5 bg-[#0D9488]'
                          : isNightMode
                            ? 'w-2 h-2 bg-amber-900/60'
                            : 'w-2 h-2 bg-[#C9B68F]'
                    }`}
                    title={`Página ${idx + 1}`}
                  />
                );
              })}
            </div>

            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider shrink-0 ml-2 ${
                isNightMode ? 'text-amber-400/80' : 'text-[#6D4C2B]'
              }`}
            >
              {currentPageIndex === 0
                ? 'Capa'
                : currentPageIndex === totalPagesCount - 1
                  ? 'Fim'
                  : `Página ${currentPageIndex} de ${totalStoryPages}`}
            </span>
          </div>
        </div>
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
            <div className="parchment-sheet p-5 sm:p-6 space-y-4 text-[#2D2114] overflow-y-auto">
              {/* Opção Efeitos Sonoros */}
              <div className="flex items-center justify-between gap-3 p-4 bg-amber-50/70 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-2xl shrink-0">🔔</span>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base block leading-tight">{t('reader_sound_effects', 'Efeitos Sonoros')}</span>
                    <span className="text-xs text-[#6B5A45] font-semibold block mt-0.5">{t('reader_sound_effects_desc', 'Sons de virar página e toques')}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSoundEffectsEnabled(prev => !prev)}
                  className={`btn-round-action px-5 py-2.5 min-w-[96px] h-11 rounded-full flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all cursor-pointer shrink-0 ${
                    soundEffectsEnabled ? 'bg-[#0284C7]' : 'bg-gray-400 opacity-60'
                  }`}
                >
                  <span>{soundEffectsEnabled ? t('settings_sound_on', 'Ligado') : t('settings_sound_off', 'Mudo')}</span>
                </button>
              </div>

              {/* Opção Narração */}
              <div className="flex items-center justify-between gap-3 p-4 bg-amber-50/70 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-2xl shrink-0">🗣️</span>
                  <div>
                    <span className="font-extrabold text-sm sm:text-base block leading-tight">{t('reader_audio_narration', 'Narração em Áudio')}</span>
                    <span className="text-xs text-[#6B5A45] font-semibold block mt-0.5">{t('reader_audio_narration_desc', 'Voz suave, fluida e pausada')}</span>
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
                  className={`btn-round-action px-5 py-2.5 min-w-[96px] h-11 rounded-full flex items-center justify-center gap-1.5 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all cursor-pointer shrink-0 ${
                    isSpeaking ? 'bg-amber-600 animate-pulse' : 'bg-[#0284C7]'
                  }`}
                >
                  <span>{isSpeaking ? t('reader_pause', 'Pausar') : t('reader_listen', 'Ouvir')}</span>
                </button>
              </div>

              {/* Idioma da História */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-900/10 shadow-xs">
                <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#4A3B2C] mb-1">
                  🌍 {t('reader_language', 'Idioma da História')}
                </div>
                <div className="text-xs text-[#6B5A45] font-semibold mb-3">
                  {t('reader_language_desc', 'Alterne o idioma de leitura e narração')}
                </div>
                <LanguageSelector variant="list" />
              </div>

              {/* Botões de Ação com Espaçamento Amplo (Início e Biblioteca maiores) */}
              <div className="pt-2 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/app"
                    className="min-h-[56px] py-4 px-5 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm hover:bg-amber-50 active:scale-98 transition-all text-center"
                  >
                    <span className="text-lg">🗺️</span>
                    <span>{t('nav_home', 'Início')}</span>
                  </Link>

                  <Link
                    href="/app/historias"
                    className="min-h-[56px] py-4 px-5 rounded-2xl bg-white border-2 border-[#D8C29D] text-[#2D2114] font-extrabold text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-sm hover:bg-amber-50 active:scale-98 transition-all text-center"
                  >
                    <span className="text-lg">📚</span>
                    <span>{t('nav_library', 'Biblioteca')}</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full min-h-[56px] py-4 px-6 rounded-2xl bg-[#0D9488] text-white font-extrabold text-sm sm:text-base uppercase tracking-wider shadow-md hover:bg-[#0F766E] transition-all active:scale-98 flex items-center justify-center cursor-pointer"
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
