import { useResetPassword } from '@/features/auth/api/reset-password';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, FormControl, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

interface ResetPasswordInputs {
  password: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const token = router.query.token;
  const [send, setSend] = useState<boolean>(false);
  const resetPasswordMutation = useResetPassword();
  const { control, handleSubmit } = useForm<ResetPasswordInputs>({
    defaultValues: {
      password: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async ({ password }) => {
    const param = new URLSearchParams();
    if (!Array.isArray(token) && token) {
      param.append('newPassword', password);
      param.append('token', token);
      await resetPasswordMutation.mutateAsync({ param }).then(() => setSend(true));
    }
  };

  if (!token) {
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
        <Box sx={{ width: '100%', py: 3 }}>
          <Typography sx={{ fontSize: 24, my: 1 }}>このページは利用できません</Typography>
          <button className="btn btn-link" onClick={() => router.push('/login')}>
            ログイン画面に戻る
          </button>
        </Box>
      </Stack>
    );
  }

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
          <Typography sx={{ fontSize: 24, my: 1 }}>変更しました！</Typography>
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
            新しいパスワードを記入してください
          </Typography>
          <Controller
            name="password"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl sx={{ width: '50%' }}>
                <TextField id="password" label="Password" type="password" {...field} />
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

export default React.memo(ResetPassword);
