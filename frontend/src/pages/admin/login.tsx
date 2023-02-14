import { useAdminLogin } from '@/features/admin/api/adminLogin';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import {
  Button,
  Container,
  createTheme,
  CssBaseline,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { NextPage } from 'next';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface AdminLoginInputs {
  email: string;
  password: string;
}

const theme = createTheme();

const AdminLogin: NextPage = () => {
  const loginMutation = useAdminLogin();

  const { handleSubmit, control } = useForm<AdminLoginInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin: SubmitHandler<AdminLoginInputs> = ({ email, password }) => {
    loginMutation.mutate({ email, password });
  };

  return (
    <AdminLayout isUnLogin={true}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box component="form" onSubmit={handleSubmit(onLogin)} noValidate sx={{ mt: 1 }}>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  id="email"
                  label="Email Address"
                  autoComplete="email"
                  autoFocus
                  margin="normal"
                  fullWidth
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  {...field}
                />
              )}
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
          </Box>
        </Container>
      </ThemeProvider>
    </AdminLayout>
  );
};

export default AdminLogin;
