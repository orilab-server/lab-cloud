import { Stack } from '@mui/system';
import React from 'react';
import DownloadProgressSnackBar from '../misc/progress/DownloadProgressBar';
import { UploadProgressSnackBar } from '../misc/progress/UploadProgressBar';

const ProgressBars = () => {
  return (
    <Stack
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
      }}
      spacing={1}
    >
      <DownloadProgressSnackBar />
      <UploadProgressSnackBar />
    </Stack>
  );
};

export default React.memo(ProgressBars);
