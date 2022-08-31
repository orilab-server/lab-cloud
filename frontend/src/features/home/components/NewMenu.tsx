import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box } from '@mui/system';
import React, { useRef, useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { AiFillFolder } from 'react-icons/ai';
import {
  MdCreateNewFolder,
  MdDelete,
  MdOutlineDriveFolderUpload,
  MdUploadFile,
} from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../api/sendRequest';
import { useUploadFiles } from '../api/uploadFiles';
import { useUploadFolders } from '../api/uploadFolders';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

type ContextMenurops = {
  children: React.ReactNode;
  path: string;
  requestMutation: UseMutationResult<string, unknown, SendRequestMutationConfig, unknown>;
};

const formStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'center',
  padding: '20px 40px',
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
  boxShadow: 24,
  width: '60vw',
  p: 5,
  px: 10,
};

export const NewMenu = ({ children, path, requestMutation }: ContextMenurops) => {
  const { files, addFiles, deleteFile, fileUploadMutation } = useUploadFiles();
  const { folders, addFolders, deleteFolder, folderUploadMutation } = useUploadFolders();
  const [CreateModal, openCreateModal, closeCreateModal] = useModal('create');
  const [UploadFilesModal, openUploadFilesModal, closeUploadFileModal] = useModal('file-upload');
  const [UploadFoldersModal, openUploadFoldersModal, closeUploadFolderModal] =
    useModal('folder-upload');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folderName, setFolderName] = useState<string>('');
  const open = Boolean(anchorEl);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  const handleFileClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div onClick={handleClick}>{children}</div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={openCreateModal}>
          <ListItemIcon>
            <MdCreateNewFolder fontSize={20} />
          </ListItemIcon>
          <ListItemText>フォルダを作成</ListItemText>
        </MenuItem>
        <Box id="create" sx={{ width: '100%' }}>
          <CreateModal>
            <Stack sx={modalStyle} spacing={5} alignItems="center">
              <TextField
                label="フォルダ名入力"
                variant="standard"
                value={folderName}
                onChange={handleChangeText}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() =>
                    requestMutation.mutate({
                      path,
                      requests: [
                        {
                          requestType: 'mkdir',
                          dirName: folderName,
                        },
                      ],
                    })
                  }
                >
                  作成
                </Button>
                <Button onClick={closeCreateModal}>閉じる</Button>
              </Stack>
            </Stack>
          </CreateModal>
        </Box>
        <Divider />
        <MenuItem onClick={openUploadFilesModal}>
          <ListItemIcon>
            <MdUploadFile fontSize={20} />
          </ListItemIcon>
          <ListItemText>ファイルをアップロード</ListItemText>
        </MenuItem>
        <Box id="file-upload" sx={{ width: '100%' }}>
          <UploadFilesModal>
            <Stack sx={modalStyle} spacing={2} alignItems="center">
              <Button onClick={handleFileClick}>ファイルを追加</Button>
              <input hidden multiple type="file" ref={inputRef} onChange={addFiles} />
              <List>
                {files.map((file) => (
                  <ListItem
                    key={file.name}
                    secondaryAction={
                      <IconButton
                        onClick={() => {
                          deleteFile(file.name);
                          setAnchorEl(null);
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
                    <ListItemText primary={file.name} />
                  </ListItem>
                ))}
              </List>
              <Stack direction="row" spacing={2}>
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    fileUploadMutation.mutate(path);
                    setAnchorEl(null);
                  }}
                >
                  アップロード
                </Button>
                <Button onClick={closeUploadFileModal}>閉じる</Button>
              </Stack>
            </Stack>
          </UploadFilesModal>
        </Box>
        <MenuItem onClick={openUploadFoldersModal}>
          <ListItemIcon>
            <MdOutlineDriveFolderUpload fontSize={20} />
          </ListItemIcon>
          <ListItemText>フォルダをアップロード</ListItemText>
        </MenuItem>
        <Box id="folder-upload" sx={{ width: '100%' }}>
          <UploadFoldersModal>
            <Stack sx={modalStyle} spacing={2} alignItems="center">
              <Button onClick={handleFileClick}>フォルダを追加</Button>
              <input
                hidden
                multiple
                type="file"
                ref={inputRef}
                onChange={addFolders}
                webkitdirectory="true"
              />
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
              <Stack direction="row" spacing={2}>
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    folderUploadMutation.mutate(path);
                    setAnchorEl(null);
                  }}
                >
                  アップロード
                </Button>
                <Button onClick={closeUploadFolderModal}>閉じる</Button>
              </Stack>
            </Stack>
          </UploadFoldersModal>
        </Box>
      </Menu>
    </div>
  );
};
