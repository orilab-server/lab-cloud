import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const BreadCrumbs = () => {
  const router = useRouter();
  const paths = ((router.query.path as string) || '').split('/').filter((p) => p);

  return (
    <div className="text-sm breadcrumbs fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
      <ul>
        <li>
          <Link href="/home">
            <a>Share</a>
          </Link>
        </li>
        {paths.map((p, i) => (
          <li key={p}>
            <Link href={`/home?path=/${paths.slice(0, i + 1).join('/')}`}>
              <a>{p}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(BreadCrumbs);
