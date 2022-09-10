import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useMailSender } from '@/hooks/useMailSender';
import {
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { MdLockOutline } from 'react-icons/md';
import { useLogin } from '../api/login';

const theme = createTheme();

export const LoginForm = () => {
  const loginMutation = useLogin();
  const sendMailMutation = useMailSender();
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);
  const [isRegisterSend, setIsRegisterSend] = useState<boolean>(false);
  const goRegisterForm = () => setIsRegisterForm(true);
  const backLoginForm = () => setIsRegisterForm(false);
  const confirmSendAndBack = () => {
    setIsRegisterForm(false);
    setIsRegisterSend(false);
  };

  const onLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email')?.toString();
    const password = data.get('password')?.toString();
    if (email && password) {
      loginMutation.mutate({ email, password });
    } else {
      alert('メールアドレスとパスワードを入力してください');
    }
  };

  const onSendRegistrationRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString();
    const email = data.get('email')?.toString();
    if (name && email) {
      await sendMailMutation
        .mutateAsync({
          name,
          subject: '登録申請',
          body: `登録申請がきています。\n\n名前 : ${name}\nメールアドレス : ${email}`,
        })
        .then(() => {
          setIsRegisterSend(true);
        });
    } else {
      alert('名前とメールアドレスを入力してください');
    }
  };

  if (isRegisterSend) {
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
              Orilab Cloud Storage
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Typography component="h1" variant="h5">
                登録申請メールを送信しました
              </Typography>
              <Button
                color="secondary"
                onClick={confirmSendAndBack}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                ログイン画面に戻る
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // 登録申請用フォーム
  if (isRegisterForm) {
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
              Orilab Cloud Storage
            </Typography>
            <Typography component="h1" variant="h5">
              登録申請
            </Typography>
            <Box component="form" onSubmit={onSendRegistrationRequest} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="name"
                label="Your Name"
                type="text"
                id="name"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, whiteSpace: 'nowrap' }}
              >
                <Typography sx={{ width: '100%', textAlign: 'center' }}>送信</Typography>
                {sendMailMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
              </Button>
              <Button
                color="secondary"
                onClick={backLoginForm}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                戻る
              </Button>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  // ログインフォーム
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
            Orilab Cloud Storage
          </Typography>
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          <Box component="form" onSubmit={onLogin} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, whiteSpace: 'nowrap' }}
            >
              <Typography sx={{ width: '100%', textAlign: 'center' }}>ログイン</Typography>
              {loginMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
            </Button>
            <Button
              onClick={goRegisterForm}
              color="secondary"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              登録申請フォームへ
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
