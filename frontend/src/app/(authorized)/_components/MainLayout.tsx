import Header from '@/app/_shared/components/Elements/Header';
import SideBar from '@/app/_shared/components/Elements/SideBar';
import { User } from '@/app/_types/user';
import React from 'react';
import { getRecentFiles } from '../_utils/getRecentFiles';

type TrashLayoutProps = {
  user: User;
  children: React.ReactNode;
};

const MainLayout = async ({ user, children }: TrashLayoutProps) => {
  const recentFiles = await getRecentFiles(5);

  return (
    <div className="w-full h-full">
      <Header user={user} />
      <SideBar recentFiles={recentFiles} />
      {children}
    </div>
  );
};

export default MainLayout;
