import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React from 'react';

type ReviewLayoutProps = {
  children: React.ReactNode;
};

const ReviewLayout = ({ children }: ReviewLayoutProps) => {
  const router = useRouter();

  return (
    <Stack
      id="review"
      sx={{ width: '90vw', height: '100vh', mx: 'auto', py: 1 }}
      alignItems="start"
      justifyContent="start"
    >
      <Stack
        direction="row"
        sx={{ width: '100%', borderBottom: '2px solid rgba(0,0,0,0.5)', py: 2 }}
        justifyContent="space-between"
      >
        <Typography sx={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.6)' }}>レビュー画面</Typography>
        <Button onClick={() => router.push('/')}>ホームへ</Button>
      </Stack>
      {children}
    </Stack>
  );
};

export default React.memo(ReviewLayout);
