// 'use client';

// import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
// import { useAuth } from '@/app/admin/(authorized)/_hooks/useAuth';
import React, { Suspense } from 'react';
import Header from './Header';
import { SidebarFetcher } from './SidebarFetcher';

type TrashLayoutProps = {
  children: React.ReactNode;
};

// TODO: Server Componentにしてルーティング制御をServer依存にさせる
const MainLayout = ({ children }: TrashLayoutProps) => {
  // const { authorized } = useAuth();

  // if (!authorized) {
  //   return <LoadingSpinner />;
  // }

  return (
    <div className="w-full h-full">
      <Header />
      <Suspense fallback={<></>}>
        {/* @ts-expect-error Server Component */}
        <SidebarFetcher />
      </Suspense>
      {children}
    </div>
  );
};

export default React.memo(MainLayout);
