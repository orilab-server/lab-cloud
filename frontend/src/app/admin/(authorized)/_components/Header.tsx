import Link from 'next/link';

const Header = () => {
  return (
    <nav className="fixed z-10 top-0 left-0 w-screen bg-gray-800">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <Link className="flex ml-2 md:mr-6" href="/admin">
              <img className="h-8 mr-3" src="/labo_icon.png"></img>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                折田研究室
                <span className="text-lg whitespace-nowrap dark:text-white ml-2">HP管理</span>
              </span>
            </Link>
          </div>
          <Link className="text-white" href="/home">
            ホームへ
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
