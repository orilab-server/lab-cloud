import { FileOrDirItem } from '@/features/home/types/storage';
import Menu from '@mui/material/Menu';
import React, { useState } from 'react';
import DeleteButton from './buttons/DeleteButton';
import DownloadButton from './buttons/DownloadButton';
import LinkCopyButton from './buttons/LinkCopyButton';

type ContextMenurops = {
  selects: FileOrDirItem[];
  path: string;
  children: React.ReactNode;
  link: string;
  important?: boolean;
  downloadItems: (targets: FileOrDirItem[]) => void;
  requestItems: () => void;
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  width: '50vw',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  px: 10,
};

export const ContextMenu = ({
  selects,
  children,
  link,
  important,
  downloadItems,
  requestItems,
}: ContextMenurops) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div onContextMenu={handleClick}>{children}</div>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {/* ダウンロードボタン */}
        <DownloadButton selects={selects} downloadItems={downloadItems} setAnchorEl={setAnchorEl} />
        {/* 削除用ボタン (重要ディレクトリは削除できない) */}
        {important ? null : (
          <DeleteButton selects={selects} requestItems={requestItems} setAnchorEl={setAnchorEl} />
        )}
        {/* リンクコピーボタン */}
        <LinkCopyButton link={link} setAnchorEl={setAnchorEl} />
      </Menu>
    </div>
  );
};
