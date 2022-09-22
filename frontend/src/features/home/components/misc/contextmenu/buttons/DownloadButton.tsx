import { FileOrDirItem, StorageFileOrDirItem } from '@/features/home/types/storage';
import { endFilenameSlicer } from '@/utils/slice';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { RiDownloadFill } from 'react-icons/ri';
import { SelectList } from '../../SelectList';

type DownloadButtonProps = {
  selects: StorageFileOrDirItem[];
  downloadItems: (targets: FileOrDirItem[]) => void;
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

const DownloadButton = ({ selects, downloadItems, setAnchorEl }: DownloadButtonProps) => {
  const [DownloadModal, openDownloadModal, closeDownloadModal] = useModal('download');

  return (
    <>
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
                    downloadItems(
                      selects.map((select) => ({
                        name: endFilenameSlicer(select.path),
                        type: select.type,
                      })),
                    );
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
    </>
  );
};

export default React.memo(DownloadButton);
