import { useMoveFilesWithDrop } from '@/features/home/hooks/main/useMoveFilesWithDrop';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const BreadCrumbs = () => {
  const router = useRouter();
  const paths = ((router.query.path as string) || '').split('/').filter((p) => p);
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
          <Link href="/home">
            <a>Share</a>
          </Link>
        </li>
        {paths.map((p, i) => (
          <li
            key={p}
            onDrop={() => dropInHigherFolder(p)}
            onDragEnter={() => saveDroppableDir(p, 'dir')}
            onDragEnd={resetDroppable}
            onDragLeave={resetDroppable}
          >
            <Link href={`/home?path=/${paths.slice(0, i + 1).join('/')}`}>
              <a
                className={`transition duration-500 rounded px-2 ${
                  droppable === p ? 'scale-110 bg-gray-400' : ''
                }`}
              >
                {p}
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default React.memo(BreadCrumbs);
