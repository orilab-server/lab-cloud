import { ShareModal } from '@/components/Modal';
import { ListItemIcon, ListItemText, Stack, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import { MdDelete, MdOutlineLink } from 'react-icons/md';
import { RiDownloadFill } from 'react-icons/ri';

type ContextMenurops = {
  itemName: string;
  itemType: 'dir' | 'file';
  path: string;
  children: React.ReactNode;
  copyLink: () => void;
  downloadItems: () => void;
  requestItems: () => void;
};

export const ContextMenu = ({
  itemName,
  itemType,
  path,
  children,
  copyLink,
  downloadItems,
  requestItems,
}: ContextMenurops) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    copyLink();
    handleClose();
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
        <MenuItem
          onClick={() => {
            downloadItems();
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <RiDownloadFill fontSize={20} />
          </ListItemIcon>
          <ListItemText>ダウンロード</ListItemText>
        </MenuItem>
        <ShareModal
          onSend={() => {
            requestItems();
            setAnchorEl(null);
          }}
          sendText="削除"
          button={
            <MenuItem>
              <ListItemIcon>
                <MdDelete fontSize={20} />
              </ListItemIcon>
              <ListItemText>削除</ListItemText>
            </MenuItem>
          }
        >
          <Stack sx={{ py: 2 }} spacing={2} alignItems="center">
            <div>
              以下の{itemType === 'dir' ? 'フォルダ' : 'ファイル'}
              を削除しますか？
            </div>
            <Typography variant="h6">{itemName}</Typography>
          </Stack>
        </ShareModal>
        <MenuItem onClick={handleCopyLink}>
          <ListItemIcon>
            <MdOutlineLink fontSize={20} />
          </ListItemIcon>
          <ListItemText>リンクをコピー</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
