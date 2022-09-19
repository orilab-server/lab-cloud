import { MyFolder } from '@/features/home/types/upload';
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  MenuItem,
} from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useRef } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { AiFillFolder } from 'react-icons/ai';
import { MdDelete, MdOutlineDriveFolderUpload } from 'react-icons/md';
import { UseMutationResult } from 'react-query';

type FolderUploadButtonProps = {
  path: string;
  folders: MyFolder[];
  foldersUploadMutation: UseMutationResult<void, unknown, string, unknown>;
  addFolders: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  deleteFolder: (name: string) => void;
  resetFolders: () => void;
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
  bgcolor: 'white',
  boxShadow: 24,
  width: '50vw',
  p: 5,
  px: 10,
};

const FolderUploadButton = ({
  path,
  folders,
  foldersUploadMutation,
  addFolders,
  deleteFolder,
  resetFolders,
}: FolderUploadButtonProps) => {
  const [UploadFoldersModal, openUploadFoldersModal, closeUploadFolderModal] =
    useModal('folder-upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <MenuItem onClick={openUploadFoldersModal}>
        <ListItemIcon>
          <MdOutlineDriveFolderUpload fontSize={20} />
        </ListItemIcon>
        <ListItemText>フォルダをアップロード</ListItemText>
      </MenuItem>
      <Box id="folder-upload" sx={{ width: '100%' }}>
        <UploadFoldersModal>
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
                      <AiFillFolder />
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
                onClick={() => {
                  foldersUploadMutation.mutate(path);
                  closeUploadFolderModal();
                  resetFolders();
                }}
              >
                アップロード
              </Button>
              <Button
                onClick={() => {
                  resetFolders();
                  closeUploadFolderModal();
                }}
              >
                閉じる
              </Button>
            </Stack>
          </Stack>
        </UploadFoldersModal>
      </Box>
    </>
  );
};

export default React.memo(FolderUploadButton);
