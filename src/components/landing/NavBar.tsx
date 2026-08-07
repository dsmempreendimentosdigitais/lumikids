'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Menu, X, Smartphone } from 'lucide-react';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0819]/90 backdrop-blur-xl border-b border-purple-500/20 px-6 py-4 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300 font-serif drop-shadow-md">
          Lumi<em className="not-italic text-yellow-300">kids</em>
          <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 list-none">
          <a href="#features" className="text-xs font-bold uppercase tracking-wider text-purple-200/80 hover:text-white transition-colors">Funcionalidades</a>
          <a href="#categorias" className="text-xs font-bold uppercase tracking-wider text-purple-200/80 hover:text-white transition-colors">Histórias</a>
          <a href="#planos" className="text-xs font-bold uppercase tracking-wider text-purple-200/80 hover:text-white transition-colors">Planos</a>
          <a href="#escolas" className="text-xs font-bold uppercase tracking-wider text-purple-200/80 hover:text-white transition-colors">Escolas</a>
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full font-extrabold text-xs text-purple-200 hover:text-white border border-purple-500/30 hover:bg-purple-900/30 transition-all">
            Entrar
          </Link>
          <Link href="/cadastro" className="px-5 py-2 rounded-full font-extrabold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-purple-500/30 hover:opacity-90 transition-opacity">
            Começar grátis ✨
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/login" className="px-3.5 py-1.5 rounded-full font-bold text-xs text-white bg-purple-900/60 border border-purple-500/30">
            Entrar
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-full bg-[#150F2D] border border-purple-500/30 text-purple-200 flex items-center justify-center"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#150F2D] border-t border-purple-500/20 mt-4 -mx-6 p-6 space-y-4 animate-in fade-in slide-in-from-top duration-300">
          <a 
            href="#features" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-purple-100 hover:text-pink-300 py-1"
          >
            Funcionalidades
          </a>
          <a 
            href="#categorias" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-purple-100 hover:text-pink-300 py-1"
          >
            Histórias
          </a>
          <a 
            href="#planos" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-purple-100 hover:text-pink-300 py-1"
          >
            Planos
          </a>
          <a 
            href="#escolas" 
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-purple-100 hover:text-pink-300 py-1"
          >
            Escolas
          </a>
          
          <div className="pt-2 flex flex-col gap-3">
            <Link 
              href="/cadastro" 
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-11 rounded-full flex items-center justify-center font-extrabold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-md shadow-purple-500/30"
            >
              Criar Conta Grátis ✨
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
