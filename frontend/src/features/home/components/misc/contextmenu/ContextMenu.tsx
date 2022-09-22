import { FileOrDirItem, StorageFileOrDirItem } from '@/features/home/types/storage';
import Menu from '@mui/material/Menu';
import React, { useState } from 'react';
import DeleteButton from './buttons/DeleteButton';
import DownloadButton from './buttons/DownloadButton';
import LinkCopyButton from './buttons/LinkCopyButton';
import MvTrashButton from './buttons/MvTrashButton';

type ContextMenurops = {
  selects: StorageFileOrDirItem[];
  path: string;
  children: React.ReactNode;
  link: string;
  isTrash?: boolean;
  important?: boolean;
  downloadItems: (targets: FileOrDirItem[]) => void;
  mvTrashRequest: () => void;
  rmRequest: () => void;
};

export const ContextMenu = ({
  selects,
  children,
  link,
  isTrash,
  important,
  downloadItems,
  mvTrashRequest,
  rmRequest,
}: ContextMenurops) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const ImportantDirMenu = () => (
    <>
      <DownloadButton selects={selects} downloadItems={downloadItems} setAnchorEl={setAnchorEl} />
      <LinkCopyButton link={link} setAnchorEl={setAnchorEl} />
    </>
  );

  const TrashDirMenu = () => (
    <DeleteButton selects={selects} rmRequest={rmRequest} setAnchorEl={setAnchorEl} />
  );

  const GeneralMenu = () => (
    <>
      <DownloadButton selects={selects} downloadItems={downloadItems} setAnchorEl={setAnchorEl} />
      <MvTrashButton selects={selects} mvTrashRequest={mvTrashRequest} setAnchorEl={setAnchorEl} />
      <LinkCopyButton link={link} setAnchorEl={setAnchorEl} />
    </>
  );

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
        {isTrash ? <TrashDirMenu /> : important ? <ImportantDirMenu /> : <GeneralMenu />}
      </Menu>
    </div>
  );
};
