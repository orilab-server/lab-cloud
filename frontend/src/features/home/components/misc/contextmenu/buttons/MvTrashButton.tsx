import { FileOrDirItem, StorageFileOrDirItem } from '@/features/home/types/storage';
import { endFilenameSlicer } from '@/utils/slice';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdDelete } from 'react-icons/md';
import { SelectList } from '../../SelectList';

type MvTrashButtonProps = {
  selects: StorageFileOrDirItem[];
  mvTrashRequest: (targets: FileOrDirItem[]) => void;
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

const DeleteButton = ({ selects, mvTrashRequest, setAnchorEl }: MvTrashButtonProps) => {
  const [MvTrashModal, openMvTrashModal, closeMvTrashModal] = useModal('mv-trash');

  return (
    <>
      <MenuItem onClick={openMvTrashModal}>
        <ListItemIcon>
          <MdDelete fontSize={20} />
        </ListItemIcon>
        <ListItemText>ゴミ箱に移動</ListItemText>
      </MenuItem>
      <Box id="mv-trash" sx={{ width: '100%' }}>
        <MvTrashModal>
          <Box sx={modalStyle}>
            <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
              <div>ゴミ箱に移動しますか？</div>
              <SelectList selects={selects} />
              <Stack direction="row" spacing={2}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    mvTrashRequest(
                      selects.map((select) => ({
                        name: endFilenameSlicer(select.path),
                        type: select.type,
                      })),
                    );
                    setAnchorEl(null);
                  }}
                >
                  削除
                </Button>
                <Button onClick={closeMvTrashModal}>閉じる</Button>
              </Stack>
            </Stack>
          </Box>
        </MvTrashModal>
      </Box>
    </>
  );
};

export default React.memo(DeleteButton);
