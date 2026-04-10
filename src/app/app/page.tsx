import React from 'react';
import AppDashboard from '@/components/app/AppDashboard';

export const metadata = {
  title: 'Meu Painel | Lumikids',
};

export default function AppPage() {
  return (
    <div className="app-container">
      <AppDashboard />
    </div>
  );
}
