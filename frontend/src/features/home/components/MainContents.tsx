import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useSelectBox } from '@/hooks/useSelectBox';
import { notifyState } from '@/stores';
import { relativePathSlicer } from '@/utils/slice';
import { Box, Button, List, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';
import { useSelector } from '../../../hooks/useSelector';
import { useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
import { Uploads } from '../api/upload';
import { Storage } from '../types/storage';
import DirpathNavigation from './main/DirpathNavigation';
import EmptyDirDisplay from './main/EmptyDirDisplay';
import FilePathList from './main/FilePathList';
import ProgressBars from './main/ProgressBars';
import { SelectList } from './SelectList';

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
  const { downloadProgresses, downloadMutation, downloadCancelMutation } = useDownload();
  // 作成・削除リクエスト用mutation
  const requestMutation = useSendRequest();
  const { selected, unSelect, onStart, onMove, onResetKeyDownEscape } = useSelector();
  // セレクトボックス用hooks
  const [SortSelectForm, selectedSortValue] = useSelectBox('sort', selectSortValues);
  const [PrioritySelectForm, setctedPriorityValue] = useSelectBox('priority', selectPriorityValues);
  // recoil
  const setNotify = useSetRecoilState(notifyState);
  const [downloadFromLink, setDownloadFromLink] = useState<boolean>(false);
  const [downloadSelectedArray, setDownloadSelectedArray] = useState<
    { name: string; type: 'dir' | 'file' }[]
  >([]);
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
        <ProgressBars
          downloadProgresses={downloadProgresses}
          downloadCancelMutation={downloadCancelMutation}
        />
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
      <ProgressBars
        downloadProgresses={downloadProgresses}
        downloadCancelMutation={downloadCancelMutation}
        uploads={uploads}
      />
      {/* トップ階層より下は戻るボタンを用意 */}
      {!isHome ? (
        <Button color="inherit" onClick={() => moveDir(prevPath)}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <MdArrowBack />
            <Typography>戻る</Typography>
          </Stack>
        </Button>
      ) : null}
      <List>
        <DirpathNavigation
          important={important}
          baseDir={baseDir}
          dirs={dirs}
          relativePath={relativePath}
          moveDir={moveDir}
        />
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
