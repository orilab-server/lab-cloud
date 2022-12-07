import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { useMailSender } from '@/shared/hooks/useMailSender';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { MdLockOutline } from 'react-icons/md';
import { useRequestRegister } from '../api/request-register';

type RegisterFormProps = {
  setIsRegisterForm: Dispatch<SetStateAction<boolean>>;
};

interface RegisterFormInputs {
  name: string;
  email: string;
  grade: string;
}

export const RegisterForm = ({ setIsRegisterForm }: RegisterFormProps) => {
  const sendMailMutation = useMailSender();
  const registerRequestMutation = useRequestRegister();
  const [isRegisterSend, setIsRegisterSend] = useState<boolean>(false);
  const backLoginForm = () => setIsRegisterForm(false);
  const confirmSendAndBack = () => {
    setIsRegisterForm(false);
    setIsRegisterSend(false);
  };

  const { control, handleSubmit } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      grade: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async ({ name, email, grade }) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('grade', grade);
    await registerRequestMutation.mutateAsync({ formData });
    await sendMailMutation
      .mutateAsync({
        name,
        subject: '登録申請',
        mime: 'MIME-version: 1.0;\nContent-Type: text/html; charset="UTF-8";\n\n',
        body: `
      <html>
        <body>
        <h2>登録申請が来ています</h2>
        <p>名前 : ${name}</p>
        <p>メールアドレス : ${email}</p>
        <p>============================</p><br/>
        <a href="${process.env.NEXT_PUBLIC_CLIENT_URL}/admin">リンクからアクセス</a>
        </body>
      </html>
      `,
      })
      .then(() => {
        setIsRegisterSend(true);
      });
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
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            id="email"
            margin="normal"
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            {...field}
          />
        )}
      />
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField id="name" margin="normal" fullWidth label="Your Name" {...field} />
        )}
      />
      <Controller
        control={control}
        name="grade"
        rules={{ required: true }}
        render={({ field }) => (
          <TextField
            id="grade"
            margin="normal"
            fullWidth
            label="Your Grade"
            placeholder="入学年度を入力 (例) 2019"
            {...field}
          />
        )}
      />
      <Typography sx={{ fontSize: 12 }}>※教職員の方は数字の1を入力してください</Typography>
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
