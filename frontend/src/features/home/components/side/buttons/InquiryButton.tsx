import { Box, Fab } from '@mui/material';
import React from 'react';
import { useModal } from 'react-hooks-use-modal';
import { MailInquiryForm } from '../../misc/MailInquiryForm';

type InquiryButtonProps = {
  name?: string;
};

const InquiryButton = ({ name }: InquiryButtonProps) => {
  const [MailModal, openMailModal, closeMailModal] = useModal('mail');

  return (
    <>
      <Fab
        sx={{
          width: '100%',
          mt: 1,
          mb: 2,
          display: 'flex',
          minHeight: 50,
          justifyContent: 'center',
          zIndex: 1,
        }}
        onClick={openMailModal}
        color="success"
        variant="extended"
      >
        <strong style={{ marginRight: '1rem' }}>問い合わせ</strong>
      </Fab>
      <Box id="mail" sx={{ width: '100%' }}>
        <MailModal>
          <MailInquiryForm name={name} close={closeMailModal} />
        </MailModal>
      </Box>
    </>
  );
};

export default React.memo(InquiryButton);
