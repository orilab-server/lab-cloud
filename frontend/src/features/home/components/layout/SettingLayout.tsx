import { Stack } from '@mui/system';
import React from 'react';

type SettingLayoutProps = {
  children: React.ReactNode;
};

const SettingLayout = ({ children }: SettingLayoutProps) => {
  return (
    <Stack
      sx={{ width: '90vw', height: '100vh', mx: 'auto', py: 1 }}
      alignItems="center"
      justifyContent="start"
    >
      <Stack
        direction="row"
        sx={{ width: '100%', borderBottom: '2px solid rgba(0,0,0,0.5)', py: 2 }}
        justifyContent="space-between"
      >
        {children}
      </Stack>
    </Stack>
  );
};

export default React.memo(SettingLayout);
