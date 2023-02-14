import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { useFilePaths } from '@/features/home/api/getFilePaths';
import ProgressBars from '@/features/home/components/main/ProgressBars';
import { MainContents } from '@/features/home/components/MainContents';
import { SideContents } from '@/features/home/components/SideContents';
import { ScreenLoading } from '@/shared/components/ScreenLoading';
import { Box, Button, Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

const Home: NextPage = () => {
  const filePathsQuery = useFilePaths();
  const userQuery = useUser();
  const router = useRouter();

  const moveDir = useCallback(
    async (path: string) => {
      await router.push(`${router.basePath}/?path=${path}`);
    },
    [router],
  );

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
    <Stack id="home-root" sx={{ minWidth: '1400px' }} direction="row" justifyContent="start">
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }}>
        <Button onClick={() => router.push('/admin')} sx={{ m: 1 }}>
          管理者ページ
        </Button>
      </Box>
      <SideContents
        topDirs={topDirs}
        currentDir={currentDir || '/'}
        trashDir={''}
        moveDir={moveDir}
        name={userQuery.data?.name}
        isTrash={false}
        important={important}
      />
      <MainContents
        filepaths={filePaths}
        currentdir={currentDir || '/'}
        trashDir={''}
        baseDir={baseDir}
        isHome={isHome}
        moveDir={moveDir}
        isTrash={false}
        important={important}
      />
      <ProgressBars />
    </Stack>
  );
};

export default Home;
