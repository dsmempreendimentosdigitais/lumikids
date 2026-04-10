'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GenerateStoryRequest } from '@/types/ai';

export default function CriarPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<any>(null);

  const [formData, setFormData] = useState<GenerateStoryRequest>({
    childName: '',
    ageGroup: '5-7',
    theme: '',
    emotion: 'Alegria',
    value: '',
    character: '',
    language: 'pt-BR',
    includeBiblicalValues: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Você precisa estar logado para criar histórias.');
      return;
    }
    setError('');
    setLoading(true);
    setSuccess(null);

    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/ai/gerar-historia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erro ao gerar história.');
      
      setSuccess(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-[#F0F2FF] min-h-screen pb-32 font-sans overflow-x-hidden">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center text-white text-[1.2rem] shadow-lg shadow-blue-500/30" style={{ background: 'linear-gradient(135deg, #3D5AFE, #5C6BC0)' }}>
           ✨
        </div>
        <div>
          <h1 className="text-[1.8rem] font-black text-[#283593] leading-tight">Criar com IA</h1>
          <p className="text-[#666] text-sm font-semibold">Crie uma nova aventura mágica</p>
        </div>
      </div>

      {!success ? (
        <form onSubmit={handleSubmit} className="bg-white rounded-[24px] p-6 shadow-[0_12px_40px_rgba(61,90,254,.08)] space-y-6">
          
          <div>
            <label className="block text-[#283593] font-bold mb-2">Nome da criança</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#F5F7FF] border-none rounded-[16px] h-[54px] px-4 font-semibold text-[#333] focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Ex: Samuel"
              value={formData.childName}
              onChange={(e) => setFormData({...formData, childName: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-[#283593] font-bold mb-2">Faixa Etária</label>
            <div className="flex gap-2">
              {['2-4', '5-7', '8-10'].map(age => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setFormData({...formData, ageGroup: age as any})}
                  className={`flex-1 h-[48px] rounded-[16px] font-bold text-sm transition-all ${formData.ageGroup === age ? 'bg-[#3D5AFE] text-white shadow-md shadow-blue-500/30' : 'bg-[#e8eaf6] text-[#666]'}`}
                >
                  {age} anos
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[#283593] font-bold mb-2">Tema da História</label>
            <input 
              type="text" 
              required
              className="w-full bg-[#F5F7FF] border-none rounded-[16px] h-[54px] px-4 font-semibold text-[#333] focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Ex: Uma viagem espacial"
              value={formData.theme}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#283593] font-bold mb-2 text-sm">Emoção Atual</label>
              <select 
                className="w-full bg-[#F5F7FF] border-none rounded-[16px] h-[54px] px-4 font-semibold text-[#333] outline-none"
                value={formData.emotion}
                onChange={(e) => setFormData({...formData, emotion: e.target.value})}
              >
                <option value="Alegria">Alegria</option>
                <option value="Medo">Medo</option>
                <option value="Tristeza">Tristeza</option>
                <option value="Raiva">Raiva</option>
                <option value="Ansiedade">Ansiedade</option>
              </select>
            </div>
            <div>
              <label className="block text-[#283593] font-bold mb-2 text-sm">Valor a ensinar</label>
              <input 
                type="text" 
                className="w-full bg-[#F5F7FF] border-none rounded-[16px] h-[54px] px-4 font-semibold text-[#333] outline-none"
                placeholder="Ex: Coragem"
                value={formData.value || ''}
                onChange={(e) => setFormData({...formData, value: e.target.value})}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-[16px] cursor-pointer transition-all border-2 border-transparent hover:border-blue-100" style={{ background: formData.includeBiblicalValues ? '#E8EAF6' : '#F5F7FF' }}>
            <div className={`w-[26px] h-[26px] rounded-[8px] flex items-center justify-center transition-all ${formData.includeBiblicalValues ? 'bg-[#3D5AFE] text-white' : 'bg-white border-2 border-[#D1D5DB]'}`}>
              {formData.includeBiblicalValues && <i className="fas fa-check text-xs"></i>}
            </div>
            <span className="font-bold text-[#283593]">Incluir Princípios Bíblicos</span>
            <input 
              type="checkbox" 
              className="hidden"
              checked={formData.includeBiblicalValues}
              onChange={(e) => setFormData({...formData, includeBiblicalValues: e.target.checked})}
            />
          </label>

          {error && <div className="text-red-500 font-bold bg-red-50 p-4 rounded-[16px] text-sm">{error}</div>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full h-[60px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] transition-all hover:-translate-y-[2px] text-white text-[1.1rem]"
            style={{ 
              background: loading ? '#9FA8DA' : 'linear-gradient(135deg, #3D5AFE, #5C6BC0)',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(61,90,254,.35)'
            }}
          >
            {loading ? (
              <span className="animate-pulse">Gerando mágica... ✨</span>
            ) : (
              <>Criar História <i className="fas fa-wand-magic-sparkles"></i></>
            )}
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-[24px] p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 relative">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
            <i className="fas fa-check"></i>
          </div>
          <h2 className="text-center font-black text-2xl text-[#283593] mt-6 mb-2">{success.story.title || 'História Criada!'}</h2>
          
          {success.audioUrl && (
            <div className="mb-6 bg-[#F0F2FF] p-4 rounded-[16px] text-center">
              <span className="block text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Áudio Disponível 🎧</span>
              <audio controls className="w-full h-[40px] rounded-full">
                <source src={success.audioUrl} type="audio/mpeg" />
              </audio>
            </div>
          )}

          <div className="prose prose-blue max-w-none mb-6 text-[#444] leading-relaxed">
            {success.story.content?.text.split('\n').map((p: string, i: number) => (
              <p key={i} className="mb-4">{p}</p>
            ))}
            <hr className="my-6 border-blue-100" />
            <h3 className="font-extrabold text-blue-800 flex items-center gap-2"><i className="fas fa-gem text-gold-500"></i> Missão do Bem</h3>
            <p className="bg-blue-50 p-4 rounded-[16px] text-blue-900 font-medium">{success.story.content?.mission}</p>
          </div>

          <button 
            onClick={() => setSuccess(null)}
            className="w-full h-[52px] rounded-[99px] font-extrabold flex items-center justify-center gap-[10px] bg-[#E8EAF6] text-[#3D5AFE] transition-all hover:bg-[#D1C4E9]"
          >
            Criar outra história
          </button>
        </div>
      )}
    </div>
  );
}
