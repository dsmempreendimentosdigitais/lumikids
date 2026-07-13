'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, dbUser, loading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (loading) return;
    
    // Se não for admin, redirecionar
    if (!user || dbUser?.role !== 'admin') {
      router.replace('/app');
      return;
    }

    fetchUsers();
  }, [user, dbUser, loading, router]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao carregar usuários');
      setUsers(data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handlePlanChange = async (targetUid: string, newPlan: string) => {
    try {
      if (!user) return;
      const token = await user.getIdToken();
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ targetUid, plan: newPlan })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao atualizar plano');
      
      // Atualizar estado local
      setUsers(users.map(u => u.uid === targetUid ? { ...u, plan: newPlan } : u));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || isLoadingUsers) {
    return <div className="p-8 text-center text-[#283593] font-bold">Carregando painel admin...</div>;
  }

  if (dbUser?.role !== 'admin') return null; // Redirecionando...

  return (
    <div className="p-6 bg-[#F0F2FF] min-h-screen pb-32 font-sans overflow-x-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-white text-[1.2rem] shadow-lg shadow-blue-500/30" style={{ background: 'linear-gradient(135deg, #1A237E, #3949AB)' }}>
           👑
        </div>
        <div>
          <h1 className="text-[1.8rem] font-black text-[#1A237E] leading-tight">Painel Admin</h1>
          <p className="text-[#666] text-sm font-semibold">Gerenciamento de usuários e planos</p>
        </div>
      </div>

      {error && <div className="text-red-500 font-bold bg-red-50 p-4 rounded-[16px] text-sm mb-6">{error}</div>}

      <div className="bg-white rounded-[24px] p-6 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[#3949AB] text-sm">
                <th className="pb-3 font-bold px-2">Nome</th>
                <th className="pb-3 font-bold px-2">E-mail</th>
                <th className="pb-3 font-bold px-2">Data Cadastro</th>
                <th className="pb-3 font-bold px-2">Role</th>
                <th className="pb-3 font-bold px-2">Plano Atual</th>
                <th className="pb-3 font-bold px-2 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.uid} className="border-b border-gray-50 text-sm hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2 font-bold text-[#333]">{u.displayName || 'Sem nome'}</td>
                  <td className="py-4 px-2 text-gray-500">{u.email}</td>
                  <td className="py-4 px-2 text-gray-500">
                    {u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString('pt-BR') : '-'}
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="py-4 px-2 font-semibold">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.plan === 'premium2' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <select
                      className="bg-[#F0F2FF] border-none text-[#283593] font-bold text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
                      value={u.plan || 'free'}
                      onChange={(e) => handlePlanChange(u.uid, e.target.value)}
                    >
                      <option value="free">Free</option>
                      <option value="start">Start (Ilimitado temp)</option>
                      <option value="familia">Família (30/mês)</option>
                      <option value="familia_plus">Família Plus (100/mês)</option>
                      <option value="premium2">Premium2 (Ilimitado)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
