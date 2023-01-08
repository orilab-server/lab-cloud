import { endFilenameSlicer } from '@/shared/utils/slice';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { RiDownloadFill } from 'react-icons/ri';

type DownloadButtonProps = {
  path: string;
  onDownload: () => Promise<void>;
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
  zIndex: 999,
};

const DownloadButton = ({ path, onDownload }: DownloadButtonProps) => {
  const fileName = endFilenameSlicer(path);
  const [DownloadModal, openDownloadModal, closeDownloadModal] = useModal('download');

  return (
    <>
      <MenuItem onClick={openDownloadModal}>
        <ListItemIcon>
          <RiDownloadFill fontSize={20} />
        </ListItemIcon>
        <ListItemText>ダウンロード</ListItemText>
      </MenuItem>
      <Box id="download" className="w-full z-[999]">
        <DownloadModal>
          <Box sx={modalStyle}>
            <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
              <div className="text-center">
                <div className="font-bold py-1 text-sky-800">{fileName}</div>
                をダウンロードしますか？
              </div>
              <Stack direction="row" spacing={2}>
                <Button
                  sx={{ whiteSpace: 'nowrap' }}
                  size="medium"
                  variant="contained"
                  onClick={async () => {
                    closeDownloadModal();
                    await onDownload();
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
    </>
  );
};

export default React.memo(DownloadButton);
