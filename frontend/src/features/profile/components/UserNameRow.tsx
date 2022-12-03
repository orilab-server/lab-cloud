import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, FormControl, FormHelperText, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useRename } from '../api/rename';

type UserNameRowProps = {
  userName: string;
};

interface UserNameInput {
  userName: string;
}

const UserNameRow = ({ userName }: UserNameRowProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const onToggleEdit = () => setEdit(!edit);
  const renameMutation = useRename();
  const { control, handleSubmit } = useForm<UserNameInput>({
    defaultValues: {
      userName,
    },
  });

  const userNamerule = {
    required: true,
    validate: (value: string) => value !== userName || '名前を変更してください',
  };

  const onSubmit: SubmitHandler<UserNameInput> = async ({ userName }) => {
    const param = new URLSearchParams();
    param.append('newName', userName);
    renameMutation.mutateAsync({ param }).finally(() => setEdit(false));
  };

  return (
    <Stack
      sx={{ width: '100%', py: 3 }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      direction="row"
      justifyContent="start"
      alignItems="center"
      spacing={3}
    >
      <Typography sx={{ fontSize: 18, color: 'rgba(0,0,0,0.6)' }}>ユーザ名 : </Typography>
      {edit ? (
        <>
          <Controller
            control={control}
            name="userName"
            rules={userNamerule}
            render={({ field, fieldState }) => (
              <FormControl>
                <TextField {...field} />
                <FormHelperText sx={{ color: 'red', position: 'absolute', top: 56, left: -10 }}>
                  {fieldState.error?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          <Button sx={{ py: 2 }} variant="contained" type="submit">
            {renameMutation.isLoading && <LoadingSpinner color="inherit" size="sm" />}
            <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>更新</Typography>
          </Button>
        </>
      ) : (
        <>
          <Typography sx={{ fontSize: 24 }}>{userName}</Typography>
        </>
      )}
      <Button sx={{ py: 2 }} variant="outlined" color="info" onClick={onToggleEdit}>
        {edit ? '編集をやめる' : '編集する'}
      </Button>
    </Stack>
  );
};

export default React.memo(UserNameRow);
