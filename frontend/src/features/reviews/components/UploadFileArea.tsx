import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, IconButton, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { ReactNode, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { AiFillFileText } from 'react-icons/ai';
import { MdAdd, MdDelete } from 'react-icons/md';

type UploadFileAreaProps = {
  file: File | null;
  isLoading?: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  type?: 'pdf' | 'docx';
  textInput?: ReactNode;
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

const extractFileTxt = (type: 'pdf' | 'docx') => {
  switch (type) {
    case 'pdf':
      return 'PDF';
    case 'docx':
      return 'Word';
  }
};

const UploadFileArea = ({
  file,
  isLoading,
  setFile,
  onUpload,
  textInput,
  type = 'pdf',
}: UploadFileAreaProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    switch (type) {
      case 'pdf': {
        if (acceptedFiles[0].type !== 'application/pdf') {
          alert('PDFのみアップロード可能です');
          return;
        }
      }
      case 'docx': {
        if (
          acceptedFiles[0].type !==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          alert('Wordのみアップロード可能です');
          return;
        }
      }
    }
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
        <Stack className="pb-3">
          {textInput}
          <Typography className="text-xs text-[#555555] pt-1">
            ※ デフォルトでは「ご確認よろしくお願い申し上げます」が送信されます
          </Typography>
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
      <input accept=".pdf" multiple={false} {...getInputProps()} />
      <Stack direction="row" alignItems="center" sx={boxStyle}>
        <MdAdd style={{ margin: '0 5px' }} />
        <Stack>
          <Typography sx={{ fontSize: '14px', mx: 1 }}>アップロード</Typography>
          <Typography sx={{ fontSize: '10px', mx: 1 }}>ドラッグ&ドロップ可能</Typography>
          <Typography sx={{ fontSize: '10px', mx: 1, textDecoration: 'underline' }}>
            ※ {extractFileTxt(type)}のみアップロード可能
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(UploadFileArea);
