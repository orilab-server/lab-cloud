'use client';

import { useMoveFilesWithDrop } from '@/app/(authorized)/home/_hooks/useMoveFilesWithDrop';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const BreadCrumbs = () => {
  const searchParams = useSearchParams();
  const paths = ((searchParams.get('path') as string) || '').split('/').filter((p) => p);
  const { dropInHigherFolder, droppable, saveDroppableDir, resetDroppable } =
    useMoveFilesWithDrop();

  return (
    <div className="text-sm breadcrumbs fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
      <ul>
        <li
          onDrop={() => dropInHigherFolder('/')}
          onDragEnter={() => saveDroppableDir('Share', 'dir')}
          onDragEnd={resetDroppable}
          onDragLeave={resetDroppable}
          className={`transition duration-500 rounded px-2 ${
            droppable === 'Share' ? 'scale-110 bg-gray-400' : ''
          }`}
        >
          <Link href="/home">Share</Link>
        </li>
        {paths.map((p, i) => (
          <li
            key={p}
            onDrop={() => dropInHigherFolder(p)}
            onDragEnter={() => saveDroppableDir(p, 'dir')}
            onDragEnd={resetDroppable}
            onDragLeave={resetDroppable}
          >
            <Link
              className={`transition duration-500 rounded px-2 ${
                droppable === p ? 'scale-110 bg-gray-400' : ''
              }`}
              href={`/home?path=/${paths.slice(0, i + 1).join('/')}`}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(BreadCrumbs);
