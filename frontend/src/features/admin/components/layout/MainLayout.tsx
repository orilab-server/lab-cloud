import React from 'react';
import Header from '../Elements/Header';
import Sidebar from '../Elements/Sidebar';

type TrashLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: TrashLayoutProps) => {
  return (
    <div className="w-full h-full">
      <Header />
      <Sidebar />
      {children}
    </div>
  );
};

export default React.memo(MainLayout);
