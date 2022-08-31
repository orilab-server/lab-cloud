import { LoginForm } from '@/features/auth/components/LoginForm';
import { createTheme } from '@mui/material';
import { NextPage } from 'next';

const theme = createTheme();

const Login: NextPage = () => {
  return <LoginForm />;
};

export default Login;
