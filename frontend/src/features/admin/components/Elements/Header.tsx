import Link from 'next/link';
import React from 'react';
import LabIcon from '../../../../../public/labo_icon.png';

const Header = () => {
  return (
    <nav className="fixed z-10 top-0 left-0 w-screen bg-gray-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link href="/home">
              <a className="flex ml-2 md:mr-6">
                <img className="h-8 mr-3" src={LabIcon.src}></img>
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  折田研究室
                </span>
              </a>
            </Link>
            <span className="text-lg whitespace-nowrap dark:text-white">HP管理</span>
          </div>
          <Link href="/home">
            <a className="text-white">ホームへ</a>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default React.memo(Header);
