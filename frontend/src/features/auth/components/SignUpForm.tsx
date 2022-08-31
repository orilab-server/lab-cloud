import { ThemeProvider } from '@emotion/react';
import {
  Avatar,
  Box,
  Button,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { useRegister } from '../api/register';

const theme = createTheme();

export const SignUpComplete = () => {
  const registerMutation = useRegister();
  const [routeChangeComplete, setRouteChangeComplete] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = data.get('password')?.toString();
    if (newPassword) {
      const params = new URLSearchParams();
      params.append('newPassword', newPassword);
      registerMutation.mutate({ params });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setRouteChangeComplete(true);
    }, 2 * 1000);
  }, []);

  if (!routeChangeComplete) {
    return null;
  }

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
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <MdOutlineAccountCircle />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Send
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};
