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
    const path = (() => {
      const topPath = url.split('/')[1];
      if (topPath.match('\\?')) {
        return topPath.split('?')[0];
      }
      return topPath;
    })();
    const session = getCookie('mysession');

    if (!publicPaths.includes(path)) {
      if (!session) {
        // 未ログイン状態でリンクにアクセスした場合
        if (url.match('path=') !== null) {
          localStorage.setItem('path', url);
        }
        // /adminページはsessionを保持できないためスルー
        if (url.match('/admin') === null) {
          if (!Boolean(localStorage.getItem('logged_in'))) {
            if (url.match('/reviews') !== null) {
              localStorage.setItem('no_session', 'true');
            }
          }
          void router.push('/login');
        }
      }
    } else {
      if (Boolean(localStorage.getItem('no_session'))) {
        localStorage.removeItem('no_session');
        router.reload();
        return;
      }
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
