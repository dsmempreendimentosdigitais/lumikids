'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { dbUser } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (dbUser && dbUser.role !== 'admin') {
      router.push('/app');
      return;
    }

    const fetchUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const uList = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
        setUsers(uList);
      } catch (err: any) {
        console.error(err);
        setError('Erro ao carregar lista de usuários.');
      } finally {
        setLoading(false);
      }
    };

    if (dbUser?.role === 'admin') {
      fetchUsers();
    }
  }, [dbUser, router]);

  const handlePlanChange = async (targetUid: string, newPlan: string) => {
    try {
      await updateDoc(doc(db, 'users', targetUid), {
        plan: newPlan,
        updatedAt: new Date()
      });
      setUsers(prev => prev.map(u => u.uid === targetUid ? { ...u, plan: newPlan } : u));
    } catch (err: any) {
      console.error(err);
      alert('Erro ao atualizar plano do usuário.');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-[#0B0819] text-white min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
        <p className="mt-4 font-bold text-sm text-purple-300">Carregando painel admin...</p>
      </div>
    );
  }

  if (dbUser?.role !== 'admin') return null;

  return (
    <div className="p-6 bg-[#0B0819] text-white min-h-screen pb-36 font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      <div className="relative z-10 max-w-4xl mx-auto pt-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[48px] h-[48px] rounded-[16px] flex items-center justify-center text-white text-[1.4rem] shadow-lg shadow-purple-500/30 border border-purple-400/30 bg-gradient-to-tr from-purple-600 to-indigo-600">
             👑
          </div>
          <div>
            <h1 className="text-[2rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight">Painel Admin</h1>
            <p className="text-purple-200/60 text-xs font-semibold">Gerenciamento de usuários e planos</p>
          </div>
        </div>

        {error && <div className="text-red-400 font-bold bg-red-500/20 border border-red-500/40 p-4 rounded-[16px] text-sm mb-6">{error}</div>}

        <div className="bg-[#150F2D] border border-purple-500/30 rounded-[24px] p-6 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-purple-500/20 text-purple-300 text-sm">
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
                  <tr key={u.uid} className="border-b border-purple-500/10 text-sm hover:bg-purple-900/20 transition-colors">
                    <td className="py-4 px-2 font-bold text-white">{u.displayName || 'Sem nome'}</td>
                    <td className="py-4 px-2 text-purple-200/60">{u.email}</td>
                    <td className="py-4 px-2 text-purple-200/60">
                      {u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-500/30 text-purple-300 border border-purple-500/40' : 'bg-gray-500/20 text-gray-400'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-semibold">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.plan === 'premium2' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <select
                        className="bg-[#1A133A] border border-purple-500/30 text-purple-200 font-bold text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
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
    </div>
  );
}
