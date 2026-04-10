'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import NavBar from '@/components/landing/NavBar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import Categories from '@/components/landing/Categories';
import HowItWorks from '@/components/landing/HowItWorks';
import Plans from '@/components/landing/Plans';
import Schools from '@/components/landing/Schools';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';
import AppDashboard from '@/components/app/AppDashboard';
import BottomNav from '@/components/app/BottomNav';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'landing' | 'app'>('landing');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Set default view based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        window.location.href = '/app';
      } else {
        setView('landing');
      }
    }
  }, [user, loading]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* SETA PARA CIMA */}
      <button 
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`} 
        onClick={scrollToTop}
      >
        <i className="fas fa-chevron-up"></i>
      </button>

      {/* NAV */}
      <NavBar />

      {/* TABS (Apenas para desenvolvimento se necessário, caso contrário oculto) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="view-tabs" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid #ddd' }}>
          <button 
            className={`vt-btn ${view === 'app' ? 'active' : ''}`} 
            onClick={() => setView('app')}
          >
            📱 App Preview
          </button>
          <button 
            className={`vt-btn ${view === 'landing' ? 'active' : ''}`} 
            onClick={() => setView('landing')}
          >
            🌐 Landing Page
          </button>
        </div>
      )}

      {/* APP VIEW */}
      <div className={`view-panel ${view === 'app' ? 'active' : ''}`} id="view-app" style={{ textAlign: 'center', paddingBottom: '60px' }}>
        <div style={{ 
          display: 'inline-block', 
          border: '8px solid var(--blue-dark)', 
          borderRadius: '44px', 
          overflow: 'hidden', 
          boxShadow: '0 32px 80px rgba(26,35,126,.22)', 
          background: 'var(--bg)', 
          width: '100%', 
          maxWidth: '390px', 
          height: 'min(85vh, 850px)', 
          textAlign: 'left', 
          position: 'relative',
          marginTop: '20px'
        }}>
          <div style={{ height: 'calc(100% - 65px)', overflowY: 'auto', overflowX: 'hidden' }}>
             <AppDashboard />
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 50 }}>
            <BottomNav />
          </div>
        </div>
      </div>

      {/* LANDING VIEW */}
      <div className={`view-panel ${view === 'landing' ? 'active' : ''}`} id="view-landing">
        <Hero />
        <Features />
        <Categories />
        <HowItWorks />
        <Plans />
        <Schools />
        <Testimonials />
        <Footer />
      </div>
    </>
  );
}
