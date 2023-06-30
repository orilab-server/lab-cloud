import { NextPage } from 'next';
import Link from 'next/link';
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
    return '/home';
  })();

  useEffect(() => {
    void router.push(to);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <span className="text-2xl font-bold">404 | Not Found</span>
      <Link href="/home">
        <a>ホームへ</a>
      </Link>
    </div>
  );
};

export default NotFound;
