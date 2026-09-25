'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GenerateStoryRequest } from '@/types/ai';
import { Sparkles, Wand2, Castle, Moon, Mic, MicOff, User, Dices } from 'lucide-react';
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
  const [progressStage, setProgressStage] = useState('Iniciando magia...');
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

  // Função para sortear nome brasileiro tradicional
  const pickRandomName = () => {
    const randomName = BRAZILIAN_NAMES[Math.floor(Math.random() * BRAZILIAN_NAMES.length)];
    setFormData(prev => ({ ...prev, childName: randomName }));
  };

  // Suporte a Reconhecimento de Voz por Áudio Nativo do Navegador
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Navegador não suporta transcrição de áudio direta. Por favor, selecione as opções nos menus!');
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
        
        // Tenta extrair detalhes falados
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
        setVoiceNotice('Não conseguimos ouvir. Selecione pelos menus suspensos abaixo!');
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

    // Constrói resumo visual
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
          setProgressStage(`🎨 Ilustrando ${formData.childName} no modelo FLUX 2D consistente...`);
          return prev + 3;
        } else if (prev < 94) {
          setProgressStage('🎙️ Sintetizando narração em áudio de alta definição...');
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
    <div className="min-h-screen bg-[#0B0819] text-white font-sans overflow-x-hidden pb-36 relative">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.2), transparent 60%)' }}></div>
      <div className="fixed top-[10%] left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></div>
      <div className="fixed top-[30%] right-[15%] w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_rgba(216,180,254,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="p-4 md:p-6 relative z-10 max-w-lg md:max-w-xl mx-auto min-h-[calc(100vh-110px)] flex flex-col justify-between py-4 pb-28">
        
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-6 mt-2">
          <h1 className="text-[2.2rem] md:text-[2.6rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            Criar História
          </h1>
          <Sparkles className="text-yellow-200 w-7 h-7 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
        </div>

        {/* Modal de Carregamento com Barra de Progresso FLUX */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-[#0B0819]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
            <div className="max-w-md w-full bg-[#150F2D] border-2 border-purple-500/40 rounded-[32px] p-8 shadow-[0_0_50px_rgba(139,92,246,0.4)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
              
              <div className="w-16 h-16 rounded-[22px] bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl mb-6 shadow-[0_0_25px_rgba(217,70,239,0.6)] mx-auto animate-bounce">
                ✨
              </div>

              <h2 className="text-2xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-2">
                Criando História Mágica
              </h2>

              <p className="text-purple-200/80 text-xs font-semibold mb-6 min-h-[32px]">
                {progressStage}
              </p>

              {/* Barra de Progresso */}
              <div className="w-full bg-[#1A133A] h-4 rounded-full p-0.5 border border-purple-500/30 overflow-hidden mb-3">
                <div 
                  className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(217,70,239,0.8)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center text-[0.7rem] font-bold text-purple-300/70 mb-4 px-1">
                <span>Gerando imagens FLUX 2D & áudio</span>
                <span>{progress}%</span>
              </div>

              <div className="p-3 bg-purple-950/40 border border-purple-500/20 rounded-2xl text-[0.7rem] text-purple-200/60 font-medium">
                💡 O personagem {formData.childName || 'principal'} manterá exatamente o mesmo visual em todas as páginas!
              </div>
            </div>
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4 md:space-y-5">
            
            {/* Bloco 1: Quem Viverá a Aventura */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 backdrop-blur-xl">
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.6)]">
                      <Wand2 size={28} strokeWidth={1.5} />
                    </div>
                    <label className="block text-white font-bold text-sm">1. Quem viverá a aventura?</label>
                  </div>

                  <button 
                    type="button"
                    onClick={pickRandomName}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-400/40 rounded-full text-xs font-bold text-purple-200 hover:bg-purple-500/30 transition-all"
                    title="Sortear nome brasileiro aleatório"
                  >
                    <Dices size={14} /> <span>🎲 Aleatório</span>
                  </button>
                </div>

                <input 
                  type="text" 
                  required
                  className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[12px] h-[46px] px-4 text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-400 font-medium"
                  placeholder="Insira o nome da criança (ex: Manuela, Filipe)"
                  value={formData.childName}
                  onChange={(e) => setFormData({...formData, childName: e.target.value})}
                />
              </div>
            </div>

            {/* Bloco 2: Personalização Visual do Personagem (Aparência RICA) */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 backdrop-blur-xl space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.6)]">
                      <User size={28} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="block text-white font-bold text-sm">2. Aparência do Personagem</h3>
                      <p className="text-[0.7rem] text-purple-200/60 font-medium">Garante o mesmo visual em todas as páginas!</p>
                    </div>
                  </div>

                  {/* Botão de Transcrição por Voz */}
                  <button
                    type="button"
                    onClick={handleVoiceInput}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                      isListening 
                      ? 'bg-red-500/30 border-red-400 text-red-200 animate-pulse' 
                      : 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-400/40 text-pink-200 hover:bg-pink-500/30'
                    }`}
                    title="Clique e fale a aparência da criança"
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                    <span>{isListening ? 'Ouvindo...' : '🎙️ Falar por voz'}</span>
                  </button>
                </div>

                {voiceNotice && (
                  <div className="p-2.5 bg-pink-950/60 border border-pink-500/40 rounded-xl text-xs text-pink-200 font-semibold text-center animate-in fade-in">
                    {voiceNotice}
                  </div>
                )}

                {/* Toggle Gênero */}
                <div>
                  <label className="block text-purple-200/80 text-xs font-bold mb-1.5">Gênero do Personagem</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'menino'})}
                      className={`h-[40px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                        formData.gender === 'menino' 
                        ? 'bg-blue-600/40 border-blue-400 text-white shadow-[0_0_12px_rgba(59,130,246,0.5)]' 
                        : 'bg-[#1A133A] border-purple-500/20 text-purple-200/60'
                      }`}
                    >
                      👦 Menino
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, gender: 'menina'})}
                      className={`h-[40px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                        formData.gender === 'menina' 
                        ? 'bg-pink-600/40 border-pink-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]' 
                        : 'bg-[#1A133A] border-purple-500/20 text-purple-200/60'
                      }`}
                    >
                      👧 Menina
                    </button>
                  </div>
                </div>

                {/* Dropdowns de Cabelo e Tom de Pele */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Cor do Cabelo</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.hairColor}
                      onChange={(e) => setFormData({...formData, hairColor: e.target.value})}
                    >
                      <option value="Preto">🖤 Cabelo Preto</option>
                      <option value="Castanho">🟤 Cabelo Castanho</option>
                      <option value="Loiro">🟡 Cabelo Loiro</option>
                      <option value="Ruivo">🔴 Cabelo Ruivo</option>
                      <option value="Colorido">🔵 Cabelo Colorido</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Estilo do Cabelo</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.hairStyle}
                      onChange={(e) => setFormData({...formData, hairStyle: e.target.value})}
                    >
                      <option value="Curto">Curto</option>
                      <option value="Longo">Longo</option>
                      <option value="Cacheado">Cacheado</option>
                      <option value="Crespo">Crespo</option>
                      <option value="Liso">Liso</option>
                      <option value="Trança">Tranças</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Tom de Pele</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.skinTone}
                      onChange={(e) => setFormData({...formData, skinTone: e.target.value})}
                    >
                      <option value="Clara">Clara</option>
                      <option value="Parda">Parda / Morena</option>
                      <option value="Negra">Negra</option>
                      <option value="Muito Clara">Muito Clara</option>
                    </select>
                  </div>
                </div>

                {/* Dropdowns de Roupas e Acessórios */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Camisa / Blusa</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.topClothing}
                      onChange={(e) => setFormData({...formData, topClothing: e.target.value})}
                    >
                      <option value="Camiseta verde">👕 Camiseta verde</option>
                      <option value="Blusa azul">👕 Blusa azul</option>
                      <option value="Vestido rosa">👗 Vestido rosa</option>
                      <option value="Moletom vermelho">🧥 Moletom vermelho</option>
                      <option value="Camisa amarela">👕 Camisa amarela</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Short / Calça</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.bottomClothing}
                      onChange={(e) => setFormData({...formData, bottomClothing: e.target.value})}
                    >
                      <option value="Short kaqui">🩳 Short kaqui</option>
                      <option value="Calça jeans">👖 Calça jeans</option>
                      <option value="Short azul">🩳 Short azul</option>
                      <option value="Saia vermelha">👗 Saia vermelha</option>
                      <option value="Bermuda preta">🩳 Bermuda preta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-purple-200/80 text-[0.7rem] font-bold mb-1">Acessório Extra</label>
                    <select
                      className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[10px] h-[38px] px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-400 cursor-pointer"
                      value={formData.accessories}
                      onChange={(e) => setFormData({...formData, accessories: e.target.value})}
                    >
                      <option value="Nenhum">Nenhum</option>
                      <option value="Óculos">👓 Óculos</option>
                      <option value="Boné vermelho">🧢 Boné vermelho</option>
                      <option value="Tiara de borboleta">👑 Tiara</option>
                      <option value="Capa de super-herói">🦸 Capa de herói</option>
                    </select>
                  </div>
                </div>

              </div>
            </div>

            {/* Bloco 3: Idade */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 flex items-center gap-5 backdrop-blur-xl">
                <div className="text-blue-300 font-black text-[2.4rem] leading-none drop-shadow-[0_0_15px_rgba(147,197,253,0.6)]" style={{ fontFamily: 'sans-serif' }}>
                  {formData.ageGroup === '2-4' ? '3' : formData.ageGroup === '5-7' ? '7' : formData.ageGroup === '8-10' ? '9' : '12'}
                </div>
                <div className="flex-1">
                  <label className="block text-white font-bold text-sm mb-1">3. Faixa Etária</label>
                  <select 
                    className="w-full bg-[#1A133A] border border-blue-500/30 rounded-[12px] h-[44px] px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer text-sm font-medium"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value as any})}
                  >
                    <option value="2-4">2 a 4 anos (20 a 30 páginas curtas)</option>
                    <option value="5-7">5 a 7 anos (30 a 50 páginas interativas)</option>
                    <option value="8-10">8 a 10 anos (40 a 60 páginas de transição)</option>
                    <option value="11-14">11 a 14 anos (60 a 150 páginas de enredo)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bloco 4: Tema */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 backdrop-blur-xl">
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.6)]">
                    <Castle size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white font-bold text-sm mb-1">4. Tema da Aventura</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-[#1A133A] border border-cyan-500/30 rounded-[12px] h-[44px] px-4 text-white placeholder-cyan-200/30 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm font-medium"
                      placeholder="Ex: Os 12 Trabalhos de Hércules, Davi e Golias, Joana d'Arc..."
                      value={formData.theme}
                      onChange={(e) => setFormData({...formData, theme: e.target.value})}
                    />
                  </div>
                </div>

                {/* Atalhos para Trilhas de Conhecimento */}
                <div>
                  <span className="block text-[0.68rem] text-purple-200/60 font-bold mb-2">✨ Ou escolha uma Trilha de Conhecimento:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { name: '🏛️ Mitologia Grega', value: 'Mitologia Grega: Os Trabalhos de Hércules e lições de virtude' },
                      { name: '📖 Histórias da Bíblia', value: 'História Bíblica: Davi e Golias com lições de fé' },
                      { name: '👑 Mulheres Fortes', value: 'Mulheres Fortes: Joana d\'Arc e coragem moral' },
                      { name: '🏰 Biografias', value: 'Biografia Histórica: Santos Dumont e a invenção' },
                      { name: '🛡️ Contos & Fábulas', value: 'Fábulas Clássicas: O Leão e o Rato e compaixão' },
                      { name: '🔬 Ciência', value: 'Grandes Inventores: Albert Einstein e curiosidade' },
                      { name: '✨ Virtudes', value: 'Virtudes no dia a dia: Verdade, paciência e respeito' },
                      { name: '🌿 Natureza', value: 'Natureza do Brasil: Vida selvagem no Pantanal' }
                    ].map((t) => (
                      <button
                        key={t.name}
                        type="button"
                        onClick={() => setFormData({...formData, theme: t.value})}
                        className={`px-3 py-1.5 rounded-full text-[0.68rem] font-bold whitespace-nowrap transition-all border ${
                          formData.theme === t.value 
                          ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(103,232,249,0.4)]' 
                          : 'bg-[#1A133A] border-purple-500/20 text-purple-200/70 hover:bg-purple-900/40 hover:text-white'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bloco 5: Emoção da História */}
            <div className="relative group mb-6">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-yellow-200 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">
                      <Moon size={28} fill="currentColor" strokeWidth={1} />
                    </div>
                    <div>
                      <h3 className="block text-white font-bold text-sm">5. Emoção da História</h3>
                      <p className="text-[0.7rem] text-purple-200/60 font-medium">Selecione o sentimento principal da aventura</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
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
                    { label: 'Inspirador', emoji: '✨' }
                  ].map(em => (
                    <button
                      key={em.label}
                      type="button"
                      onClick={() => setFormData({...formData, emotion: em.label})}
                      className={`h-[42px] px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                        formData.emotion === em.label 
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_15px_rgba(217,70,239,0.7)] scale-105 border border-white/40' 
                        : 'bg-[#1A133A] text-purple-200/80 border border-purple-500/20 hover:bg-purple-900/40 hover:text-white'
                      }`}
                    >
                      <span>{em.emoji}</span>
                      <span>{em.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 font-bold p-4 rounded-[16px] text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className="relative w-full group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-[8px] opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <div className="relative w-full h-[60px] md:h-[64px] bg-[#150F2D] rounded-full border-2 border-transparent flex items-center justify-center overflow-hidden" style={{ backgroundClip: 'padding-box' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20"></div>
                  {loading ? (
                    <span className="text-white font-extrabold text-lg relative z-10 animate-pulse">Criando Magia com FLUX... ✨</span>
                  ) : (
                    <span className="text-white font-extrabold text-[1.15rem] md:text-[1.25rem] relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Criar História Mágica! ✨</span>
                  )}
                </div>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#150F2D] border border-purple-500/30 rounded-[32px] p-6 shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-in fade-in relative mt-8">
            <h2 className="text-center font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 mt-2 mb-6 drop-shadow-md">
              {success.story.title || 'História Criada!'}
            </h2>

            <button 
              onClick={() => setSuccess(null)}
              className="w-full h-[60px] rounded-full font-extrabold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 text-lg"
            >
              Criar Outra <Sparkles size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
