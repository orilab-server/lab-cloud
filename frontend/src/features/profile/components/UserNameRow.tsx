import { Button, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

type UserNameRowProps = {
  userName: string;
};

interface UserNameInput {
  userName: string;
}

const UserNameRow = ({ userName }: UserNameRowProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  const onToggleEdit = () => setEdit(!edit);
  const { control, handleSubmit } = useForm<UserNameInput>({
    defaultValues: {
      userName,
    },
  });

  const onSubmit: SubmitHandler<UserNameInput> = ({ userName }) => {
    console.log(userName);
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
            rules={{ required: true }}
            render={({ field }) => <TextField {...field} />}
          />
          <Button sx={{ py: 2 }} variant="contained" type="submit">
            更新
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
