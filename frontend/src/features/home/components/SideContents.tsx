import { TextSkelton } from '@/components/TextSkelton';
import { useLogout } from '@/features/auth/api/logout';
import { endFilenameSlicer } from '@/utils/slice';
import {
  Avatar,
  createTheme,
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
import { useModal } from 'react-hooks-use-modal';
import { BsPersonCircle } from 'react-icons/bs';
import { MdAdd, MdLogout } from 'react-icons/md';
import { UseMutationResult } from 'react-query';
import { SendRequestMutationConfig } from '../api/sendRequest';
import { Uploads } from '../api/upload';
import { MailInquiryForm } from './MailInquiryForm';
import { NewMenu } from './NewMenu';

const style = {
  width: '100%',
  bgcolor: 'background.paper',
};

const theme = createTheme();

type SideContentsProps = {
  name?: string;
  topDirs: string[];
  currentDir: string;
  uploads: Uploads;
  important?: boolean;
  requestMutation: UseMutationResult<string[], unknown, SendRequestMutationConfig, unknown>;
  moveDir: (path: string) => Promise<void>;
};

export const SideContents = ({
  name,
  topDirs,
  currentDir,
  requestMutation,
  uploads,
  moveDir,
}: SideContentsProps) => {
  const logoutMutation = useLogout();
  const [MailModal, openMailModal, closeMailModal] = useModal('mail');

  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
      }}
    >
      <Box
        sx={{
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
        <Fab
          sx={{
            width: '100%',
            mt: 1,
            mb: 2,
            display: 'flex',
            minHeight: 50,
            justifyContent: 'start',
            zIndex: 1,
          }}
          onClick={() => logoutMutation.mutate()}
          color="secondary"
          variant="extended"
        >
          <MdLogout size={25} style={{ marginRight: 10, marginLeft: 1 }} />
          <strong style={{ marginRight: '1rem' }}>ログアウト</strong>
        </Fab>
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
        <List sx={style} component="nav">
          <ListItem>
            <ListItemText sx={{ color: 'rgba(0,0,0,0.5)' }}>Share</ListItemText>
          </ListItem>
          <Box
            sx={{
              overflow: 'scroll',
              borderTop: '1px solid rgba(0,0,0,0.6)',
              height: 320,
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
