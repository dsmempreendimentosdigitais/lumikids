'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GenerateStoryRequest } from '@/types/ai';
import { Sparkles, Wand2, Castle, Moon, Mic, MicOff, User, Dices, Compass } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BRAZILIAN_NAMES = [
  'Filipe', 'Manuela', 'Gabriel', 'Sofia', 'Lucas', 'Beatriz',
  'Davi', 'Alice', 'Matheus', 'Valentina', 'Samuel', 'Isabella',
  'Enzo', 'Helena', 'Heitor', 'Laura', 'Bernardo', 'Giovanna'
];

export default function CriarPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('Iniciando história...');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');

  const [formData, setFormData] = useState<GenerateStoryRequest>({
    childName: '',
    ageGroup: '5-7',
    theme: 'Floresta Mágica',
    emotion: 'Feliz',
    value: 'Amizade e Coragem',
    character: '',
    language: 'pt-BR',
    includeBiblicalValues: true,
    gender: 'menino',
    hairColor: 'Preto',
    hairStyle: 'Curto',
    skinTone: 'Clara',
    topClothing: 'Camiseta verde',
    bottomClothing: 'Short kaqui',
    accessories: 'Nenhum',
    characterAppearanceSummary: ''
  });

  const pickRandomName = () => {
    const randomName = BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];
    setFormData(prev => ({ ...prev, childName: randomName }));
  };

  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Navegador não suporta transcrição de áudio direta. Por favor, selecione as opções abaixo!');
      setTimeout(() => setVoiceNotice(''), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('🎙️ Ouvindo... Fale a aparência da criança (ex: menino de 4 anos com cabelo preto e camiseta verde)!');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setIsListening(false);
        setVoiceNotice(`✨ Entendido: "${transcript}"`);

        let hairC = formData.hairColor;
        let hairS = formData.hairStyle;
        let skin = formData.skinTone;
        let topC = formData.topClothing;
        let botC = formData.bottomClothing;
        let gen = formData.gender;

        if (transcript.includes('menina') || transcript.includes('garota')) gen = 'menina';
        if (transcript.includes('menino') || transcript.includes('garoto')) gen = 'menino';

        if (transcript.includes('preto') || transcript.includes('escuro')) hairC = 'Preto';
        if (transcript.includes('castanho') || transcript.includes('marrom')) hairC = 'Castanho';
        if (transcript.includes('loiro') || transcript.includes('amarelo')) hairC = 'Loiro';
        if (transcript.includes('ruivo') || transcript.includes('vermelho')) hairC = 'Ruivo';

        if (transcript.includes('cacheado') || transcript.includes('crespo')) hairS = 'Cacheado';
        if (transcript.includes('curto')) hairS = 'Curto';
        if (transcript.includes('longo') || transcript.includes('comprido')) hairS = 'Longo';

        if (transcript.includes('pele clara') || transcript.includes('branca')) skin = 'Clara';
        if (transcript.includes('pele morena') || transcript.includes('parda')) skin = 'Parda';
        if (transcript.includes('pele negra') || transcript.includes('escura')) skin = 'Negra';

        if (transcript.includes('verde')) topC = 'Camiseta verde';
        if (transcript.includes('azul')) topC = 'Blusa azul';
        if (transcript.includes('vermelh')) topC = 'Moletom vermelho';
        if (transcript.includes('rosa')) topC = 'Vestido rosa';
        if (transcript.includes('kaqui') || transcript.includes('caqui')) botC = 'Short kaqui';

        setFormData(prev => ({
          ...prev,
          gender: gen,
          hairColor: hairC,
          hairStyle: hairS,
          skinTone: skin,
          topClothing: topC,
          bottomClothing: botC,
          characterAppearanceSummary: transcript
        }));

        setTimeout(() => setVoiceNotice(''), 5000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('Não conseguimos ouvir. Selecione pelos menus abaixo!');
        setTimeout(() => setVoiceNotice(''), 3000);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setVoiceNotice('Erro ao ativar microfone. Escolha as opções no formulário!');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Você precisa estar logado para criar histórias.');
      return;
    }
    setError('');
    setLoading(true);
    setProgress(5);
    setProgressStage('✨ Criando o roteiro com Inteligência Artificial...');
    setSuccess(null);

    const appearanceSummary = `${formData.gender === 'menino' ? 'Menino' : 'Menina'}, cabelo ${formData.hairStyle?.toLowerCase()} ${formData.hairColor?.toLowerCase()}, pele ${formData.skinTone?.toLowerCase()}, ${formData.topClothing?.toLowerCase()}, ${formData.bottomClothing?.toLowerCase()}${formData.accessories && formData.accessories !== 'Nenhum' ? `, com ${formData.accessories.toLowerCase()}` : ''}`;

    const finalFormData = {
      ...formData,
      characterAppearanceSummary: appearanceSummary
    };

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 30) {
          setProgressStage('✨ Escrevendo páginas e diálogos envolventes...');
          return prev + 4;
        } else if (prev < 75) {
          setProgressStage(`🎨 Ilustrando ${formData.childName} em aquarela 2D consistente...`);
          return prev + 3;
        } else if (prev < 94) {
          setProgressStage('🎙️ Preparando narração acolhedora...');
          return prev + 1;
        }
        return prev;
      });
    }, 400);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/ai/gerar-historia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalFormData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar história.');

      clearInterval(progressTimer);
      setProgress(100);
      setProgressStage('🚀 Tudo pronto! Abrindo sua história mágica...');

      if (data.storyId) {
        setTimeout(() => {
          router.push(`/app/historias/${data.storyId}`);
        }, 500);
      } else {
        setSuccess(data);
      }
    } catch (err: any) {
      clearInterval(progressTimer);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF9] via-[#FEF7E6] to-[#ECFDF5] text-[#1A1D20] font-sans overflow-x-hidden pb-40 relative">
      {/* Plano de Fundo Cenográfico Estilo Caminho da Leitura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-6 left-6 text-4xl opacity-65">☁️</div>
        <div className="absolute top-12 right-8 text-5xl opacity-70">☁️</div>
        <div className="absolute top-72 left-4 text-3xl opacity-55">🌲🌿</div>
        <div className="absolute top-[520px] right-4 text-3xl opacity-55">🌻✨</div>
        <div className="absolute bottom-48 left-6 text-3xl opacity-55">🌳🏮</div>
      </div>

      <div className="px-4 sm:px-6 pt-6 pb-32 relative z-10 max-w-xl mx-auto">
        {/* Cabeçalho Estilo Reino / Caminho da Leitura */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold uppercase tracking-wider shadow-2xs mb-3">
            <Sparkles size={14} className="text-[#D97706]" />
            <span>Trilha da Imaginação</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
            Criar História <span className="text-[#0D9488]">Mágica</span> ✨
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-sm mx-auto mt-1.5 leading-relaxed">
            Siga os 5 passos da trilha para criar um livro ilustrado personalizado com o nome e o rostinho da criança!
          </p>
        </div>

        {/* Modal de Carregamento com Barra de Progresso */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-white border-2 border-[#E6DEC8] rounded-[36px] p-8 shadow-2xl relative overflow-hidden text-slate-900">
              <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#0D9488] text-3xl mb-6 mx-auto animate-bounce">
                ✨
              </div>

              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Criando História Mágica
              </h2>

              <p className="text-slate-600 text-sm font-semibold mb-6 min-h-[36px]">
                {progressStage}
              </p>

              <div className="w-full bg-slate-100 h-4 rounded-full p-0.5 border border-slate-200 overflow-hidden mb-3">
                <div
                  className="bg-[#0D9488] h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs font-extrabold text-slate-500 mb-5 px-1">
                <span>Gerando ilustrações 2D & áudio</span>
                <span>{progress}%</span>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-bold leading-relaxed">
                💡 O personagem {formData.childName || 'principal'} manterá exatamente o mesmo visual em todas as páginas!
              </div>
            </div>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {/* ═══ PASSO 1: QUEM VIVERÁ A AVENTURA ═══ */}
            <div className="w-full bg-white/95 backdrop-blur-md border-2 border-[#E6DEC8] rounded-[32px] p-6 sm:p-7 shadow-[0_12px_30px_rgba(45,33,20,0.06)]">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-teal-50 border-2 border-teal-200 text-[#0D9488] flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                    1
                  </div>
                  <div>
                    <label className="block text-slate-900 font-extrabold text-base sm:text-lg leading-tight">
                      Quem viverá a aventura?
                    </label>
                    <span className="text-xs text-slate-500 font-semibold">
                      O herói ou heroína principal da história
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={pickRandomName}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-50 border border-amber-300 rounded-full text-xs font-extrabold text-amber-900 hover:bg-amber-100 transition-all shrink-0 cursor-pointer"
                  title="Sortear nome brasileiro aleatório"
                >
                  <Dices size={15} />
                  <span>🎲 Aleatório</span>
                </button>
              </div>

              <input
                type="text"
                required
                className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-13 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white font-bold text-sm sm:text-base transition-colors"
                placeholder="Digite o nome da criança (ex: Manuela, Filipe)"
                value={formData.childName}
                onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
              />
            </div>

            {/* Pedrinhas Douradas do Caminho */}
            <div className="my-3 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-4 h-3 rounded-full bg-[#DFC38D] border border-[#B89758]" />
              <div className="w-3.5 h-2.5 rounded-full bg-[#DFC38D] border border-[#B89758]" />
            </div>

            {/* ═══ PASSO 2: APARÊNCIA DO PERSONAGEM ═══ */}
            <div className="w-full bg-white/95 backdrop-blur-md border-2 border-[#E6DEC8] rounded-[32px] p-6 sm:p-7 shadow-[0_12px_30px_rgba(45,33,20,0.06)] space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 border-2 border-amber-300 text-[#D97706] flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-slate-900 font-extrabold text-base sm:text-lg leading-tight">
                      Aparência do Personagem
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold mt-0.5">
                      Garante o mesmo visual em todas as páginas!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleVoiceInput}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold transition-all border shrink-0 cursor-pointer ${
                    isListening
                      ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                      : 'bg-teal-50 border-teal-200 text-[#0D9488] hover:bg-teal-100'
                  }`}
                  title="Clique e fale a aparência da criança"
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                  <span>{isListening ? 'Ouvindo...' : '🎙️ Voz'}</span>
                </button>
              </div>

              {voiceNotice && (
                <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs sm:text-sm text-[#0D9488] font-bold text-center">
                  {voiceNotice}
                </div>
              )}

              {/* Toggle Gênero Espaçado */}
              <div>
                <label className="block text-slate-700 text-xs sm:text-sm font-extrabold mb-2">
                  Gênero do Personagem
                </label>
                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'menino' })}
                    className={`min-h-[50px] py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2.5 border-2 transition-all cursor-pointer ${
                      formData.gender === 'menino'
                        ? 'bg-[#0D9488] border-[#0D9488] text-white shadow-md shadow-teal-900/15'
                        : 'bg-[#FAF8F2] border-[#E2D9C5] text-slate-700 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-lg">👦</span>
                    <span>Menino</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: 'menina' })}
                    className={`min-h-[50px] py-3 px-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2.5 border-2 transition-all cursor-pointer ${
                      formData.gender === 'menina'
                        ? 'bg-[#0D9488] border-[#0D9488] text-white shadow-md shadow-teal-900/15'
                        : 'bg-[#FAF8F2] border-[#E2D9C5] text-slate-700 hover:bg-amber-50/50'
                    }`}
                  >
                    <span className="text-lg">👧</span>
                    <span>Menina</span>
                  </button>
                </div>
              </div>

              {/* Seletores de Cabelo e Tom de Pele com Espaçamento Amplo */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Cor do Cabelo
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.hairColor}
                    onChange={(e) => setFormData({ ...formData, hairColor: e.target.value })}
                  >
                    <option value="Preto">🖤 Cabelo Preto</option>
                    <option value="Castanho">🟤 Cabelo Castanho</option>
                    <option value="Loiro">🟡 Cabelo Loiro</option>
                    <option value="Ruivo">🔴 Cabelo Ruivo</option>
                    <option value="Colorido">🔵 Cabelo Colorido</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Estilo do Cabelo
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.hairStyle}
                    onChange={(e) => setFormData({ ...formData, hairStyle: e.target.value })}
                  >
                    <option value="Curto">✨ Curto</option>
                    <option value="Longo">✨ Longo</option>
                    <option value="Cacheado">✨ Cacheado</option>
                    <option value="Crespo">✨ Crespo</option>
                    <option value="Liso">✨ Liso</option>
                    <option value="Trança">✨ Tranças</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Tom de Pele
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.skinTone}
                    onChange={(e) => setFormData({ ...formData, skinTone: e.target.value })}
                  >
                    <option value="Clara">🌟 Clara</option>
                    <option value="Parda">🌟 Parda / Morena</option>
                    <option value="Negra">🌟 Negra</option>
                    <option value="Muito Clara">🌟 Muito Clara</option>
                  </select>
                </div>
              </div>

              {/* Seletores de Roupas e Acessórios */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Camisa / Blusa
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.topClothing}
                    onChange={(e) => setFormData({ ...formData, topClothing: e.target.value })}
                  >
                    <option value="Camiseta verde">👕 Camiseta verde</option>
                    <option value="Blusa azul">👕 Blusa azul</option>
                    <option value="Vestido rosa">👗 Vestido rosa</option>
                    <option value="Moletom vermelho">🧥 Moletom vermelho</option>
                    <option value="Camisa amarela">👕 Camisa amarela</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Short / Calça
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.bottomClothing}
                    onChange={(e) => setFormData({ ...formData, bottomClothing: e.target.value })}
                  >
                    <option value="Short kaqui">🩳 Short kaqui</option>
                    <option value="Calça jeans">👖 Calça jeans</option>
                    <option value="Short azul">🩳 Short azul</option>
                    <option value="Saia vermelha">👗 Saia vermelha</option>
                    <option value="Bermuda preta">🩳 Bermuda preta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 text-xs font-extrabold mb-1.5">
                    Acessório Extra
                  </label>
                  <select
                    className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-12 px-3.5 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#0D9488] cursor-pointer"
                    value={formData.accessories}
                    onChange={(e) => setFormData({ ...formData, accessories: e.target.value })}
                  >
                    <option value="Nenhum">✨ Nenhum</option>
                    <option value="Óculos">👓 Óculos</option>
                    <option value="Boné vermelho">🧢 Boné vermelho</option>
                    <option value="Tiara de borboleta">👑 Tiara</option>
                    <option value="Capa de super-herói">🦸 Capa de herói</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pedrinhas Douradas do Caminho */}
            <div className="my-3 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-4 h-3 rounded-full bg-[#DFC38D] border border-[#B89758]" />
              <div className="w-3.5 h-2.5 rounded-full bg-[#DFC38D] border border-[#B89758]" />
            </div>

            {/* ═══ PASSO 3: FAIXA ETÁRIA ═══ */}
            <div className="w-full bg-white/95 backdrop-blur-md border-2 border-[#E6DEC8] rounded-[32px] p-6 sm:p-7 shadow-[0_12px_30px_rgba(45,33,20,0.06)]">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border-2 border-teal-200 text-[#0D9488] flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                  3
                </div>
                <div>
                  <label className="block text-slate-900 font-extrabold text-base sm:text-lg leading-tight">
                    Faixa Etária da Criança
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    Adapta o vocabulário e o tamanho dos parágrafos
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: '2-4', title: '2 a 4 anos', desc: 'Frases curtinhas e lúdicas', emoji: '🐣' },
                  { id: '5-7', title: '5 a 7 anos', desc: 'Histórias ilustradas', emoji: '🦊' },
                  { id: '8-10', title: '8 a 10 anos', desc: 'Aventuras completas', emoji: '🦁' },
                  { id: '11-14', title: '11+ anos', desc: 'Enredos profundos', emoji: '🦅' },
                ].map((age) => (
                  <button
                    key={age.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, ageGroup: age.id as any })}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      formData.ageGroup === age.id
                        ? 'bg-teal-50/80 border-[#0D9488] text-slate-900 shadow-xs'
                        : 'bg-[#FAF8F2] border-[#E2D9C5] text-slate-700 hover:bg-amber-50/40'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{age.emoji}</span>
                    <div>
                      <div className="font-extrabold text-xs sm:text-sm leading-tight">{age.title}</div>
                      <div className="text-[0.68rem] text-slate-500 font-semibold mt-0.5 leading-snug">{age.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pedrinhas Douradas do Caminho */}
            <div className="my-3 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-4 h-3 rounded-full bg-[#DFC38D] border border-[#B89758]" />
              <div className="w-3.5 h-2.5 rounded-full bg-[#DFC38D] border border-[#B89758]" />
            </div>

            {/* ═══ PASSO 4: TEMA & REINO DA AVENTURA ═══ */}
            <div className="w-full bg-white/95 backdrop-blur-md border-2 border-[#E6DEC8] rounded-[32px] p-6 sm:p-7 shadow-[0_12px_30px_rgba(45,33,20,0.06)] space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border-2 border-amber-300 text-[#D97706] flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                  4
                </div>
                <div>
                  <label className="block text-slate-900 font-extrabold text-base sm:text-lg leading-tight">
                    Reino & Tema da Aventura
                  </label>
                  <span className="text-xs text-slate-500 font-semibold">
                    Digite uma ideia ou escolha um reino abaixo
                  </span>
                </div>
              </div>

              <input
                type="text"
                required
                className="w-full bg-[#FAF8F2] border-2 border-[#E2D9C5] rounded-2xl h-13 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white text-sm sm:text-base font-bold transition-colors"
                placeholder="Ex: Floresta Mágica, Davi e Golias, Os Trabalhos de Hércules..."
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
              />

              <div>
                <span className="block text-xs text-slate-600 font-extrabold mb-2.5">
                  ✨ Ou toque em uma Trilha do Caminho da Leitura:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: '🏛️ Mitologia Grega', value: 'Mitologia Grega: Os Trabalhos de Hércules e lições de virtude' },
                    { name: '📖 Histórias da Bíblia', value: 'História Bíblica: Davi e Golias com lições de fé' },
                    { name: '👑 Mulheres Fortes', value: "Mulheres Fortes: Joana d'Arc e coragem moral" },
                    { name: '🏰 Biografias', value: 'Biografia Histórica: Santos Dumont e a invenção' },
                    { name: '🛡️ Contos & Fábulas', value: 'Fábulas Clássicas: O Leão e o Rato e compaixão' },
                    { name: '🔬 Ciência', value: 'Grandes Inventores: Albert Einstein e curiosidade' },
                    { name: '✨ Virtudes', value: 'Virtudes no dia a dia: Verdade, paciência e respeito' },
                    { name: '🌿 Natureza', value: 'Natureza do Brasil: Vida selvagem no Pantanal' },
                  ].map((t) => (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, theme: t.value })}
                      className={`px-3.5 py-2 rounded-full text-xs font-extrabold transition-all border-2 cursor-pointer ${
                        formData.theme === t.value
                          ? 'bg-[#0D9488] border-[#0D9488] text-white shadow-xs'
                          : 'bg-[#FAF8F2] border-[#E2D9C5] text-slate-700 hover:bg-amber-50'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Pedrinhas Douradas do Caminho */}
            <div className="my-3 flex flex-col items-center gap-1.5 pointer-events-none">
              <div className="w-4 h-3 rounded-full bg-[#DFC38D] border border-[#B89758]" />
              <div className="w-3.5 h-2.5 rounded-full bg-[#DFC38D] border border-[#B89758]" />
            </div>

            {/* ═══ PASSO 5: EMOÇÃO & VIRTUDE DA HISTÓRIA ═══ */}
            <div className="w-full bg-white/95 backdrop-blur-md border-2 border-[#E6DEC8] rounded-[32px] p-6 sm:p-7 shadow-[0_12px_30px_rgba(45,33,20,0.06)] mb-6">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border-2 border-teal-200 text-[#0D9488] flex items-center justify-center font-black text-base shadow-2xs shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-slate-900 font-extrabold text-base sm:text-lg leading-tight">
                    Emoção & Virtude da História
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Escolha o sentimento principal desta aventura
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Feliz', emoji: '😊' },
                  { label: 'Curioso', emoji: '🔍' },
                  { label: 'Valente', emoji: '🦁' },
                  { label: 'Engraçado', emoji: '😂' },
                  { label: 'Calmo', emoji: '🧘' },
                  { label: 'Amoroso', emoji: '❤️' },
                  { label: 'Corajoso', emoji: '🛡️' },
                  { label: 'Aventureiro', emoji: '🚀' },
                  { label: 'Criativo', emoji: '🎨' },
                  { label: 'Empático', emoji: '🤝' },
                  { label: 'Sonhador', emoji: '⭐' },
                  { label: 'Inspirador', emoji: '✨' },
                ].map((em) => (
                  <button
                    key={em.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, emotion: em.label })}
                    className={`min-h-[48px] py-2.5 px-3.5 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border-2 cursor-pointer ${
                      formData.emotion === em.label
                        ? 'bg-[#0D9488] text-white border-[#0D9488] shadow-md shadow-teal-900/15'
                        : 'bg-[#FAF8F2] text-slate-700 border-[#E2D9C5] hover:bg-amber-50/60'
                    }`}
                  >
                    <span className="text-base">{em.emoji}</span>
                    <span>{em.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="w-full bg-red-50 border-2 border-red-200 text-red-600 font-extrabold p-4 rounded-2xl text-sm text-center mb-4">
                {error}
              </div>
            )}

            {/* Botão Principal de Criação com Espaçamento Amplo */}
            <div className="w-full pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[60px] py-4 px-6 bg-gradient-to-r from-[#0D9488] to-[#0F766E] hover:from-[#0F766E] hover:to-[#115E59] transition-all text-white font-extrabold text-base sm:text-lg rounded-2xl shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
              >
                <Sparkles size={20} className="text-amber-300" />
                {loading ? (
                  <span className="animate-pulse">Escrevendo História com IA...</span>
                ) : (
                  <span>Criar História Ilustrada Agora</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white border-2 border-[#E6DEC8] rounded-[32px] p-8 shadow-lg text-center mt-8">
            <h2 className="font-black text-2xl text-slate-900 mb-6">
              {success.story.title || 'História Criada!'}
            </h2>

            <button
              onClick={() => setSuccess(null)}
              className="w-full min-h-[54px] py-4 px-6 rounded-2xl font-extrabold flex items-center justify-center gap-2 bg-[#0D9488] text-white hover:bg-[#0F766E] transition-all shadow-md text-base cursor-pointer"
            >
              <span>Criar Outra História</span>
              <Sparkles size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
