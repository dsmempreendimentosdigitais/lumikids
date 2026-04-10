import Link from 'next/link';

export default function Hero() {
  return (
    <section className="hero-section" id="hero">
      <div className="hero-badge">✦ Lançamento 2025 — IA + Valores + Fé</div>
      <h1>Histórias que <span>iluminam</span> o coração das crianças</h1>
      <p>IA que cria histórias personalizadas com valores, fé cristã e personagens que as crianças amam. De 2 a 10 anos, em qualquer idioma.</p>
      <div className="hero-btns">
        <Link href="/cadastro" className="btn btn-gold btn-lg"><i className="fas fa-play"></i> Começar grátis</Link>
        <Link href="/galeria" className="btn btn-outline btn-lg"><i className="fas fa-book-open"></i> Ver histórias</Link>
      </div>
      <div className="hero-stats">
        <div className="stat-item"><strong>100+</strong><span>histórias</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>8+</strong><span>idiomas</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>2–10</strong><span>anos</span></div>
        <div className="stat-sep"></div>
        <div className="stat-item"><strong>∞</strong><span>criações IA</span></div>
      </div>

      <div className="hero-phone-wrap">
        <div className="phone-frame">
          <div className="app-header" style={{ padding: '28px 16px 56px' }}>
            <div className="header-top">
              <div className="header-logo" style={{ fontSize: '1.05rem' }}>Lumi<em>kids</em></div>
              <div className="header-avatar" style={{ width: '30px', height: '30px', fontSize: '.78rem' }}>S</div>
            </div>
            <div className="header-greeting" style={{ fontSize: '.75rem' }}>Boa noite, Samuel 👋</div>
            <div className="header-title" style={{ fontSize: '1.1rem' }}>O que vamos<br/>ler hoje?</div>
            <div className="age-selector" style={{ marginTop: '10px', gap: '6px' }}>
              <div className="age-pill" style={{ fontSize: '.65rem', padding: '4px 9px' }}>🍼 2–4</div>
              <div className="age-pill active" style={{ fontSize: '.65rem', padding: '4px 9px' }}>📚 5–7</div>
              <div className="age-pill" style={{ fontSize: '.65rem', padding: '4px 9px' }}>🎓 8–10</div>
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
