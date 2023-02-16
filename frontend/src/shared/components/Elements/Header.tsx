import { useUser } from '@/features/auth/api/getUser';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import LabIcon from '../../../../public/labo_icon.png';

const Header = () => {
  const userQuery = useUser();
  const user = userQuery.data;
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const insideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = insideRef.current;
    if (!el) return;
    const hundleClickOutside = (e: MouseEvent) => {
      if (!el?.contains(e.target as Node)) setOpenMenu(false);
    };
    document.addEventListener('click', hundleClickOutside);
    return () => {
      document.removeEventListener('click', hundleClickOutside);
    };
  }, [insideRef]);

  return (
    <nav className="fixed top-0 left-0 z-50 w-screen border-solid border-0 border-b border-b-gray-600 bg-gray-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link href="/home">
              <a className="flex ml-2 md:mr-24">
                <img className="h-8 mr-3" src={LabIcon.src}></img>
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  折田研究室
                </span>
              </a>
            </Link>
          </div>
          <div className="relative" ref={insideRef}>
            <div
              onClick={() => setOpenMenu(!openMenu)}
              className="flex items-center text-base font-normal no-underline text-white hover:text-gray-400 cursor-pointer"
            >
              <FaUserCircle size={25} className="text-gray-400" />
              <span className="ml-3">{user?.name}</span>
            </div>
            <div
              className={`absolute top-8 -left-24 w-56 mx-2 flex flex-col py-2 items-start bg-gray-700 rounded ${
                openMenu ? '' : 'hidden'
              }`}
            >
              <div className="w-full py-2 hover:bg-gray-600">
                <Link href="/home/profile">
                  <a className="text-white no-underline mx-2 text-sm">プロフィール</a>
                </Link>
              </div>
              <div className="w-full text-white py-2 hover:bg-gray-600 cursor-pointer">
                <span className="mx-2 text-sm">ログアウト</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Header);
