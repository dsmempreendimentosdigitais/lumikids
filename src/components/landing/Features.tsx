import Link from 'next/link';

export default function Features() {
  return (
    <section className="land-section section-anchor" id="features">
      <div className="sec-tag-badge stb-blue">Funcionalidades</div>
      <h2>Tudo que uma criança precisa para crescer bem</h2>
      <p>Tecnologia moderna a serviço dos valores mais importantes da vida.</p>
      <div className="feat-grid">
        <Link href="/app/historias?cat=bebes-2-4" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-p">🍼</div><h3>Para 2–4 anos também</h3><p>Histórias curtas com narração suave. Pais leem junto com seus bebês em missões de carinho diárias.</p></Link>
        <Link href="/cadastro" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-g">🤖</div><h3>IA Criadora de Histórias</h3><p>Crie histórias com o nome da criança, tema e emoção — em segundos, em qualquer idioma.</p></Link>
        <Link href="/galeria" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-b">🎙️</div><h3>Narração Multilíngue</h3><p>Vozes naturais em 8+ idiomas com leitura sincronizada estilo karaokê.</p></Link>
        <Link href="/galeria" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-c">🎮</div><h3>Histórias Interativas</h3><p>A criança faz escolhas que mudam a história. Engajamento real com desenvolvimento de empatia.</p></Link>
        <Link href="/app/historias?cat=vida-de-jesus" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-g">✝️</div><h3>Bíblia em Destaque</h3><p>Vida de Jesus, parábolas e muito mais — ativos por padrão e adaptados para cada faixa etária.</p></Link>
        <Link href="/app/configuracoes" className="feat-card block" style={{textDecoration:'none'}}><div className="fci fci-gr">👨‍👩‍👧</div><h3>Controle Parental</h3><p>Ative e desative categorias com PIN. Relatório de progresso e tempo de tela controlado.</p></Link>
      </div>
    </section>
  );
}
