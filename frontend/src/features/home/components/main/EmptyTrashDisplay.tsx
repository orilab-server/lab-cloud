import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { BsTrash2Fill } from 'react-icons/bs';

const EmptyTrashDisplay = () => {
  return (
    <Box
      sx={{
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '20rem',
          height: '20rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'whitesmoke',
          border: '1px solid rgba(0,0,0,0)',
          borderRadius: 50,
        }}
      >
        <BsTrash2Fill color="rgba(0,0,0,0.6)" size={100} />
        <Typography sx={{ mt: 3, color: 'rgba(0,0,0,0.6)' }} fontSize={20}>
          ゴミ箱は空です
        </Typography>
      </Box>
    </Box>
  );
};

export default React.memo(EmptyTrashDisplay);
