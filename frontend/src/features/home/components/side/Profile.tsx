import { TextSkelton } from '@/shared/components/TextSkelton';
import { Avatar, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';

type ProfileProps = {
  name?: string;
};

const Profile = ({ name }: ProfileProps) => {
  const router = useRouter();

  return (
    <Stack
      onClick={() => router.push('/home/profile')}
      direction="row"
      alignItems="center"
      spacing={2}
      sx={{
        p: 1,
        my: 2,
        boxShadow: '1px 1px 1px 1px #ccc',
        borderRadius: 20,
        cursor: 'pointer',
        '&:hover': {
          background: '#ccc',
        },
      }}
    >
      <Avatar sx={{ bgcolor: 'green' }}>
        <BsPersonCircle />
      </Avatar>
      <Typography variant="h6" component="div">
        {name || <TextSkelton sx={{ fontSize: '2.5rem', borderRadius: '10px', width: '8rem' }} />}
      </Typography>
    </Stack>
  );
};

export default React.memo(Profile);
