'use client';
import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Sparkles } from 'lucide-react';

declare global {
  interface Window {
    pwaPrompt: any;
  }
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detecta se já está instalado como PWA Standalone
    const isRunningStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
    setIsStandalone(isRunningStandalone);

    // Detecta se é dispositivo Apple iOS (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isAppleDevice);

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      window.pwaPrompt = e;
      setShowBanner(true);
      window.dispatchEvent(new Event('pwa-ready'));
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Se for iOS e não estiver instalado, mostra o banner após 2 segundos
    if (isAppleDevice && !isRunningStandalone) {
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }

    // Se não for standalone, mostra o banner informativo
    if (!isRunningStandalone) {
      setShowBanner(true);
    }

    const handleOpenModal = () => setShowIosModal(true);
    window.addEventListener('open-pwa-modal', handleOpenModal);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('open-pwa-modal', handleOpenModal);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosModal(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install: ${outcome}`);
      setDeferredPrompt(null);
      window.pwaPrompt = null;
      setShowBanner(false);
    } else {
      // Se não disparou o evento nativo (ex: Chrome sem prompt direto), mostra instruções
      setShowIosModal(true);
    }
  };

  if (isStandalone) return null;

  return (
    <>
      {/* Floating PWA Install Pill Banner */}
      {showBanner && (
        <div className="fixed bottom-20 md:bottom-24 left-4 right-4 max-w-md mx-auto z-50 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="bg-[#150F2D]/95 backdrop-blur-xl border-2 border-purple-500/40 rounded-[24px] p-4 shadow-[0_10px_35px_rgba(139,92,246,0.35)] flex items-center justify-between gap-3 text-white">
            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-[0_0_15px_rgba(217,70,239,0.5)] flex-shrink-0">
              <Smartphone size={24} />
            </div>
            
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-0.5">
                <h4 className="font-extrabold text-sm text-white font-serif">Baixar App no Celular</h4>
                <Sparkles size={14} className="text-yellow-300 animate-pulse" />
              </div>
              <p className="text-purple-200/70 text-[0.68rem] font-semibold leading-tight">
                Salvar Lumikids no seu Celular ou Tablet!
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-black text-xs px-4 py-2.5 rounded-full shadow-md shadow-purple-500/30 flex items-center gap-1.5 transition-all whitespace-nowrap active:scale-95"
              >
                <Download size={14} /> Instalar
              </button>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-purple-300/50 hover:text-white p-1 transition-colors"
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS / Manual Install Guide Modal */}
      {showIosModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-[#150F2D] border border-purple-500/40 rounded-[32px] p-6 max-w-md w-full text-white shadow-2xl relative">
            <button 
              onClick={() => setShowIosModal(false)}
              className="absolute top-5 right-5 text-purple-300/60 hover:text-white p-1"
            >
              <X size={22} />
            </button>

            <div className="w-14 h-14 rounded-[20px] bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-2xl mb-4 shadow-[0_0_20px_rgba(217,70,239,0.5)] mx-auto">
              <Download size={28} />
            </div>

            <h3 className="text-center font-serif font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-2">
              Instalar no iPhone / Android
            </h3>
            <p className="text-center text-purple-200/70 text-xs font-semibold mb-6">
              Siga os passos abaixo para ter o ícone do Lumikids direto na tela inicial do seu aparelho:
            </p>

            <div className="space-y-4 bg-purple-950/40 border border-purple-500/20 rounded-[24px] p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-600/40 text-purple-300 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/30">
                  1
                </div>
                <div className="text-xs text-purple-100 font-medium">
                  {isIos ? (
                    <>Toque no botão <strong>Compartilhar</strong> <Share size={14} className="inline text-blue-400 mx-1" /> na barra do navegador Safari.</>
                  ) : (
                    <>Abra o menu do navegador (os <strong>3 pontinhos</strong> no canto superior).</>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-600/40 text-purple-300 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/30">
                  2
                </div>
                <div className="text-xs text-purple-100 font-medium">
                  Role as opções e toque em <strong>"Adicionar à Tela de Início"</strong> <PlusSquare size={14} className="inline text-pink-400 mx-1" /> ou <strong>"Instalar Aplicativo"</strong>.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-purple-600/40 text-purple-300 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5 border border-purple-500/30">
                  3
                </div>
                <div className="text-xs text-purple-100 font-medium">
                  Toque em <strong>"Adicionar"</strong> no canto superior direito. Pronto! O Lumikids estará salvo no seu celular! ✨
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosModal(false)}
              className="w-full h-[50px] rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-sm shadow-lg shadow-purple-500/30 hover:opacity-90 transition-opacity"
            >
              Entendido! 👍
            </button>
          </div>
        </div>
      )}
    </>
  );
}
