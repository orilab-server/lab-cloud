import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { useAdminLogout } from '../../api/adminLogout';
import { useAuth } from '../../hooks/useAuth';

type AdminLayoutProps = {
  children: ReactNode;
  isUnLogin?: boolean;
};

export const AdminLayout = ({ children, isUnLogin }: AdminLayoutProps) => {
  const router = useRouter();
  const logoutMutation = useAdminLogout();
  const { authorized } = useAuth();

  return (
    <Stack sx={{ width: '90vw', height: '100vh', mx: 'auto' }} alignItems="center">
      {/* ヘッダー(的存在) */}
      <Stack
        direction="row"
        justifyContent="space-around"
        sx={{ width: '100%', borderBottom: '2px rgba(0,0,0,0.5) solid', my: 3, py: 1 }}
      >
        <Typography sx={{ width: '80%', fontSize: 24 }}>HP管理画面</Typography>
        <Button onClick={() => router.push('/home')}>ホームへ</Button>
        {!isUnLogin && (
          <Button color="secondary" onClick={() => logoutMutation.mutate()}>
            {logoutMutation.isLoading && <LoadingSpinner />}
            ログアウト
          </Button>
        )}
      </Stack>
      {authorized ? children : <LoadingSpinner />}
    </Stack>
  );
};
