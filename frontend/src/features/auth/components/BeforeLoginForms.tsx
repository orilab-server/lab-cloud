import {
  Avatar,
  Box,
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { MdLockOutline } from 'react-icons/md';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const theme = createTheme();

export const BeforeLoginForms = () => {
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <MdLockOutline />
          </Avatar>
          <Typography component="h1" variant="h5">
            Orilab Cloud Storage V 1.1
          </Typography>{' '}
          <Typography component="h1" variant="h5">
            {isRegisterForm ? '登録申請' : 'ログイン'}
          </Typography>
          {isRegisterForm ? (
            <RegisterForm setIsRegisterForm={setIsRegisterForm} />
          ) : (
            <LoginForm setIsRegisterForm={setIsRegisterForm} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};
