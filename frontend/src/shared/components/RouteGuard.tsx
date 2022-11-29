import { getCookie } from '@/shared/utils/cookie';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useState } from 'react';
import { ScreenLoading } from './ScreenLoading';

const publicPaths = ['login'];

type RouteGuardProps = {
  children: ReactElement;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean>(false);

  useEffect(() => {
    authCheck(router.asPath);

    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.on('routeChangeStart', hideContent);
      router.events.on('routeChangeComplete', authCheck);
    };
  }, []);

  const authCheck = (url: string) => {
    const path = url.split('/')[1];
    const session = getCookie('mysession');

    console.log('session', session, ', path: ', url);

    if (!publicPaths.includes(path)) {
      if (!session) {
        // 未ログイン状態でリンクにアクセスした場合
        if (url.match('path=') !== null) {
          localStorage.setItem('path', url);
        }
        // /adminページはsessionを保持できないためスルー
        if (url.match('/admin') === null) {
          void router.push('/login');
        }
      }
    } else {
      if (session) {
        // home → loginページへの遷移は不可, それ以外は許可
        const to = publicPaths.includes(path) ? '/' : path;
        void router.push(to);
      }
    }

    setAuthorized(true);
  };

  return authorized ? children : <ScreenLoading />;
};
