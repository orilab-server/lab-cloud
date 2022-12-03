import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { auth } from '@/shared/lib/firebase';
import { getCookie } from '@/shared/utils/cookie';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { useAdminLogout } from '../../api/adminLogout';

type AdminLayoutProps = {
  children: ReactNode;
  isUnLogin?: boolean;
};

const adminPath = '/admin';

export const AdminLayout = ({ children, isUnLogin }: AdminLayoutProps) => {
  const router = useRouter();
  const isLoginPath = router.asPath.match(`${adminPath}/login`) !== null;
  const [authorized, setAuthorized] = useState<boolean>(isLoginPath ? true : false);
  const logoutMutation = useAdminLogout();
  const session = getCookie('mysession');

  useEffect(() => {
    const authCheck = () => {
      onAuthStateChanged(auth, async (user) => {
        if (!isLoginPath && user === null) {
          await router.push(`${adminPath}/login`);
        } else if (isLoginPath && user !== null) {
          await router.push(adminPath);
        }
      });
      setAuthorized(true);
    };

    // adminページではサーバーからのsessionを受け取れないため
    // 再読み込みなどがされた状態でホームに戻るとログイン画面に戻ってしまうため
    // localstorageでログイン画面に戻ってもホームに遷移するように実装
    // TODO: もう少しスマートなやり方
    if (session === '' && !Boolean(localStorage.getItem('no_session'))) {
      localStorage.setItem('no_session', 'true');
    }

    return () => {
      authCheck();
    };
  }, []);

  return (
    <Stack sx={{ width: '90vw', height: '100vh', mx: 'auto' }} alignItems="center">
      {/* ヘッダー(的存在) */}
      <Stack
        direction="row"
        justifyContent="space-around"
        sx={{ width: '100%', borderBottom: '2px rgba(0,0,0,0.5) solid', my: 3, py: 1 }}
      >
        <Typography sx={{ width: '80%', fontSize: 24 }}>管理者画面</Typography>
        <Button onClick={() => router.push('/')}>ホームへ</Button>
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
