import { startDirPathSlicer } from '@/utils/slice';
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
  Theme,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, SxProps } from '@mui/system';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useModal } from 'react-hooks-use-modal';
import { AiFillFolder } from 'react-icons/ai';
import {
  MdCreateNewFolder,
  MdDelete,
  MdOutlineDriveFolderUpload,
  MdUploadFile,
} from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../../api/sendRequest';
import { Uploads } from '../../api/upload';

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

type ContextMenurops = {
  children: React.ReactNode;
  path: string;
  context?: boolean;
  anchorStyle?: SxProps<Theme> | undefined;
  uploads: Uploads;
  important?: boolean;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
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
  width: '50vw',
  p: 5,
  px: 10,
};

interface ExtendedFile extends File {
  path: string;
}

export const NewMenu = ({
  children,
  path,
  context,
  anchorStyle,
  uploads,
  requestMutation,
}: ContextMenurops) => {
  // アップロード用
  const {
    files,
    folders,
    setFiles,
    setFolders,
    addFiles,
    addFolders,
    deleteFile,
    deleteFolder,
    filesUploadMutation,
    foldersUploadMutation,
    resetFiles,
    resetFolders,
  } = uploads;
  const [folderName, setFolderName] = useState<string>('');
  const onChangeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };
  // モーダル用
  const [CreateModal, openCreateModal, closeCreateModal] = useModal('create');
  const [UploadFilesModal, openUploadFilesModal, closeUploadFileModal] = useModal('file-upload');
  const [UploadFoldersModal, openUploadFoldersModal, closeUploadFolderModal] =
    useModal('folder-upload');
  // コンテキストメニュー用state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // その他state
  const [isDropped, setIsDropped] = useState<boolean>(false);

  const onDrop = useCallback(async (accepted: File[]) => {
    const targetFiles = accepted
      .filter((item) => (item as ExtendedFile).path.match('/') === null)
      .map((item) => ({ type: 'file' as 'file', path, file: item, isDrop: true }));
    const filesInFolder = accepted.filter(
      (item) => (item as ExtendedFile).path.match('/') !== null,
    );
    const relativePaths = filesInFolder.map((item) =>
      startDirPathSlicer((item as ExtendedFile).path.slice(1)),
    );
    const noMultiRelativePaths = new Set(relativePaths);
    const targetFolders = Array.from(noMultiRelativePaths).map((relativePath) => {
      const files = filesInFolder.filter(
        (fileInFolder) =>
          relativePath === startDirPathSlicer((fileInFolder as ExtendedFile).path.slice(1)),
      );
      const fileNames = files.map((item) => (item as ExtendedFile).path);
      return {
        type: 'folder' as 'folder',
        path,
        name: relativePath,
        fileNames,
        files,
        isDrop: true,
      };
    });
    if (targetFiles.length > 0) {
      setFiles(targetFiles);
    }
    if (targetFolders.length > 0) {
      setFolders(targetFolders);
    }
    setIsDropped(true);
  }, []);
  const { getRootProps } = useDropzone({ onDrop, noClick: true });

  const handleFileClick = () => {
    inputRef.current?.click();
  };

  // ファイル・フォルダをドロップした際にuploadProgressesにセット
  useEffect(() => {
    if (isDropped) {
      const dropedFiles = files.filter((item) => item.isDrop);
      const dropedFolders = folders.filter((item) => item.isDrop);
      if (dropedFiles.length > 0) {
        const convertedUnDroppedFiles = dropedFiles.map((item) => ({ ...item, isDrop: false }));
        setFiles(convertedUnDroppedFiles);
        filesUploadMutation.mutate(path);
      }
      if (dropedFolders.length > 0) {
        const convertedUnDroppedFolders = dropedFolders.map((item) => ({ ...item, isDrop: false }));
        setFolders(convertedUnDroppedFolders);
        foldersUploadMutation.mutate(path);
      }
      setIsDropped(false);
    }
  }, [isDropped]);

  return (
    <div>
      {context ? (
        <div onContextMenu={handleClick} {...getRootProps()}>
          {children}
        </div>
      ) : (
        <div onClick={handleClick}>{children}</div>
      )}
      <Menu
        id="basic-menu"
        sx={anchorStyle}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* フォルダ作成ボタン */}
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
                onChange={onChangeFolderName}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    requestMutation.mutate({
                      path,
                      requests: [
                        {
                          requestType: 'mkdir',
                          dirName: folderName,
                        },
                      ],
                    });
                    setFolderName('');
                    closeCreateModal();
                  }}
                >
                  作成
                </Button>
                <Button onClick={closeCreateModal}>閉じる</Button>
              </Stack>
            </Stack>
          </CreateModal>
        </Box>
        <Divider />
        {/* ファイルアップロードボタン */}
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
        {/* フォルダアップロードボタン */}
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
      </Menu>
    </div>
  );
};
