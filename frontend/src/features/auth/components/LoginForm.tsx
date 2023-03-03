import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, TextField } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import { useLogin } from '../api/login';

type LoginFormProps = {
  setIsRegisterForm: Dispatch<SetStateAction<boolean>>;
};

export const LoginForm = ({ setIsRegisterForm }: LoginFormProps) => {
  const loginMutation = useLogin();
  const goRegisterForm = () => setIsRegisterForm(true);

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

  return (
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
      <button type="submit" className="btn btn-primary w-full my-1">
        <span className="w-full px-3">ログイン</span>
        {loginMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
      </button>
      <button className="btn btn-secondary w-full my-1" onClick={goRegisterForm}>
        登録申請フォームへ
      </button>
    </Box>
  );
};
