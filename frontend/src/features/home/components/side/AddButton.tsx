import { Fab } from '@mui/material';
import React from 'react';
import { MdAdd } from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../../api/sendRequest';
import { Uploads } from '../../api/upload';
import { NewMenu } from '../misc/NewMenu';

type AddButtonProps = {
  currentDir: string;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
  uploads: Uploads;
};

const AddButton = ({ currentDir, requestMutation, uploads }: AddButtonProps) => {
  return (
    <NewMenu requestMutation={requestMutation} path={currentDir} uploads={uploads}>
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
