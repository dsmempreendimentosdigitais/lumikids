'use client';
import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const ageData = {
  '2-4':  { title: 'O Leãozinho Corajoso', meta: '🍼 Bebês<span class="dot">•</span>3 min<span class="dot">•</span>2–4 anos' },
  '5-7':  { title: 'O Pão que Alimentou a Multidão', meta: '📖 Bíblia<span class="dot">•</span>5 min<span class="dot">•</span>5–7 anos' },
  '8-10': { title: 'A Menina que Inventou a Luz', meta: '🔬 Inventores<span class="dot">•</span>8 min<span class="dot">•</span>8–10 anos' }
};

export default function AppDashboard() {
  const { user } = useAuth();
  const [activeAge, setActiveAge] = useState<'2-4'|'5-7'|'8-10'>('5-7');
  const [recentStories, setRecentStories] = useState<any[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const q = query(collection(db, 'stories'), orderBy('createdAt', 'desc'), limit(3));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentStories(data);
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoadingStories(false);
      }
    };
    fetchStories();
  }, []);

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Explorador(a)';
  const userInitial = userName.charAt(0).toUpperCase();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <>
      <div className="app-header">
        <div className="header-top">
          <div className="header-logo">Lumi<em>kids</em></div>
          <div className="header-avatar">{userInitial}</div>
        </div>
        <div className="header-greeting">{greeting}, {userName} 👋</div>
        <div className="header-title">O que vamos<br/>ler hoje?</div>
        <div className="age-selector">
          <div className={`age-pill ${activeAge === '2-4' ? 'active' : ''}`} onClick={() => setActiveAge('2-4')}>🍼 2–4 anos</div>
          <div className={`age-pill ${activeAge === '5-7' ? 'active' : ''}`} onClick={() => setActiveAge('5-7')}>📚 5–7 anos</div>
          <div className={`age-pill ${activeAge === '8-10' ? 'active' : ''}`} onClick={() => setActiveAge('8-10')}>🎓 8–10 anos</div>
        </div>
      </div>

      <div className="main-content">
        <div className="story-day-card">
          <div className="sdc-tag">✦ História do dia</div>
          <div className="sdc-title" id="sdcTitle">{ageData[activeAge].title}</div>
          <div className="sdc-meta" id="sdcMeta" dangerouslySetInnerHTML={{ __html: ageData[activeAge].meta }}></div>
          <Link href={recentStories.length > 0 ? `/app/historias/${recentStories[0].id}` : '/app/criar'} className="sdc-play inline-flex items-center justify-center gap-2">
            <div className="play-circle"><i className="fas fa-play"></i></div>Ouvir agora
          </Link>
        </div>

        <div className="age-banner">
          <div className="ab-icon-wrap">🍼</div>
          <div className="ab-text">
            <div className="ab-tag">✨ Novidade</div>
            <div className="ab-title">Histórias para 2–4 anos</div>
            <div className="ab-sub">Leia junto com seu bebê ❤️</div>
          </div>
          <i className="fas fa-chevron-right ab-arrow"></i>
        </div>

        <div className="sec-lbl">Coleções <Link href="/app/historias">Ver todas</Link></div>
        <div className="cols-grid">
          <Link href="/app/historias?cat=vida-de-jesus" className="col-card"><div className="col-icon ci-blue">✝️</div><h4>Vida de Jesus</h4><span>12 histórias</span></Link>
          <Link href="/app/historias?cat=hora-de-dormir" className="col-card"><div className="col-icon ci-teal">💤</div><h4>Hora de dormir</h4><span>28 histórias</span></Link>
          <Link href="/app/historias?cat=sentimentos" className="col-card"><div className="col-icon ci-pink">❤️</div><h4>Sentimentos</h4><span>18 histórias</span></Link>
          <Link href="/app/historias?cat=mulheres-fortes" className="col-card"><div className="col-icon ci-gold">👸</div><h4>Mulheres Fortes</h4><span>15 histórias</span></Link>
          <Link href="/app/historias?cat=inventores-genios" className="col-card"><div className="col-icon ci-green">🔬</div><h4>Inventores</h4><span>20 histórias</span></Link>
          <Link href="/app/historias?cat=classicos-infantis" className="col-card"><div className="col-icon ci-orange">📚</div><h4>Clássicos</h4><span>24 histórias</span></Link>
        </div>

        <div className="sec-lbl">Criar & Explorar</div>
        <div className="quick-grid">
          <Link href="/app/criar" className="qa-card qa-blue"><div className="qa-icon">🤖</div><h4>Criar com IA</h4><p>Sua história em segundos</p></Link>
          <Link href="/app/progresso" className="qa-card qa-gold"><div className="qa-icon">🎯</div><h4>Missão do Bem</h4><p>Tarefa de hoje</p></Link>
          <Link href="/app/historias?cat=biblia-kids" className="qa-card qa-green"><div className="qa-icon">📖</div><h4>Trilha Bíblica</h4><p>Continue sua jornada</p></Link>
          <Link href="/app/historias?cat=hora-de-dormir" className="qa-card qa-coral"><div className="qa-icon">🌙</div><h4>Hora de Dormir</h4><p>Histórias calmas</p></Link>
        </div>

        <div className="sec-lbl">Em destaque <Link href="/app/historias">Ver todas</Link></div>
        <div className="highlights">
          {loadingStories ? (
            <div className="p-4 text-sm text-gray-500 text-center w-full animate-pulse">Carregando histórias...</div>
          ) : recentStories.length > 0 ? (
            recentStories.map((story) => (
              <Link href={`/app/historias/${story.id}`} key={story.id} className="hl-card block cursor-pointer transition-all hover:scale-[1.02]">
                <div className="hl-cover relative flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #E8EAF6, #C5CAE9)' }}>
                  {story.ageGroups?.[0] === '2-4' ? '🍼' : story.ageGroups?.[0] === '8-10' ? '🎓' : '📚'}
                </div>
                <div className="hl-info">
                  <div className="hl-cat" style={{ color: 'var(--blue)' }}>{story.theme || 'História Mágica'}</div>
                  <div className="hl-title truncate w-full pr-4">{story.title || 'Incrível Aventura'}</div>
                  <div className="hl-meta"><span>{story.ageGroups?.[0] ? `${story.ageGroups[0]} anos` : 'Livre'}</span><span>•</span><span>⭐ Nova</span></div>
                </div>
                <i className="fas fa-chevron-right hl-arrow"></i>
              </Link>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center w-full">Nenhuma história encontrada. Que tal <Link href="/app/criar" className="text-[var(--blue)] font-bold">criar uma nova</Link>?</div>
          )}
        </div>
      </div>

    </>
  );
}
