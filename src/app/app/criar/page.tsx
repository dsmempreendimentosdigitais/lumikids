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
    <div className="min-h-screen bg-[#090A0F] text-white font-sans overflow-x-hidden pb-32 relative">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="p-6 relative z-10 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10 mt-4">
          <div className="w-[54px] h-[54px] rounded-[18px] flex items-center justify-center text-[1.5rem] shadow-[0_0_25px_rgba(139,92,246,0.4)]" style={{ background: 'linear-gradient(135deg, #8B5CF6, #3B82F6)' }}>
            ✨
          </div>
          <div>
            <h1 className="text-[2rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 leading-tight drop-shadow-lg">
              Criar Mágica
            </h1>
            <p className="text-purple-200/60 text-sm font-semibold tracking-wide">Inicie uma nova aventura espetacular</p>
          </div>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-7">
            
            <div className="space-y-2">
              <label className="block text-purple-300 font-bold text-sm tracking-wide">NOME DO HERÓI / HEROÍNA</label>
              <input 
                type="text" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-[16px] h-[56px] px-5 font-semibold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                placeholder="Ex: Samuel"
                value={formData.childName}
                onChange={(e) => setFormData({...formData, childName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-purple-300 font-bold text-sm tracking-wide">FAIXA ETÁRIA</label>
              <div className="flex gap-3">
                {['2-4', '5-7', '8-10'].map(age => (
                  <button
                    key={age}
                    type="button"
                    onClick={() => setFormData({...formData, ageGroup: age as any})}
                    className={`flex-1 h-[52px] rounded-[16px] font-bold text-sm transition-all duration-300 ${formData.ageGroup === age ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] border-none' : 'bg-black/30 text-purple-200/50 hover:bg-black/50 border border-white/5'}`}
                  >
                    {age} anos
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-purple-300 font-bold text-sm tracking-wide">TEMA DA AVENTURA</label>
              <input 
                type="text" 
                required
                className="w-full bg-black/40 border border-white/10 rounded-[16px] h-[56px] px-5 font-semibold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all outline-none"
                placeholder="Ex: Viagem espacial com dinossauros"
                value={formData.theme}
                onChange={(e) => setFormData({...formData, theme: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-purple-300 font-bold text-xs tracking-wide">EMOÇÃO INICIAL</label>
                <select 
                  className="w-full bg-black/40 border border-white/10 rounded-[16px] h-[56px] px-5 font-semibold text-white focus:ring-2 focus:ring-purple-500 outline-none appearance-none"
                  value={formData.emotion}
                  onChange={(e) => setFormData({...formData, emotion: e.target.value})}
                >
                  <option value="Alegria" className="bg-[#090A0F]">Alegria ✨</option>
                  <option value="Medo" className="bg-[#090A0F]">Medo 🥺</option>
                  <option value="Tristeza" className="bg-[#090A0F]">Tristeza 😢</option>
                  <option value="Raiva" className="bg-[#090A0F]">Raiva 😠</option>
                  <option value="Ansiedade" className="bg-[#090A0F]">Ansiedade 😰</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-purple-300 font-bold text-xs tracking-wide">VALOR A ENSINAR</label>
                <input 
                  type="text" 
                  className="w-full bg-black/40 border border-white/10 rounded-[16px] h-[56px] px-5 font-semibold text-white placeholder-purple-200/30 focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Ex: Coragem"
                  value={formData.value || ''}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                />
              </div>
            </div>

            <label className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all border border-white/10 ${formData.includeBiblicalValues ? 'bg-purple-900/30' : 'bg-black/30 hover:bg-black/50'}`}>
              <div className={`w-[28px] h-[28px] rounded-[10px] flex items-center justify-center transition-all ${formData.includeBiblicalValues ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]' : 'bg-black/50 border border-white/20'}`}>
                {formData.includeBiblicalValues && <i className="fas fa-check text-xs text-white"></i>}
              </div>
              <span className={`font-bold ${formData.includeBiblicalValues ? 'text-purple-200' : 'text-purple-200/50'}`}>Incluir Princípios Bíblicos</span>
              <input 
                type="checkbox" 
                className="hidden"
                checked={formData.includeBiblicalValues}
                onChange={(e) => setFormData({...formData, includeBiblicalValues: e.target.checked})}
              />
            </label>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 font-bold p-4 rounded-[16px] text-sm flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-red-500"></i>
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-[64px] mt-4 rounded-[24px] font-extrabold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 text-white text-[1.15rem] relative overflow-hidden group"
              style={{ 
                background: loading ? '#4B5563' : 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                boxShadow: loading ? 'none' : '0 10px 30px -10px rgba(139,92,246,0.8)'
              }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-[-100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              {loading ? (
                <span className="animate-pulse relative z-10">Conjurando história... ✨</span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">Gerar Aventura <i className="fas fa-rocket ml-1"></i></span>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl animate-in fade-in slide-in-from-bottom-8 relative mt-8">
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-[0_0_30px_rgba(52,211,153,0.5)] rotate-12">
              <i className="fas fa-check -rotate-12"></i>
            </div>
            
            <h2 className="text-center font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mt-8 mb-4 drop-shadow-md">
              {success.story.title || 'História Criada!'}
            </h2>
            
            {success.audioUrl && (
              <div className="mb-8 bg-black/40 border border-white/10 p-4 rounded-[20px] text-center">
                <span className="block text-xs font-bold text-purple-400 mb-3 uppercase tracking-widest flex items-center justify-center gap-2">
                  <i className="fas fa-headphones"></i> Áudio Mágico
                </span>
                <audio controls className="w-full h-[40px] rounded-full opacity-90 sepia-0 hue-rotate-180 invert">
                  <source src={success.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}

            {/* Páginas da História */}
            {success.story.content?.paragraphs && success.story.content.paragraphs.length > 0 ? (
              <div className="flex flex-col gap-10 mb-10">
                {success.story.content.paragraphs.map((p: any, i: number) => {
                  const img = p.imageUrl || success.story.nanoBananaImageUrl || 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=800&auto=format&fit=crop';
                  return (
                    <div 
                      key={i} 
                      className="relative rounded-[32px] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.4)] group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:-translate-y-2 border border-white/10 bg-black"
                    >
                      {/* Imagem de Fundo */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <img 
                          src={img} 
                          alt={`Página ${i + 1}`} 
                          className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                          onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1514068574489-503a8eb91592?q=80&w=800&auto=format&fit=crop'; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-[#090A0F]/60 to-transparent"></div>
                      </div>

                      {/* Conteúdo */}
                      <div className="relative z-10 p-8 pt-64 flex flex-col justify-end min-h-[480px]">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/20 backdrop-blur-md text-purple-200 text-xs font-bold uppercase tracking-widest mb-4 w-fit border border-purple-500/30">
                          <i className="fas fa-star text-yellow-400"></i> Página {i + 1}
                        </div>
                        <p className="text-white font-bold text-2xl leading-relaxed drop-shadow-[0_4px_4px_rgba(0,0,0,1)]">
                          {p.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                {success.story.nanoBananaImageUrl && (
                  <div className="mb-8 rounded-[32px] overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.2)] border border-white/10">
                    <img src={success.story.nanoBananaImageUrl} alt="Capa" className="w-full h-auto object-cover" />
                  </div>
                )}
                <div className="prose prose-invert max-w-none mb-8 text-gray-300 leading-relaxed text-lg font-medium">
                  {success.story.content?.text.split('\n').map((p: string, i: number) => (
                    <p key={i} className="mb-5">{p}</p>
                  ))}
                </div>
              </>
            )}

            {(success.story.mission || success.story.content?.mission) && (
              <div className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30 p-8 rounded-[32px] shadow-[0_0_40px_rgba(139,92,246,0.15)] mb-10 relative overflow-hidden">
                <div className="absolute -right-10 -top-10 text-[100px] text-purple-500/10 rotate-12 pointer-events-none">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl text-white shadow-lg">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <h3 className="font-black text-2xl text-white tracking-wide">
                    {success.story.mission?.title || 'Missão do Bem'}
                  </h3>
                </div>
                <p className="font-semibold text-purple-200 text-lg leading-relaxed relative z-10">
                  {success.story.mission?.description || success.story.content?.mission}
                </p>
              </div>
            )}

            <button 
              onClick={() => setSuccess(null)}
              className="w-full h-[64px] rounded-[24px] font-extrabold flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 text-[1.1rem]"
            >
              Criar Outra Aventura <i className="fas fa-plus"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
