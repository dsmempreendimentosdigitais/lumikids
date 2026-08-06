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
    <div className="bottom-nav fixed bottom-0 left-0 w-full bg-[#0B0819]/80 backdrop-blur-xl border-t border-purple-500/20 p-[10px_0_16px] flex justify-around shadow-[0_-10px_30px_rgba(139,92,246,0.15)] z-50 rounded-t-[32px]">
      {ITEMS.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.id}
            href={item.path}
            className={`bn-item flex flex-col items-center gap-[4px] cursor-pointer px-[12px] group ${isActive ? 'active' : ''} transition-all duration-300`}
          >
            <div className={`bn-icon w-[44px] h-[44px] rounded-[16px] flex items-center justify-center text-[1.1rem] transition-all duration-300 ${isActive ? 'bg-gradient-to-tr from-purple-500 to-blue-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)]' : 'bg-transparent text-purple-200/40 group-hover:bg-white/5 group-hover:text-purple-300'}`}>
              {item.icon}
            </div>
            <div className={`bn-label text-[0.65rem] font-[800] tracking-wide transition-all duration-300 ${isActive ? 'text-purple-300 drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]' : 'text-purple-200/40'}`}>
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
