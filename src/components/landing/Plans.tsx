import Link from 'next/link';

export default function Plans() {
  return (
    <section className="land-section section-anchor" id="planos">
      <div className="sec-tag-badge stb-blue">Planos</div>
      <h2>Para cada família, o plano certo</h2>
      <p>Comece grátis. Cresça no ritmo da sua família.</p>
      <div className="plans-grid">
        <div className="plan-card">
          <div className="plan-name">Gratuito</div>
          <div className="plan-price"><span className="pp-amt">0</span></div>
          <div className="plan-desc">Perfeito para conhecer e já ter uma experiência incrível.</div>
          <ul className="plan-feats">
            <li><i className="fas fa-check-circle"></i> História do dia</li>
            <li><i className="fas fa-check-circle"></i> 3 histórias/semana</li>
            <li><i className="fas fa-check-circle"></i> 2 criações IA/semana</li>
            <li><i className="fas fa-check-circle"></i> 1 perfil de criança</li>
            <li className="off"><i className="fas fa-times-circle"></i> Biblioteca ilimitada</li>
          </ul>
          <Link href="/cadastro" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>Começar grátis</Link>
        </div>
        <div className="plan-card">
          <div className="plan-name">Start</div>
          <div className="plan-price"><span className="pp-cur">R$</span><span className="pp-amt">14</span><span className="pp-per">,90/mês</span></div>
          <div className="plan-desc">Mais histórias e acesso livre à biblioteca.</div>
          <ul className="plan-feats">
            <li><i className="fas fa-check-circle"></i> Biblioteca ilimitada</li>
            <li><i className="fas fa-check-circle"></i> Áudio sem limite</li>
            <li><i className="fas fa-check-circle"></i> 2 perfis de criança</li>
            <li><i className="fas fa-check-circle"></i> Sem anúncios</li>
            <li className="off"><i className="fas fa-times-circle"></i> IA ilimitada</li>
          </ul>
          <Link href="/cadastro" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>Assinar</Link>
        </div>
        <div className="plan-card feat-plan">
          <div className="plan-badge">⭐ Mais popular</div>
          <div className="plan-name">Família</div>
          <div className="plan-price"><span className="pp-cur">R$</span><span className="pp-amt">24</span><span className="pp-per">,90/mês</span></div>
          <div className="plan-desc">O plano completo para quem valoriza aprendizado com valores.</div>
          <ul className="plan-feats">
            <li><i className="fas fa-check-circle"></i> 30 criações IA/mês</li>
            <li><i className="fas fa-check-circle"></i> Vozes premium</li>
            <li><i className="fas fa-check-circle"></i> 4 perfis de criança</li>
            <li><i className="fas fa-check-circle"></i> Trilhas por virtudes</li>
            <li><i className="fas fa-check-circle"></i> Relatório dos pais</li>
          </ul>
          <Link href="/cadastro" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>Assinar</Link>
        </div>
        <div className="plan-card">
          <div className="plan-name">Família+</div>
          <div className="plan-price"><span className="pp-cur">R$</span><span className="pp-amt">39</span><span className="pp-per">,90/mês</span></div>
          <div className="plan-desc">Máxima personalização, IA avançada e modo offline.</div>
          <ul className="plan-feats">
            <li><i className="fas fa-check-circle"></i> 100 criações IA/mês</li>
            <li><i className="fas fa-check-circle"></i> Modo offline parcial</li>
            <li><i className="fas fa-check-circle"></i> Packs temáticos mensais</li>
            <li><i className="fas fa-check-circle"></i> Relatório detalhado</li>
            <li className="off"><i className="fas fa-times-circle"></i> Animações exclusivas</li>
          </ul>
          <Link href="/cadastro" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>Assinar</Link>
        </div>
        <div className="plan-card">
          <div className="plan-name">Premium2</div>
          <div className="plan-price"><span className="pp-cur">R$</span><span className="pp-amt">59</span><span className="pp-per">,90/mês</span></div>
          <div className="plan-desc">Experiência máxima: animações, guias para pais e suporte VIP.</div>
          <ul className="plan-feats">
            <li><i className="fas fa-check-circle"></i> Mini animações exclusivas</li>
            <li><i className="fas fa-check-circle"></i> IA quase ilimitada</li>
            <li><i className="fas fa-check-circle"></i> Guias para pais</li>
            <li><i className="fas fa-check-circle"></i> Desafios semanais</li>
            <li><i className="fas fa-check-circle"></i> Prioridade na fila da IA</li>
          </ul>
          <Link href="/cadastro" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: '.82rem' }}>Assinar</Link>
        </div>
      </div>
    </section>
  );
}
