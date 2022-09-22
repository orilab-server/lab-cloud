import { Fab } from '@mui/material';
import React from 'react';
import { MdAdd } from 'react-icons/md';
import { Uploads } from '../../../api/upload';
import { NewMenu } from '../../misc/newmenu/NewMenu';

type AddButtonProps = {
  currentDir: string;
  uploads: Uploads;
  isTrash?: boolean;
};

const AddButton = ({ currentDir, uploads, isTrash }: AddButtonProps) => {
  if (isTrash) {
    return (
      <Fab
        sx={{
          width: '100%',
          display: 'flex',
          mb: 1,
          minHeight: 50,
          justifyContent: 'start',
          zIndex: 1,
        }}
        variant="extended"
        disabled={true}
      >
        <MdAdd size={25} color="white" style={{ marginRight: 10, marginLeft: 1 }} />
        <strong style={{ marginRight: '1rem' }}>新規</strong>
      </Fab>
    );
  }

  return (
    <NewMenu path={currentDir} uploads={uploads}>
      <Fab
        sx={{
          width: '100%',
          display: 'flex',
          mb: 1,
          minHeight: 50,
          justifyContent: 'start',
          zIndex: 1,
        }}
        color="primary"
        variant="extended"
      >
        <MdAdd size={25} color="white" style={{ marginRight: 10, marginLeft: 1 }} />
        <strong style={{ marginRight: '1rem' }}>新規</strong>
      </Fab>
    </NewMenu>
  );
};

export default React.memo(AddButton);
