'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // 1. Detectar se já está rodando em modo PWA / Standalone
    const isStandaloneMode = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    
    setIsStandalone(isStandaloneMode);

    if (isStandaloneMode) {
      return; // Se já está instalado, nunca mostra o banner
    }

    // 2. Detectar se é dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Capturar o evento nativo 'beforeinstallprompt' do Chrome / Android / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Se for iOS e não estiver em standalone, mostra o banner após 3 segundos
    if (isIosDevice && !isStandaloneMode) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
      setShowBanner(false);
    } else {
      // Se não disparou o evento nativo (ex: Safari no iOS ou navegador que precisa de guia), abre instruções
      setShowIosModal(true);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* ═══ Floating PWA Install Pill Banner (Estilo Contos & Virtudes) ═══ */}
      {showBanner && (
        <aside 
          aria-label="Instalar Aplicativo"
          className="fixed bottom-24 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-24 max-w-sm sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom duration-500"
        >
          <div className="bg-[#FFFDF7]/98 backdrop-blur-xl border-2 border-amber-300 rounded-[28px] p-3.5 sm:p-4 shadow-[0_16px_40px_rgba(45,33,20,0.15)] flex items-center justify-between gap-3 text-slate-900">
            {/* Ícone Estrelinha Dourada */}
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 p-0.5 shadow-md flex items-center justify-center shrink-0">
              <img 
                src="/icons/lumikids-star-logo.svg" 
                alt="Contos & Virtudes Ícone" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="font-serif font-black text-sm text-slate-900 leading-tight">Instalar Aplicativo</h4>
                <Sparkles size={13} className="text-amber-500" />
              </div>
              <p className="text-slate-600 text-[0.68rem] font-semibold leading-tight line-clamp-1">
                Acesse direto da tela do seu celular!
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-xs px-3.5 sm:px-4 py-2 rounded-full shadow-md shadow-teal-800/20 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95 cursor-pointer"
              >
                <Download size={13} />
                <span>Instalar</span>
              </button>
              
              <button
                type="button"
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 transition-colors cursor-pointer"
                aria-label="Fechar aviso de instalação"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ═══ Modal Guia Passo a Passo (iPhone / Android) ═══ */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#FFFDF7] border-2 border-amber-300 rounded-[32px] p-6 sm:p-7 max-w-md w-full text-slate-900 shadow-2xl relative">
            <button 
              type="button"
              onClick={() => setShowIosModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 cursor-pointer"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-2xl mb-4 shadow-sm mx-auto">
              ⭐
            </div>

            <h3 className="text-center font-serif font-black text-xl text-slate-900 mb-1">
              Instalar Contos & Virtudes
            </h3>
            <p className="text-center text-slate-600 text-xs font-semibold mb-5">
              Siga os 3 passos para adicionar o app à sua tela inicial:
            </p>

            <div className="space-y-3.5 bg-amber-50/70 border border-amber-200 rounded-[24px] p-4 mb-6 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  {isIos ? (
                    <>Toque no botão <strong>Compartilhar</strong> <Share size={13} className="inline text-[#0D9488] mx-1" /> na barra inferior do Safari.</>
                  ) : (
                    <>Abra o menu do navegador (os <strong>3 pontinhos</strong> no canto superior).</>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  Role a lista e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare size={13} className="inline text-amber-700 mx-1" /> ou <strong>"Instalar aplicativo"</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#0D9488] text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-slate-700 font-medium leading-relaxed">
                  Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O app fica na sua tela principal! ✨
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-4 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-teal-900/20 transition-all cursor-pointer"
            >
              Entendido! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
