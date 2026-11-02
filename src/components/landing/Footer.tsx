import Link from 'next/link';

export default function Footer() {
  return (
    <>
      <div className="pwa-strip">
        <h2>📲 Instale como app — sem loja, sem taxas</h2>
        <p>Funciona como um app de verdade no seu celular em contosevirtudes.com.br</p>
        <div className="pwa-steps-row">
          <div className="pwa-step"><div className="pwa-num">1</div> Abra contosevirtudes.com.br</div>
          <div className="pwa-step"><div className="pwa-num">2</div> Toque em "Compartilhar"</div>
          <div className="pwa-step"><div className="pwa-num">3</div> "Adicionar à tela inicial"</div>
          <div className="pwa-step"><div className="pwa-num">4</div> Pronto! ✨</div>
        </div>
        <Link href="/login" className="btn btn-primary btn-lg"><i className="fas fa-download"></i> Instalar o Contos & Virtudes</Link>
      </div>

      <footer>
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="foot-logo-row">
              <div className="fl-ic">✦</div>
              <span className="fl-nm">Contos &<em> Virtudes</em></span>
            </div>
            <p>Histórias clássicas com valores, fé e sabedoria para toda a família.</p>
            <div style={{ marginTop: '8px', fontSize: '.74rem', opacity: .5, fontWeight: 700 }}>🌐 contosevirtudes.com.br</div>
            <div className="foot-social">
              <a href="#" className="soc-ic"><i className="fab fa-instagram"></i></a>
              <a href="#" className="soc-ic"><i className="fab fa-tiktok"></i></a>
              <a href="#" className="soc-ic"><i className="fab fa-youtube"></i></a>
              <a href="https://wa.me/5531999180068" target="_blank" rel="noopener noreferrer" className="soc-ic"><i className="fab fa-whatsapp"></i></a>
            </div>
          </div>
          <div className="foot-col">
            <h5>Produto</h5>
            <ul>
              <li><a href="/#como-funciona">Funcionalidades</a></li>
              <li><a href="/#planos">Planos</a></li>
              <li><a href="/termos">Termos de Uso</a></li>
              <li><a href="/privacidade">Privacidade & LGPD</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Histórias</h5>
            <ul>
              <li><a href="/app/historias">Bíblia Kids</a></li>
              <li><a href="/app/historias">Heroínas da História</a></li>
              <li><a href="/app/historias">Fábulas Clássicas</a></li>
              <li><a href="/app/historias">Grandes Líderes</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Empresa</h5>
            <ul>
              <li><a href="/#missao">Sobre nós</a></li>
              <li><a href="https://wa.me/5531999180068">Contato WhatsApp</a></li>
              <li><a href="/privacidade">Privacidade</a></li>
              <li><a href="/termos">Termos</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <p>© {new Date().getFullYear()} Contos & Virtudes · contosevirtudes.com.br · DSM Empreendimentos Digitais</p>
          <p>Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  );
}
