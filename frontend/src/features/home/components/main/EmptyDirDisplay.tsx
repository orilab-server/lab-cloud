import { filesExists, filesState, foldersExists, foldersState } from '@/stores';
import { Button, IconButton, Snackbar, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { VscFiles } from 'react-icons/vsc';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useDropItem } from '../../hooks/useDropItem';
import { useUploadFileList } from '../../hooks/useUploadFileList';
import { useUploadFolderList } from '../../hooks/useUploadFolderList';
import { DraggableArea } from '../misc/DraggableArea';

type EmptyDirDisplayProps = {
  currentDir: string;
  important?: boolean;
};

type SnackContents = {
  itemText: string;
  itemList: unknown[];
  openModal: () => void;
  handleDelete: () => void;
};

const SnackContents = ({ itemText, itemList, openModal, handleDelete }: SnackContents) => {
  return (
    <>
      <Typography>
        {itemList.length}個の{itemText}があります
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Button size="small" onClick={openModal}>
          アップロードする
        </Button>
        <React.Fragment>
          <IconButton onClick={handleDelete} size="large" aria-label="close" color="inherit">
            <AiOutlineDelete fontSize="large" />
          </IconButton>
        </React.Fragment>
      </Stack>
    </>
  );
};

const EmptyDirDisplay = ({ currentDir }: EmptyDirDisplayProps) => {
  const [UploadFileListModal, openUploadFileListModal] = useUploadFileList();
  const [UploadFolderListModal, openUploadFolderListModal] = useUploadFolderList();
  const [DropArea] = useDropItem(currentDir);
  const [files, setFiles] = useRecoilState(filesState);
  const [folders, setFolders] = useRecoilState(foldersState);
  const filesEx = useRecoilValue(filesExists);
  const foldersEx = useRecoilValue(foldersExists);
  const handleDeleteFiles = () => setFiles([]);
  const handleDeleteFolders = () => setFolders([]);

  return (
    <DropArea>
      <DraggableArea>
        <>
          {(files.length > 0 || folders.length > 0) && (
            <Snackbar
              open={filesEx || foldersEx}
              autoHideDuration={Infinity}
              message={
                <Box sx={{ py: 1 }}>
                  {filesEx && (
                    <SnackContents
                      itemText="ファイル"
                      itemList={files}
                      openModal={openUploadFileListModal}
                      handleDelete={handleDeleteFiles}
                    />
                  )}
                  {foldersEx && (
                    <SnackContents
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
          <UploadFileListModal path={currentDir} />
          <UploadFolderListModal path={currentDir} />
          <Box
            sx={{
              height: '80vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: '20rem',
                height: '20rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'whitesmoke',
                border: '1px solid rgba(0,0,0,0)',
                borderRadius: 50,
              }}
            >
              <VscFiles size={40} />
              <Typography sx={{ mt: 3, color: 'rgba(0,0,0,0.6)' }} fontSize={20}>
                ファイルを追加してください
              </Typography>
            </Box>
          </Box>
        </>
      </DraggableArea>
    </DropArea>
  );
};

export default React.memo(EmptyDirDisplay);
