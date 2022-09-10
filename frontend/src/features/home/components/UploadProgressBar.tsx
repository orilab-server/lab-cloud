import { CircularProgressWithLabel } from '@/components/CircularProgressWithLabel';
import { IconButton, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { MdCancel } from 'react-icons/md';
import { UploadProgress } from '../types/upload';

type UploadProgressSnackBar = {
  uploadProgress: UploadProgress;
  upload: () => void;
  cancel: () => void;
};

export const UploadProgressSnackBar = ({
  uploadProgress,
  upload,
  cancel,
}: UploadProgressSnackBar) => {
  const [isShow, setIsShow] = useState<boolean>(true);
  const { name, text, status, progress } = uploadProgress;

  useEffect(() => {
    if (status === 'start' && localStorage.getItem(name + '_uploadCancel') !== 'true') {
      upload();
    }
  }, [status]);

  const onClickCancel = () => {
    localStorage.setItem(name + '_uploadCancel', 'true');
    cancel();
  };

  if (!isShow) {
    return null;
  }

  const action = (
    <IconButton sx={{ color: 'white' }} onClick={onClickCancel}>
      <Stack alignItems="center">
        <MdCancel />
        <Box sx={{ fontSize: 3 }}>中断</Box>
      </Stack>
    </IconButton>
  );

  return (
    <Stack
      sx={{
        bgcolor: '#ccc',
        px: 3,
        borderRadius: 1,
        color: '#333',
        position: 'relative',
        zIndex: 999,
      }}
      direction="row"
      alignItems="center"
      spacing={3}
    >
      <CircularProgressWithLabel value={progress} />
      <Box>{text}</Box>
      {status !== 'pending' ? null : action}
      <MdCancel
        onClick={() => setIsShow(false)}
        style={{ position: 'absolute', top: -6, right: -5 }}
        fontSize={20}
      />
    </Stack>
  );
};
