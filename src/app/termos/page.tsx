import React from 'react';
import Link from 'next/link';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { ArrowLeft, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Termos de Uso | Lumikids',
  description: 'Termos e Condições de Uso da plataforma e aplicativo educativo Lumikids.',
};

export default function TermosPage() {
  const whatsappUrl = "https://wa.me/5531999180068?text=Ol%C3%A1!%20Tenho%20uma%20d%C3%BAvida%20sobre%20os%20Termos%20do%20Lumikids.";

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A1D20] font-sans antialiased selection:bg-amber-200 selection:text-amber-950">
      
      {/* Header Simples */}
      <header className="sticky top-0 z-50 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-amber-900/10 px-4 sm:px-8 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <LumikidsLogo size="sm" />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#0D9488] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Voltar para o Início</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#0D9488] text-xs font-black uppercase tracking-wider mb-3">
            <FileText size={14} />
            <span>Transparência & Confiança</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 mb-3">
            Termos e Condições de Uso
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Última atualização: Novembro de 2026 • DSM Empreendimentos Digitais (Lumikids)
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-8 text-slate-700">
          
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">1.</span> Visão Geral e Identificação
            </h2>
            <p>
              Estes Termos de Uso regulam o acesso e a utilização do serviço digital <strong>Lumikids</strong> (disponível através do domínio <code>lumikids.app.br</code> e seus aplicativos correlatos), de propriedade e gerido por <strong>DSM Empreendimentos Digitais</strong>.
            </p>
            <p className="mt-2">
              Ao criar uma conta, navegar ou assinar qualquer plano no Lumikids, o responsável legal declara ter lido, compreendido e concordado integralmente com estes termos, bem como com a nossa Política de Privacidade.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">2.</span> Natureza do Serviço e Conteúdo Educativo
            </h2>
            <p>
              O <strong>Lumikids</strong> é uma plataforma de leitura interativa infantil, com acervo de histórias ilustradas no estilo clássico aquarela, narrações em áudio relaxante, quizzes pedagógicos por faixa etária e ferramentas de incentivo ao hábito de leitura (como o Desafio dos 30 Dias e Álbum de Conquistas).
            </p>
            <p className="mt-2">
              O conteúdo é estritamente planejado para nutrir virtudes humanas e morais (como honestidade, respeito, generosidade, perdão e perseverança), lições históricas e narrativas inspiradoras, <strong>sem qualquer conteúdo de teor violento, esotérico nocivo ou hiperestimulante</strong>.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">3.</span> Assinatura, Cobrança e Acesso Imediato
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                <strong>Planos Disponíveis:</strong> Oferecemos opções de assinatura mensal e anual com desconto, conforme tabela de preços vigente na página de Planos.
              </li>
              <li>
                <strong>Processamento Seguro:</strong> Todas as transações financeiras (PIX ou Cartão de Crédito) são intermediadas pelo <strong>Mercado Pago</strong>, com criptografia ponta a ponta e total conformidade com padrões de segurança bancária PCI-DSS. O Lumikids não armazena dados de cartão de crédito.
              </li>
              <li>
                <strong>Liberação Instantânea:</strong> O acesso total a todas as histórias, áudios e quizzes é liberado imediatamente após a confirmação do pagamento.
              </li>
              <li>
                <strong>Renovação Automática:</strong> As assinaturas contam com renovação automática periódica para conveniência da família, podendo ser canceladas a qualquer momento antes do próximo ciclo de faturamento.
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">4.</span> Garantia Incondicional de 7 Dias e Cancelamento
            </h2>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-950 font-medium mb-3 flex items-start gap-3">
              <ShieldCheck size={22} className="text-[#0D9488] shrink-0 mt-0.5" />
              <div>
                <strong>Direito de Arrependimento (Art. 49 do CDC):</strong> Garantimos devolução integral de 100% do valor pago caso você solicite o cancelamento em até 7 (sete) dias corridos a partir da contratação inicial, sem qualquer burocracia ou taxa retida.
              </div>
            </div>
            <p>
              Para solicitar o cancelamento ou estorno, basta enviar uma mensagem pelo WhatsApp oficial de suporte <strong>(31) 99918-0068</strong> ou pelo painel do usuário. Após os 7 dias, o cancelamento interrompe cobranças futuras e o acesso permanece ativo até o término do período já pago.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">5.</span> Supervisão Parental e Segurança Infantil
            </h2>
            <p>
              O Lumikids foi desenvolvido para ser utilizado sob a mediação ou consentimento dos pais ou responsáveis legais. A plataforma é um ambiente <strong>100% livre de anúncios comerciais</strong>, sem links externos para redes sociais e com travas parentais para acesso a áreas financeiras.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">6.</span> Propriedade Intelectual
            </h2>
            <p>
              Todas as marcas, ilustrações, narrativas, composições sonoras, quizzes e códigos pertencem exclusivamente a <strong>DSM Empreendimentos Digitais</strong> ou foram devidamente licenciados. É expressamente proibida a cópia, reprodução, distribuição comercial, engenharia reversa ou modificação do material sem autorização prévia por escrito.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">7.</span> Contato e Atendimento ao Cliente
            </h2>
            <p>
              Para dúvidas, suporte técnico, dúvidas de faturamento ou feedback, nosso canal direto está à disposição:
            </p>
            <div className="mt-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-slate-800 text-sm font-semibold flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span>WhatsApp de Atendimento Humanizado: </span>
                <strong className="text-slate-900">(31) 99918-0068</strong>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BA5A] transition-colors"
              >
                Falar pelo WhatsApp
              </a>
            </div>
          </section>

        </div>

      </main>

      {/* Footer Mínimo */}
      <footer className="border-t border-amber-900/10 py-8 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Lumikids • DSM Empreendimentos Digitais. Todos os direitos reservados.</p>
      </footer>

    </div>
  );
}
