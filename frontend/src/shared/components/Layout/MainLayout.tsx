import React from 'react';
import Header from '../Elements/Header';
import SideBar from '../Elements/SideBar';

type TrashLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: TrashLayoutProps) => {
  return (
    <div className="w-full h-full">
      <Header />
      <SideBar />
      {children}
    </div>
  );
};

export default React.memo(MainLayout);
