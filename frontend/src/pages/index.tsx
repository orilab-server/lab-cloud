import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { useFilePaths } from '@/features/home/api/getFilePaths';
import ProgressBars from '@/features/home/components/main/ProgressBars';
import { MainContents } from '@/features/home/components/MainContents';
import PdfReview from '@/features/home/components/misc/PdfReview';
import { SideContents } from '@/features/home/components/SideContents';
import { ScreenLoading } from '@/shared/components/ScreenLoading';
import { pdfReviewState } from '@/shared/stores';
import { Box, Button, Stack } from '@mui/material';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { useRecoilValue } from 'recoil';

const Home: NextPage = () => {
  const filePathsQuery = useFilePaths();
  const userQuery = useUser();
  const router = useRouter();
  const pdfReview = useRecoilValue(pdfReviewState);

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

  const filePaths = filePathsQuery.data.filepaths || [];
  const currentDir = filePathsQuery.data.currentdir;
  const baseDir = filePathsQuery.data.basedir;
  const trashDir = filePathsQuery.data.trashdir;
  const topDirs = filePathsQuery.data.topdirs;
  const isHome = filePathsQuery.data.ishome;
  const isTrash = filePathsQuery.data.istrash;
  const important = filePathsQuery.data.important;

  return (
    <Stack id="home-root" sx={{ minWidth: '1400px' }} direction="row" justifyContent="start">
      {pdfReview && <PdfReview />}
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }}>
        <Button onClick={() => router.push('/admin')} sx={{ m: 1 }}>
          管理者ページ
        </Button>
      </Box>
      <SideContents
        topDirs={topDirs}
        currentDir={currentDir || '/'}
        trashDir={trashDir}
        moveDir={moveDir}
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
        moveDir={moveDir}
        isTrash={isTrash}
        important={important}
      />
      <ProgressBars />
    </Stack>
  );
};

export default Home;
