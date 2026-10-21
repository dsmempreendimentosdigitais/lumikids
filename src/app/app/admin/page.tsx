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
      <div className="p-8 text-center bg-[#F8F7F2] text-slate-900 min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0D9488] mx-auto"></div>
        <p className="mt-4 font-bold text-sm text-slate-600">Carregando painel admin...</p>
      </div>
    );
  }

  if (dbUser?.role !== 'admin') return null;

  return (
    <div className="p-6 bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-36 font-sans overflow-x-hidden relative">
      <div className="relative z-10 max-w-4xl mx-auto pt-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-[48px] h-[48px] rounded-[16px] flex items-center justify-center text-amber-700 text-[1.4rem] shadow-xs border border-amber-200 bg-amber-50">
             👑
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Painel Admin</h1>
            <p className="text-slate-500 text-xs font-semibold">Gerenciamento de usuários e planos</p>
          </div>
        </div>

        {error && <div className="text-red-600 font-bold bg-red-50 border border-red-200 p-4 rounded-[16px] text-sm mb-6">{error}</div>}

        <div className="bg-white border border-slate-200/90 rounded-[24px] p-6 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
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
                  <tr key={u.uid} className="border-b border-slate-100 text-sm hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-900">{u.displayName || 'Sem nome'}</td>
                    <td className="py-4 px-2 text-slate-500">{u.email}</td>
                    <td className="py-4 px-2 text-slate-500">
                      {u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="py-4 px-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role || 'user'}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-semibold">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.plan === 'premium2' ? 'bg-teal-100 text-[#0D9488] border border-teal-300' : 'bg-slate-100 text-slate-600'}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-right">
                      <select
                        className="bg-[#FAF9F5] border border-slate-300 text-slate-800 font-bold text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
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
