'use client';

import { RecentFile } from '@/app/(authorized)/home/_types/recents';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback } from 'react';
import { AiFillFile } from 'react-icons/ai';
import { BsFillTrash2Fill, BsShare } from 'react-icons/bs';
import { IoIosTime } from 'react-icons/io';
import { MdReviews } from 'react-icons/md';

type Props = {
  recentFiles: RecentFile[];
};

const SideBar = ({ recentFiles }: Props) => {
  const pathname = usePathname();
  const isMatch = useCallback(
    // dynamic route pathを削除する正規表現
    (path: string) => pathname.replace(/\/\[[^\]]+\]$/, '') === path,
    [pathname],
  );

  return (
    <aside className="fixed z-[2] top-0 left-0 w-64 h-screen pt-14">
      <div className="h-full py-4 border-t border-t-gray-600 overflow-y-auto bg-gray-800">
        <ul className="relative space-y-2 pb-4 pt-2 mx-2 px-0 ">
          <div className="absolute -top-1 left-2 text-gray-400 text-xs">遷移</div>
          <li>
            <Link
              className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                isMatch('/recent') ? '' : 'hover:'
              }bg-gray-700`}
              href="/recent"
            >
              <IoIosTime size={25} className="text-gray-400" />
              <span className="ml-3">最近の項目</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                isMatch('/home') ? '' : 'hover:'
              }bg-gray-700`}
              href="/home"
            >
              <BsShare size={25} className="text-gray-400" />
              <span className="ml-3">共有</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                isMatch('/reviews') ? '' : 'hover:'
              }bg-gray-700`}
              href="/reviews"
            >
              <MdReviews size={25} className="text-gray-400" />
              <span className="ml-3">レビュー</span>
            </Link>
          </li>
          <li>
            <Link
              className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                isMatch('/trash') ? '' : 'hover:'
              }bg-gray-700`}
              href="/trash"
            >
              <BsFillTrash2Fill size={25} className="text-gray-400" />
              <span className="ml-3">ゴミ箱</span>
            </Link>
          </li>
        </ul>
        <div className="mx-2 py-3 border-solid border-0 border-t border-gray-600"></div>
        <ul className="relative space-y-2 mx-2 pb-4 px-0 pt-2">
          <div className="absolute -top-3 left-2 text-gray-400 text-xs">最近のアップロード</div>
          {recentFiles.map((r) => (
            <li key={r.id} className="my-1 group">
              <Link
                className="tooltip tooltip-primary flex items-center p-2 py-1 font-normal rounded-md text-white hover:bg-gray-700"
                data-tip={`upload: ${r.created_at}`}
                href={r.type === 'review' ? `/reviews/${r.location}` : `/home?path=${r.location}`}
              >
                {r.type === 'review' ? (
                  <MdReviews className="min-w-[16px] text-gray-200" />
                ) : (
                  <AiFillFile className="min-w-[16px] text-gray-200" />
                )}
                <span className="ml-2 text-sm truncate">{r.file_name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default React.memo(SideBar);
