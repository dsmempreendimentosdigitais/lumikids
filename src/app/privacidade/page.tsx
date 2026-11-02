import React from 'react';
import Link from 'next/link';
import LumikidsLogo from '@/components/ui/LumikidsLogo';
import { ArrowLeft, Shield, Lock, EyeOff, UserCheck, HeartHandshake } from 'lucide-react';

export const metadata = {
  title: 'Política de Privacidade & LGPD Infantil | Lumikids',
  description: 'Compromisso com a proteção integral da privacidade das crianças e das famílias no Lumikids.',
};

export default function PrivacidadePage() {
  const whatsappUrl = "https://wa.me/5531999180068?text=Ol%C3%A1!%20Gostaria%20de%20falar%20sobre%20a%20pol%C3%ADtica%20de%20privacidade%20do%20Lumikids.";

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#1A1D20] font-sans antialiased selection:bg-amber-200 selection:text-amber-950">
      
      {/* Header */}
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black uppercase tracking-wider mb-3">
            <Shield size={14} className="text-emerald-600" />
            <span>Proteção Integral da Criança & LGPD</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 mb-3">
            Política de Privacidade e Segurança
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm">
            Em total conformidade com o Artigo 14 da LGPD (Lei 13.709/2018) • DSM Empreendimentos Digitais
          </p>
        </div>

        {/* Destaque de Segurança */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-white border border-emerald-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <EyeOff size={20} />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm mb-1">Zero Publicidade</h3>
            <p className="text-xs text-slate-600">Não exibimos anúncios e nunca vendemos seus dados para anunciantes terceiros.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-teal-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-[#0D9488] flex items-center justify-center mb-3">
              <Lock size={20} />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm mb-1">Criptografia Forte</h3>
            <p className="text-xs text-slate-600">Servidores seguros na Google Cloud (Firebase) com criptografia em trânsito e em repouso.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <UserCheck size={20} />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-sm mb-1">Controle dos Pais</h3>
            <p className="text-xs text-slate-600">Você tem autonomia total para acessar, editar ou excluir seus dados quando quiser.</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-8 text-slate-700">
          
          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">1.</span> Nosso Compromisso Ético com a Família
            </h2>
            <p>
              No <strong>Lumikids</strong>, acreditamos que a infância deve ser preservada. Ao contrário de plataformas de vídeos e redes sociais gratuitas que monetizam a atenção das crianças por meio de algoritmos viciantes e coleta de dados comportamentais, o Lumikids é um <strong>ambiente digital protegido</strong>.
            </p>
            <p className="mt-2">
              Tratamos os dados de crianças exclusivamente no seu <strong>melhor interesse</strong>, atendendo com rigor ao <strong>Artigo 14 da Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD)</strong>.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">2.</span> Quais Dados Coletamos e Por Que
            </h2>
            <p>
              Coletamos apenas as informações estritamente necessárias para o funcionamento pedagógico e a segurança da conta:
            </p>
            <ul className="space-y-2 list-disc pl-5 mt-2">
              <li>
                <strong>Dados do Responsável:</strong> Nome e endereço de e-mail (utilizados para autenticação segura e comunicação de faturamento).
              </li>
              <li>
                <strong>Perfil da Criança (Opcional):</strong> Primeiro nome ou apelido e faixa etária recomendada (2–4, 5–7 ou 8–10 anos) para filtrar adequadamente os quizzes e o vocabulário.
              </li>
              <li>
                <strong>Progresso Educativo:</strong> Histórias concluídas, tempo estimado de leitura e adesivos desbloqueados, armazenados no dispositivo e no banco para exibir a medalha e o progresso do Desafio dos 30 Dias.
              </li>
              <li>
                <strong>Dados de Pagamento:</strong> Processados diretamente em ambiente seguro pelo Mercado Pago. O Lumikids <em>não armazena</em> números de cartão de crédito nem códigos CVV.
              </li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">3.</span> Consentimento Parental e Trava de Segurança
            </h2>
            <p>
              O cadastro e o pagamento no Lumikids devem ser realizados exclusivamente por maiores de 18 anos. Implementamos travas parentais e proteção por PIN para alterações de planos, configurações sensíveis ou contato com suporte, garantindo que a criança utilize o aplicativo com total serenidade.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">4.</span> Não Compartilhamento e Zero Rastreamento Comercial
            </h2>
            <p>
              Nós <strong>nunca comercializamos, alugamos ou compartilhamos</strong> informações pessoais de nossos usuários mirins ou responsáveis com corretores de dados, empresas de publicidade ou terceiros com fins lucrativos.
            </p>
            <p className="mt-2">
              Nossos prestadores de serviço de infraestrutura (Google Firebase para banco de dados e hospedagem; Mercado Pago para cobrança) operam sob rígidos contratos de confidencialidade e segurança cibernética.
            </p>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">5.</span> Seus Direitos (Acesso, Retificação e Exclusão)
            </h2>
            <p>
              Conforme previsto pela LGPD, o titular da conta pode a qualquer momento:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 mt-2">
              <li>Confirmar a existência de tratamento de dados;</li>
              <li>Acessar seus dados e histórico de leitura;</li>
              <li>Corrigir dados incompletos ou inexatos;</li>
              <li>Solicitar a exclusão definitiva da sua conta e de todos os dados associados.</li>
            </ul>
          </section>

          <section className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-200/90 shadow-xs">
            <h2 className="text-xl font-serif font-black text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-[#0D9488]">6.</span> Contato do Encarregado de Dados (DPO)
            </h2>
            <p>
              Para qualquer dúvida ou solicitação referente à privacidade e proteção de dados de seus filhos, entre em contato diretamente com o nosso responsável:
            </p>
            <div className="mt-3 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-slate-800 text-sm font-semibold flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <p className="text-xs text-[#0D9488] uppercase font-black tracking-wider">Atendimento LGPD Lumikids</p>
                <p className="text-slate-900 font-bold">DSM Empreendimentos Digitais</p>
                <p className="text-slate-600 text-xs">WhatsApp: (31) 99918-0068 • Belo Horizonte / MG</p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs hover:bg-[#20BA5A] transition-colors"
              >
                Falar com Encarregado
              </a>
            </div>
          </section>

        </div>

      </main>

      {/* Footer Mínimo */}
      <footer className="border-t border-amber-900/10 py-8 px-4 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Lumikids • DSM Empreendimentos Digitais. Protegendo a infância com amor.</p>
      </footer>

    </div>
  );
}
