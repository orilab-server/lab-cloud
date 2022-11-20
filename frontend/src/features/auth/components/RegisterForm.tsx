import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useMailSender } from '@/shared/hooks/useMailSender';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { MdLockOutline } from 'react-icons/md';

type RegisterFormProps = {
  setIsRegisterForm: Dispatch<SetStateAction<boolean>>;
};

export const RegisterForm = ({ setIsRegisterForm }: RegisterFormProps) => {
  const sendMailMutation = useMailSender();
  const [isRegisterSend, setIsRegisterSend] = useState<boolean>(false);
  const backLoginForm = () => setIsRegisterForm(false);
  const confirmSendAndBack = () => {
    setIsRegisterForm(false);
    setIsRegisterSend(false);
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
    );
  }

  return (
    <Box component="form" onSubmit={onSendRegistrationRequest} noValidate sx={{ mt: 1 }}>
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
        name="name"
        label="Your Name"
        type="text"
        id="name"
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
  );
};
