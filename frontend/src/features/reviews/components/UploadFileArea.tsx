import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, IconButton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillFileText } from 'react-icons/ai';
import { MdAdd, MdDelete } from 'react-icons/md';

type UploadFileAreaProps = {
  file: File | null;
  isLoading?: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  onUpload: () => Promise<void>;
};

const boxStyle = {
  width: '100%',
  cursor: 'pointer',
  background: 'rgba(240,248,255)',
  py: 3,
  '&:hover': {
    background: 'rgba(0,0,0,0.1)',
  },
};

const UploadFileArea = ({ file, isLoading, setFile, onUpload }: UploadFileAreaProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  if (file !== null) {
    return (
      <Stack sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
          <AiFillFileText size={25} />
          <Typography sx={{ fontSize: '14px', mx: 1 }}>{file.name}</Typography>
          <IconButton onClick={() => setFile(null)}>
            <MdDelete />
          </IconButton>
        </Stack>
        <Button disabled={isLoading} onClick={onUpload}>
          <Stack direction="row">{isLoading && <LoadingSpinner size="sm" color="primary" />}</Stack>
          <Typography sx={{ whiteSpace: 'nowrap', mx: 1 }}>アップロード</Typography>
        </Button>
      </Stack>
    );
  }

  return (
    <Box sx={{ width: '100%' }} {...getRootProps()}>
      <input {...getInputProps()} />
      <Stack direction="row" alignItems="center" sx={boxStyle}>
        <MdAdd style={{ margin: '0 5px' }} />
        <Stack>
          <Typography sx={{ fontSize: '14px', mx: 1 }}>アップロード</Typography>
          <Typography sx={{ fontSize: '10px', mx: 1 }}>ドラッグ&ドロップ可能</Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(UploadFileArea);
