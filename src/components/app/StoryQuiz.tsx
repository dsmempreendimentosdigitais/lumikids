'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Trophy, CheckCircle2, XCircle, ArrowRight, RotateCcw, Brain } from 'lucide-react';

export type AgeGroup = '3-5' | '6-8' | '9-12';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  encouragement?: string;
}

interface StoryQuizProps {
  storyTitle: string;
  storyValue?: string;
  storyCategory?: string;
  storySummary?: string;
  initialAgeGroup?: AgeGroup;
  onReread?: () => void;
  onComplete?: (result: { correctCount: number; total: number; earnedPoints: number }) => void;
}

// Fallback pedagógico imediato e multilíngue caso a rede esteja lenta
function getFallbackQuestions(
  title: string, 
  value: string = 'Amizade e Virtude', 
  age: AgeGroup = '6-8', 
  lang: string = 'pt'
): QuizQuestion[] {
  if (lang === 'en') {
    if (age === '3-5') {
      return [
        {
          id: 1,
          question: `Who is the main friend in "${title}"?`,
          options: ['A kind and brave character', 'A sleepy cloud in the sky', 'A little raindrop'],
          correctIndex: 0,
          encouragement: 'Great job noticing our little friend!'
        },
        {
          id: 2,
          question: `What feeling filled their heart when helping others?`,
          options: ['Joy and warmth', 'Anger and grumpiness', 'Boredom'],
          correctIndex: 0,
          encouragement: 'Yes! Helping others brings true joy!'
        },
        {
          id: 3,
          question: `What was the most beautiful thing that happened at the end?`,
          options: ['Everyone shared peace and smiles', 'They ran away into the dark', 'Nothing at all'],
          correctIndex: 0,
          encouragement: 'Wonderful! You listened so well!'
        }
      ];
    }
    return [
      {
        id: 1,
        question: `What is the main virtue highlighted in "${title}"?`,
        options: [`Practicing ${value} and doing good`, 'Giving up at the first obstacle', 'Keeping everything to ourselves'],
        correctIndex: 0,
        encouragement: 'Spot on! Virtue is our greatest treasure.'
      },
      {
        id: 2,
        question: `How did the characters overcome the biggest challenge?`,
        options: ['Through patience, courage, and teamwork', 'By running away without trying', 'By waiting for someone else to fix it'],
        correctIndex: 0,
        encouragement: 'Exactly! Courage and patience always win.'
      },
      {
        id: 3,
        question: `How can you apply the lesson of this story in your day?`,
        options: ['By being respectful and helping family and friends', 'By never sharing my toys', 'By speaking loudly when someone is resting'],
        correctIndex: 0,
        encouragement: 'You are so wise! Keep shining!'
      }
    ];
  }

  if (lang === 'es') {
    return [
      {
        id: 1,
        question: `¿Cuál es el valor más importante que nos enseña "${title}"?`,
        options: [`Practicar la ${value} y hacer el bien`, 'Enojarse y rendirse de inmediato', 'Guardar todo solo para uno mismo'],
        correctIndex: 0,
        encouragement: '¡Muy bien! Las virtudes iluminan nuestro camino.'
      },
      {
        id: 2,
        question: `¿Cómo resolvieron el momento más difícil del relato?`,
        options: ['Con paciencia, valentía y trabajo en equipo', 'Saliendo corriendo con miedo', 'Esperando que otros hicieran todo'],
        correctIndex: 0,
        encouragement: '¡Exacto! El valor y la constancia triunfan.'
      },
      {
        id: 3,
        question: `¿Qué podemos hacer en casa para vivir esta lección?`,
        options: ['Ayudar a la familia con amor y respeto', 'No compartir nada', 'Hacer berrinches'],
        correctIndex: 0,
        encouragement: '¡Excelente reflexión! Eres un gran lector.'
      }
    ];
  }

  if (lang === 'fr') {
    return [
      {
        id: 1,
        question: `Quelle est la plus belle valeur transmise par "${title}" ?`,
        options: [`Pratiquer la ${value} et faire le bien`, 'Se décourager tout de suite', 'Garder tout égoïstement pour soi'],
        correctIndex: 0,
        encouragement: 'Bravo ! Faire le bien réchauffe les cœurs.'
      },
      {
        id: 2,
        question: `Comment les personnages ont-ils surmonté l'épreuve ?`,
        options: ['Avec courage, écoute et patience', 'En s\'enfuyant sans réfléchir', 'En refusant toute aide'],
        correctIndex: 0,
        encouragement: 'Exactement ! Le courage et la bonté triomphent.'
      },
      {
        id: 3,
        question: `Comment appliquer cette belle leçon dans ton quotidien ?`,
        options: ['En partageant et en aidant mes proches avec tendresse', 'En ne prêtant jamais mes jouets', 'En boudant dans mon coin'],
        correctIndex: 0,
        encouragement: 'Quelle belle sagesse ! Tu as tout compris.'
      }
    ];
  }

  if (lang === 'it') {
    return [
      {
        id: 1,
        question: `Qual è il valore più bello che ci insegna "${title}"?`,
        options: [`Praticare la ${value} e fare del bene`, 'Arrabbiarsi e arrendersi subito', 'Tenere tutto solo per sé'],
        correctIndex: 0,
        encouragement: 'Bravissimo! Fare del bene riempie il cuore.'
      },
      {
        id: 2,
        question: `In che modo hanno affrontato la prova più difficile?`,
        options: ['Con coraggio, pazienza e unione', 'Scappando via senza provare', 'Ignorando i consigli degli amici'],
        correctIndex: 0,
        encouragement: 'Esatto! Il coraggio e la pazienza vincono sempre.'
      },
      {
        id: 3,
        question: `Come puoi vivere questa bella lezione ogni giorno?`,
        options: ['Aiutando la famiglia e gli amici con affetto', 'Non condividendo mai nulla', 'Facendo i capricci prima di dormire'],
        correctIndex: 0,
        encouragement: 'Splendida risposta! Sei un vero saggio.'
      }
    ];
  }

  // Português (padrão)
  if (age === '3-5') {
    return [
      {
        id: 1,
        question: `Quem foi o grande amigo da história "${title}"?`,
        options: ['Um personagem bondoso e valente', 'Uma nuvem rabugenta', 'Um relógio sem ponteiros'],
        correctIndex: 0,
        encouragement: 'Muito bem! Você prestou muita atenção!'
      },
      {
        id: 2,
        question: `O que ele sentiu no coração ao ajudar os outros?`,
        options: ['Alegria e paz quentinha', 'Tristeza e preguiça', 'Vontade de chorar'],
        correctIndex: 0,
        encouragement: 'Isso mesmo! Ajudar traz alegria de verdade!'
      },
      {
        id: 3,
        question: `Como terminou essa linda aventura?`,
        options: ['Todos felizes e em união', 'Cada um foi para um lado triste', 'Não aconteceu nada'],
        correctIndex: 0,
        encouragement: 'Parabéns, pequeno explorador! Você é brilhante!'
      }
    ];
  }

  if (age === '9-12') {
    return [
      {
        id: 1,
        question: `Qual foi a virtude determinante para o desfecho de "${title}"?`,
        options: [`A dedicação em viver a ${value} com honra`, 'A busca por vantagens fáceis', 'O orgulho diante dos desafios'],
        correctIndex: 0,
        encouragement: 'Perfeito! O caráter molda as grandes decisões.'
      },
      {
        id: 2,
        question: `Diante da incerteza, qual foi a atitude mais nobre do protagonista?`,
        options: ['Manter a serenidade e persistir com sabedoria', 'Agir por impulso e raiva', 'Abandonar seus princípios'],
        correctIndex: 0,
        encouragement: 'Exatamente! A calma e a sabedoria guiam a vitória.'
      },
      {
        id: 3,
        question: `Qual reflexão profunda podemos levar para as nossas amizades?`,
        options: ['A lealdade e a empatia superam qualquer discordância', 'Pensar apenas nos próprios interesses', 'Evitar dialogar quando há dificuldades'],
        correctIndex: 0,
        encouragement: 'Excelente maturidade reflexiva!'
      }
    ];
  }

  // Faixa 6-8 anos (intermediária)
  return [
    {
      id: 1,
      question: `Qual é o valor e a lição mais importante de "${title}"?`,
      options: [`Praticar a ${value} e cultivar o bem`, 'Desistir no primeiro obstáculo', 'Guardar tudo com egoísmo'],
      correctIndex: 0,
      encouragement: 'Parabéns! Fazer o bem transforma o mundo!'
    },
    {
      id: 2,
      question: `Como os personagens superaram o momento mais difícil?`,
      options: ['Com coragem, paciência e colaboração', 'Fugindo e deixando tudo para trás', 'Esperando que outros resolvessem sozinhos'],
      correctIndex: 0,
      encouragement: 'Exatamente! A coragem e a união vencem qualquer medo!'
    },
    {
      id: 3,
      question: `Como você pode colocar essa atitude em prática hoje?`,
      options: ['Sendo generoso e respeitando a família e os amigos', 'Não dividindo meus brinquedos', 'Fazendo birra quando for contrariado'],
      correctIndex: 0,
      encouragement: 'Incrível! Você já é um verdadeiro sábio!'
    }
  ];
}

