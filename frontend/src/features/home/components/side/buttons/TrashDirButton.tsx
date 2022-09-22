import { Fab } from '@mui/material';
import React from 'react';
import { BsTrash2Fill } from 'react-icons/bs';

type TrashBoxProps = {
  moveTrashDir: () => void;
};

const TrashBox = ({ moveTrashDir }: TrashBoxProps) => {
  return (
    <Fab
      onClick={moveTrashDir}
      sx={{
        width: '100%',
        display: 'flex',
        mb: 1,
        minHeight: 50,
        justifyContent: 'start',
        zIndex: 1,
      }}
      color="inherit"
      variant="extended"
    >
      <BsTrash2Fill size={25} color="rgba(0,0,0,0.6)" style={{ marginRight: 10, marginLeft: 1 }} />
      <strong style={{ marginRight: '1rem' }}>ゴミ箱</strong>
    </Fab>
  );
};

export default React.memo(TrashBox);
