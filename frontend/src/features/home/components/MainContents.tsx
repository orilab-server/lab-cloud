import { useSelectBox } from '@/shared/hooks/useSelectBox';
import { useSelector } from '@/shared/hooks/useSelector';
import { filesExists, foldersExists } from '@/shared/stores';
import { endFilenameSlicer, relativePathSlicer } from '@/shared/utils/slice';
import { Box, Button, List, Snackbar, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useRecoilValue } from 'recoil';
import { useUpload } from '../api/upload';
import { useUploadFileList } from '../hooks/useUploadFileList';
import { useUploadFolderList } from '../hooks/useUploadFolderList';
import { FileOrDir, Storage, StorageFileOrDirItem } from '../types/storage';
import DirpathNavigation from './main/DirpathNavigation';
import DownloadFromLinkModal from './main/DownloadFromLinkModal';
import EmptyDirDisplay from './main/EmptyDirDisplay';
import EmptyTrashDisplay from './main/EmptyTrashDisplay';
import FilePathList from './main/FilePathList';
import { UploadableListSnackbar } from './misc/UploadableListSnackbar';

type MainContentsProps = {
  filepaths: Storage['filePaths'];
  currentdir: string;
  trashDir: string;
  baseDir: string;
  isHome: boolean;
  isTrash?: boolean;
  important?: boolean;
  moveDir: (path: string) => Promise<void>;
};

const selectSortValues = ['昇順', '降順'];

const selectPriorityValues = ['なし', 'フォルダ', 'ファイル'];

export const MainContents = ({
  filepaths,
  currentdir,
  trashDir,
  baseDir,
  isHome,
  important,
  isTrash,
  moveDir,
}: MainContentsProps) => {
  const router = useRouter();
  // リストアイテム用hooks
  const { selected, unSelect, onStart, onMove, onResetKeyDownEscape } = useSelector();
  // セレクトボックス用hooks
  const [SortSelectForm, selectedSortValue] = useSelectBox('sort', selectSortValues);
  const [PrioritySelectForm, setctedPriorityValue] = useSelectBox('priority', selectPriorityValues);
  // ダウンロードリンク関連
  const [downloadFromLink, setDownloadFromLink] = useState<boolean>(false);
  const [downloadSelectedArray, setDownloadSelectedArray] = useState<StorageFileOrDirItem[]>([]);
  const selectedArray = Array.from(selected).map((item) => {
    const filepath = filepaths.find((filepath) => filepath.path.match(`${currentdir}/${item}`));
    return {
      id: filepath?.id || '',
      path: currentdir + '/' + item,
      type: filepath?.type as FileOrDir,
      pastLocation: filepath?.pastLocation || '',
    };
  });
  // ディレクトリパス関連
  const prevPath = currentdir.slice(0, currentdir.lastIndexOf('/'));
  const relativePath = relativePathSlicer(currentdir, baseDir);
  const dirs = relativePath.split('/');
  // ドロップ専用
  const [UploadFileListModal, openUploadFileListModal] = useUploadFileList();
  const [UploadFolderListModal, openUploadFolderListModal] = useUploadFolderList();
  const { files, folders, setFiles, setFolders } = useUpload();
  const filesEx = useRecoilValue(filesExists);
  const foldersEx = useRecoilValue(foldersExists);
  const handleDeleteFiles = () => setFiles([]);
  const handleDeleteFolders = () => setFolders([]);

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
        id: '',
        path: currentdir + '/' + item,
        type: targetTypes[index] as FileOrDir,
        pastLocation: '',
      }));
      setDownloadSelectedArray(targets);
      setDownloadFromLink(true);
    }
  }, []);

  const EmptyDisplay = () =>
    isTrash ? (
      <EmptyTrashDisplay
        isTopTrashDir={endFilenameSlicer(trashDir) === endFilenameSlicer(currentdir)}
      />
    ) : (
      <EmptyDirDisplay currentDir={currentdir} important={important} />
    );

  const BackButton = React.memo(() => {
    return (
      <Button color="inherit" onClick={() => moveDir(prevPath)}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <MdArrowBack />
          <Typography>戻る</Typography>
        </Stack>
      </Button>
    );
  });

  // ダウンロードリンクを開いた際の画面
  if (downloadFromLink) {
    return (
      <DownloadFromLinkModal
        currentDir={currentdir}
        downloadSelectedArray={downloadSelectedArray}
        setDownloadFromLink={setDownloadFromLink}
      />
    );
  }

  return (
    <Box
      id="main-root"
      onKeyDown={onResetKeyDownEscape}
      sx={{ flex: 6, height: '100%', pt: 3, position: 'relative' }}
    >
      {/* トップ階層より下は戻るボタンを用意 */}
      {!isHome ? <BackButton /> : null}
      {/* アップロード候補をスナックバーで表示 */}
      {(files.length > 0 || folders.length > 0) && (
        <Snackbar
          open={filesEx || foldersEx}
          autoHideDuration={Infinity}
          message={
            <Box sx={{ py: 1 }}>
              {filesEx && (
                <UploadableListSnackbar
                  itemText="ファイル"
                  itemList={files}
                  openModal={openUploadFileListModal}
                  handleDelete={handleDeleteFiles}
                />
              )}
              {foldersEx && (
                <UploadableListSnackbar
                  itemText="フォルダ"
                  itemList={folders}
                  openModal={openUploadFolderListModal}
                  handleDelete={handleDeleteFolders}
                />
              )}
              <Typography fontSize={5}>※再読み込みすると自動で消えます</Typography>
            </Box>
          }
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        />
      )}
      <UploadFileListModal path={currentdir} />
      <UploadFolderListModal path={currentdir} />
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
        <FilePathList
          currentDir={currentdir}
          filePaths={filepaths}
          isTrash={isTrash}
          important={important}
          selectedValue={`${selectedSortValue}-${setctedPriorityValue}`}
          selected={selected}
          selectedArray={selectedArray}
          onStart={onStart}
          onMove={onMove}
          moveDir={moveDir}
          unSelect={unSelect}
        />
        {/* 空の場所の場合(ドロップ&コンテキストメニュー使用可能) */}
        {filepaths.length === 0 && <EmptyDisplay />}
      </List>
    </Box>
  );
};
