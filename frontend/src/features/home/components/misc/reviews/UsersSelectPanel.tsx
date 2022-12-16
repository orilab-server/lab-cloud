import { User } from '@/features/auth/types/user';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React, { Dispatch, SetStateAction } from 'react';

type UsersSelectPanelProps = {
  selectedState: [string[], Dispatch<SetStateAction<string[]>>];
  users: User[];
};

const UsersSelectPanel = ({ selectedState, users }: UsersSelectPanelProps) => {
  const [selected, setSelected] = selectedState;

  return (
    <Box
      sx={{
        width: '100%',
        height: 120,
        border: '1px solid #ccc',
        borderRadius: 1,
        overflow: 'scroll',
      }}
    >
      <Grid container xs={12} sx={{ width: '100%' }}>
        {users.map((user) => (
          <Grid
            item
            onClick={() => {
              setSelected((old) => {
                if (old.includes(`${user.id},${user.name}`)) {
                  return old.filter((item) => item !== `${user.id},${user.name}`);
                }
                return [...old, `${user.id},${user.name}`];
              });
            }}
            key={user.id}
            xs={6}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 1,
              p: 2,
              background: selected.includes(`${user.id},${user.name}`) ? '#87CEFA' : '',
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(0,0,0,0.1)',
              },
            }}
          >
            {user.name}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default React.memo(UsersSelectPanel);
