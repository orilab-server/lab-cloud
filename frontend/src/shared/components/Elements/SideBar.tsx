import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback } from 'react';
import { BsFillTrash2Fill, BsShare } from 'react-icons/bs';
import { IoIosTime } from 'react-icons/io';
import { MdCreateNewFolder, MdDriveFolderUpload, MdReviews, MdUploadFile } from 'react-icons/md';

const SideBar = () => {
  const router = useRouter();
  const isMatch = useCallback((path: string) => router.pathname === path, [router.asPath]);

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
        <ul className="relative space-y-2 mx-2 pb-4 px-0">
          <div className="absolute -top-5 left-2 text-gray-400 text-xs">よく使う項目</div>
          <li>
            <div className="flex items-center p-2 text-base font-normal rounded-md text-white hover:bg-gray-700">
              <MdCreateNewFolder size={25} className="text-gray-400" />
              <span className="ml-3">フォルダを作成</span>
            </div>
          </li>
          <li>
            <div className="flex items-center p-2 text-base font-normal no-underline rounded-md text-white hover:bg-gray-700">
              <MdUploadFile size={25} className="text-gray-400" />
              <span className="ml-3">ファイルを追加</span>
            </div>
          </li>
          <li>
            <div className="flex items-center p-2 text-base font-normal no-underline rounded-md text-white hover:bg-gray-700">
              <MdDriveFolderUpload size={25} className="text-gray-400" />
              <span className="ml-3">フォルダを追加</span>
            </div>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default React.memo(SideBar);
