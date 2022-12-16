import { Fab } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { MdReviews } from 'react-icons/md';

const GoReviewButton = () => {
  const router = useRouter();

  return (
    <Fab
      onClick={() => router.push('/reviews')}
      sx={{
        width: '100%',
        display: 'flex',
        minHeight: 50,
        justifyContent: 'start',
        zIndex: 1,
      }}
      variant="extended"
      color="warning"
    >
      <MdReviews size={25} color="white" style={{ marginRight: 10, marginLeft: 1 }} />
      <strong style={{ marginRight: '1rem' }}>レビュー</strong>
    </Fab>
  );
};

export default React.memo(GoReviewButton);
