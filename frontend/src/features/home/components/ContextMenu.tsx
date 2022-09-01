import { Box, Button, ListItemIcon, ListItemText, Stack } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdDelete, MdOutlineLink } from 'react-icons/md';
import { RiDownloadFill } from 'react-icons/ri';
import { SelectList } from './SelectList';

type ContextMenurops = {
  selects: { name: string; type: 'dir' | 'file' }[];
  path: string;
  children: React.ReactNode;
  copyLink: () => void;
  downloadItems: (targets: { name: string; type: 'dir' | 'file' }[]) => void;
  requestItems: () => void;
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
  p: 5,
  px: 10,
};

export const ContextMenu = ({
  selects,
  children,
  copyLink,
  downloadItems,
  requestItems,
}: ContextMenurops) => {
  const router = useRouter();
  const [DownloadModal, openDownloadModal, closeDownloadModal, isOpenDownloadModal] =
    useModal('download');
  const [DeleteModal, openDeleteModal, closeDeleteModal] = useModal('delete');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    copyLink();
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
        <MenuItem onClick={openDownloadModal}>
          <ListItemIcon>
            <RiDownloadFill fontSize={20} />
          </ListItemIcon>
          <ListItemText>ダウンロード</ListItemText>
        </MenuItem>
        <Box id="download" sx={{ width: '100%' }}>
          <DownloadModal>
            <Box sx={modalStyle}>
              <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
                <div>以下をダウンロードしますか？</div>
                <SelectList selects={selects} />
                <Stack direction="row" spacing={2}>
                  <Button
                    sx={{ whiteSpace: 'nowrap' }}
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      downloadItems(selects);
                      setAnchorEl(null);
                    }}
                  >
                    ダウンロード
                  </Button>
                  <Button onClick={closeDownloadModal}>閉じる</Button>
                </Stack>
              </Stack>
            </Box>
          </DownloadModal>
        </Box>
        <MenuItem onClick={openDeleteModal}>
          <ListItemIcon>
            <MdDelete fontSize={20} />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
        <Box id="delete" sx={{ width: '100%' }}>
          <DeleteModal>
            <Box sx={modalStyle}>
              <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
                <div>以下を削除しますか？</div>
                <SelectList selects={selects} />
                <Stack direction="row" spacing={2}>
                  <Button
                    size="medium"
                    variant="contained"
                    onClick={() => {
                      requestItems();
                      setAnchorEl(null);
                    }}
                  >
                    削除
                  </Button>
                  <Button onClick={closeDeleteModal}>閉じる</Button>
                </Stack>
              </Stack>
            </Box>
          </DeleteModal>
        </Box>
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
