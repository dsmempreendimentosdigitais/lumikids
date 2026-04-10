import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="pwa-strip">
        <h2>📲 Instale como app — sem loja, sem taxas</h2>
        <p>Funciona como um app de verdade no seu celular em lumikids.app</p>
        <div className="pwa-steps-row">
          <div className="pwa-step"><div className="pwa-num">1</div> Abra lumikids.app</div>
          <div className="pwa-step"><div className="pwa-num">2</div> Toque em "Compartilhar"</div>
          <div className="pwa-step"><div className="pwa-num">3</div> "Adicionar à tela inicial"</div>
          <div className="pwa-step"><div className="pwa-num">4</div> Pronto! ✨</div>
        </div>
        <Link href="/login" className="btn btn-primary btn-lg"><i className="fas fa-download"></i> Instalar o Lumikids</Link>
      </div>

      <footer>
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-logo-row">
              <div className="fl-ic">✦</div>
              <span className="fl-nm">Lumi<em>kids</em></span>
            </div>
            <p>Histórias que iluminam o coração — com fé, valores e inteligência artificial.</p>
            <div style={{ marginTop: '8px', fontSize: '.74rem', opacity: .5, fontWeight: 700 }}>🌐 lumikids.app</div>
            <div className="foot-social">
              <a href="#" className="soc-ic"><i className="fab fa-instagram"></i></a>
              <a href="#" className="soc-ic"><i className="fab fa-tiktok"></i></a>
              <a href="#" className="soc-ic"><i className="fab fa-youtube"></i></a>
              <a href="#" className="soc-ic"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Produto</h5>
            <ul>
              <li><a href="#">Funcionalidades</a></li>
              <li><a href="#">Planos</a></li>
              <li><a href="#">Para Escolas</a></li>
              <li><a href="#">Instalar PWA</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Histórias</h5>
            <ul>
              <li><a href="#">Bíblia Kids</a></li>
              <li><a href="#">Clássicos Infantis</a></li>
              <li><a href="#">2–4 Anos</a></li>
              <li><a href="#">Criar com IA</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="#">Sobre nós</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contato</a></li>
              <li><a href="#">Privacidade</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© 2025 Lumikids · lumikids.app · Feito com ❤️ em Belo Horizonte, Brasil.</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
