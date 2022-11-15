import { useUpload } from '@/features/home/api/upload';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import { useRef } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdCreateNewFolder, MdDelete } from 'react-icons/md';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'white',
  boxShadow: 24,
  width: '50vw',
  p: 5,
  px: 10,
  zIndex: 1000,
};

type UploadFileList = {
  path: string;
  modalButton?: JSX.Element;
};

type ReturnType = [({ path, modalButton }: UploadFileList) => JSX.Element, () => void, boolean];

export const useUploadFileList = (): ReturnType => {
  const { files, addFiles, deleteFile, resetFiles, filesUploadMutation } = useUpload();
  const [UploadFilesModal, openUploadFilesModal, closeUploadFileModal, isOpen] =
    useModal('home-root');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const UploadFileList = ({ path, modalButton }: UploadFileList) => {
    return (
      <>
        {modalButton && <div onClick={openUploadFilesModal}>{modalButton}</div>}
        <Box sx={{ width: '100%' }}>
          <UploadFilesModal>
            <Stack sx={modalStyle} spacing={6} alignItems="center">
              <List>
                {files.map((item) => (
                  <ListItem
                    key={item.file.name}
                    secondaryAction={
                      <IconButton
                        onClick={() => {
                          deleteFile(item.file.name);
                        }}
                        edge="end"
                      >
                        <MdDelete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <MdCreateNewFolder />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.file.name} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" color="secondary" onClick={handleFileClick}>
                ファイルを追加
              </Button>
              <input
                hidden
                multiple
                type="file"
                ref={inputRef}
                onChange={(e) => addFiles(e, path)}
              />
              <Stack direction="row" spacing={2} sx={{ pt: 5 }}>
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  disabled={files.length === 0}
                  variant="contained"
                  onClick={() => {
                    filesUploadMutation.mutate(path);
                    closeUploadFileModal();
                    resetFiles();
                  }}
                >
                  アップロード
                </Button>
                <Button
                  onClick={() => {
                    closeUploadFileModal();
                  }}
                >
                  閉じる
                </Button>
              </Stack>
            </Stack>
          </UploadFilesModal>
        </Box>
      </>
    );
  };

  return [UploadFileList, openUploadFilesModal, isOpen];
};