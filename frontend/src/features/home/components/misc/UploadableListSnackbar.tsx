import { Button, IconButton, Stack, Typography } from '@mui/material';
import React from 'react';
import { AiOutlineDelete } from 'react-icons/ai';

type UploadableListSnackbarProps = {
  itemText: string;
  itemList: unknown[];
  openModal: () => void;
  handleDelete: () => void;
};

export const UploadableListSnackbar = ({
  itemText,
  itemList,
  openModal,
  handleDelete,
}: UploadableListSnackbarProps) => {
  return (
    <>
      <Typography>
        {itemList.length}個の{itemText}があります
      </Typography>
      <Stack direction="row" justifyContent="space-between">
        <Button size="small" onClick={openModal}>
          アップロードする
        </Button>
        <React.Fragment>
          <IconButton onClick={handleDelete} size="large" aria-label="close" color="inherit">
            <AiOutlineDelete fontSize="large" />
          </IconButton>
        </React.Fragment>
      </Stack>
    </>
  );
};
