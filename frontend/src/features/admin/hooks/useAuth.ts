import { auth } from '@/shared/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const router = useRouter();
  const isLoginPath = router.asPath.match('/admin/login') !== null;
  const [authorized, setAuthorized] = useState<boolean>(isLoginPath ? true : false);

  useEffect(() => {
    const authCheck = () => {
      onAuthStateChanged(auth, async (user) => {
        if (!isLoginPath && user === null) {
          await router.push('/admin/login');
        } else if (isLoginPath && user !== null) {
          await router.push('/admin');
        }
      });
      setAuthorized(true);
    };
    authCheck();

    return () => {
      authCheck();
    };
  }, []);

  return { authorized };
};
