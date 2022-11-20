import { usePreviewFile } from '@/features/home/api/download/previewFile';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import React from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  width: '80vw',
  height: '80vh',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: 24,
};

const iconStyle = {
  position: 'absolute',
  top: -15,
  right: -15,
  background: 'black',
  borderRadius: '50%',
  color: 'white',
  cursor: 'pointer',
  '&:hover': {
    background: 'rgba(0,0,0,0.3)',
  },
} as React.CSSProperties;

type FilePreviewModalProps = {
  path: string;
  fileName: string;
  button: React.ReactNode;
};

export const FilePreviewModal = ({ path, fileName, button }: FilePreviewModalProps) => {
  const { url, open, handleOpen, handleClose } = usePreviewFile(path, fileName);

  return (
    <div>
      <div onDoubleClick={handleOpen}>{button}</div>
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {url === '' ? null : <embed src={url} width="100%" height="100%" />}
          <AiOutlineCloseCircle onClick={handleClose} fontSize={30} style={iconStyle} />
        </Box>
      </Modal>
    </div>
  );
};
