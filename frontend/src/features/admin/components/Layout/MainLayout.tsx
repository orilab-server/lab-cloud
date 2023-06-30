import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import Header from '../Elements/Header';
import Sidebar from '../Elements/Sidebar';

type TrashLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: TrashLayoutProps) => {
  const { authorized } = useAuth();

  if (!authorized) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full h-full">
      <Header />
      <Sidebar />
      {children}
    </div>
  );
};

export default React.memo(MainLayout);