export default function StoryQuiz({
  storyTitle,
  storyValue,
  storyCategory,
  storySummary,
  initialAgeGroup = '6-8',
  onReread,
  onComplete
}: StoryQuizProps) {
  const { language, t } = useLanguage();
  const [selectedAge, setSelectedAge] = useState<AgeGroup>(initialAgeGroup);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sons lúdicos via Web Audio
  const playSound = (isCorrect: boolean) => {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isCorrect ? 'triangle' : 'sawtooth';
      osc.frequency.setValueAtTime(isCorrect ? 523.25 : 220, ctx.currentTime);
      if (isCorrect) {
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.25);
      }
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  // Carrega ou busca perguntas adaptadas à faixa etária e idioma
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectAnswersCount(0);
    setIsFinished(false);

    // Imediato: carrega fallback para zero tempo de espera
    const fallback = getFallbackQuestions(storyTitle, storyValue, selectedAge, language);
    setQuestions(fallback);

    // Busca perguntas personalizadas via Gemini em segundo plano
    fetch('/api/ai/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storyTitle,
        storyCategory,
        storyValue,
        storySummary,
        ageGroup: selectedAge,
        language
      })
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.quiz && Array.isArray(data.quiz) && data.quiz.length === 3) {
          setQuestions(data.quiz);
        }
      })
      .catch(err => console.warn('Using pedagogical fallback quiz:', err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [storyTitle, storyValue, storyCategory, storySummary, selectedAge, language]);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (hasAnswered || !currentQ) return;
    setSelectedOption(idx);
    setHasAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    playSound(isCorrect);

    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      setIsFinished(true);
      const total = questions.length;
      const earned = (correctAnswersCount * 5) + 10; // +10 leitura +5 cada acerto
      if (onComplete) {
        onComplete({ correctCount: correctAnswersCount, total, earnedPoints: earned });
      }
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setCorrectAnswersCount(0);
    setIsFinished(false);
  };

  const ageLabels: Record<AgeGroup, string> = {
    '3-5': t('age_2_4', '🍼 2–4 anos'),
    '6-8': t('age_5_7', '📚 5–7 anos'),
    '9-12': t('age_8_10', '🎓 8–10 anos'),
  };

  return (
    <div className="w-full bg-[#FFFDF7]/95 backdrop-blur-md rounded-[32px] border-2 border-[#D8C29D] shadow-2xl p-6 sm:p-8 text-left my-auto relative select-none font-sans text-slate-800">
      
      {/* ═══ CABEÇALHO DO QUIZ: TROFÉU & SELETOR DE IDADE AMPLIADO ═══ */}
      <div className="text-center pb-5 mb-5 border-b border-amber-900/10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 border-2 border-amber-300 shadow-sm text-3xl mb-3 animate-bounce-subtle">
          🏆
        </div>
        
        <h3 className="text-2xl sm:text-3xl font-serif font-black text-[#2D2114] leading-tight">
          Fim da Aventura!
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-[#6D4C2B] mt-1 max-w-md mx-auto">
          Você completou esta história com honra e sabedoria. Responda ao quiz para consolidar os valores!
        </p>

        {/* BOTÕES DE IDADE AMPLIADOS E ESPAÇADOS */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 flex-wrap">
          {(['3-5', '6-8', '9-12'] as AgeGroup[]).map((grp) => {
            const isSelected = selectedAge === grp;
            return (
              <button
                key={grp}
                type="button"
                onClick={() => setSelectedAge(grp)}
                className={`py-2 px-4 sm:py-2.5 sm:px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0D9488] text-white shadow-md scale-105 ring-2 ring-teal-300'
                    : 'bg-white border-2 border-[#D8C29D] text-[#6D4C2B] hover:bg-amber-50'
                }`}
              >
                <span>{ageLabels[grp]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ ESTADO FINAL: CELEBRAÇÃO & PONTUAÇÃO ═══ */}
      {isFinished ? (
        <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-300 text-amber-600 shadow-inner">
            <Trophy size={42} className="animate-bounce" />
          </div>

          <div>
            <h4 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
              {correctAnswersCount === 3 ? 'Incrível! 100% de Acertos!' : 'Parabéns pela Conquista!'}
            </h4>
            <p className="text-sm sm:text-base text-slate-600 font-semibold mt-1.5">
              Você acertou {correctAnswersCount} de {questions.length} perguntas e ganhou <strong className="text-amber-600">+{(correctAnswersCount * 5) + 10} Pontos</strong>!
            </p>
          </div>

          {/* Troféus e Medalhas */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto pt-1">
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 flex flex-col items-center">
              <span className="text-3xl mb-1">⭐</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sabedoria</span>
              <span className="text-lg font-black text-amber-700">+{correctAnswersCount * 5} pts</span>
            </div>
            <div className="bg-teal-50 rounded-2xl p-4 border-2 border-teal-200 flex flex-col items-center">
              <span className="text-3xl mb-1">📖</span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Leitor do Dia</span>
              <span className="text-lg font-black text-[#0D9488]">+10 pts</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleRestart}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white border-2 border-amber-300 text-amber-900 text-xs sm:text-sm font-black shadow-xs hover:bg-amber-50 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw size={16} /> Tentar Novamente
            </button>

            {onReread && (
              <button
                type="button"
                onClick={onReread}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔄 Reler História</span>
              </button>
            )}

            <Link
              href="/app"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all text-center"
            >
              🗺️ Voltar ao Mapa
            </Link>
          </div>
        </div>
      ) : (
        /* ═══ ESTADO ATIVO: PERGUNTA ATUAL ═══ */
        currentQ && (
          <div className="space-y-5">
            
            {/* Barra de Progresso e Identificador da Pergunta */}
            <div className="flex items-center justify-between text-xs sm:text-sm font-black text-[#6D4C2B]">
              <span className="bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200/80">
                {t('quiz_question', 'Pergunta')} {currentIndex + 1} de {questions.length}
              </span>
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2.5 rounded-full transition-all ${
                      i === currentIndex
                        ? 'w-8 bg-[#0D9488]'
                        : i < currentIndex
                          ? 'w-3 bg-amber-400'
                          : 'w-3 bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Texto da Pergunta em Tamanho Grande e Espaçado */}
            <h4 className="font-serif font-black text-[#2D2114] text-lg sm:text-2xl leading-snug sm:leading-relaxed">
              {currentQ.question}
            </h4>

            {/* 3 Opções de Resposta em Cartões Amplos */}
            <div className="space-y-3 sm:space-y-3.5 pt-1">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = selectedOption === oIdx;
                const isCorrect = oIdx === currentQ.correctIndex;
                
                let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-amber-400 hover:bg-amber-50/50';
                if (hasAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black ring-2 ring-emerald-300';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 font-semibold';
                  } else {
                    btnStyle = 'bg-white/50 border-slate-200 text-slate-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    type="button"
                    disabled={hasAnswered}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 transition-all text-left flex items-center justify-between gap-3 text-sm sm:text-base font-bold shadow-xs cursor-pointer ${btnStyle}`}
                  >
                    <span className="flex-1 leading-snug sm:leading-normal">{opt}</span>
                    {hasAnswered && isCorrect && (
                      <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle size={22} className="text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Botão Próxima Pergunta */}
            {hasAnswered && (
              <div className="pt-2 animate-in fade-in duration-150 flex flex-col sm:flex-row items-center justify-between gap-3 bg-amber-50/90 p-4 sm:p-5 rounded-2xl border-2 border-amber-200">
                <div className="text-xs sm:text-sm font-bold text-amber-950 text-center sm:text-left">
                  {selectedOption === currentQ.correctIndex ? (
                    <span className="flex items-center gap-2 text-emerald-700 font-black">
                      <Sparkles size={16} /> {currentQ.encouragement || t('quiz_correct', 'Muito bem! Resposta correta! ⭐')}
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold">
                      {t('quiz_try_again', 'Quase lá! A virtude sempre nos guia.')}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#0D9488] text-white text-xs sm:text-sm font-black shadow-md hover:bg-[#0F766E] flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-all"
                >
                  <span>{currentIndex < questions.length - 1 ? t('quiz_next', 'Próxima Pergunta') : 'Ver Pontuação'}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {/* Botões de Ação Inferiores */}
            <div className="pt-4 border-t border-amber-900/10 flex flex-col sm:flex-row items-center gap-2.5">
              {onReread && (
                <button
                  type="button"
                  onClick={onReread}
                  className="w-full py-3 rounded-full bg-white border border-[#D8C29D] text-[#6D4C2B] font-bold text-xs sm:text-sm hover:bg-amber-50 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>🔄 Reler História</span>
                </button>
              )}

              <Link
                href="/app"
                className="w-full py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-xs transition-colors block text-center"
              >
                🗺️ Voltar ao Mapa de Aventuras
              </Link>
            </div>

          </div>
        )
      )}

    </div>
  );
}
