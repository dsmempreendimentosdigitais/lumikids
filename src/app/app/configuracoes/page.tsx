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
    <div className="p-6 font-sans bg-[#F0F2FF] min-h-screen pb-32">
      <h1 className="text-[1.8rem] font-black text-[#283593] mb-6 leading-tight">Configurações</h1>

      <div className="bg-white rounded-[24px] p-6 shadow-sm mb-6 flex items-center gap-4">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden shadow-sm border-2 border-slate-100 flex-shrink-0 flex items-center justify-center bg-[#E8EAF6] text-[#3D5AFE] text-2xl font-bold font-sans">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Avatar" className="w-[100%] h-[100%] object-cover" />
          ) : (
            userInitials
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-xl font-extrabold text-[#283593] truncate">{userName}</h2>
          <p className="text-[#666] text-xs font-semibold truncate">{user?.email || 'Nenhum email cadastrado'}</p>
        </div>
      </div>

      <div className="bg-white rounded-[24px] p-4 shadow-sm space-y-2 mb-6">
        <div className="p-3 text-sm font-bold text-[#283593]">Configurações da Conta</div>
        
        <Link href="/app/planos" className="flex items-center justify-between p-4 rounded-[16px] hover:bg-gray-50 transition-colors w-full cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
              <i className="fas fa-crown"></i>
            </div>
            <div className="text-left">
              <div className="font-bold text-[#333]">Meu Plano</div>
              <div className="text-xs text-gray-500">Plano Gratuito • Upgrade</div>
            </div>
          </div>
          <i className="fas fa-chevron-right text-gray-300"></i>
        </Link>
        
        <div className="flex items-center justify-between p-4 rounded-[16px] hover:bg-gray-50 transition-colors w-full cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <i className="fas fa-user-edit"></i>
            </div>
            <div className="text-left">
              <div className="font-bold text-[#333]">Editar Perfil</div>
              <div className="text-xs text-gray-500">Alterar nome ou foto</div>
            </div>
          </div>
          <i className="fas fa-chevron-right text-gray-300"></i>
        </div>

      </div>

      <div className="flex justify-center mt-8">
        <button 
          onClick={handleLogout}
          className="bg-red-50 text-red-600 font-extrabold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-red-100 transition-colors w-full justify-center"
        >
          <i className="fas fa-sign-out-alt"></i> Sair da Conta
        </button>
      </div>

      <div className="text-center text-xs font-semibold text-gray-400 mt-8">
        Lumikids App v1.0.0
      </div>
    </div>
  );
}
