'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { 
  Sparkles, 
  Check, 
  Crown, 
  ShieldCheck, 
  Zap, 
  BookOpen, 
  Volume2, 
  Brain, 
  Globe2, 
  Flame, 
  Heart, 
  Moon, 
  Smartphone, 
  Star, 
  ArrowRight, 
  MessageCircle, 
  Lock, 
  ChevronDown,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const whatsappUrl = "https://wa.me/5531999180068?text=Ol%C3%A1!%20Estou%20no%20site%20do%20Lumikids%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.";

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A1D20] font-sans antialiased overflow-x-hidden selection:bg-amber-200 selection:text-amber-950">
      
      {/* ═══ 1. NAVBAR PROFISSIONAL E MODERNA ═══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-amber-900/10 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          {/* Logo da Estrelinha Sorridente */}
          <LumikidsLogo size="md" />

          {/* Links Centrais no Desktop */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <a href="#solucao" className="hover:text-[#0D9488] transition-colors">A Solução</a>
            <a href="#historias" className="hover:text-[#0D9488] transition-colors">O Acervo</a>
            <a href="#diferenciais" className="hover:text-[#0D9488] transition-colors">Recursos</a>
            <a href="#depoimentos" className="hover:text-[#0D9488] transition-colors">Depoimentos</a>
            <a href="#planos" className="hover:text-[#0D9488] transition-colors text-amber-600 font-black">Planos</a>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link 
              href={user ? "/app" : "/login"} 
              className="px-4 py-2 rounded-full font-bold text-xs sm:text-sm text-slate-700 hover:text-slate-900 hover:bg-amber-50 border border-amber-200/80 transition-all cursor-pointer"
            >
              {user ? "Meu Painel" : "Acessar Conta"}
            </Link>

            <a 
              href="#planos" 
              className="px-4 sm:px-5 py-2.5 rounded-full font-black text-xs sm:text-sm text-white bg-[#0D9488] hover:bg-[#0F766E] shadow-md shadow-teal-700/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Assinar (33% OFF)</span>
              <Sparkles size={14} />
            </a>
          </div>

        </div>
      </nav>

      {/* ═══ 2. HERO SECTION DE ALTA CONVERSÃO ═══ */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-8 bg-gradient-to-b from-amber-50/50 via-[#FFFDF9] to-white overflow-hidden">
        
        {/* Elementos Decorativos de Fundo */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-amber-200/30 via-teal-100/40 to-amber-100/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-950 text-xs sm:text-sm font-black mb-6 shadow-2xs animate-fade-in">
            <Sparkles size={16} className="text-amber-600" />
            <span>O Clube de Leitura Infantil Mais Amado pelas Famílias</span>
          </div>

          {/* Headline Principal Persuasiva */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-slate-900 leading-[1.15] tracking-tight max-w-4xl mx-auto mb-6">
            Substitua os vídeos frenéticos por momentos de <span className="text-[#0D9488]">conexão</span>, <span className="text-[#D97706]">virtudes</span> e sono tranquilo.
          </h1>

          {/* Subheadline Focada na Dor e Solução */}
          <p className="text-slate-600 text-base sm:text-xl font-medium max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
            O <strong>Lumikids</strong> é o primeiro aplicativo educativo que resgata a pureza das histórias clássicas, virtudes morais e ilustrações artísticas no estilo <em>Puffin Rock</em> — criando uma rotina noturna saudável de 5 a 7 minutos para crianças de 2 a 10 anos.
          </p>

          {/* Botões de Ação Principais */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 mb-10 max-w-md mx-auto">
            <a 
              href="#planos" 
              className="w-full sm:w-auto px-8 py-4 sm:py-5 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-xl shadow-teal-800/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Zap size={22} />
              <span>QUERO O ACESSO TOTAL (33% OFF)</span>
            </a>

            <Link 
              href={user ? "/app" : "/login"} 
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm sm:text-base border-2 border-slate-200 transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <BookOpen size={18} />
              <span>Entrar na Minha Conta</span>
            </Link>
          </div>

          {/* Badges de Confiança */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#0D9488]" strokeWidth={3} />
              <span>60+ Histórias Publicadas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#0D9488]" strokeWidth={3} />
              <span>991 Ilustrações Exclusivas</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#0D9488]" strokeWidth={3} />
              <span>Narração em Áudio Humano</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={18} className="text-[#0D9488]" strokeWidth={3} />
              <span>5 Idiomas com 1 Toque</span>
            </div>
          </div>

          {/* Vitrine Visual de Capas Reais do Acervo */}
          <div className="mt-14 sm:mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto">
            {[
              { id: '396iy19bfOCQBuTK0aGe', title: 'A Rainha Ester', tag: 'Coragem' },
              { id: '10RcwpUmFQWwJ1hikODu', title: 'Mahatma Gandhi', tag: 'Paz' },
              { id: '3q8Nb0fUJjgLxMwpPCEC', title: 'Galileu Galilei', tag: 'Sabedoria' },
              { id: '8g8ywuh20kG7I03gz8rg', title: 'O Bom Samaritano', tag: 'Bondade' },
            ].map((story, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl overflow-hidden border-2 border-amber-200 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-1.5 text-left"
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
                  <h3 className="font-serif font-black text-sm text-slate-900 line-clamp-1">
                    {story.title}
                  </h3>
                  <div className="flex items-center justify-between text-[0.7rem] text-slate-500 font-semibold mt-1">
                    <span>📖 5-7 min</span>
                    <span className="text-[#0D9488] font-black">Áudio HD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══ 3. O DILEMA DOS PAIS: TELAS TÓXICAS VS. O MÉTODO LUMIKIDS ═══ */}
      <section id="solucao" className="py-16 sm:py-24 px-4 sm:px-8 bg-white border-y border-amber-900/10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3.5 py-1 rounded-full border border-rose-200">
              O Desafio das Famílias Atuais
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-4 leading-snug">
              Você sabe o que os vídeos rápidos estão fazendo com o sono do seu filho?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Vídeos curtos de dancinhas e desenhos hiperativos inundam o cérebro das crianças com picos de dopamina rápida. O resultado? Dificuldade para desacelerar, insônia, birras noturnas e perda do hábito de leitura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* O que evitar */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-rose-50/60 border-2 border-rose-200">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">
                ❌
              </div>
              <h3 className="text-xl font-serif font-black text-rose-950 mb-3">
                O Efeito das Telas Comuns
              </h3>
              <ul className="space-y-3 text-sm font-semibold text-rose-900/80">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Vídeos hiperestimulantes que atrasam o sono e agitam o cérebro infantil.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Anúncios impróprios e conteúdos sem filtro moral.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-500 font-bold">•</span>
                  <span>Crianças passivas, que perdem a capacidade de imaginação e concentração.</span>
                </li>
              </ul>
            </div>

            {/* A Solução Lumikids */}
            <div className="p-6 sm:p-8 rounded-[32px] bg-teal-50/70 border-2 border-teal-300 shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0D9488] flex items-center justify-center text-2xl mb-4">
                ⭐
              </div>
              <h3 className="text-xl font-serif font-black text-teal-950 mb-3">
                O Ambiente Protetor Lumikids
              </h3>
              <ul className="space-y-3 text-sm font-semibold text-teal-900">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0D9488] font-black">✓</span>
                  <span><strong>Arte Puffin Rock em Aquarela:</strong> Cores suaves e quentes que preparam a mente para o descanso.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0D9488] font-black">✓</span>
                  <span><strong>Virtudes Eternas:</strong> Histórias que ensinam honestidade, generosidade, coragem, respeito e fé.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#0D9488] font-black">✓</span>
                  <span><strong>Voz Acolhedora & Sincronizada:</strong> Áudio relaxante que ajuda a criança a acompanhar as palavras.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* ═══ 4. RECURSOS EXCLUSIVOS DO LUMIKIDS ═══ */}
      <section id="diferenciais" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-white via-amber-50/40 to-white">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
              Tecnologia & Pedagogia
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-3">
              Tudo o que seu filho precisa em um só lugar
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Desenvolvido com carinho para ser simples para os pais e fascinante para as crianças.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
                🎨
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">991 Ilustrações em HD</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Todas as 60 histórias contam com 14 a 22 ilustrações exclusivas em estilo livro impresso infantil europeu.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#0D9488] flex items-center justify-center text-2xl mb-4">
                🎙️
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">Narração Calmante</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Áudio de voz doce e pausado para você ouvir com seu filho ou deixá-lo relaxar na cama antes de dormir.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl mb-4">
                🧠
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">Quizzes por Faixa Etária</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                3 perguntas interativas ao final de cada história ajustadas para 2–4, 5–7 e 8–10 anos, fixando o aprendizado com diversão.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl mb-4">
                🌍
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">5 Idiomas em 1 Clique</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ensine novos idiomas desde cedo! Alterne instantaneamente entre Português, Inglês, Espanhol, Francês e Italiano.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
                🔥
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">Desafio dos 30 Dias</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Estimule o hábito diário de leitura com álbum de adesivos, medalhas e desbloqueio de histórias bônus especiais.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200/90 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
                🛡️
              </div>
              <h3 className="font-serif font-black text-lg text-slate-900 mb-2">Zero Anúncios e 100% Seguro</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ambiente fechado, sem links externos nocivos, sem telas de compras acidentais e protegido por PIN parental.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 5. AS 8 TRILHAS DE HISTÓRIAS ═══ */}
      <section id="historias" className="py-16 sm:py-24 px-4 sm:px-8 bg-white">
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
              { icon: '👑', title: 'Heroínas da História', desc: 'Mulheres que mudaram o mundo' },
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

        </div>
      </section>

      {/* ═══ 6. DEPOIMENTOS DE FAMÍLIAS ═══ */}
      <section id="depoimentos" className="py-16 sm:py-24 px-4 sm:px-8 bg-gradient-to-b from-white to-amber-50/50 border-t border-amber-900/10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-black uppercase tracking-wider text-[#0D9488] bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200">
              Depoimentos Reais
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-black text-slate-900 mt-3 mb-3">
              O que os pais estão dizendo
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              A paz na hora de dormir já é realidade em centenas de lares.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                  "Meu filho de 5 anos tinha birra para largar os vídeos do YouTube. Com o Lumikids, ele mesmo escolhe a história da noite e já dorme na terceira página. Foi um divisor de águas na nossa rotina!"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-[#0D9488] font-bold flex items-center justify-center text-sm">
                  MC
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Mariana Costa</div>
                  <div className="text-[0.68rem] text-slate-400">Mãe do Theo (5 anos) • Belo Horizonte</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                  "As ilustrações são lindas demais, lembram os livros clássicos da minha infância. E o fato de ter quizzes no final ajuda muito a conversar sobre honestidade e respeito com eles."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-sm">
                  RS
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Rodrigo Silveira</div>
                  <div className="text-[0.68rem] text-slate-400">Pai da Alice (7 anos) • São Paulo</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-amber-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed mb-4">
                  "Uso a opção de ler em Inglês para estimular o vocabulário das meninas. A voz da narração é suave e a tradução é perfeita. Recomendo para todas as famílias cristãs."
                </p>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  CF
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Camila Ferraz</div>
                  <div className="text-[0.68rem] text-slate-400">Mãe de 2 filhas • Curitiba</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 7. SEÇÃO DE OFERTA E PLANOS (MERCADO PAGO) ═══ */}
      <section id="planos" className="py-20 sm:py-28 px-4 sm:px-8 bg-gradient-to-b from-amber-50/50 via-[#FAF6ED] to-[#FFFDF9] border-t border-amber-900/10">
        <div className="max-w-4xl mx-auto text-center">
          
          <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-300 px-4 py-1.5 rounded-full border border-amber-400 shadow-xs">
            🎉 OFERTA ESPECIAL DE LANÇAMENTO
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-black text-slate-900 mt-4 mb-4">
            Escolha o Plano Ideal para Sua Família
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto mb-12">
            Acesso ilimitado e imediato a todas as 60+ histórias, áudios e quizzes. Menos de R$ 0,66 por dia.
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
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/app/planos"
                  className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm uppercase tracking-wider transition-all text-center block cursor-pointer"
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
                  className="w-full py-5 rounded-2xl bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-base uppercase tracking-wider shadow-lg shadow-teal-800/30 active:scale-95 transition-all text-center block cursor-pointer"
                >
                  GARANTIR ACESSO ANUAL 🚀
                </Link>
                <div className="text-[0.68rem] text-slate-400 font-semibold text-center mt-2.5 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#0D9488]" />
                  <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ═══ 8. PERGUNTAS FREQUENTES (FAQ) ═══ */}
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
                q: "Para quais idades o Lumikids é recomendado?",
                a: "O aplicativo foi desenvolvido para crianças de 2 a 10 anos. Você pode filtrar as histórias por faixa etária (2–4 anos, 5–7 anos e 8–10 anos), com quizzes pedagógicos adaptados para cada nível de compreensão."
              },
              {
                q: "Posso acessar no celular, tablet e computador?",
                a: "Sim! O Lumikids é um Web App moderno e PWA. Você e sua família podem acessar de qualquer celular (iPhone ou Android), tablet, iPad ou navegador de computador com o mesmo login."
              },
              {
                q: "As histórias contêm conteúdo místico ou assustador?",
                a: "Não, zero conteúdo esotérico ou de medo. Todas as histórias são focadas em valores humanos positivos, virtudes morais (honestidade, respeito, generosidade, perdão), ensinamentos bíblicos e amor à família e à natureza."
              },
              {
                q: "Como funciona a garantia de 7 dias?",
                a: "Se por qualquer motivo você ou seus filhos não se adaptarem ao Lumikids dentro dos primeiros 7 dias após a assinatura, basta nos enviar uma mensagem e devolveremos 100% do seu investimento, sem burocracia."
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

      {/* ═══ 9. RODAPÉ INSTITUCIONAL ═══ */}
      <footer className="bg-slate-950 text-white py-12 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <LumikidsLogo size="md" variant="light" />
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-bold">
            <Link href="/login" className="hover:text-white transition-colors">Acessar Conta</Link>
            <a href="#planos" className="hover:text-white transition-colors">Planos & Preços</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              WhatsApp Suporte (31 999180068)
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Lumikids • Desenvolvido com amor para as famílias brasileiras.</p>
          <p>DSM Empreendimentos Digitais</p>
        </div>
      </footer>

      {/* ═══ 10. BOTÃO FLUTUANTE DE WHATSAPP TIRA-DÚVIDAS (Samuel - 31 999180068) ═══ */}
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
