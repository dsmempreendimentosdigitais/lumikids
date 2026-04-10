'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, BookOpen, Wand2, BarChart3, Settings } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const ITEMS = [
    { id: 'home', path: '/app', icon: <House size={20} />, label: "Início" },
    { id: 'stories', path: '/app/historias', icon: <BookOpen size={20} />, label: "Histórias" },
    { id: 'create', path: '/app/criar', icon: <Wand2 size={20} />, label: "Criar" },
    { id: 'progress', path: '/app/progresso', icon: <BarChart3 size={20} />, label: "Progresso" },
    { id: 'settings', path: '/app/configuracoes', icon: <Settings size={20} />, label: "Config." },
  ];

  return (
    <div className="bottom-nav sticky bottom-0 bg-white border-t border-[rgba(61,90,254,0.07)] p-[10px_0_16px] flex justify-around shadow-[0_-4px_20px_rgba(61,90,254,0.08)] z-10 w-full rounded-t-[20px]">
      {ITEMS.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.id}
            href={item.path}
            className={`bn-item flex flex-col items-center gap-[3px] cursor-pointer px-[12px] group ${isActive ? 'active' : ''}`}
          >
            <div className={`bn-icon w-[40px] h-[40px] rounded-[12px] flex items-center justify-center text-[0.95rem] transition-all ${isActive ? 'bg-[var(--blue)] text-white shadow-[0_4px_12px_rgba(61,90,254,0.28)]' : 'bg-transparent text-[#ccc] group-hover:bg-[#F0F2FF] group-hover:text-[var(--blue)]'}`}>
              {item.icon}
            </div>
            <div className={`bn-label text-[0.6rem] font-[800] ${isActive ? 'text-[var(--blue)]' : 'text-[#ccc]'}`}>
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
