import { getCookie } from '@/shared/utils/cookie';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { ScreenLoading } from './ScreenLoading';

const publicPaths = ['login', 'reset-password', '404'];

type RouteGuardProps = {
  children: ReactElement;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    // router.pathname : /aaa/bbb?q=ccc → /aaa/bbb
    authCheck(router.pathname);

    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.on('routeChangeStart', hideContent);
      router.events.on('routeChangeComplete', authCheck);
    };
  }, []);

  const authCheck = (url: string) => {
    const path = url.split('/').filter((p) => p)[0];
    const session = getCookie('mysession');

    // adminへのアクセスはsession関係なし
    if (path === 'admin') {
      setAuthorized(true);
      return;
    }

    // session必要なしページ
    const isPublic = publicPaths.includes(path);
    if (isPublic) {
      if (session) {
        // home → loginページへの遷移は不可, それ以外は許可
        const to = isPublic ? '/home' : path;
        void router.push(to);
      }
      setAuthorized(true);
      return;
    }

    // 以下session必要
    if (!session) {
      // 未ログイン状態でリンクにアクセスした場合
      if (url.match('path=') !== null) {
        localStorage.setItem('path', url);
      }
      void router.push('/login');
    }
    setAuthorized(true);
  };

  return authorized ? children : <ScreenLoading />;
};
