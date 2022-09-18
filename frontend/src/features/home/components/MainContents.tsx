import { useSelectBox } from '@/hooks/useSelectBox';
import { relativePathSlicer } from '@/utils/slice';
import { Box, Button, List, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useSelector } from '../../../hooks/useSelector';
import { useDownload } from '../api/download';
import { useSendRequest } from '../api/sendRequest';
import { Uploads } from '../api/upload';
import { Storage } from '../types/storage';
import DirpathNavigation from './main/DirpathNavigation';
import DownloadFromLinkModal from './main/DownloadFromLinkModal';
import EmptyDirDisplay from './main/EmptyDirDisplay';
import FilePathList from './main/FilePathList';
import ProgressBars from './main/ProgressBars';

type MainContentsProps = {
  filepaths: Storage['filepaths'];
  currentdir: string;
  baseDir: string;
  isHome: boolean;
  uploads: Uploads;
  important?: boolean;
  moveDir: (path: string) => Promise<void>;
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
  // ダウンロードリンク関連
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
  // ディレクトリパス関連
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
      <DownloadFromLinkModal
        currentDir={currentdir}
        downloadSelectedArray={downloadSelectedArray}
        downloadProgresses={downloadProgresses}
        downloadMutation={downloadMutation}
        downloadCancelMutation={downloadCancelMutation}
        setDownloadFromLink={setDownloadFromLink}
      />
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
