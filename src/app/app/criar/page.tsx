'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GenerateStoryRequest } from '@/types/ai';
import { Sparkles, Wand2, Castle, Moon } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0B0819] text-white font-sans overflow-x-hidden pb-32 relative">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.2), transparent 60%)' }}></div>
      <div className="fixed top-[10%] left-[10%] w-1 h-1 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse"></div>
      <div className="fixed top-[30%] right-[15%] w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_15px_rgba(216,180,254,0.8)] animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-[60%] left-[20%] w-1.5 h-1.5 bg-blue-300 rounded-full shadow-[0_0_12px_rgba(147,197,253,0.8)] animate-pulse" style={{ animationDelay: '0.5s' }}></div>

      <div className="p-6 relative z-10 max-w-lg md:max-w-xl mx-auto min-h-[calc(100vh-110px)] flex flex-col justify-between py-4 pb-28">
        
        {/* Title */}
        <div className="flex items-center justify-center gap-2 mb-6 mt-4">
          <h1 className="text-[2.4rem] md:text-[2.8rem] font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-200 to-blue-200 leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
            Criar História
          </h1>
          <Sparkles className="text-yellow-200 w-8 h-8 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)]" />
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4 md:space-y-6">
            
            {/* Field 1: Nome */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 flex items-center gap-5 backdrop-blur-xl">
                <div className="text-purple-300 drop-shadow-[0_0_10px_rgba(216,180,254,0.6)]">
                  <Wand2 size={36} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <label className="block text-white font-bold text-sm mb-1">1. Nome da Criança</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#1A133A] border border-purple-500/30 rounded-[12px] h-[44px] px-4 text-white placeholder-purple-200/30 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="Ex: Leo"
                    value={formData.childName}
                    onChange={(e) => setFormData({...formData, childName: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Field 2: Idade */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 flex items-center gap-5 backdrop-blur-xl">
                <div className="text-blue-300 font-black text-[2.6rem] leading-none drop-shadow-[0_0_15px_rgba(147,197,253,0.6)]" style={{ fontFamily: 'sans-serif' }}>
                  {formData.ageGroup === '2-4' ? '3' : formData.ageGroup === '5-7' ? '7' : formData.ageGroup === '8-10' ? '9' : '12'}
                </div>
                <div className="flex-1">
                  <label className="block text-white font-bold text-sm mb-1">2. Idade</label>
                  <select 
                    className="w-full bg-[#1A133A] border border-blue-500/30 rounded-[12px] h-[44px] px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value as any})}
                  >
                    <option value="2-4">2 a 4 anos</option>
                    <option value="5-7">5 a 7 anos</option>
                    <option value="8-10">8 a 10 anos</option>
                    <option value="11-14">11 a 14 anos</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Field 3: Tema */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 flex items-center gap-5 backdrop-blur-xl">
                <div className="text-cyan-300 drop-shadow-[0_0_10px_rgba(103,232,249,0.6)]">
                  <Castle size={38} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <label className="block text-white font-bold text-sm mb-1">3. Tema da Aventura</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#1A133A] border border-cyan-500/30 rounded-[12px] h-[44px] px-4 text-white placeholder-cyan-200/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    placeholder="Ex: Floresta Mágica"
                    value={formData.theme}
                    onChange={(e) => setFormData({...formData, theme: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Field 4: Emoção */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-orange-400 rounded-[28px] opacity-75 blur-[2px] transition duration-300 group-hover:opacity-100"></div>
              <div className="relative bg-[#150F2D] border border-white/10 rounded-[26px] p-4 md:p-5 flex items-center gap-5 backdrop-blur-xl">
                <div className="text-yellow-200 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]">
                  <Moon size={38} fill="currentColor" strokeWidth={1} />
                </div>
                <div className="flex-1">
                  <label className="block text-white font-bold text-sm mb-2">4. Emoção da História</label>
                  <div className="flex flex-wrap gap-2">
                    {['Feliz', 'Curioso', 'Valente', 'Engraçado'].map(em => (
                      <button
                        key={em}
                        type="button"
                        onClick={() => setFormData({...formData, emotion: em})}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          formData.emotion === em 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' 
                          : 'bg-[#1A133A] text-purple-200/70 border border-purple-500/20'
                        }`}
                      >
                        {em}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 font-bold p-4 rounded-[16px] text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="submit"
                disabled={loading}
                className="relative w-full group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-[8px] opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                <div className="relative w-full h-[60px] md:h-[64px] bg-[#150F2D] rounded-full border-2 border-transparent flex items-center justify-center overflow-hidden" style={{ backgroundClip: 'padding-box' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-blue-500/20"></div>
                  {loading ? (
                    <span className="text-white font-extrabold text-xl relative z-10 animate-pulse">Criando Magia... ✨</span>
                  ) : (
                    <span className="text-white font-extrabold text-[1.2rem] md:text-[1.3rem] relative z-10 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">Criar História Mágica!</span>
                  )}
                </div>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-[#150F2D] border border-purple-500/30 rounded-[32px] p-6 shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-in fade-in relative mt-8">
            <h2 className="text-center font-black text-3xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-blue-400 mt-2 mb-6 drop-shadow-md">
              {success.story.title || 'História Criada!'}
            </h2>
            
            {success.audioUrl && (
              <div className="mb-8 bg-black/40 border border-white/10 p-4 rounded-[20px] text-center">
                <span className="block text-xs font-bold text-purple-400 mb-3 uppercase tracking-widest">
                  🎙️ Áudio Mágico
                </span>
                <audio controls className="w-full h-[40px] rounded-full">
                  <source src={success.audioUrl} type="audio/mpeg" />
                </audio>
              </div>
            )}

            {success.story.content?.paragraphs && success.story.content.paragraphs.length > 0 ? (
              <div className="flex flex-col gap-10 mb-10">
                {success.story.content.paragraphs.map((p: any, i: number) => {
                  const img = p.imageUrl || success.story.nanoBananaImageUrl;
                  return (
                    <div key={i} className="relative rounded-[24px] overflow-hidden border border-purple-500/30 bg-black">
                      <div className="absolute inset-0 w-full h-full">
                        <img 
                          src={img} 
                          alt={`Página ${i + 1}`} 
                          className="w-full h-full object-cover opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0819] via-[#0B0819]/80 to-transparent"></div>
                      </div>
                      <div className="relative z-10 p-6 pt-64 flex flex-col justify-end min-h-[480px]">
                        <p className="text-white font-bold text-xl leading-relaxed drop-shadow-lg">
                          {p.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none mb-8 text-purple-100 text-lg">
                {success.story.content?.text}
              </div>
            )}

            <button 
              onClick={() => setSuccess(null)}
              className="w-full h-[60px] rounded-full font-extrabold flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 text-lg"
            >
              Criar Outra <Sparkles size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
