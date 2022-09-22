import { ScreenLoading } from '@/components/ScreenLoading';
import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { useFilePaths } from '@/features/home/api/getFilePaths';
import { useUpload } from '@/features/home/api/upload';
import { MainContents } from '@/features/home/components/MainContents';
import { SideContents } from '@/features/home/components/SideContents';
import { Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const filePathsQuery = useFilePaths();
  const userQuery = useUser();
  const router = useRouter();
  // アップロード用
  const uploads = useUpload();

  const moveDir = async (path: string) => {
    await router.push(`${router.basePath}/?path=${path}`);
  };

  if (userQuery.data?.is_temporary) {
    return <SignUpComplete />;
  }

  if (!filePathsQuery.data || filePathsQuery.isLoading) {
    return <ScreenLoading />;
  }

  const filePaths = filePathsQuery.data.filepaths || [];
  const currentDir = filePathsQuery.data.currentdir;
  const baseDir = filePathsQuery.data.basedir;
  const trashDir = filePathsQuery.data.trashdir;
  const topDirs = filePathsQuery.data.topdirs;
  const isHome = filePathsQuery.data.ishome;
  const isTrash = filePathsQuery.data.istrash;
  const important = filePathsQuery.data.important;

  return (
    <Stack sx={{ minWidth: '1400px' }} direction="row" justifyContent="start">
      <SideContents
        topDirs={topDirs}
        currentDir={currentDir || '/'}
        trashDir={trashDir}
        moveDir={moveDir}
        uploads={uploads}
        name={userQuery.data?.name}
        isTrash={isTrash}
        important={important}
      />
      <MainContents
        filepaths={filePaths}
        currentdir={currentDir || '/'}
        trashDir={trashDir}
        baseDir={baseDir}
        isHome={isHome}
        uploads={uploads}
        moveDir={moveDir}
        isTrash={isTrash}
        important={important}
      />
    </Stack>
  );
};

export default Home;
