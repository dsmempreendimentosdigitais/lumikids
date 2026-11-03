'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Volume2, 
  Brain, 
  Globe2, 
  Flame, 
  Heart, 
  Moon, 
  Star, 
  ArrowRight, 
  MessageCircle, 
  ChevronDown,
  Play,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Layers,
  Leaf
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const whatsappUrl = "https://wa.me/5531999180068?text=Ol%C3%A1!%20Estou%20no%20site%20do%20Contos%20%26%20Virtudes%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.";
  
  // Link direto para uma história demonstrativa livre e completa (sem cadastro prévio)
  const freeDemoStoryUrl = "/app/historias/396iy19bfOCQBuTK0aGe";

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A1D20] font-sans antialiased overflow-x-hidden selection:bg-amber-200 selection:text-amber-950">
      
      {/* ═══ 1. NAVBAR PROFISSIONAL E MODERNA COM BOTÕES AMPLOS ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-900/10 px-3 sm:px-8 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          
          {/* Logo Oficial Contos & Virtudes */}
          <LumikidsLogo size="md" />

          {/* Links Centrais no Desktop */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#solucao" className="hover:text-[#0D9488] transition-colors">A Solução</a>
            <a href="#como-funciona" className="hover:text-[#0D9488] transition-colors">Como Funciona</a>
            <a href="#historias" className="hover:text-[#0D9488] transition-colors">O Acervo</a>
            <a href="#missao" className="hover:text-[#0D9488] transition-colors">Nossa Missão</a>
            <a href="#planos" className="hover:text-[#0D9488] transition-colors text-amber-600 font-black">Planos</a>
          </div>

          {/* Botões de Ação com Tamanho Confortável */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link 
              href={freeDemoStoryUrl}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all cursor-pointer"
            >
              <Play size={13} className="fill-amber-900" />
              <span>História Grátis</span>
            </Link>

            <Link 
              href={user ? "/app" : "/login"} 
              className="px-4 sm:px-5 py-2.5 rounded-full font-extrabold text-xs sm:text-sm text-slate-800 bg-amber-50/90 hover:bg-amber-100 border border-amber-300 shadow-2xs transition-all cursor-pointer"
            >
              {user ? "Meu Painel" : "Entrar"}
            </Link>

            <a 
              href="#planos" 
              className="px-4 sm:px-6 py-2.5 rounded-full font-black text-xs sm:text-sm text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-md shadow-teal-800/25 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Assinar (33% OFF)</span>
              <Sparkles size={14} />
            </a>
          </div>

        </div>
      </nav>

      {/* ═══ 2. HERO SECTION COM ESPAÇAMENTO GENEROSO & LIMPO ═══ */}
      <section className="relative pt-36 sm:pt-44 md:pt-48 pb-16 sm:pb-24 px-4 sm:px-8 bg-gradient-to-b from-amber-50/60 via-[#FFFDF9] to-white overflow-hidden">
        
        {/* Fundo Atmosférico de Aquarela Suave */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-r from-amber-200/30 via-teal-100/30 to-amber-100/40 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          
          {/* Badge de Autoridade com espaçamento */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-black mb-5 shadow-2xs">
            <Sparkles size={16} className="text-amber-600" />
            <span>O Clube de Histórias com Valores & Fé para Famílias</span>
          </div>

          {/* Headline Principal Limpa e Imponente */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-slate-900 leading-[1.2] tracking-tight max-w-3xl mx-auto mb-6">
            Substitua os vídeos frenéticos por momentos de <span className="text-[#0D9488]">conexão</span>, <span className="text-[#D97706]">virtudes</span> e sono tranquilo.
          </h1>

          {/* Subheadline Concisa e Respirada */}
          <p className="text-slate-600 text-base sm:text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            Histórias clássicas em aquarela <em>Puffin Rock</em>, narração acolhedora, quizzes e 5 idiomas. Uma rotina serena de 5 a 7 minutos que resgata valores para crianças de 2 a 10 anos.
          </p>

          {/* Botões de Ação Principais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-5 max-w-lg mx-auto">
            
            <a 
              href="#planos" 
              className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm sm:text-base uppercase tracking-wider shadow-xl shadow-teal-800/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Zap size={20} />
              <span>QUERO O ACESSO TOTAL (33% OFF)</span>
            </a>

            <Link 
              href={freeDemoStoryUrl} 
              className="w-full sm:w-auto px-6 py-4 sm:py-5 rounded-full bg-white hover:bg-amber-50/80 text-amber-950 font-black text-sm sm:text-base border-2 border-amber-300 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
            >
              <BookOpen size={18} className="text-amber-700" />
              <span>Ler História Grátis</span>
            </Link>

          </div>

          <p className="text-xs text-slate-500 font-semibold mb-8 flex items-center justify-center gap-1.5">
            <Check size={14} className="text-[#0D9488]" strokeWidth={3} />
            <span>Sem necessidade de cadastro prévio para ler a primeira história</span>
          </p>

          {/* Faixa Limpa de Destaques (Respirada e Elegante) */}
          <div className="inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-2.5 px-5 rounded-full bg-amber-50/80 border border-amber-200/80 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs">
            <span>📖 60+ Histórias</span>
            <span className="text-amber-300">•</span>
            <span>🎨 991 Ilustrações</span>
            <span className="text-amber-300">•</span>
            <span>🎙️ Áudio Suave</span>
            <span className="text-amber-300">•</span>
            <span>🌍 5 Idiomas</span>
          </div>

        </div>
      </section>

      {/* ═══ 3. VITRINE DE HISTÓRIAS (COM ESPAÇAMENTO RESPIRADO) ═══ */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 bg-gradient-to-b from-white via-amber-50/30 to-white">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              Acervo de Clássicos & Valores
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-2">
              Histórias que inspiram virtudes reais
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {[
              { id: '396iy19bfOCQBuTK0aGe', title: 'A Rainha Ester', tag: 'Coragem & Fé' },
              { id: '10RcwpUmFQWwJ1hikODu', title: 'Mahatma Gandhi', tag: 'Paz & Verdade' },
              { id: '3q8Nb0fUJjgLxMwpPCEC', title: 'Galileu Galilei', tag: 'Sabedoria' },
              { id: '8g8ywuh20kG7I03gz8rg', title: 'O Bom Samaritano', tag: 'Amor ao Próximo' },
            ].map((story, i) => (
              <Link 
                key={i} 
                href={`/app/historias/${story.id}`}
                className="bg-white rounded-[28px] overflow-hidden border border-amber-200/90 shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 text-left block"
              >
                <div className="h-44 sm:h-52 w-full bg-slate-900 overflow-hidden relative">
                  <img 
                    src={`/stories/${story.id}/cover.jpg`} 
                    alt={story.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[0.65rem] uppercase tracking-wider shadow-xs">
                    {story.tag}
                  </span>
                </div>
                <div className="p-3.5">
                  <h3 className="font-serif font-black text-sm text-slate-900 line-clamp-1 group-hover:text-[#0D9488] transition-colors">
                    {story.title}
                  </h3>
                  <div className="flex items-center justify-between text-[0.7rem] text-slate-500 font-semibold mt-1">
                    <span>📖 5-7 min</span>
                    <span className="text-[#0D9488] font-black">Ler Agora →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 4. O DILEMA DOS PAIS (ESTILO CARD LIMPO E AREJADO) ═══ */}
      <section id="solucao" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-y border-amber-900/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
              O Desafio das Famílias Atuais
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-4 leading-snug">
              Você sabe o que os vídeos rápidos fazem com a mente do seu filho?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Dancinhas frenéticas e cortes a cada 2 segundos inundam o cérebro infantil com picos de dopamina rápida, gerando agitação noturna, birras e perda de foco.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* O Que Evitar */}
            <div className="bg-rose-50/50 rounded-[32px] p-6 sm:p-8 border border-rose-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl font-bold mb-4">
                  ❌
                </div>
                <h3 className="text-xl font-serif font-black text-rose-950 mb-3">
                  As Telas Hiperestimulantes
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm font-semibold text-rose-900/80">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Animações com ritmo acelerado que impedem o cérebro de desacelerar antes do sono.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Anúncios comerciais imprevisíveis e conteúdos sem nenhum filtro moral.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>Passividade: a criança consome sem exercitar a imaginação, vocabulário ou reflexão.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* A Solução Contos & Virtudes */}
            <div className="bg-[#FFFDF7] rounded-[32px] p-6 sm:p-8 border-2 border-teal-300 shadow-md flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0D9488] flex items-center justify-center text-xl font-bold mb-4">
                  ⭐
                </div>
                <h3 className="text-xl font-serif font-black text-teal-950 mb-3">
                  O Método Contos & Virtudes
                </h3>
                <ul className="space-y-3.5 text-xs sm:text-sm font-semibold text-teal-900">
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0D9488] shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong>Arte Puffin Rock em Aquarela:</strong> Cores quentes e serenas que preparam a mente para o descanso.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0D9488] shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong>Virtudes Eternas:</strong> Histórias que ensinam honestidade, generosidade, coragem, respeito e fé.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check size={18} className="text-[#0D9488] shrink-0 mt-0.5" strokeWidth={3} />
                    <span><strong>Voz Acolhedora Sincronizada:</strong> Narração em tom calmo que conduz suavemente à hora de dormir.</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 5. CARD LIMPO CENTRAL (ESTILO PLAN FOR EXPLORER) ═══ */}
      <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-white via-amber-50/40 to-white">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
              O Seu Guia Noturno
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-3">
              Tudo o que seu filho precisa em um só lugar
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Desenvolvido no formato limpo, espaçoso e intuitivo que as famílias adoram.
            </p>
          </div>

          {/* CARD CENTRAL BRANCO ARREDONDADO */}
          <div className="bg-white rounded-[36px] border border-amber-200/80 shadow-[0_20px_50px_rgba(45,33,20,0.06)] p-6 sm:p-10">
            
            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#FFFDF9] rounded-2xl flex items-center justify-center text-2xl">
                  ⭐
                </div>
              </div>
              <div>
                <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-900">
                  Plano de Leitura & Virtudes
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                  Rotina de 5 a 7 minutos por noite • Crianças de 2 a 10 anos
                </p>
              </div>
            </div>

            {/* Lista de Itens Arejados e Divididos */}
            <div className="divide-y divide-slate-100">
              
              {/* Item 1 */}
              <div className="py-5 sm:py-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-teal-50 border border-teal-200 text-[#0D9488] flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-[#0D9488]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      991 Ilustrações em Aquarela Puffin Rock
                    </h4>
                    <span className="text-xs">🎨 🌿</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Mais de 60 histórias ilustradas cena a cena com paleta suave que descansa os olhos e desacelera os batimentos.
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="py-5 sm:py-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Leaf size={22} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      Quizzes Pedagógicos por Faixa Etária
                    </h4>
                    <span className="text-xs">🧠 👶</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Três perguntas interativas ao final de cada história adaptadas para 2–4, 5–7 e 8–10 anos, fixando ensinamentos morais de forma lúdica.
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="py-5 sm:py-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <Volume2 size={22} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      Narração Suave em Áudio Acolhedor
                    </h4>
                    <span className="text-xs">🎙️ 🌙</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Áudio de alta definição com destaque palavra a palavra, estimulando a alfabetização e a concentração antes do sono.
                  </p>
                </div>
              </div>

              {/* Item 4 */}
              <div className="py-5 sm:py-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                  <Globe2 size={22} className="text-rose-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      5 Idiomas Disponíveis com 1 Clique
                    </h4>
                    <span className="text-xs">🇧🇷 🇺🇸 🇪🇸 🇫🇷 🇮🇹</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Alterne instantaneamente para Português, Inglês, Espanhol, Francês ou Italiano para estimular o bilinguismo precoce natural.
                  </p>
                </div>
              </div>

              {/* Item 5 */}
              <div className="py-5 sm:py-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                  <Flame size={22} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      Desafio dos 30 Dias & Álbum de Adesivos
                    </h4>
                    <span className="text-xs">🏆 📜</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                    Gamificação positiva que incentiva o hábito diário de leitura: a criança coleciona selos dourados e desbloqueia histórias secretas.
                  </p>
                </div>
              </div>

            </div>

            {/* Botão de Ação Inferior Grande e Limpo */}
            <div className="pt-8 mt-2">
              <a
                href="#planos"
                className="w-full py-4 sm:py-5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-lg shadow-teal-800/20 active:scale-98 transition-all text-center block cursor-pointer"
              >
                COMEÇAR O PLANO AGORA 🚀
              </a>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs font-semibold text-slate-400">
                <ShieldCheck size={16} className="text-[#0D9488]" />
                <span>Garantia incondicional de 7 dias • Cancele quando quiser</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 6. AS 8 TRILHAS DE HISTÓRIAS ═══ */}
      <section id="historias" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-t border-amber-900/10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              O Catálogo Completo
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-3">
              8 Trilhas do Conhecimento & Valores
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Mais de 60 histórias distribuídas em trilhas cuidadosamente planejadas para cada fase do seu filho.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: '📖', title: 'Bíblia Kids', desc: 'Davi, Ester, Moisés, Jonas' },
              { icon: '👑', title: 'Heroínas da História', desc: 'Mulheres que transformaram o mundo' },
              { icon: '🏛️', title: 'Grandes Líderes', desc: 'Gandhi, Lincoln, Nelson Mandela' },
              { icon: '🦊', title: 'Fábulas Clássicas', desc: 'Esopo, La Fontaine e sabedoria' },
              { icon: '🔬', title: 'Oficina de Invenções', desc: 'Galileu, Da Vinci e Santos Dumont' },
              { icon: '✨', title: 'Virtudes Humanas', desc: 'Honestidade, empatia e coragem' },
              { icon: '🌿', title: 'Guardiões da Natureza', desc: 'Amor aos animais e criação' },
              { icon: '🍼', title: 'Bebês (2 a 4 anos)', desc: 'Narrativas curtas e doces' },
            ].map((trail, i) => (
              <div key={i} className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 text-center hover:bg-amber-100/50 transition-colors">
                <span className="text-3xl block mb-2">{trail.icon}</span>
                <h3 className="font-serif font-bold text-sm text-slate-900">{trail.title}</h3>
                <p className="text-[0.7rem] text-slate-500 font-semibold mt-1">{trail.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href={freeDemoStoryUrl}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-xs sm:text-sm border border-amber-300 transition-all cursor-pointer"
            >
              <span>Experimente uma história completa gratuitamente agora</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* ═══ 7. QUEM CRIOU & O PROPÓSITO DO CONTOS & VIRTUDES ═══ */}
      <section id="missao" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-white via-amber-50/50 to-white border-t border-amber-900/10">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-[36px] p-6 sm:p-12 border border-amber-200/90 shadow-xl relative overflow-hidden">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 p-1 shrink-0 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#FFFDF9] rounded-full flex items-center justify-center text-3xl">
                  👨‍👩‍👧‍👦
                </div>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
                  De Família para Família
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-2">
                  Por que criamos o Contos & Virtudes?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                  Por Samuel e a equipe DSM Empreendimentos Digitais
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
              <p>
                Como pais e educadores, nós víamos com angústia a mesma cena se repetir todas as noites: luz azul no rosto das crianças, vídeos curtíssimos e barulhentos nos algoritmos do YouTube e a dificuldade cada vez maior de colocar nossos filhos na cama com paz.
              </p>
              <p>
                Sentíamos falta de um <strong>lugar seguro</strong> — um refúgio digital onde não houvesse propagandas nos empurrando brinquedos, nem narrativas vazias ou assustadoras.
              </p>
              <p>
                Foi assim que nasceu o <strong>Contos & Virtudes</strong>: reunimos ilustrações em aquarela estilo livro infantil europeu, narrativas com profundidade moral (coragem, generosidade, respeito, fé e verdade) e perguntas reflexivas para que pais e filhos possam conversar antes de apagar as luzes.
              </p>
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-serif italic text-sm sm:text-base">
                "Não criamos apenas um aplicativo; criamos o ritual sagrado de 7 minutos que restaura a conversa, a imaginação e o sono tranquilo no seu lar."
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <ShieldCheck size={18} className="text-[#0D9488]" />
                <span>Zero Anúncios • 100% Protegido pela LGPD Infantil</span>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-black text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1.5"
              >
                <span>Falar com o Criador no WhatsApp</span>
                <ArrowRight size={14} />
              </a>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 8. SEÇÃO DE OFERTA E PLANOS (MERCADO PAGO) ═══ */}
      <section id="planos" className="py-20 sm:py-28 px-4 sm:px-8 bg-gradient-to-b from-amber-50/50 via-[#FAF6ED] to-[#FFFDF9] border-t border-amber-900/10">
        <div className="max-w-4xl mx-auto text-center">
          
          <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-300 px-4 py-1.5 rounded-full border border-amber-400 shadow-xs">
            🎉 OFERTA ESPECIAL DE LANÇAMENTO
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 mt-4 mb-4">
            Escolha o Plano Ideal para Sua Família
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-12">
            Acesso ilimitado e imediato a todas as 60+ histórias, 991 ilustrações, áudios e quizzes. Menos de R$ 0,66 por dia.
          </p>

          {/* Cards dos Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
            
            {/* Plano Mensal */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-2 border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Plano Mensal</div>
                <h3 className="text-2xl font-serif font-black text-slate-900 mb-2">Mês a Mês</h3>
                <p className="text-xs text-slate-500 mb-6">Flexibilidade para cancelar a qualquer momento sem fidelidade.</p>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-base font-bold text-slate-400">R$</span>
                  <span className="text-5xl font-serif font-black text-slate-900">29</span>
                  <span className="text-2xl font-serif font-black text-slate-900">,90</span>
                  <span className="text-xs text-slate-500 font-bold">/mês</span>
                </div>

                <ul className="space-y-3 pt-4 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Acesso a todas as 60+ histórias</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Todas as 991 ilustrações em HD</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Quizzes e áudio humanizado</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>5 idiomas disponíveis</span>
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/app/planos"
                  className="w-full py-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition-all text-center block cursor-pointer"
                >
                  Assinar Mensal
                </Link>
              </div>
            </div>

            {/* Plano Anual (Destaque Campeão) */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border-4 border-amber-400 shadow-2xl relative flex flex-col justify-between">
              
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[0.7rem] uppercase tracking-wider py-1 px-4 rounded-full shadow-md border border-white">
                ⭐ O Mais Escolhido (-33% OFF)
              </div>

              <div>
                <div className="text-sm font-bold text-[#0D9488] uppercase tracking-wider mb-2">Plano Anual</div>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mb-2">1 Ano de Histórias</h3>
                <p className="text-xs text-slate-500 mb-4">Economia real de R$ 120,00 no ano para a sua família.</p>

                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-base font-bold text-slate-400">R$</span>
                  <span className="text-6xl font-serif font-black text-slate-900">19</span>
                  <span className="text-3xl font-serif font-black text-slate-900">,90</span>
                  <span className="text-xs text-slate-500 font-bold">/mês</span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0D9488] border border-emerald-200 text-xs font-bold mb-4 text-center">
                  Cobrado R$ 238,80/ano ou em até 12x de R$ 19,90 no Cartão
                </div>

                <ul className="space-y-3 pt-3 border-t border-slate-100 text-xs sm:text-sm font-semibold text-slate-700">
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span><strong>Tudo do Mensal</strong> com 33% de desconto</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Acesso antecipado a novas histórias</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Desbloqueio do Desafio dos 30 Dias</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={16} className="text-[#0D9488]" strokeWidth={3} />
                    <span>Pagamento via PIX ou Cartão em até 12x</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6">
                <Link
                  href="/app/planos"
                  className="w-full py-5 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-base uppercase tracking-wider shadow-lg shadow-teal-800/30 active:scale-95 transition-all text-center block cursor-pointer"
                >
                  GARANTIR ACESSO ANUAL 🚀
                </Link>
                <div className="text-[0.68rem] text-slate-400 font-semibold text-center mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0D9488]" />
                  <span>Garantia incondicional de 7 dias ou 100% do seu dinheiro de volta</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 9. PERGUNTAS FREQUENTES (FAQ) ═══ */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 bg-white border-t border-amber-900/10">
        <div className="max-w-3xl mx-auto">
          
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-3.5 py-1 rounded-full">
              Tire Suas Dúvidas
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 mt-3">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Para quais idades o Contos & Virtudes é recomendado?",
                a: "O aplicativo foi desenvolvido para crianças de 2 a 10 anos. Você pode filtrar as histórias por faixa etária (2–4 anos, 5–7 anos e 8–10 anos), com quizzes pedagógicos adaptados para cada nível de compreensão."
              },
              {
                q: "Posso testar alguma história antes de pagar?",
                a: "Com certeza! Você pode clicar no botão 'História Grátis' no topo da página e ler a história completa de A Rainha Ester sem precisar de cadastro nem cartão de crédito."
              },
              {
                q: "Posso acessar no celular, tablet e computador?",
                a: "Sim! O Contos & Virtudes é um Web App moderno e PWA. Você e sua família podem acessar de qualquer celular (iPhone ou Android), tablet, iPad ou navegador de computador com o mesmo login."
              },
              {
                q: "As histórias contêm conteúdo místico ou assustador?",
                a: "Não, zero conteúdo esotérico ou de medo. Todas as histórias são focadas em valores humanos positivos, virtudes morais (honestidade, respeito, generosidade, perdão), ensinamentos bíblicos e amor à família e à natureza."
              },
              {
                q: "Como funciona a garantia incondicional de 7 dias?",
                a: "Se por qualquer motivo você ou seus filhos não se adaptarem ao Contos & Virtudes dentro dos primeiros 7 dias após a assinatura, basta nos enviar uma mensagem e devolveremos 100% do seu investimento, sem qualquer burocracia."
              },
              {
                q: "Como recebo o acesso após o pagamento?",
                a: "A liberação é instantânea! Assim que o pagamento via PIX ou Cartão for aprovado pelo Mercado Pago, sua conta é liberada automaticamente e você já pode começar a ler."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="border border-amber-200/90 rounded-2xl overflow-hidden bg-[#FFFDF9]"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-amber-50/50 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`transition-transform duration-200 shrink-0 text-slate-400 ${openFaq === idx ? 'rotate-180 text-amber-600' : ''}`} 
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed border-t border-amber-100">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 10. RODAPÉ INSTITUCIONAL COM LINKS LEGAIS ═══ */}
      <footer className="bg-slate-950 text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <LumikidsLogo size="md" variant="light" />
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold">
            <Link href={freeDemoStoryUrl} className="hover:text-amber-400 transition-colors">História Grátis</Link>
            <Link href="/login" className="hover:text-white transition-colors">Acessar Conta</Link>
            <a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a>
            <Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-white transition-colors">Privacidade & LGPD</Link>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              WhatsApp Suporte (31 999180068)
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Contos & Virtudes • Desenvolvido com amor para as famílias brasileiras.</p>
          <p>DSM Empreendimentos Digitais • CNPJ e Dados Legais Protegidos</p>
        </div>
      </footer>

      {/* ═══ 11. BOTÃO FLUTUANTE DE WHATSAPP TIRA-DÚVIDAS (Samuel - 31 999180068) ═══ */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        title="Dúvidas? Fale comigo no WhatsApp"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
        </span>
        <MessageCircle size={24} className="shrink-0" />
        <span className="hidden sm:inline-block font-black text-xs sm:text-sm tracking-wide">
          Dúvidas? Fale no WhatsApp
        </span>
      </a>

    </div>
  );
}
