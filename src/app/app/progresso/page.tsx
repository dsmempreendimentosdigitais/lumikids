'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import ProfileCustomizerModal from '@/components/app/ProfileCustomizerModal';
import { AVATAR_OPTIONS, COVER_OPTIONS } from '@/config/profileCustomization';
import { Paintbrush, Sparkles } from 'lucide-react';

export default function ProgressoPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStories: 0,
    weekCount: 0,
    monthCount: 0,
    plan: 'free'
  });
  const [quizStats, setQuizStats] = useState({
    storiesRead: 3,
    correctAnswers: 8,
    streakDays: 3,
  });
  const [loading, setLoading] = useState(true);

  // Estados de Personalização de Perfil (Avatar & Capa)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [userAvatarId, setUserAvatarId] = useState<string>('lion');
  const [userCoverId, setUserCoverId] = useState<string>('night_stars');

  useEffect(() => {
    // Carrega personalização do localStorage
    if (typeof window !== 'undefined' && user?.uid) {
      const savedAvatar = localStorage.getItem(`lumikids_avatar_${user.uid}`);
      const savedCover = localStorage.getItem(`lumikids_cover_${user.uid}`);
      if (savedAvatar) setUserAvatarId(savedAvatar);
      if (savedCover) setUserCoverId(savedCover);
    }
  }, [user]);

  useEffect(() => {
    // Carrega estatísticas de leitura e quiz locais / do usuário
    if (typeof window !== 'undefined' && user?.uid) {
      try {
        const saved = localStorage.getItem(`lumikids_stats_${user.uid}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          setQuizStats({
            storiesRead: parsed.storiesRead || 3,
            correctAnswers: parsed.correctAnswers || 8,
            streakDays: parsed.streak || 3,
          });
        }
      } catch (e) {}
    }
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        // Obter contagem de uso do plano e dados de personalização
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        if (userData?.avatarId) setUserAvatarId(userData.avatarId);
        if (userData?.coverId) setUserCoverId(userData.coverId);
        
        // Obter total de histórias geradas pelo usuário
        const q = query(collection(db, 'stories'), where('generatedForUid', '==', user.uid));
        const snap = await getDocs(q);
        
        setStats({
          totalStories: snap.size,
          weekCount: userData?.aiUsage?.weekCount || 0,
          monthCount: userData?.aiUsage?.monthCount || 0,
          plan: userData?.plan || 'free'
        });
      } catch (err) {
        console.error('Erro ao buscar progresso:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const planName = stats.plan === 'free' ? 'Plano Básico' : stats.plan === 'familia' ? 'Plano Família' : 'Plano Premium';
  const planColor = stats.plan === 'free' ? 'text-gray-500' : 'text-gold-500';

  const currentCover = COVER_OPTIONS.find(c => c.id === userCoverId) || COVER_OPTIONS[0];
  const currentAvatar = AVATAR_OPTIONS.find(a => a.id === userAvatarId) || AVATAR_OPTIONS[0];

  return (
    <div className="p-4 sm:p-6 font-sans bg-[#F8F7F2] text-[#1A1D20] min-h-screen pb-32 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pt-2 mb-4">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Perfil</h1>
        <Link href="/app/configuracoes" className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-xs hover:bg-slate-50 transition-all cursor-pointer" title="Configurações">
          ⚙️
        </Link>
      </div>

      {/* User Info Card com Capa Personalizável & Avatar Interativo */}
      <div className="bg-white rounded-[28px] border border-slate-200/90 overflow-hidden shadow-xs mb-6 relative">
        {/* Banner de Capa */}
        <div 
          className={`h-28 sm:h-32 w-full bg-gradient-to-r ${currentCover.gradient} relative transition-all duration-300 p-3 flex items-start justify-end`}
          style={{ backgroundImage: currentCover.pattern }}
        >
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white text-[0.68rem] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm active:scale-95"
            title="Alterar Capa e Avatar"
          >
            <Paintbrush size={12} />
            <span>Mudar Capa & Avatar</span>
          </button>
        </div>

        {/* Informações do Usuário com Avatar Sobreposto */}
        <div className="px-5 pb-5 pt-0 relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            {/* Avatar Clicável com badge de edição */}
            <div 
              onClick={() => setIsCustomizerOpen(true)}
              className="-mt-12 w-20 h-20 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0 relative group cursor-pointer transition-transform hover:scale-105 active:scale-95"
              title="Clique para trocar seu avatar"
            >
              <div 
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: currentAvatar.svg }}
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-black">
                ✏️
              </div>
            </div>

            <div className="pb-1">
              <h2 className="text-xl font-serif font-black text-slate-900 leading-tight">
                {user?.displayName || 'admin'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#F59E0B] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                  👑 {planName}
                </span>
                <button
                  type="button"
                  onClick={() => setIsCustomizerOpen(true)}
                  className="text-[0.7rem] font-bold text-[#0D9488] hover:underline cursor-pointer"
                >
                  Personalizar
                </button>
              </div>
            </div>
          </div>

          <Link
            href="/app/planos"
            className="sm:mb-1 self-start sm:self-end px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[0.72rem] shadow-xs hover:brightness-105 transition-all flex items-center gap-1.5"
          >
            <Sparkles size={13} />
            <span>Ver Planos</span>
          </Link>
        </div>
      </div>

      {/* Modal de Personalização de Perfil */}
      <ProfileCustomizerModal 
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        user={user}
        currentAvatar={userAvatarId}
        currentCoverId={userCoverId}
        onSaveSuccess={(newAvatarId, newCoverId) => {
          setUserAvatarId(newAvatarId);
          setUserCoverId(newCoverId);
        }}
      />

      {/* Stats Row (Estilo Readmio Image 8) */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">⏳</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Tempo de Leitura</div>
          <div className="text-xl font-bold font-sans text-slate-900">{stats.totalStories * 5} <span className="text-xs text-slate-500 font-normal">min</span></div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">🗓️</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Semanas de Leitura</div>
          <div className="text-xl font-bold font-sans text-slate-900">1</div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 text-center shadow-xs">
          <div className="text-3xl mb-2">📕</div>
          <div className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-wider mb-1">Histórias Lidas</div>
          <div className="text-xl font-bold font-sans text-slate-900">{loading ? '...' : (stats.totalStories || quizStats.storiesRead)}</div>
        </div>
      </div>

      {/* 🏆 DESAFIO DOS 30 DIAS & STREAKS DE RETENÇÃO */}
      <div className="mb-8 bg-gradient-to-br from-amber-500/10 via-amber-100/50 to-teal-50 border-2 border-amber-300 rounded-[28px] p-5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xl shadow-xs">
              🔥
            </div>
            <div>
              <h3 className="font-serif font-black text-slate-900 text-base leading-tight">Desafio dos 30 Dias</h3>
              <p className="text-[0.68rem] text-slate-600 font-semibold">1 história lida por dia para desbloquear histórias bônus!</p>
            </div>
          </div>
          <span className="text-[0.68rem] font-black uppercase px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 shadow-xs">
            {quizStats.storiesRead} / 30 Dias
          </span>
        </div>

        {/* Metas de Desbloqueio */}
        <div className="space-y-3 pt-1">
          {/* Meta 1: 30 histórias + 30 acertos */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            quizStats.storiesRead >= 30 && quizStats.correctAnswers >= 30
              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
              : 'bg-white/80 border-amber-200/80 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black flex items-center gap-1.5">
                <span>🎁 Meta 1: Hábito de Ouro</span>
                <span className="text-[0.65rem] text-[#0D9488] font-bold">(+1 História por Trilha)</span>
              </span>
              <span className="text-[0.68rem] font-bold text-slate-500">
                {Math.min(quizStats.storiesRead, 30)}/30 leituras • {Math.min(quizStats.correctAnswers, 30)}/30 acertos
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-[#0D9488] h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ((quizStats.storiesRead + quizStats.correctAnswers) / 60) * 100)}%` }}
              />
            </div>
          </div>

          {/* Meta 2: 30 histórias + 50 acertos */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            quizStats.storiesRead >= 30 && quizStats.correctAnswers >= 50
              ? 'bg-amber-100 border-amber-400 text-amber-950 shadow-xs'
              : 'bg-white/80 border-amber-200/80 text-slate-800'
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-black flex items-center gap-1.5">
                <span>🏆 Meta 2: Grande Mestre</span>
                <span className="text-[0.65rem] text-amber-700 font-bold">(+2 Histórias por Trilha)</span>
              </span>
              <span className="text-[0.68rem] font-bold text-slate-500">
                {Math.min(quizStats.storiesRead, 30)}/30 leituras • {Math.min(quizStats.correctAnswers, 50)}/50 acertos
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, ((quizStats.storiesRead + quizStats.correctAnswers) / 80) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Álbum do Explorador: Adesivos das Trilhas (Estilo Bible App for Kids) */}
      <div className="mb-8 bg-gradient-to-br from-amber-50 to-teal-50 border-2 border-amber-200/90 rounded-[28px] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📖</span>
            <div>
              <h3 className="font-serif font-bold text-slate-900 text-sm">Álbum de Adesivos & Mundos</h3>
              <p className="text-[0.68rem] text-slate-500 font-medium">Colete um selo dourado ao completar cada trilha</p>
            </div>
          </div>
          <span className="text-[0.65rem] font-black uppercase px-2.5 py-1 rounded-full bg-amber-400 text-amber-950 shadow-xs">
            {stats.totalStories} / 8 Selos
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 pt-2">
          {[
            { id: 'mitologia-grega', emoji: '🏛️', name: 'Olimpo', unlocked: true },
            { id: 'biblia-kids', emoji: '📖', name: 'Bíblia', unlocked: stats.totalStories >= 1 },
            { id: 'mulheres-fortes', emoji: '👑', name: 'Heroínas', unlocked: stats.totalStories >= 2 },
            { id: 'biografias-historicas', emoji: '🏰', name: 'Líderes', unlocked: stats.totalStories >= 3 },
            { id: 'contos-de-herois', emoji: '🛡️', name: 'Fábulas', unlocked: stats.totalStories >= 4 },
            { id: 'inventores-genios', emoji: '🔬', name: 'Oficina', unlocked: stats.totalStories >= 5 },
            { id: 'virtudes-em-acao', emoji: '✨', name: 'Virtudes', unlocked: stats.totalStories >= 6 },
            { id: 'natureza-animais', emoji: '🌿', name: 'Natureza', unlocked: stats.totalStories >= 7 },
          ].map((sticker) => (
            <div 
              key={sticker.id}
              className={`rounded-2xl p-2.5 text-center flex flex-col items-center justify-center transition-all ${
                sticker.unlocked
                  ? 'bg-white border-2 border-amber-300 shadow-xs scale-100'
                  : 'bg-slate-100/70 border border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-1">
                {sticker.emoji}
              </div>
              <span className="text-[0.62rem] font-bold text-slate-800 truncate w-full">
                {sticker.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Seção Conquistas Recentes */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-serif font-bold text-slate-900">Medalhas de Leitura</h3>
          <span className="text-xs font-bold text-[#0D9488]">Todas</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '🏅', title: 'Semana Perfeita' },
            { icon: '🌱', title: 'Primeiros Brotos' },
            { icon: '🌸', title: 'Flor dos Contos' },
            { icon: '✨', title: 'Três Desejos' },
            { icon: '🌳', title: 'Carvalho Mítico' },
            { icon: '📖', title: 'Virador de Páginas' },
            { icon: '📜', title: 'Buscador' },
            { icon: '📚', title: 'Devorador' },
            { icon: '👑', title: 'Mestre dos Contos' },
          ].map((medal, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 text-center shadow-xs flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-amber-200 flex items-center justify-center text-2xl mb-2 shadow-xs">
                {medal.icon}
              </div>
              <span className="text-xs font-bold text-slate-700 leading-tight">{medal.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
