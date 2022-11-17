import { useRenameRequest } from '@/features/home/api/request/rename';
import { FileOrDir } from '@/features/home/types/storage';
import { Button, ListItemIcon, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { AiFillEdit } from 'react-icons/ai';

type RenameButtonProps = {
  type: FileOrDir;
  path: string;
  oldName: string;
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

const RenameButton = ({ type, path, oldName, setAnchorEl }: RenameButtonProps) => {
  const [RenameModal, openRenameModal, closeRenameModal] = useModal('rename');
  const renameMutation = useRenameRequest();

  const onRename = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newName = (() => {
      const name = data.get('new-name')?.toString();
      if (type === 'dir') {
        return name;
      }
      const extension = oldName.slice(oldName.lastIndexOf('.'));
      const withoutExtensionName = name?.slice(0, name.indexOf('.'));
      return `${withoutExtensionName}${extension}`;
    })();
    if (newName) {
      renameMutation.mutate({ oldName: `${path}/${oldName}`, newName: `${path}/${newName}` });
      setAnchorEl(null);
    } else {
      alert('入力してください.');
    }
  };

  return (
    <>
      <MenuItem onClick={openRenameModal}>
        <ListItemIcon>
          <AiFillEdit fontSize={20} />
        </ListItemIcon>
        <ListItemText>名前を変更</ListItemText>
      </MenuItem>
      <Box id="rename" sx={{ width: '100%' }}>
        <RenameModal>
          <Box onSubmit={onRename} component="form" sx={modalStyle}>
            <Stack sx={{ py: 2, px: 10 }} spacing={2} alignItems="center">
              <TextField
                defaultValue={oldName}
                margin="normal"
                required
                fullWidth
                id="new-name"
                label="New Name"
                name="new-name"
                autoFocus
              />
              <Typography sx={{ fontSize: 12 }}>※拡張子は変更できません</Typography>
              <Stack direction="row" spacing={2}>
                <Button size="medium" variant="contained" type="submit">
                  変更
                </Button>
                <Button onClick={closeRenameModal}>閉じる</Button>
              </Stack>
            </Stack>
          </Box>
        </RenameModal>
      </Box>
    </>
  );
};

export default React.memo(RenameButton);
