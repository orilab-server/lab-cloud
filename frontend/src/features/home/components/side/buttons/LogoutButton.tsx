import { useLogout } from '@/features/auth/api/logout';
import { Fab } from '@mui/material';
import React from 'react';
import { MdLogout } from 'react-icons/md';

const LogoutButton = () => {
  const logoutMutation = useLogout();
  return (
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
  );
};

export default React.memo(LogoutButton);
