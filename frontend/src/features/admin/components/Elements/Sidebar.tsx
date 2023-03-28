import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { BiLogOutCircle } from 'react-icons/bi';
import { FaUsers } from 'react-icons/fa';
import { GiArchiveResearch } from 'react-icons/gi';
import { IoIosTime } from 'react-icons/io';
import { useAdminLogout } from '../../api/adminLogout';
import ConfirmRequestsModal from '../Misc/ConfirmRequestsModal';

const SideBar = () => {
  const router = useRouter();
  const isMatch = useCallback(
    // dynamic route pathを削除する正規表現
    (path: string) => router.asPath === path,
    [router.asPath],
  );
  const logoutMutation = useAdminLogout();
  const [confirmReqModalOpen, setConfirmReqModalOpen] = useState<boolean>(false);

  return (
    <aside className="fixed z-[2] top-0 left-0 w-64 h-screen pt-14">
      <div className="h-full py-4 border-t border-t-gray-600 overflow-y-auto bg-gray-800">
        <ul className="relative space-y-2 pb-4 pt-2 mx-2 px-0">
          <div className="absolute -top-1 left-2 text-gray-400 text-xs">遷移</div>
          <li>
            <Link href="/admin/news">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/admin/news') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <IoIosTime size={25} className="text-gray-400" />
                <span className="ml-3">News</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/members">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/admin/members') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <FaUsers size={25} className="text-gray-400" />
                <span className="ml-3">Members</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/researches">
              <a
                className={`flex items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/admin/researches') ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <GiArchiveResearch size={25} className="text-gray-400" />
                <span className="ml-3">Researches</span>
              </a>
            </Link>
          </li>
        </ul>
        <div className="mx-2 py-1 border-solid border-0 border-t border-gray-600"></div>
        <div className="w-full">
          <ul className="relative space-y-2 mx-2 pb-4 px-0 pt-2">
            <li>
              <button
                onClick={() => setConfirmReqModalOpen(true)}
                className={`flex w-full items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/reviews') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <AiOutlineUsergroupAdd size={25} className="text-gray-400" />
                <span className="ml-3">登録申請</span>
              </button>
              <ConfirmRequestsModal
                isOpen={confirmReqModalOpen}
                close={() => setConfirmReqModalOpen(false)}
              />
            </li>
            <li>
              <button
                onClick={() => logoutMutation.mutate()}
                className={`flex w-full items-center p-2 text-base font-normal no-underline rounded-md text-white ${
                  isMatch('/reviews') ? '' : 'hover:'
                }bg-gray-700`}
              >
                <BiLogOutCircle size={25} className="text-gray-400" />
                <span className="ml-3">ログアウト</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
};

export default React.memo(SideBar);
