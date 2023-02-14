import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const dynamicPath = {
  reviews: {
    review_id: '',
    reviewed_id: '',
  },
  admin: {
    collection: '',
  },
};

const NotFound: NextPage = () => {
  const router = useRouter();
  const url = new URL(decodeURI(location.href));
  const params = (() => {
    const pair = [] as string[][];
    url.searchParams.forEach((v, k) => pair.push([k, v]));
    return Object.fromEntries(pair);
  })();
  const to = (() => {
    const pathnames = url.pathname.split('/').filter((p) => p);
    if (Object.keys(dynamicPath).includes(pathnames[0]) && pathnames.length > 1) {
      const target = dynamicPath[pathnames[0] as 'reviews' | 'admin'];
      const keys = Object.keys(target).sort();
      const pathname = pathnames.slice(1).reduce((s, c, i) => {
        if (Object.keys(dynamicPath).includes(c)) {
          return `${s}/${c}`;
        }
        return `${s}/[${keys[i]}]`;
      }, `/${pathnames[0]}`);
      const dynamicPairs = Object.fromEntries(pathnames.slice(1).map((p, i) => [keys[i], p]));
      return {
        pathname,
        query: {
          ...dynamicPairs,
          ...params,
        },
      };
    }
    return router.asPath;
  })();

  useEffect(() => {
    void router.push(to);
  }, []);

  return (
    <Stack
      spacing={1}
      sx={{ width: '100vw', height: '100vh' }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography>404 | Not Found</Typography>
      <Button onClick={() => router.push('/home')}>ホームへ</Button>
    </Stack>
  );
};

export default NotFound;
