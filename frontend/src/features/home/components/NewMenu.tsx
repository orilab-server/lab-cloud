import { ShareModal } from '@/components/Modal';
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
  TextField,
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useRef, useState } from 'react';
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

export const NewMenu = ({ children, path, requestMutation }: ContextMenurops) => {
  const { files, addFiles, deleteFile, fileUploadMutation } = useUploadFiles();
  const { folders, addFolders, deleteFolder, folderUploadMutation } = useUploadFolders();
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
        <ShareModal
          onSend={() =>
            requestMutation.mutate({
              body: {
                requestType: 'mkdir',
                dirName: folderName,
              },
              path,
            })
          }
          sendText="作成"
          button={
            <MenuItem>
              <ListItemIcon>
                <MdCreateNewFolder fontSize={20} />
              </ListItemIcon>
              <ListItemText>フォルダを作成</ListItemText>
            </MenuItem>
          }
        >
          <div style={formStyle}>
            <TextField
              label="フォルダ名入力"
              variant="standard"
              value={folderName}
              onChange={handleChangeText}
            />
          </div>
        </ShareModal>
        <Divider />
        <ShareModal
          onSend={() => fileUploadMutation.mutate(path)}
          sendText="アップロード"
          button={
            <MenuItem>
              <ListItemIcon>
                <MdUploadFile fontSize={20} />
              </ListItemIcon>
              <ListItemText>ファイルをアップロード</ListItemText>
            </MenuItem>
          }
        >
          <div style={formStyle}>
            <Button onClick={handleFileClick}>ファイルを追加</Button>
            <input hidden multiple type="file" ref={inputRef} onChange={addFiles} />
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.name}
                  secondaryAction={
                    <IconButton onClick={() => deleteFile(file.name)} edge="end">
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
          </div>
        </ShareModal>
        <ShareModal
          onSend={() => folderUploadMutation.mutate(path)}
          sendText="アップロード"
          button={
            <MenuItem>
              <ListItemIcon>
                <MdOutlineDriveFolderUpload fontSize={20} />
              </ListItemIcon>
              <ListItemText>フォルダをアップロード</ListItemText>
            </MenuItem>
          }
        >
          <div style={formStyle}>
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
          </div>
        </ShareModal>
      </Menu>
    </div>
  );
};
