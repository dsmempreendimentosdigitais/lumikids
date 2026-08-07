'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ConfigPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const userName = user?.displayName || 'Aventureiro';
  const userInitials = userName.charAt(0).toUpperCase();

  return (
    <div className="p-6 font-sans bg-[#0B0819] text-white min-h-screen pb-36 relative overflow-x-hidden">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      <div className="relative z-10 max-w-2xl mx-auto pt-4">
        <h1 className="text-[2rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 mb-6 leading-tight drop-shadow-md">Perfil & Configurações</h1>

        <div className="bg-[#150F2D] border border-purple-500/30 rounded-[28px] p-6 shadow-lg mb-6 flex items-center gap-4">
          <div className="w-[64px] h-[64px] rounded-full overflow-hidden shadow-[0_0_15px_rgba(139,92,246,0.5)] border-2 border-purple-400 flex-shrink-0 flex items-center justify-center bg-gradient-to-tr from-purple-600 to-blue-600 text-white text-2xl font-bold font-sans">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-[100%] h-[100%] object-cover" />
            ) : (
              userInitials
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-xl font-extrabold text-white truncate font-serif">{userName}</h2>
            <p className="text-purple-200/60 text-xs font-semibold truncate">{user?.email || 'Nenhum email cadastrado'}</p>
          </div>
        </div>

        <div className="bg-[#150F2D] border border-purple-500/20 rounded-[28px] p-4 shadow-lg space-y-2 mb-8">
          <div className="p-3 text-xs font-black text-purple-300 uppercase tracking-widest">Configurações da Conta</div>
          
          <Link href="/app/planos" className="flex items-center justify-between p-4 rounded-[20px] hover:bg-purple-900/30 transition-colors w-full cursor-pointer border border-transparent hover:border-purple-500/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 flex items-center justify-center">
                <i className="fas fa-crown"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm">Meu Plano</div>
                <div className="text-xs text-purple-200/60 font-medium">Plano Gratuito • Fazer Upgrade</div>
              </div>
            </div>
            <i className="fas fa-chevron-right text-purple-400/50"></i>
          </Link>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-modal'))}
            className="flex items-center justify-between p-4 rounded-[20px] hover:bg-purple-900/30 transition-colors w-full cursor-pointer border border-transparent hover:border-purple-500/30 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 flex items-center justify-center text-base">
                📲
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-sm">Instalar no Celular / Tablet</div>
                <div className="text-xs text-purple-200/60 font-medium">Salvar ícone na tela inicial (PWA)</div>
              </div>
            </div>
            <i className="fas fa-download text-pink-400/70 text-xs"></i>
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogout}
            className="bg-red-500/20 border border-red-500/40 text-red-300 font-extrabold px-6 py-4 rounded-full flex items-center gap-2 hover:bg-red-500/30 transition-colors w-full justify-center text-sm shadow-md"
          >
            <i className="fas fa-sign-out-alt"></i> Sair da Conta
          </button>
        </div>

        <div className="text-center text-xs font-semibold text-purple-300/40 mt-8">
          Lumikids App v1.0.0 • Mágico Neon 🌌
        </div>
      </div>
    </div>
  );
}
