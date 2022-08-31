import { getCookie } from '@/utils/cookie';
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

    if (!publicPaths.includes(path)) {
      if (!session) {
        void router.push('/login');
      }
    } else {
      if (session) {
        void router.push('/');
      }
    }

    setAuthorized(true);
  };

  return authorized ? children : <ScreenLoading />;
};
