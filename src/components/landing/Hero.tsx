'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Smartphone, Sparkles, BookOpen, Play } from 'lucide-react';

export default function Hero() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handlePwaReady = () => setCanInstall(true);
    if (typeof window !== 'undefined' && window.pwaPrompt) {
      setCanInstall(true);
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('pwa-ready', handlePwaReady);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pwa-ready', handlePwaReady);
      }
    };
  }, []);

  const handleInstallClick = () => {
    if (typeof window !== 'undefined' && window.pwaPrompt) {
      window.pwaPrompt.prompt();
      window.pwaPrompt.userChoice.then(() => {
        window.pwaPrompt = null;
        setCanInstall(false);
      });
    } else {
      // Dispara o modal de instruções PWA
      window.dispatchEvent(new CustomEvent('open-pwa-modal'));
    }
  };

  return (
    <section className="hero-section" id="hero">
      <div className="hero-badge">✦ Lançamento 2025 — Histórias Mágicas + Valores + Fé</div>
      <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight mb-4 drop-shadow-lg">
        Histórias que <span>iluminam</span> o coração das crianças
      </h1>
      <p className="text-purple-200/80 text-sm md:text-base max-w-xl mx-auto mb-6">
        IA que cria histórias infantis personalizadas com ilustrações 3D estilo Pixar, fé cristã e valores morais. De 2 a 14 anos, no celular e tablet!
      </p>

      <div className="hero-btns flex flex-wrap items-center justify-center gap-3 mb-8">
        <Link href="/cadastro" className="btn btn-gold btn-lg flex items-center gap-2">
          <Play size={18} /> Começar grátis
        </Link>
        <Link href="/login" className="btn btn-outline btn-lg flex items-center gap-2">
          <BookOpen size={18} /> Acessar Minha Conta
        </Link>
        <button 
          onClick={handleInstallClick} 
          className="btn btn-lg flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold shadow-lg shadow-purple-500/30 border border-purple-400/30 hover:scale-105 transition-transform"
        >
          <Smartphone size={18} /> Baixar App PWA
        </button>
      </div>

      <div className="hero-stats">
        <div className="stat-item"><strong>100+</strong><span>histórias</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>8+</strong><span>idiomas</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>2–14</strong><span>anos</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>3D</strong><span>Pixar IA</span></div>
      </div>

      <div className="hero-phone-wrap mt-8">
        <div className="phone-frame shadow-[0_0_50px_rgba(139,92,246,0.3)] border border-purple-500/30">
          <div className="app-header" style={{ padding: '28px 16px 56px' }}>
            <div className="header-top">
              <div className="header-logo" style={{ fontSize: '1.05rem' }}>Lumi<em>kids</em></div>
              <div className="header-avatar" style={{ width: '30px', height: '30px', fontSize: '.78rem' }}>S</div>
            </div>
            <div className="header-greeting" style={{ fontSize: '.75rem' }}>Boa noite, Explorador 👋</div>
            <div className="header-title" style={{ fontSize: '1.1rem' }}>O que vamos<br/>ler hoje?</div>
            <div className="age-selector" style={{ marginTop: '10px', gap: '6px' }}>
              <div className="age-pill" style={{ fontSize: '.65rem', padding: '4px 9px' }}>🍼 2–4</div>
              <div className="age-pill active" style={{ fontSize: '.65rem', padding: '4px 9px' }}>📚 5–7</div>
              <div className="age-pill" style={{ fontSize: '.65rem', padding: '4px 9px' }}>🎓 8–10</div>
              <div className="age-pill" style={{ fontSize: '.65rem', padding: '4px 9px' }}>🗡️ 11–14</div>
            </div>
          </div>
          <div style={{ padding: '0 11px 14px', marginTop: '-38px', position: 'relative', zIndex: 2 }}>
            <div className="story-day-card" style={{ padding: '13px', marginBottom: '11px' }}>
              <div className="sdc-tag" style={{ fontSize: '.58rem', padding: '3px 9px' }}>✦ História do dia</div>
              <div className="sdc-title" style={{ fontSize: '.82rem', marginBottom: '6px' }}>O Pão que Alimentou a Multidão</div>
              <div className="sdc-meta" style={{ fontSize: '.6rem', marginBottom: '10px' }}><span>📖 Bíblia</span><span className="dot">•</span><span>5 min</span></div>
              <button className="sdc-play" style={{ fontSize: '.68rem', padding: '7px 13px' }}>
                <div className="play-circle" style={{ width: '17px', height: '17px', fontSize: '.52rem' }}><i className="fas fa-play"></i></div>
                Ouvir agora
              </button>
            </div>
            <div style={{ fontSize: '.6rem', fontWeight: 900, color: 'var(--blue-dark)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '9px' }}>Coleções</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '7px' }}>
              <div className="col-card" style={{ padding: '9px 6px' }}><div className="col-icon ci-blue" style={{ width: '30px', height: '30px', borderRadius: '9px', fontSize: '.9rem', marginBottom: '5px' }}>✝️</div><h4 style={{ fontSize: '.58rem' }}>Vida de Jesus</h4><span style={{ fontSize: '.52rem' }}>12</span></div>
              <div className="col-card" style={{ padding: '9px 6px' }}><div className="col-icon ci-teal" style={{ width: '30px', height: '30px', borderRadius: '9px', fontSize: '.9rem', marginBottom: '5px' }}>💤</div><h4 style={{ fontSize: '.58rem' }}>Dormir</h4><span style={{ fontSize: '.52rem' }}>28</span></div>
              <div className="col-card" style={{ padding: '9px 6px' }}><div className="col-icon ci-orange" style={{ width: '30px', height: '30px', borderRadius: '9px', fontSize: '.9rem', marginBottom: '5px' }}>📚</div><h4 style={{ fontSize: '.58rem' }}>Clássicos</h4><span style={{ fontSize: '.52rem' }}>24</span></div>
            </div>
          </div>
        </div>
      </div>

      <a className="scroll-down-arrow" href="#features">
        <span>Explorar</span>
        <div className="arrow-circle"><i className="fas fa-chevron-down"></i></div>
      </a>
    </section>
  );
}
