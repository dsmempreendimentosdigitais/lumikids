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
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Se o usuário estiver autenticado, vai direto para o aplicativo
  useEffect(() => {
    if (!loading && user) {
      router.push('/app');
    }
  }, [user, loading, router]);

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
    <div className="min-h-screen bg-[#0B0819] text-white font-sans overflow-x-hidden relative">
      {/* Background Starry Glows */}
      <div className="fixed inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.15), transparent 60%)' }}></div>

      {/* Seta para o topo */}
      {showScrollTop && (
        <button 
          className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-purple-600/80 backdrop-blur-md text-white border border-purple-400/40 shadow-lg shadow-purple-500/30 flex items-center justify-center z-40 hover:scale-105 transition-transform"
          onClick={scrollToTop}
          aria-label="Voltar ao topo"
        >
          <i className="fas fa-chevron-up text-sm"></i>
        </button>
      )}

      {/* Barra de Navegação */}
      <NavBar />

      {/* Seções da Landing Page */}
      <main className="relative z-10 pt-20">
        <Hero />
        <Features />
        <Categories />
        <HowItWorks />
        <Plans />
        <Schools />
        <Testimonials />
        <Footer />
      </main>
    </div>
  );
}
