import { useMvPastLocationRequest } from '@/features/home/api/request/mvPastLocation';
import { StorageFileOrDirItem } from '@/features/home/types/storage';
import { Button, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { SelectPairLocationList } from '../../SelectPastLocationList';

type MvPastLocationProps = {
  selects: StorageFileOrDirItem[];
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
  py: 5,
};

const MvPastLocation = ({ selects, setAnchorEl }: MvPastLocationProps) => {
  const [MvPastLocationModal, openMvPastLocationModal, closeMvPastLocationModal] =
    useModal('mv-pastlocation');
  const mvPastLocationMutation = useMvPastLocationRequest();
  const ids = selects.map((select) => select.id);

  return (
    <>
      <MenuItem onClick={openMvPastLocationModal}>
        <ListItemIcon>
          <RiArrowGoBackFill fontSize={20} />
        </ListItemIcon>
        <ListItemText>元の場所に戻す</ListItemText>
      </MenuItem>
      <Box id="mv-pastlocation" sx={{ width: '100%' }}>
        <MvPastLocationModal>
          <Box sx={modalStyle}>
            <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
              <div>以下の場所に戻しますか？</div>
              <SelectPairLocationList selects={selects} />
              <Stack direction="row" spacing={2}>
                <Button
                  size="medium"
                  variant="contained"
                  onClick={() => {
                    mvPastLocationMutation.mutate(ids);
                    setAnchorEl(null);
                  }}
                >
                  削除
                </Button>
                <Button onClick={closeMvPastLocationModal}>閉じる</Button>
              </Stack>
            </Stack>
          </Box>
        </MvPastLocationModal>
      </Box>
    </>
  );
};

export default React.memo(MvPastLocation);
