import ContentsLayout from '@/app/(authorized)/_components/ContentsLayout';
import { getWithApi } from '@/app/_shared/lib/fetch/api';
import MainLayout from '@/app/admin/(authorized)/_components/MainLayout';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { FIREBASE_SESSION_NAME } from '../_consts/session';

type Props = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: Props) => {
  const session = cookies().get(FIREBASE_SESSION_NAME);

  if (!session) {
    redirect('/admin/login');
  }

  const responseAPI = await getWithApi('/admin/login', {
    headers: {
      Cookie: `${FIREBASE_SESSION_NAME}=${session?.value}`,
    },
  });

  if (responseAPI.status !== 200) {
    redirect('/admin/login');
  }

  return (
    <MainLayout>
      <ContentsLayout>{children}</ContentsLayout>
    </MainLayout>
  );
};

export default AdminLayout;
