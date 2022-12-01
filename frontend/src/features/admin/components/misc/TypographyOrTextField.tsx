import { TextField, TextFieldProps, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { Control, Controller } from 'react-hook-form';

type TypographyOrTextFieldProps = {
  titleElement: React.ReactNode;
  control: Control<any, any>;
  edit: boolean;
  value: string | number;
} & TextFieldProps;

export const TypographyOrTextField = ({
  titleElement,
  control,
  edit,
  value,
  name = '',
  ...props
}: TypographyOrTextFieldProps) => {
  return (
    <Stack direction="row" sx={{ width: '100%' }}>
      {titleElement}
      {edit ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) => <TextField {...props} {...field} />}
        />
      ) : (
        <Typography sx={{ mx: 1, fontSize: 20 }}>{value}</Typography>
      )}
    </Stack>
  );
};
