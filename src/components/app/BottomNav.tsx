'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  // Esconde apenas na tela de checkout/planos (/app/planos), sucesso (/app/sucesso) e dentro do leitor de página inteira (/app/historias/[id])
  if (
    pathname === '/app/planos' ||
    pathname === '/app/sucesso' ||
    pathname.startsWith('/app/historias/')
  ) {
    return null;
  }

  const ITEMS = [
    {
      id: 'journey',
      path: '/app',
      label: t('nav_home', 'Jornada'),
      exact: true,
      renderIcon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ícone Moderno Duotone: Bússola / Trilha de Exploração */}
          <circle
            cx="12"
            cy="12"
            r="9"
            fill={active ? '#CCFBF1' : 'none'}
            stroke="currentColor"
            strokeWidth={active ? '2.2' : '1.9'}
          />
          <polygon
            points="14.8,9.2 13.1,13.1 9.2,14.8 10.9,10.9"
            fill={active ? '#0D9488' : 'none'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="12" r="1.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      id: 'library',
      path: '/app/historias',
      label: t('nav_library', 'Biblioteca'),
      exact: false,
      renderIcon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ícone Moderno Duotone: Livro Aberto com Páginas */}
          <path
            d="M2 6.5C2 5.4 2.9 4.5 4 4.5H8.5C10.4 4.5 12 6.1 12 8V19.5C12 18.1 10.9 17 9.5 17H4C2.9 17 2 16.1 2 15V6.5Z"
            fill={active ? '#CCFBF1' : 'none'}
            stroke="currentColor"
            strokeWidth={active ? '2.1' : '1.9'}
            strokeLinejoin="round"
          />
          <path
            d="M22 6.5C22 5.4 21.1 4.5 20 4.5H15.5C13.6 4.5 12 6.1 12 8V19.5C12 18.1 13.1 17 14.5 17H20C21.1 17 22 16.1 22 15V6.5Z"
            fill={active ? '#99F6E4' : 'none'}
            stroke="currentColor"
            strokeWidth={active ? '2.1' : '1.9'}
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      id: 'create',
      path: '/app/criar',
      label: t('nav_create', 'Criar'),
      exact: false,
      renderIcon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ícone Moderno Duotone: Estrela Mágica de Criação */}
          <path
            d="M12 3L14.2 8.8L20 11L14.2 13.2L12 19L9.8 13.2L4 11L9.8 8.8L12 3Z"
            fill={active ? '#FDE68A' : 'none'}
            stroke="currentColor"
            strokeWidth={active ? '2.1' : '1.9'}
            strokeLinejoin="round"
          />
          <path
            d="M19 3L19.7 4.8L21.5 5.5L19.7 6.2L19 8L18.3 6.2L16.5 5.5L18.3 4.8L19 3Z"
            fill="currentColor"
          />
        </svg>
      ),
    },
    {
      id: 'family',
      path: '/app/progresso',
      label: t('nav_profile', 'Família'),
      exact: false,
      renderIcon: (active: boolean) => (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-5 h-5 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ícone Moderno Duotone: Escudo / Medalha Familiar de Virtudes */}
          <path
            d="M12 3L19 6V11.5C19 16.2 15.9 20.3 12 21.5C8.1 20.3 5 16.2 5 11.5V6L12 3Z"
            fill={active ? '#CCFBF1' : 'none'}
            stroke="currentColor"
            strokeWidth={active ? '2.1' : '1.9'}
            strokeLinejoin="round"
          />
          <path
            d="M12 8.2L13.1 10.5L15.6 10.8L13.8 12.5L14.2 15L12 13.8L9.8 15L10.2 12.5L8.4 10.8L10.9 10.5L12 8.2Z"
            fill={active ? '#F59E0B' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav
      aria-label="Navegação Principal"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-[430px] bg-white/95 backdrop-blur-xl border-2 border-[#E6DEC8] rounded-[28px] px-2.5 py-2 flex items-center justify-between shadow-[0_14px_38px_rgba(30,41,59,0.12)] z-40"
    >
      {ITEMS.map((item) => {
        const isActive = item.exact
          ? pathname === item.path
          : pathname === item.path || pathname.startsWith(item.path);

        return (
          <Link
            key={item.id}
            href={item.path}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 px-2 rounded-2xl transition-all duration-200 select-none ${
              isActive
                ? 'bg-[#E6F7F5] text-[#0F766E] font-extrabold shadow-2xs scale-[1.02]'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 font-bold'
            }`}
          >
            <span className={isActive ? 'text-[#0D9488]' : 'text-slate-400'}>
              {item.renderIcon(isActive)}
            </span>
            <span className="text-[0.7rem] tracking-tight leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
