export default function Testimonials() {
  return (
    <section className="land-section section-anchor" id="depoimentos">
      <div className="sec-tag-badge stb-blue">Depoimentos</div>
      <h2>O que as famílias dizem</h2>
      <p>Experiências reais de pais e educadores.</p>
      <div className="testi-grid">
        <div className="testi-card">
          <div className="testi-quote">"</div>
          <div className="testi-stars">★★★★★</div>
          <p>Minha filha de 7 anos pediu para ouvir o Bom Samaritano três vezes. No dia seguinte ela ajudou a vizinha sem eu pedir. Não tem preço.</p>
          <div className="testi-author"><div className="ta-av" style={{ background: 'var(--blue)' }}>A</div><div><div className="ta-name">Ana Paula M.</div><div className="ta-role">Mãe · Belo Horizonte, MG</div></div></div>
        </div>
        <div className="testi-card">
          <div className="testi-quote">"</div>
          <div className="testi-stars">★★★★★</div>
          <p>Usei nas minhas turmas do 2º ano. As crianças ficam em silêncio absoluto. As perguntas depois geram conversas incríveis sobre valores.</p>
          <div className="testi-author"><div className="ta-av" style={{ background: 'var(--green)' }}>C</div><div><div className="ta-name">Prof. Carla R.</div><div className="ta-role">Professora · Escola Particular · SP</div></div></div>
        </div>
        <div className="testi-card">
          <div className="testi-quote">"</div>
          <div className="testi-stars">★★★★★</div>
          <p>Meu filho tem TDAH e nunca focava em livros. Com o Lumikids ele termina as histórias, faz as missões e ainda pede mais. Transformador.</p>
          <div className="testi-author"><div className="ta-av" style={{ background: 'var(--coral)' }}>R</div><div><div className="ta-name">Ricardo F.</div><div className="ta-role">Pai · Goiânia, GO</div></div></div>
        </div>
      </div>
    </section>
  );
}
