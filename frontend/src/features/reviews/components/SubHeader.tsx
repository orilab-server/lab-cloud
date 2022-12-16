import { Button, Chip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

type LabelColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
type LabelVariant = 'filled' | 'outlined';

type SubHeaderProps = {
  to?: string;
  labels: string[];
  labelColors?: LabelColor[];
  labelVariants?: LabelVariant[];
};

const SubHeader = ({ to, labels, labelColors, labelVariants }: SubHeaderProps) => {
  const router = useRouter();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Button
        sx={{ my: 2 }}
        onClick={async () => {
          if (to) {
            await router.push(to);
          } else {
            router.back();
          }
        }}
      >
        <MdArrowBack />
        <Typography sx={{ mx: 1, fontSize: '14px' }}>戻る</Typography>
      </Button>
      {labels.map((label, i) => (
        <Chip
          key={`${label}-${i}`}
          variant={labelVariants ? labelVariants[i] : undefined}
          color={labelColors ? labelColors[i] : undefined}
          label={label}
        />
      ))}
    </Stack>
  );
};

export default React.memo(SubHeader);
