export default function Categories() {
  return (
    <section className="land-section-light section-anchor" id="categorias">
      <div className="sec-tag-badge stb-purp">Biblioteca</div>
      <h2>Histórias para cada momento</h2>
      <p style={{ color: '#777', maxWidth: '500px', margin: '0 auto 52px', fontSize: '.96rem', fontWeight: 600, lineHeight: 1.72 }}>
        Categorias ativadas e desativadas pelos pais. Bíblia ativa por padrão.
      </p>

      <div className="cats-grid">

        {/* ATIVAS */}
        <div className="cat-card">
          <div className="cat-emoji ce-blue">✝️</div>
          <h4>Vida de Jesus</h4>
          <div className="cat-count">12 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-blue">📖</div>
          <h4>Bíblia Kids</h4>
          <div className="cat-count">48 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-teal">💤</div>
          <h4>Hora de Dormir</h4>
          <div className="cat-count">28 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-pink">❤️</div>
          <h4>Sentimentos</h4>
          <div className="cat-count">18 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-gold">👩‍🦸</div>
          <h4>Mulheres Fortes</h4>
          <div className="cat-count">15 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-green">🔬</div>
          <h4>Inventores & Gênios</h4>
          <div className="cat-count">20 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        {/* CLÁSSICOS — NOVO */}
        <div className="cat-card" style={{ borderColor: 'var(--gold)', boxShadow: '0 6px 24px rgba(249,168,37,.18)' }}>
          <div className="cat-emoji ce-orange" style={{ position: 'relative' }}>
            📚
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: 'var(--gold)', color: 'var(--blue-dark)', fontSize: '.55rem', fontWeight: 900, padding: '2px 7px', borderRadius: '99px', whiteSpace: 'nowrap' }}>Novo ✨</span>
          </div>
          <h4>Clássicos Infantis</h4>
          <div className="cat-count">24 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-cyan">🌍</div>
          <h4>Países & Culturas</h4>
          <div className="cat-count">30 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        <div className="cat-card">
          <div className="cat-emoji ce-purple">🍼</div>
          <h4>Bebês 2–4 Anos</h4>
          <div className="cat-count">22 histórias</div>
          <span className="cat-status cs-on"><i className="fas fa-check"></i> Ativo</span>
        </div>

        {/* DESATIVADO */}
        <div className="cat-card" style={{ opacity: .75 }}>
          <div className="cat-emoji ce-gray">🏛️</div>
          <h4>Mitologia Grega</h4>
          <div className="cat-count">14 histórias</div>
          <span className="cat-status cs-off"><i className="fas fa-circle"></i> Desativado</span>
        </div>

        {/* CONTROLE PARENTAL */}
        <div className="cat-card" style={{ opacity: .85 }}>
          <div className="cat-emoji ce-gold">🌸</div>
          <h4>Budismo & Hinduísmo</h4>
          <div className="cat-count">8 histórias</div>
          <span className="cat-status cs-parent"><i className="fas fa-shield"></i> Controle parental</span>
        </div>

        {/* CTA CRIAR COM IA */}
        <div className="cat-card" style={{ background: 'linear-gradient(135deg,var(--blue),var(--blue2))', border: 'none', cursor: 'pointer' }}>
          <div className="cat-emoji" style={{ background: 'rgba(255,255,255,.15)' }}>🤖</div>
          <h4 style={{ color: '#fff' }}>Criar com IA</h4>
          <div className="cat-count" style={{ color: 'rgba(255,255,255,.7)' }}>Histórias únicas</div>
          <span className="cat-status" style={{ background: 'var(--gold)', color: 'var(--blue-dark)' }}>✦ Personalizar</span>
        </div>

      </div>
    </section>
  );
}
