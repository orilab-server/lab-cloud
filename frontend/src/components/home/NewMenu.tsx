import React, { useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import UploadFileIcon from "@mui/icons-material/UploadFile";
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
} from "@mui/material";
import { ShareModal } from "../misc/Modal";
import { UseMutationResult } from "react-query";
import { MkRmRequest } from "../../types/request";
import { useUpload } from "../../hooks/useUpload";
import { Folder } from "@mui/icons-material";

type ContextMenurops = {
  children: React.ReactNode;
  path: string;
  requestMutation: UseMutationResult<void, unknown, MkRmRequest, unknown>;
};

const formStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  padding: "20px 40px",
};

export const NewMenu = ({
  children,
  path,
  requestMutation,
}: ContextMenurops) => {
  const {
    files,
    folders,
    fileMutation,
    folderMutation,
    handleOnAddFile,
    handleOnDeleteFile,
    handleOnAddFolder,
    handleOnDeleteFolder,
  } = useUpload(path);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [folderName, setFolderName] = useState<string>("");
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
          "aria-labelledby": "basic-button",
        }}
      >
        <ShareModal
          onSend={() =>
            requestMutation.mutate({
              requestType: "mkdir",
              dirName: folderName,
            })
          }
          sendText="作成"
          button={
            <MenuItem>
              <ListItemIcon>
                <CreateNewFolderIcon fontSize="small" />
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
          onSend={() => fileMutation.mutate()}
          sendText="アップロード"
          button={
            <MenuItem>
              <ListItemIcon>
                <UploadFileIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>ファイルをアップロード</ListItemText>
            </MenuItem>
          }
        >
          <div style={formStyle}>
            <Button onClick={handleFileClick}>ファイルを追加</Button>
            <input
              hidden
              multiple
              type="file"
              ref={inputRef}
              onChange={handleOnAddFile}
            />
            <List>
              {files.map((file) => (
                <ListItem
                  key={file.name}
                  secondaryAction={
                    <IconButton
                      onClick={() => handleOnDeleteFile(file.name)}
                      edge="end"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <InsertDriveFileIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          </div>
        </ShareModal>
        <ShareModal
          onSend={() => folderMutation.mutate()}
          sendText="アップロード"
          button={
            <MenuItem>
              <ListItemIcon>
                <DriveFolderUploadIcon fontSize="small" />
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
              onChange={handleOnAddFolder}
              webkitdirectory="true"
            />
            <List>
              {folders.map((folder) => (
                <ListItem
                  key={folder.name}
                  secondaryAction={
                    <IconButton
                      onClick={() => handleOnDeleteFolder(folder.name)}
                      edge="end"
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <Folder />
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
