import { Divider, Theme } from '@mui/material';
import Menu from '@mui/material/Menu';
import { SxProps } from '@mui/system';
import React, { useState } from 'react';
import CreateFolderButton from './buttons/CreateFolderButton';
import FileUploadButton from './buttons/FileUploadButton';
import FolderUploadButton from './buttons/FolderUploadButton';

// webkitdirectory属性のビルドエラー回避
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
  important?: boolean;
};

interface ExtendedFile extends File {
  path: string;
}

export const NewMenu = ({ children, path, context, anchorStyle }: ContextMenurops) => {
  // コンテキストメニュー用state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div onClick={handleClick}>{children}</div>
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
        <CreateFolderButton path={path} />
        <Divider />
        {/* ファイルアップロードボタン */}
        <FileUploadButton path={path} />
        {/* フォルダアップロードボタン */}
        <FolderUploadButton path={path} />
      </Menu>
    </div>
  );
};
