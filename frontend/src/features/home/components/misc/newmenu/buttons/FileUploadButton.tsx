import { MyFile } from '@/features/home/types/upload';
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
import { MdCreateNewFolder, MdDelete, MdUploadFile } from 'react-icons/md';
import { UseMutationResult } from 'react-query';

type FileUploadButtonProps = {
  path: string;
  files: MyFile[];
  filesUploadMutation: UseMutationResult<void, unknown, string, unknown>;
  addFiles: (event: React.ChangeEvent<HTMLInputElement>, path: string) => void;
  deleteFile: (name: string) => void;
  resetFiles: () => void;
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

const FileUploadButton = ({
  path,
  files,
  filesUploadMutation,
  addFiles,
  deleteFile,
  resetFiles,
}: FileUploadButtonProps) => {
  const [UploadFilesModal, openUploadFilesModal, closeUploadFileModal] = useModal('file-upload');
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFileClick = () => {
    inputRef.current?.click();
  };

  return (
    <>
      <MenuItem onClick={openUploadFilesModal}>
        <ListItemIcon>
          <MdUploadFile fontSize={20} />
        </ListItemIcon>
        <ListItemText>ファイルをアップロード</ListItemText>
      </MenuItem>
      <Box id="file-upload" sx={{ width: '100%' }}>
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
            <input hidden multiple type="file" ref={inputRef} onChange={(e) => addFiles(e, path)} />
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
                  resetFiles();
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

export default React.memo(FileUploadButton);
