'use client';

import React, { useState } from 'react';
import { AVATAR_OPTIONS, COVER_OPTIONS, AvatarOption, CoverOption } from '@/config/profileCustomization';
import { X, Check, Sparkles, Image as ImageIcon, Smile, Crown } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { updateProfile } from 'firebase/auth';

interface ProfileCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentAvatar: string;
  currentCoverId: string;
  onSaveSuccess: (newAvatarSvgOrUrl: string, newCoverId: string) => void;
}

export default function ProfileCustomizerModal({
  isOpen,
  onClose,
  user,
  currentAvatar,
  currentCoverId,
  onSaveSuccess,
}: ProfileCustomizerModalProps) {
  const [activeTab, setActiveTab] = useState<'avatar' | 'cover'>('avatar');
  const [avatarCategory, setAvatarCategory] = useState<'todos' | 'animais' | 'herois' | 'aventura'>('todos');
  
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || 'lion');
  const [selectedCover, setSelectedCover] = useState<string>(currentCoverId || 'night_stars');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const filteredAvatars = avatarCategory === 'todos'
    ? AVATAR_OPTIONS
    : AVATAR_OPTIONS.filter(a => a.category === avatarCategory);

  const activeCoverObj = COVER_OPTIONS.find(c => c.id === selectedCover) || COVER_OPTIONS[0];
  const activeAvatarObj = AVATAR_OPTIONS.find(a => a.id === selectedAvatar || a.svg === selectedAvatar) || AVATAR_OPTIONS[0];

  const handleSave = async () => {
    setSaving(true);
    try {
      // Salva no localStorage para carregamento instantâneo
      if (user?.uid) {
        localStorage.setItem(`contosevirtudes_avatar_${user.uid}`, activeAvatarObj.id);
        localStorage.setItem(`contosevirtudes_cover_${user.uid}`, activeCoverObj.id);

        // Salva no documento do usuário no Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          avatarId: activeAvatarObj.id,
          coverId: activeCoverObj.id,
          photoURL: `avatar:${activeAvatarObj.id}`,
          updatedAt: new Date()
        });

        // Atualiza perfil no Firebase Auth
        if (user) {
          try {
            await updateProfile(user, { photoURL: `avatar:${activeAvatarObj.id}` });
          } catch (e) {}
        }
      }

      onSaveSuccess(activeAvatarObj.id, activeCoverObj.id);
      onClose();
    } catch (err) {
      console.error('Erro ao salvar personalização:', err);
      // Salva pelo menos localmente para o usuário não perder a escolha
      onSaveSuccess(activeAvatarObj.id, activeCoverObj.id);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FFFDF9] w-full max-w-lg rounded-[32px] border-2 border-amber-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Topo do Modal com Fechar */}
        <div className="p-4 sm:p-5 border-b border-amber-900/10 flex items-center justify-between bg-amber-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎨</span>
            <h2 className="text-lg sm:text-xl font-serif font-black text-slate-900">
              Personalizar Perfil
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
          >
            <X size={18} />
          </button>
        </div>

        {/* Pré-visualização ao Vivo do Perfil */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-amber-50/30 to-transparent">
          <div className="text-[0.65rem] font-black uppercase tracking-wider text-slate-400 mb-2">
            Pré-visualização ao Vivo
          </div>

          <div className="rounded-2xl overflow-hidden border border-amber-200 shadow-sm relative">
            {/* Banner de Capa */}
            <div 
              className={`h-24 w-full bg-gradient-to-r ${activeCoverObj.gradient} relative transition-all duration-300`}
              style={{ backgroundImage: activeCoverObj.pattern }}
            >
              <span className="absolute top-2 right-3 text-lg opacity-80">
                {activeCoverObj.icon}
              </span>
            </div>

            {/* Avatar sobreposto ao banner */}
            <div className="px-4 pb-3 pt-0 flex items-end gap-3 bg-white relative">
              <div className="-mt-8 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
                <div 
                  className="w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: activeAvatarObj.svg }}
                />
              </div>

              <div className="flex-1 pb-1">
                <div className="text-sm font-bold text-slate-900 font-serif leading-tight">
                  {user?.displayName || 'Leitor Contos & Virtudes'}
                </div>
                <div className="text-[0.65rem] text-[#D97706] font-bold flex items-center gap-1">
                  <Crown size={11} /> Plano Premium
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Abas: Escolher Avatar vs Escolher Capa */}
        <div className="flex border-b border-amber-900/10 px-4 sm:px-5 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('avatar')}
            className={`py-2.5 px-4 text-xs font-black rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'avatar'
                ? 'bg-amber-100/70 text-amber-950 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smile size={15} />
            <span>Escolher Avatar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('cover')}
            className={`py-2.5 px-4 text-xs font-black rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'cover'
                ? 'bg-amber-100/70 text-amber-950 border-b-2 border-amber-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon size={15} />
            <span>Imagem de Capa</span>
          </button>
        </div>

        {/* Conteúdo Rolável da Aba */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {activeTab === 'avatar' ? (
            <div>
              {/* Filtro de Categoria */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
                {[
                  { id: 'todos', label: 'Todos' },
                  { id: 'animais', label: '🦁 Animais Fofos' },
                  { id: 'herois', label: '👑 Heróis & Virtudes' },
                  { id: 'aventura', label: '🚀 Aventureiros' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setAvatarCategory(cat.id as any)}
                    className={`px-3 py-1 rounded-full text-[0.7rem] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      avatarCategory === cat.id
                        ? 'bg-[#0D9488] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Grid de Avatares */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-1">
                {filteredAvatars.map((av) => {
                  const isSelected = selectedAvatar === av.id;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`relative p-2.5 rounded-2xl border-2 transition-all flex flex-col items-center gap-1.5 cursor-pointer text-center ${
                        isSelected
                          ? 'border-[#0D9488] bg-teal-50 ring-2 ring-teal-300 shadow-xs scale-102'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-amber-50/50'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0D9488] text-white flex items-center justify-center text-[0.65rem] shadow-2xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                      <div 
                        className="w-14 h-14 rounded-full overflow-hidden shadow-2xs shrink-0"
                        dangerouslySetInnerHTML={{ __html: av.svg }}
                      />
                      <span className="text-[0.65rem] font-bold text-slate-800 line-clamp-1 leading-tight">
                        {av.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-3">
                Escolha uma capa mágica para dar vida ao topo do seu perfil:
              </p>

              {/* Grid de Capas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COVER_OPTIONS.map((cov) => {
                  const isSelected = selectedCover === cov.id;
                  return (
                    <button
                      key={cov.id}
                      type="button"
                      onClick={() => setSelectedCover(cov.id)}
                      className={`relative rounded-2xl overflow-hidden border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0D9488] ring-2 ring-teal-300 shadow-md scale-101'
                          : 'border-slate-200 hover:border-amber-300 shadow-xs'
                      }`}
                    >
                      <div 
                        className={`h-20 w-full bg-gradient-to-r ${cov.gradient} p-3 flex items-start justify-between relative`}
                        style={{ backgroundImage: cov.pattern }}
                      >
                        <span className="text-xl drop-shadow-sm">{cov.icon}</span>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-white text-[#0D9488] flex items-center justify-center text-[0.65rem] shadow-sm font-black">
                            ✓
                          </div>
                        )}
                      </div>
                      <div className="p-2.5 bg-white">
                        <span className="text-xs font-bold text-slate-900 block leading-tight">
                          {cov.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Salvar */}
        <div className="p-4 sm:p-5 border-t border-amber-900/10 bg-amber-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-600 hover:bg-slate-200/70 transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs sm:text-sm font-black uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <span>Salvando...</span>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Salvar Escolhas</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
