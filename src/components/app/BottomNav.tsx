'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { House, LayoutGrid, LibraryBig, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const ITEMS = [
    { id: 'home', path: '/app', icon: <House size={20} />, label: "Home" },
    { id: 'browse', path: '/app/historias', icon: <LayoutGrid size={20} />, label: "Explorar" },
    { id: 'library', path: '/app/criar', icon: <LibraryBig size={20} />, label: "Biblioteca" },
    { id: 'profile', path: '/app/progresso', icon: <User size={20} />, label: "Perfil" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[420px] bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-full px-3 py-2 flex items-center justify-around shadow-[0_12px_36px_rgba(0,0,0,0.08)] z-50">
      {ITEMS.map((item) => {
        const isActive = pathname === item.path || (item.path !== '/app' && pathname.startsWith(item.path));
        return (
          <Link 
            key={item.id}
            href={item.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 select-none ${
              isActive 
                ? 'bg-[#E6F4F1] text-[#0D9488] font-bold shadow-sm' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/70 font-semibold'
            }`}
          >
            <span className={`${isActive ? 'text-[#0D9488]' : 'text-slate-400'}`}>
              {item.icon}
            </span>
            <span className={`text-xs font-bold tracking-tight ${isActive ? 'inline-block' : 'hidden md:inline-block'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
