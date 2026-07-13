'use client';
import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    pwaPrompt: any;
  }
}

export default function PwaInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      // Impede o Chrome de mostrar o prompt automático
      e.preventDefault();
      // Guarda o evento para disparar depois
      setDeferredPrompt(e);
      window.pwaPrompt = e;
      window.dispatchEvent(new Event('pwa-ready'));
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostra o prompt nativo
    deferredPrompt.prompt();

    // Espera pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // Limpamos o prompt
    setDeferredPrompt(null);
    window.pwaPrompt = null;
    setShowInstallBanner(false);
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[100] animate-bounce-subtle">
      <div className="bg-white rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-2 border-[#3D5AFE] flex items-center gap-4">
        <div className="w-12 h-12 bg-[#3D5AFE] rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0 shadow-lg">
          ✦
        </div>
        <div className="flex-1">
          <h4 className="text-[#283593] font-black text-sm leading-tight">Instalar Lumikids</h4>
          <p className="text-gray-500 text-[0.7rem] font-bold">Acesse suas histórias direto da tela inicial!</p>
        </div>
        <button 
          onClick={handleInstallClick}
          className="bg-[#3D5AFE] text-white text-xs font-black px-4 py-2.5 rounded-full shadow-md active:scale-95 transition-all"
        >
          Instalar
        </button>
        <button 
          onClick={() => setShowInstallBanner(false)}
          className="text-gray-400 p-1"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
}
