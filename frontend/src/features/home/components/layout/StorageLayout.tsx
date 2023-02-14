import { Box, Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

type StorageLayoutProps = {
  children: React.ReactNode;
};

const StorageLayout = ({ children }: StorageLayoutProps) => {
  const router = useRouter();

  return (
    <Stack id="home-root" sx={{ minWidth: '1400px' }} direction="row" justifyContent="start">
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }}>
        <Button onClick={() => router.push('/admin')} sx={{ m: 1 }}>
          管理者ページ
        </Button>
      </Box>
      {children}
    </Stack>
  );
};

export default React.memo(StorageLayout);
