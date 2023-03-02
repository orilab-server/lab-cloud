import { useResetPassword } from '@/features/auth/api/reset-password';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface ResetPasswordInputs {
  email: string;
}

const ResetPasswordRequest = () => {
  const router = useRouter();
  const [send, setSend] = useState<boolean>(false);
  const resetPasswordMutation = useResetPassword();
  const { control, handleSubmit } = useForm<ResetPasswordInputs>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async ({ email }) => {
    const param = new URLSearchParams();
    param.append('email', email);
    await resetPasswordMutation.mutateAsync({ param, request: true }).then(() => setSend(true));
  };

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
        <Typography sx={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.6)' }}>
          パスワードリセット
        </Typography>
        <button className="btn btn-link" onClick={() => router.push('/login')}>
          戻る
        </button>
      </Stack>
      {send ? (
        <Box sx={{ width: '100%', py: 3 }}>
          <Typography sx={{ fontSize: 24, my: 1 }}>
            登録したメールアドレス宛にリセット用のリンクを送信しました
          </Typography>
          <button className="btn btn-link" onClick={() => router.push('/login')}>
            ログイン画面に戻る
          </button>
        </Box>
      ) : (
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: '100%', height: '100%', my: 3 }}
          alignItems="start"
          spacing={1}
        >
          <Typography sx={{ color: 'rgba(0,0,0,0.5)' }}>
            登録しているメールアドレスを入力してください
          </Typography>
          <Controller
            name="email"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl sx={{ width: '50%' }}>
                <TextField id="email" label="Email" type="email" {...field} />
              </FormControl>
            )}
          />
          <button type="submit" className="btn btn-primary">
            {resetPasswordMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
            <span className="px-3">送信</span>
          </button>
        </Stack>
      )}
    </Stack>
  );
};

export default React.memo(ResetPasswordRequest);
