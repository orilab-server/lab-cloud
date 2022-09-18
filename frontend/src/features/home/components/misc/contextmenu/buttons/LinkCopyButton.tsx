import { notifyState } from '@/stores';
import { Button, Input, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useRef } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdOutlineLink } from 'react-icons/md';
import { useSetRecoilState } from 'recoil';

type DownloadButtonProps = {
  link: string;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
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
  bgcolor: 'white',
  boxShadow: 24,
  p: 5,
  px: 10,
};

const LinkCopyButton = ({ link, setAnchorEl }: DownloadButtonProps) => {
  const [CopyModal, openCopyModal, closeCopyModal] = useModal('copy-link');
  const linkRef = useRef(null);
  const setNotify = useSetRecoilState(notifyState);

  const handleCopyLink = () => {
    const linkBox = document.getElementById('copy');
    // @ts-ignore
    linkBox?.select();
    document.execCommand('copy');
    setAnchorEl(null);
    setNotify({ severity: 'info', text: 'コピーしました！' });
  };

  return (
    <>
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
    </>
  );
};

export default React.memo(LinkCopyButton);
