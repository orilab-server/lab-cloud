import { useGetRecentFiles } from '@/features/home/api/recents/getRecentFiles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { AiFillFile } from 'react-icons/ai';
import { BsFillTrash2Fill, BsShare } from 'react-icons/bs';
import { IoIosTime } from 'react-icons/io';
import { MdReviews } from 'react-icons/md';

const SideBar = () => {
  const router = useRouter();
  const isMatch = useCallback(
    // dynamic route pathを削除する正規表現
    (path: string) => router.pathname.replace(/\/\[[^\]]+\]$/, '') === path,
    [router.asPath],
  );
  const recentsQuery = useGetRecentFiles(5);
  const recents = recentsQuery.data || [];

  return (
    <aside className="fixed z-[2] top-0 left-0 w-64 h-screen pt-14">
      <div className="h-full py-4 border-t border-t-gray-600 overflow-y-auto bg-gray-800">
        <ul className="relative space-y-2 pb-4 pt-2 mx-2 px-0 ">
          <div className="absolute -top-1 left-2 text-gray-400 text-xs">遷移</div>
          <li>
            <Link href="/home/recent">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/home/recent') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <IoIosTime size={25} className="text-gray-400" />
                <span className="ml-3">最近の項目</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/home">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/home') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <BsShare size={25} className="text-gray-400" />
                <span className="ml-3">共有</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/reviews">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/reviews') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <MdReviews size={25} className="text-gray-400" />
                <span className="ml-3">レビュー</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/home/trash">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/home/trash') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <BsFillTrash2Fill size={25} className="text-gray-400" />
                <span className="ml-3">ゴミ箱</span>
              </a>
            </Link>
          </li>
        </ul>
        <div className="mx-2 py-3 border-solid border-0 border-t border-gray-600"></div>
        <ul className="relative space-y-2 mx-2 pb-4 px-0 pt-2">
          <div className="absolute -top-3 left-2 text-gray-400 text-xs">最近のアップロード</div>
          {recents.map((r) => (
            <li key={r.id} className="my-1 group">
              <Link
                href={r.type === 'review' ? `/reviews/${r.location}` : `/home?path=${r.location}`}
              >
                <a
                  className="tooltip tooltip-primary flex items-center p-2 py-1 font-normal rounded-md text-white hover:bg-gray-700"
                  data-tip={`upload: ${r.created_at}`}
                >
                  {r.type === 'review' ? (
                    <MdReviews className="min-w-[16px] text-gray-200" />
                  ) : (
                    <AiFillFile className="min-w-[16px] text-gray-200" />
                  )}
                  <span className="ml-2 text-sm truncate">{r.file_name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default React.memo(SideBar);
