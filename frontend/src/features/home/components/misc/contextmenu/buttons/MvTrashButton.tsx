import { StorageFileOrDirItem } from '@/features/home/types/storage';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdDelete } from 'react-icons/md';
import { SelectList } from '../../SelectList';

type MvTrashButtonProps = {
  selects: StorageFileOrDirItem[];
  mvTrashRequest: () => void;
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
  const [DeleteModal, openDeleteModal, closeDeleteModal] = useModal('delete');

  return (
    <>
      <MenuItem onClick={openDeleteModal}>
        <ListItemIcon>
          <MdDelete fontSize={20} />
        </ListItemIcon>
        <ListItemText>ゴミ箱に移動</ListItemText>
      </MenuItem>
      <Box id="delete" sx={{ width: '100%' }}>
        <DeleteModal>
          <Box sx={modalStyle}>
            <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
              <div>ゴミ箱に移動しますか？</div>
              <SelectList selects={selects} />
              <Stack direction="row" spacing={2}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    mvTrashRequest();
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
    </>
  );
};

export default React.memo(DeleteButton);
