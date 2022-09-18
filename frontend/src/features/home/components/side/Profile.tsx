import { TextSkelton } from '@/components/TextSkelton';
import { Avatar, Stack, Typography } from '@mui/material';
import React from 'react';
import { BsPersonCircle } from 'react-icons/bs';

type ProfileProps = {
  name?: string;
};

const Profile = ({ name }: ProfileProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={2} pb={3}>
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
