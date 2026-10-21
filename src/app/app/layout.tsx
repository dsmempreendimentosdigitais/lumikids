import React from 'react';
import BottomNav from '@/components/app/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col relative bg-[#F8F7F2] font-sans">
      <main className="flex-1 w-full">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
