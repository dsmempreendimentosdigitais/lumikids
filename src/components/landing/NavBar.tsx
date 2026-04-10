import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="desk-nav">
      <a href="#" className="desk-logo">
        <div className="dl-icon">✦</div>
        <span className="dl-name">Lumi<em>kids</em></span>
      </a>
      <ul className="desk-links">
        <li><a href="#features">Funcionalidades</a></li>
        <li><a href="#categorias">Histórias</a></li>
        <li><a href="#planos">Planos</a></li>
        <li><a href="#escolas">Escolas</a></li>
      </ul>
      <div className="desk-cta">
        <Link href="/login" className="btn btn-outline" style={{ padding: '9px 20px', fontSize: '.85rem' }}>Entrar</Link>
        <Link href="/cadastro" className="btn btn-primary" style={{ padding: '9px 20px', fontSize: '.85rem' }}>Começar grátis</Link>
      </div>
    </nav>
  );
}
