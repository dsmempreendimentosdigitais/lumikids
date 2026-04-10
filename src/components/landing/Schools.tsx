import Link from 'next/link';

export default function Schools() {
  return (
    <section className="land-section-dark section-anchor" id="escolas">
      <div className="sec-tag-badge stb-gold">Para Escolas</div>
      <h2>Clube de Leitura Digital para sua escola</h2>
      <p>Trilhas prontas, material para professor e relatórios de engajamento.</p>
      <div className="b2b-grid">
        <div className="b2b-card"><div className="b2b-icon">📋</div><h4>Trilhas mensais prontas</h4><p>4 semanas de conteúdo curado por faixa etária. O professor aplica — o app ensina.</p></div>
        <div className="b2b-card"><div className="b2b-icon">👩‍🏫</div><h4>Material do professor</h4><p>PDF semanal com roteiro, perguntas guia e missões coletivas. Pronto para usar.</p></div>
        <div className="b2b-card"><div className="b2b-icon">📊</div><h4>Relatórios de turma</h4><p>Histórias concluídas, tempo de leitura e missões realizadas. Dados simples e visuais.</p></div>
        <div className="b2b-card"><div className="b2b-icon">🏫</div><h4>Licenças por aluno</h4><p>Preço especial por aluno/mês. Contrato simples, onboarding rápido, suporte dedicado.</p></div>
      </div>
      <div style={{ marginTop: '36px' }}>
        <Link href="/login" className="btn btn-gold btn-lg"><i className="fas fa-school"></i> Falar com nossa equipe</Link>
      </div>
    </section>
  );
}
