import {
  Box,
  Chip,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { useState } from 'react';
import LabIcon from '../../../../public/oritaken_logo.png';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const theme = createTheme();

export const BeforeLoginForms = () => {
  const router = useRouter();
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ m: 1 }}>
            <img width="180px" style={{ aspectRatio: '16/9' }} src={LabIcon.src} alt="" />
          </Box>
          <Stack direction="row" sx={{}}>
            <Typography component="h1" variant="h5">
              Orilab Cloud Storage
            </Typography>
            <Chip
              label={process.env.NEXT_PUBLIC_APP_VERSION}
              sx={{ fontWeight: 600, fontSize: 24, mx: 1, py: 1, color: 'rgba(0,0,0,0.6)' }}
            />
          </Stack>
          <Typography component="h1" variant="h5">
            {isRegisterForm ? '登録申請' : 'ログイン'}
          </Typography>
          {isRegisterForm ? (
            <RegisterForm setIsRegisterForm={setIsRegisterForm} />
          ) : (
            <LoginForm setIsRegisterForm={setIsRegisterForm} />
          )}
          <button className="btn btn-link" onClick={() => router.push('/reset-password/request')}>
            パスワードを忘れた方
          </button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
