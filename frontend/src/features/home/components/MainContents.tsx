import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useSelectBox } from '@/hooks/useSelectBox';
import { notifyState, uploadProgressesState } from '@/stores';
import { relativePathSlicer } from '@/utils/slice';
import { Box, Button, List, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useQueryClient } from 'react-query';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useSelector } from '../../../hooks/useSelector';
import { useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
import { uploadFile, uploadFolder, Uploads } from '../api/upload';
import { Storage } from '../types/storage';
import { MyFile, MyFolder } from '../types/upload';
import { DownloadProgressSnackBar } from './DownloadProgressBar';
import { EmptyDirDisplay } from './main/EmptyDirDisplay';
import { FilePathList } from './main/FilePathList';
import { SelectList } from './SelectList';
import { UploadProgressSnackBar } from './UploadProgressBar';

type MainContentsProps = {
  filepaths: Storage['filepaths'];
  currentdir: string;
  baseDir: string;
  isHome: boolean;
  uploads: Uploads;
  important?: boolean;
  moveDir: (path: string) => Promise<void>;
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'background.paper',
  p: 5,
  px: 10,
};

const selectSortValues = ['昇順', '降順'];

const selectPriorityValues = ['なし', 'フォルダ', 'ファイル'];

export const MainContents = ({
  filepaths,
  currentdir,
  baseDir,
  isHome,
  uploads,
  important,
  moveDir,
}: MainContentsProps) => {
  const router = useRouter();
  // ダウンロード用hooks
  const { downloadProgress, downloadMutation, downloadCancelMutation } = useDownload();
  // 作成・削除リクエスト用mutation
  const requestMutation = useSendRequest();
  const { selected, unSelect, onStart, onMove, onResetKeyDownEscape } = useSelector();
  // セレクトボックス用hooks
  const [SortSelectForm, selectedSortValue] = useSelectBox('sort', selectSortValues);
  const [PrioritySelectForm, setctedPriorityValue] = useSelectBox('priority', selectPriorityValues);
  // recoil
  const [uploadProgresses, setUploadProgresses] = useRecoilState(uploadProgressesState);
  const setNotify = useSetRecoilState(notifyState);
  const [downloadFromLink, setDownloadFromLink] = useState<boolean>(false);
  const [downloadSelectedArray, setDownloadSelectedArray] = useState<
    { name: string; type: 'dir' | 'file' }[]
  >([]);
  const queryClient = useQueryClient();
  const updateStorage = async () => await queryClient.invalidateQueries('storage');
  const uploadMyFile = (target: MyFile) => uploadFile(target, setUploadProgresses, updateStorage);
  const uploadMyFolder = (target: MyFolder) =>
    uploadFolder(target, setUploadProgresses, updateStorage);
  const { uploadCancelMutation } = uploads;
  const selectedArray = Array.from(selected).map((item) => ({
    name: item,
    type: filepaths.find((filepath) => filepath.path.match(`${currentdir}/${item}`))?.type as
      | 'dir'
      | 'file',
  }));
  const prevPath = currentdir.slice(0, currentdir.lastIndexOf('/'));
  const relativePath = relativePathSlicer(currentdir, baseDir);
  const dirs = relativePath.split('/');

  // クエリ文字列からダウンロードリンクからアクセスしたのかを判断するuseEffect
  useEffect(() => {
    const queries = router.query;
    if (Boolean(queries.share)) {
      if (downloadFromLink) {
        return;
      }
      const targetNames = (queries.targets as string).split('/');
      const targetTypes = (queries.types as string).split('/');
      const targets = targetNames.map((item, index) => ({
        name: item,
        type: targetTypes[index] as 'dir' | 'file',
      }));
      setDownloadSelectedArray(targets);
      setDownloadFromLink(true);
    }
  }, []);

  // ダウンロードリンクを開いた際の画面
  if (downloadFromLink) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100vh',
          bgcolor: 'rgba(0,0,0,0.8)',
          zIndex: 100,
        }}
      >
        <Stack
          sx={{
            position: 'absolute',
            bottom: 20,
            right: 20,
          }}
          spacing={1}
        >
          {downloadProgress.map((downloadProgress) => {
            return (
              <DownloadProgressSnackBar
                key={downloadProgress.name}
                response={downloadProgress}
                isFromLink={true}
                cancel={() => downloadCancelMutation.mutate(downloadProgress.name)}
              />
            );
          })}
        </Stack>
        <Box sx={modalStyle}>
          <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
            <div>以下をダウンロードしますか？</div>
            <SelectList selects={downloadSelectedArray} />
            <Stack direction="row" spacing={2}>
              <Button
                sx={{ whiteSpace: 'nowrap' }}
                size="medium"
                variant="contained"
                onClick={async () => {
                  setNotify({ severity: 'info', text: 'ダウンロード後, 移動します' });
                  await downloadMutation
                    .mutateAsync({ path: currentdir, targets: downloadSelectedArray })
                    .finally(async () => {
                      setDownloadFromLink(false);
                      await router.push(`/?path=${router.query.path}`);
                    });
                }}
              >
                {downloadMutation.isLoading && (
                  <LoadingSpinner size="sm" sx={{ color: '#fff', mr: 1 }} />
                )}
                ダウンロード
              </Button>
              <Button
                onClick={async () => {
                  setDownloadFromLink(false);
                  await router.push(`/?path=${router.query.path}`);
                }}
              >
                閉じる
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box onKeyDown={onResetKeyDownEscape} sx={{ flex: 6, height: '100%', pt: 3 }}>
      <Stack
        sx={{
          position: 'absolute',
          bottom: 20,
          right: 20,
        }}
        spacing={1}
      >
        {downloadProgress.map((downloadProgress) => {
          return (
            <DownloadProgressSnackBar
              key={downloadProgress.name}
              response={downloadProgress}
              cancel={() => downloadCancelMutation.mutate(downloadProgress.name)}
            />
          );
        })}
        {uploadProgresses.map((progress) => {
          if (progress.target.type === 'file') {
            return (
              <UploadProgressSnackBar
                key={progress.name}
                uploadProgress={progress}
                upload={() => uploadMyFile(progress.target as MyFile)}
                cancel={() => uploadCancelMutation.mutate(progress.name)}
              />
            );
          }
          return (
            <UploadProgressSnackBar
              key={progress.name}
              uploadProgress={progress}
              upload={() => uploadMyFolder(progress.target as MyFolder)}
              cancel={() => uploadCancelMutation.mutate(progress.name)}
            />
          );
        })}
      </Stack>
      {!isHome ? (
        <Button color="inherit" onClick={() => moveDir(prevPath)}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MdArrowBack />
            <Typography>戻る</Typography>
          </Stack>
        </Button>
      ) : null}
      <List>
        <Box py={2}>
          現在のパス :{' '}
          <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
            /{' '}
            <Typography
              component="span"
              onClick={() => moveDir(baseDir)}
              sx={{
                color: 'royalblue',
                borderBottom: '1px solid royalblue',
                cursor: 'pointer',
                '&:hover': {
                  color: 'rgba(0,0,0,0.3)',
                },
              }}
            >
              *Share
            </Typography>{' '}
            /{' '}
          </Typography>
          {dirs
            .filter((path) => path !== '')
            .map((dir, index) => {
              let targetPath = '/';
              if (relativePath.match(dir)) {
                targetPath = dirs.slice(0, dirs.indexOf(dir) + 1).join('/');
              }
              return (
                <React.Fragment key={dir + index}>
                  <Typography
                    component="span"
                    onClick={() => moveDir(baseDir + targetPath)}
                    sx={{
                      color: 'royalblue',
                      borderBottom: '1px solid royalblue',
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    {important && '*'}
                    {dir}
                  </Typography>
                  <Typography component="span" sx={{ color: 'rgba(0,0,0,0.5)' }}>
                    /{' '}
                  </Typography>
                </React.Fragment>
              );
            })}
        </Box>
        <SortSelectForm size="small" />
        <PrioritySelectForm size="small" />
        {/* 空の場所の場合(ドロップ&コンテキストメニュー使用可能) */}
        {filepaths.length === 0 && (
          <EmptyDirDisplay
            requestMutation={requestMutation}
            currentDir={currentdir}
            important={important}
            uploads={uploads}
          />
        )}
        <FilePathList
          filePaths={filepaths}
          important={important}
          selectedValue={`${selectedSortValue}-${setctedPriorityValue}`}
          selected={selected}
          selectedArray={selectedArray}
          downloadMutation={downloadMutation}
          requestMutation={requestMutation}
          onStart={onStart}
          onMove={onMove}
          moveDir={moveDir}
          unSelect={unSelect}
        />
      </List>
    </Box>
  );
};
