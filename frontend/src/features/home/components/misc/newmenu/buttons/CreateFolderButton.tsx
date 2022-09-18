import { SendRequestMutationConfig } from '@/features/home/api/sendRequest';
import { Button, ListItemIcon, ListItemText, MenuItem, TextField } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useState } from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MdCreateNewFolder } from 'react-icons/md';
import { UseMutationResult } from 'react-query';

type CreateFolderButtonProps = {
  path: string;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
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
  bgcolor: 'white',
  boxShadow: 24,
  width: '50vw',
  p: 5,
  px: 10,
};

const CreateFolderButton = ({ path, requestMutation }: CreateFolderButtonProps) => {
  const [CreateModal, openCreateModal, closeCreateModal] = useModal('create');
  const [folderName, setFolderName] = useState<string>('');
  const onChangeFolderName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(event.target.value);
  };

  return (
    <>
      <MenuItem onClick={openCreateModal}>
        <ListItemIcon>
          <MdCreateNewFolder fontSize={20} />
        </ListItemIcon>
        <ListItemText>フォルダを作成</ListItemText>
      </MenuItem>
      <Box id="create" sx={{ width: '100%' }}>
        <CreateModal>
          <Stack sx={modalStyle} spacing={5} alignItems="center">
            <TextField
              label="フォルダ名入力"
              variant="standard"
              value={folderName}
              onChange={onChangeFolderName}
            />
            <Stack direction="row" spacing={2}>
              <Button
                size="medium"
                variant="contained"
                onClick={() => {
                  requestMutation.mutate({
                    path,
                    requests: [
                      {
                        requestType: 'mkdir',
                        dirName: folderName,
                      },
                    ],
                  });
                  setFolderName('');
                  closeCreateModal();
                }}
              >
                作成
              </Button>
              <Button onClick={closeCreateModal}>閉じる</Button>
            </Stack>
          </Stack>
        </CreateModal>
      </Box>
    </>
  );
};

export default React.memo(CreateFolderButton);
