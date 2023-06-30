import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import Link from 'next/link';
import { ReactNode } from 'react';
import { useAdminLogout } from '../../api/adminLogout';
import { useAuth } from '../../hooks/useAuth';

type AdminLayoutProps = {
  children: ReactNode;
  isUnLogin?: boolean;
};

export const AdminLayout = ({ children, isUnLogin }: AdminLayoutProps) => {
  const logoutMutation = useAdminLogout();
  const { authorized } = useAuth();

  return (
    <div className="w-[90vw] h-screen mx-auto flex flex-col items-center">
      {/* ヘッダー(的存在) */}
      <div className="flex items-center justify-around w-full border-b my-3 py-1">
        <span className="w-full text-lg">HP管理画面</span>
        <Link href="/home">
          <a className="btn btn-link">ホームへ</a>
        </Link>
        {!isUnLogin && (
          <button className="btn btn-link" onClick={() => logoutMutation.mutate()}>
            {logoutMutation.isLoading && <LoadingSpinner />}
            ログアウト
          </button>
        )}
      </div>
      {authorized ? children : <LoadingSpinner />}
    </div>
  );
};
