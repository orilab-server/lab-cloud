import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { VscFiles } from 'react-icons/vsc';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../../api/sendRequest';
import { Uploads } from '../../api/upload';
import { NewMenu } from '../misc/newmenu/NewMenu';

type EmptyDirDisplayProps = {
  currentDir: string;
  important?: boolean;
  uploads: Uploads;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
};

const EmptyDirDisplay = ({
  currentDir,
  important,
  uploads,
  requestMutation,
}: EmptyDirDisplayProps) => {
  return (
    <NewMenu
      requestMutation={requestMutation}
      path={currentDir}
      context={true}
      important={important}
      anchorStyle={{ top: -180, left: 400 }}
      uploads={uploads}
    >
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
          <VscFiles size={40} />
          <Typography sx={{ mt: 3, color: 'rgba(0,0,0,0.6)' }} fontSize={20}>
            ファイルを追加してください
          </Typography>
        </Box>
      </Box>
    </NewMenu>
  );
};

export default React.memo(EmptyDirDisplay);
