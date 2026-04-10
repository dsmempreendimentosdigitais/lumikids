import React from 'react';
import BottomNav from '@/components/app/BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="phone-wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div style={{ flex: 1, paddingBottom: '80px', overflowY: 'auto' }}>
        {children}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 50 }}>
        <BottomNav />
      </div>
    </div>
  );
}
