import { notifyState } from '@/stores';
import { Box, Button, Input, ListItemIcon, ListItemText, Stack } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useRef, useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdDelete, MdOutlineLink } from 'react-icons/md';
import { RiDownloadFill } from 'react-icons/ri';
import { useSetRecoilState } from 'recoil';
import { SelectList } from './SelectList';

type ContextMenurops = {
  selects: { name: string; type: 'dir' | 'file' }[];
  path: string;
  children: React.ReactNode;
  link: string;
  important?: boolean;
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
  link,
  important,
  downloadItems,
  requestItems,
}: ContextMenurops) => {
  const [DownloadModal, openDownloadModal, closeDownloadModal] = useModal('download');
  const [DeleteModal, openDeleteModal, closeDeleteModal] = useModal('delete');
  const [CopyModal, openCopyModal, closeCopyModal] = useModal('copy-link');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const linkRef = useRef(null);
  const setNotify = useSetRecoilState(notifyState);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = () => {
    const linkBox = document.getElementById('copy');
    // @ts-ignore
    linkBox?.select();
    document.execCommand('copy');
    setAnchorEl(null);
    setNotify({ severity: 'info', text: 'コピーしました！' });
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
        {/* 削除用ボタン (重要ディレクトリは削除できない) */}
        {important ? null : (
          <div>
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
          </div>
        )}
        <MenuItem onClick={openCopyModal}>
          <ListItemIcon>
            <MdOutlineLink fontSize={20} />
          </ListItemIcon>
          <ListItemText>リンクをコピー</ListItemText>
        </MenuItem>
        <Box id="copy-link" sx={{ width: '100%' }}>
          <CopyModal>
            <Box sx={modalStyle}>
              <Stack sx={{ py: 2, px: 5 }} spacing={2} alignItems="center">
                <div>ボタンを押してコピーしてください</div>
                <Input
                  id="copy"
                  ref={linkRef}
                  sx={{
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50vh',
                    overflowWrap: 'break-word',
                    wordBreak: 'break-all',
                    background: 'rgba(0,0,0,0.1)',
                  }}
                  defaultValue={link}
                ></Input>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="medium"
                    variant="contained"
                    sx={{ whiteSpace: 'nowrap' }}
                    onClick={handleCopyLink}
                  >
                    コピー
                  </Button>
                  <Button onClick={closeCopyModal}>閉じる</Button>
                </Stack>
              </Stack>
            </Box>
          </CopyModal>
        </Box>
      </Menu>
    </div>
  );
};
