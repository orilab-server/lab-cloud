import { getWithApi } from '@/app/_shared/lib/fetch/api';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { FIREBASE_SESSION_NAME } from '../_consts/session';

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = cookies().get(FIREBASE_SESSION_NAME);

  const responseAPI = await getWithApi('/admin/login', {
    headers: {
      Cookie: `${FIREBASE_SESSION_NAME}=${session?.value}`,
    },
  });

  if (responseAPI.status === 200) {
    redirect('/admin');
  }

  return (
    <div className="w-[90vw] h-screen mx-auto flex flex-col items-center">
      {/* ヘッダー(的存在) */}
      <div className="flex items-center justify-around w-full border-b my-3 py-1">
        <span className="w-full text-lg">HP管理画面</span>
        <Link className="btn btn-link" href="/home">
          ホームへ
        </Link>
      </div>
      {children}
    </div>
  );
};

export default AdminLayout;
