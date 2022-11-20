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
import { useUploadFolders } from '../api/upload/uploadFolders';

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

export const useUploadFolderList = (): ReturnType => {
  const { folders, addFolders, deleteFolder } = useUpload();
  const foldersUploadMutation = useUploadFolders();
  const [UploadFolderListModal, openUploadFolderListModal, closeUploadFolderListModal, isOpen] =
    useModal('home-root');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  const UploadFolderList = ({ path, modalButton }: UploadFileList) => {
    return (
      <>
        {modalButton && <div onClick={openUploadFolderListModal}>{modalButton}</div>}
        <Box sx={{ width: '100%' }}>
          <UploadFolderListModal>
            <Stack sx={modalStyle} spacing={6} alignItems="center">
              <List>
                {folders.map((folder) => (
                  <ListItem
                    key={folder.name}
                    secondaryAction={
                      <IconButton onClick={() => deleteFolder(folder.name)} edge="end">
                        <MdDelete />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <MdCreateNewFolder />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={folder.name} />
                  </ListItem>
                ))}
              </List>
              <Button variant="contained" color="secondary" onClick={handleFileClick}>
                フォルダを追加
              </Button>
              <input
                hidden
                multiple
                type="file"
                ref={inputRef}
                onChange={(e) => addFolders(e, path)}
                webkitdirectory="true"
              />
              <Stack direction="row" spacing={2} sx={{ pt: 5 }}>
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  disabled={folders.length === 0}
                  size="medium"
                  variant="contained"
                  onClick={async () => {
                    closeUploadFolderListModal();
                    foldersUploadMutation.mutate();
                  }}
                >
                  アップロード
                </Button>
                <Button
                  onClick={() => {
                    closeUploadFolderListModal();
                  }}
                >
                  閉じる
                </Button>
              </Stack>
            </Stack>
          </UploadFolderListModal>
        </Box>
      </>
    );
  };

  return [UploadFolderList, openUploadFolderListModal, isOpen];
};
