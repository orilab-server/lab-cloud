import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { useFilePaths } from '@/features/home/api/getFilePaths';
import FloatingButton from '@/features/home/components/FloatingButton';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';
import { ScreenLoading } from '@/shared/components/ScreenLoading';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const filePathsQuery = useFilePaths();
  const userQuery = useUser();
  const router = useRouter();

  const moveDir = async (path: string) => {
    await router.push(`/home/?path=${path}`);
  };

  if (userQuery.data?.is_temporary) {
    return <SignUpComplete />;
  }

  if (!filePathsQuery.data || filePathsQuery.isLoading) {
    return <ScreenLoading />;
  }

  const filePaths = filePathsQuery.data.filePaths || [];
  const currentDir = filePathsQuery.data.currentdir;
  const baseDir = filePathsQuery.data.baseDir;
  const topDirs = filePathsQuery.data.topDirs || [];
  const isHome = filePathsQuery.data.isTop;
  const important = filePathsQuery.data.important;

  return (
    <MainLayout>
      <ContentsLayout>
        <div className="grid grid-cols-6 w-[calc(100vw_-_16rem)] min-w-[1000px] px-2 py-1 divide-x border-b fixed top-14 bg-white">
          <div className="col-span-3 pl-2">名前</div>
          <div className="pl-2">サイズ</div>
          <div className="pl-2">種類</div>
          <div className="pl-2">追加日</div>
        </div>
        <div className="pt-9"></div>
        {/* ここにファイルリスト */}
        <div className="pb-9"></div>
        <div className="fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
          <span>Share</span>
        </div>
        <FloatingButton />
      </ContentsLayout>
    </MainLayout>
  );
};

export default Home;
