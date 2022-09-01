import { TextSkelton } from '@/components/TextSkelton';
import { useLogout } from '@/features/auth/api/logout';
import { endFilenameSlicer } from '@/utils/slice';
import {
  Avatar,
  Divider,
  Fab,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { MdAdd, MdLogout } from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../api/sendRequest';
import { NewMenu } from './NewMenu';

const style = {
  width: '100%',
  bgcolor: 'background.paper',
};

type SideContentsProps = {
  name?: string;
  topDirs: string[];
  currentDir: string;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
  moveDir: (path: string) => Promise<void>;
};

export const SideContents = ({
  name,
  topDirs,
  currentDir,
  requestMutation,
  moveDir,
}: SideContentsProps) => {
  const logoutMutation = useLogout();

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          width: 200,
          height: '100%',
          pt: 5,
          pl: 3,
          pr: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} pb={3}>
          <Avatar sx={{ bgcolor: 'green' }}>
            <BsPersonCircle />
          </Avatar>
          <Typography variant="h6" component="div">
            {name || (
              <TextSkelton sx={{ fontSize: '2.5rem', borderRadius: '10px', width: '8rem' }} />
            )}
          </Typography>
        </Stack>
        <NewMenu requestMutation={requestMutation} path={currentDir}>
          <Fab
            sx={{
              width: '100%',
              display: 'flex',
              mb: 1,
              minHeight: 50,
              justifyContent: 'start',
            }}
            color="primary"
            variant="extended"
          >
            <MdAdd size={25} color="white" style={{ marginRight: 10, marginLeft: 1 }} />
            <strong style={{ marginRight: '1rem' }}>新規</strong>
          </Fab>
        </NewMenu>
        <Fab
          sx={{
            width: '100%',
            mt: 1,
            mb: 2,
            display: 'flex',
            minHeight: 50,
            justifyContent: 'start',
          }}
          onClick={() => logoutMutation.mutate()}
          color="secondary"
          variant="extended"
        >
          <MdLogout size={25} style={{ marginRight: 10, marginLeft: 1 }} />
          <strong style={{ marginRight: '1rem' }}>ログアウト</strong>
        </Fab>
        <List sx={style} component="nav">
          <ListItem>
            <ListItemText sx={{ color: 'rgba(0,0,0,0.5)' }}>Share</ListItemText>
          </ListItem>
          <Box
            sx={{
              overflow: 'scroll',
              borderTop: '1px solid rgba(0,0,0,0.6)',
              height: 450,
            }}
          >
            {topDirs.map((item) => (
              <React.Fragment key={item}>
                <ListItem button onClick={() => moveDir(item)}>
                  <ListItemText primary={endFilenameSlicer(item)} />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </Box>
        </List>
      </Box>
    </Box>
  );
};
