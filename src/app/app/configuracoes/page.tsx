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
    <div className="p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-36 relative overflow-x-hidden">
      <div className="relative z-10 max-w-2xl mx-auto pt-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-6 leading-tight">Perfil & Configurações</h1>

        <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-xs mb-6 flex items-center gap-4">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center bg-[#0D9488] text-white text-2xl font-bold font-sans shadow-xs">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              userInitials
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="text-lg font-serif font-bold text-slate-900 truncate">{userName}</h2>
            <p className="text-slate-500 text-xs font-medium truncate">{user?.email || 'Nenhum email cadastrado'}</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-[24px] p-4 shadow-xs space-y-2 mb-8">
          <div className="p-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Configurações da Conta</div>
          
          <Link href="/app/planos" className="flex items-center justify-between p-4 rounded-[18px] hover:bg-slate-50 transition-colors w-full cursor-pointer border border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200 flex items-center justify-center">
                <i className="fas fa-crown"></i>
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">Meu Plano</div>
                <div className="text-xs text-slate-500 font-medium">Plano Gratuito • Fazer Upgrade</div>
              </div>
            </div>
            <i className="fas fa-chevron-right text-slate-300"></i>
          </Link>
          
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-pwa-modal'))}
            className="flex items-center justify-between p-4 rounded-[18px] hover:bg-slate-50 transition-colors w-full cursor-pointer border border-slate-100 text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#0D9488] border border-teal-200 flex items-center justify-center text-base">
                📲
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 text-sm">Instalar no Celular / Tablet</div>
                <div className="text-xs text-slate-500 font-medium">Salvar ícone na tela inicial (PWA)</div>
              </div>
            </div>
            <i className="fas fa-download text-slate-300 text-xs"></i>
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={handleLogout}
            className="bg-red-50 border border-red-200 text-red-600 font-bold px-6 py-4 rounded-full flex items-center gap-2 hover:bg-red-100 transition-colors w-full justify-center text-sm shadow-xs"
          >
            <i className="fas fa-sign-out-alt"></i> Sair da Conta
          </button>
        </div>

        <div className="text-center text-xs font-semibold text-slate-400 mt-8">
          Lumikids App v1.0.0 📖
        </div>
      </div>
    </div>
  );
}
