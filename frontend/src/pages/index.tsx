import { ScreenLoading } from '@/components/ScreenLoading';
import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { useFilePaths } from '@/features/home/api/getFilePaths';
import { useSendRequest } from '@/features/home/api/sendRequest';
import { MainContents } from '@/features/home/components/MainContents';
import { SideContents } from '@/features/home/components/SideContents';
import { Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const filePathsQuery = useFilePaths();
  const requestMutation = useSendRequest();
  const userQuery = useUser();
  const router = useRouter();

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
  const topDirs = filePathsQuery.data.topdirs;
  const isHome = filePathsQuery.data.ishome;

  return (
    <Stack sx={{ minWidth: '1400px' }} direction="row" justifyContent="start">
      <SideContents
        topDirs={topDirs}
        currentDir={currentDir || '/'}
        moveDir={moveDir}
        requestMutation={requestMutation}
        name={userQuery.data?.name}
      />
      <MainContents
        filepaths={filePaths}
        currentdir={currentDir || '/'}
        baseDir={baseDir}
        isHome={isHome}
        moveDir={moveDir}
      />
    </Stack>
  );
};

export default Home;
