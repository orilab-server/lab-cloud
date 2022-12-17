import { IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { AiFillCloseCircle } from 'react-icons/ai';

type ModalLayoutProps = {
  children: React.ReactNode;
  closeModal?: () => void;
};

export const ModalLayout = ({ children, closeModal }: ModalLayoutProps) => {
  return (
    <>
      <IconButton
        onClick={closeModal}
        sx={{
          position: 'absolute',
          cursor: 'pointer',
          zIndex: 1000,
          top: 0,
          left: 0,
          '&:hover': {
            background: '#ccc',
          },
        }}
      >
        <AiFillCloseCircle size={30} />
      </IconButton>
      <Box
        sx={{
          position: 'relative',
          width: '80vw',
          height: '80vh',
          background: '#fff',
          borderRadius: 1,
          p: 5,
          overflow: 'scroll',
        }}
      >
        {children}
      </Box>
    </>
  );
};
