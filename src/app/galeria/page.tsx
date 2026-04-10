import React from 'react';
import Link from 'next/link';

const mockStories = [
  { id: 1, title: 'O Pão que Alimentou a Multidão', cat: 'Vida de Jesus', emoji: '🍞', gradient: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)' },
  { id: 2, title: 'A Ovelha Perdida', cat: 'Parábolas', emoji: '🐑', gradient: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)' },
  { id: 3, title: 'A Coragem de Davi', cat: 'Heróis da Fé', emoji: '🪨', gradient: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)' },
  { id: 4, title: 'O Quarto Bagunçado de Léo', cat: 'Comportamento', emoji: '🧸', gradient: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' },
  { id: 5, title: 'A Sementinha Cuidadosa', cat: 'Natureza', emoji: '🌱', gradient: 'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)' },
  { id: 6, title: 'As Cores da Amizade', cat: 'Sentimentos', emoji: '🎨', gradient: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' },
  { id: 7, title: 'O Presente Invisível', cat: 'Gratidão', emoji: '🎁', gradient: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)' },
  { id: 8, title: 'Estrelinhas Corajosas', cat: 'Hora de Dormir', emoji: '🌟', gradient: 'linear-gradient(to top, #09203f 0%, #537895 100%)' },
  { id: 9, title: 'O Rei e o Menino Pobre', cat: 'Humildade', emoji: '👑', gradient: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)' },
  { id: 10, title: 'O Desejo da Borboleta', cat: 'Paciência', emoji: '🦋', gradient: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)' },
];

export default function GaleriaPage() {
  return (
    <div className="min-h-screen bg-[#F0F2FF] font-sans pb-20">
      <nav className="desk-nav sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link href="/" className="desk-logo">
          <div className="dl-icon">✦</div>
          <span className="dl-name">Lumi<em>kids</em></span>
        </Link>
        <div className="desk-cta hidden sm:flex">
          <Link href="/cadastro" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '.85rem' }}>Começar grátis</Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 pt-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-[#3D5AFE] font-extrabold text-sm mb-4 uppercase tracking-wider">Biblioteca Aberta</div>
          <h1 className="text-4xl md:text-5xl font-black text-[#283593] mb-4 tracking-tight">O que vamos ler hoje?</h1>
          <p className="text-[#666] font-semibold text-lg max-w-2xl mx-auto">Explore uma seleção especial das nossas histórias mágicas.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {mockStories.map((story) => (
            <div key={story.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center cursor-pointer hover:-translate-y-1 relative">
              <div 
                className="w-full aspect-square rounded-xl mb-4 flex items-center justify-center text-6xl shadow-inner relative overflow-hidden"
                style={{ background: story.gradient }}
              >
                <span className="relative z-10 group-hover:scale-110 transition-transform duration-300">{story.emoji}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#3D5AFE] tracking-wider mb-1">{story.cat}</span>
              <h3 className="font-extrabold text-[#283593] text-sm leading-snug line-clamp-2">{story.title}</h3>
              
              {/* Overlay Mock */}
              <Link href="/cadastro" className="absolute inset-0 bg-white/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                 <span className="bg-[#3D5AFE] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">Ler agora</span>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center bg-white p-8 rounded-3xl shadow-lg border border-blue-50 max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-[#283593] mb-2">Quer criar as suas próprias?</h2>
          <p className="text-gray-500 mb-6 font-semibold">Desbloqueie infinitas criações com o nome do seu filho.</p>
          <Link href="/cadastro" className="btn btn-gold btn-lg inline-flex"><i className="fas fa-play"></i> Criar conta agora</Link>
        </div>
      </div>
    </div>
  );
}
