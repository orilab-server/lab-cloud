import UsersSelectPanel from '@/features/home/components/misc/reviews/UsersSelectPanel';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useSendMkReviewDirRequest } from '../api/mkReviewDir';

type CreateReviewModalProps = {
  button: React.ReactNode;
};

interface ReviewDirInput {
  reviewName: string;
  targetGrade: 2 | 3 | 4 | 5 | 6;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  bgcolor: 'white',
  boxShadow: 24,
  width: '70vw',
  p: 5,
  px: 10,
};

const CreateReviewModal = ({ button }: CreateReviewModalProps) => {
  const [Modal, openM, closeM] = useModal('review');
  const [selected, setSelected] = useState<string[]>([]);
  const mkReviewDirMutation = useSendMkReviewDirRequest();

  const { control, handleSubmit, watch } = useForm<ReviewDirInput>({
    defaultValues: {
      reviewName: '',
    },
  });

  const onSubmit: SubmitHandler<ReviewDirInput> = async (data) => {
    if (watch('targetGrade') === 6 && selected.length === 0) {
      alert('レビュー対象者を選択してください');
      return;
    }
    const formData = Object.entries(data).reduce((sum, [key, val]) => {
      sum.append(key, val);
      return sum;
    }, new FormData());
    if (watch('targetGrade') === 6) {
      formData.append('userIdAndNames', selected.join('/'));
    }
    await mkReviewDirMutation.mutateAsync({ formData }).finally(() => closeM());
  };

  return (
    <>
      <Button sx={{ my: 2 }} variant="contained" onClick={openM}>
        {button}
      </Button>
      <Modal>
        <Stack
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={modalStyle}
          spacing={5}
          alignItems="center"
        >
          <Typography sx={{ fontSize: 18 }}>ディレクトリ名と学年を入力してください</Typography>
          <Controller
            name="reviewName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Stack spacing={1} sx={{ width: '100%' }}>
                <TextField
                  sx={{ width: '100%' }}
                  label="ディレクトリ名を入力"
                  variant="standard"
                  {...field}
                />
                <Typography sx={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>
                  ※ ディレクトリ名は [発表会などの名称]_[年]といった形式にしてください
                  <br />
                  また, 作成時に自動的にディレクトリ名の後ろに[対象学年]が付与されます
                  <br />
                  出力例 : 中間発表_2022_学士4年
                </Typography>
              </Stack>
            )}
          />
          <Controller
            name="targetGrade"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel id="select-grade">学年を選択</InputLabel>
                <Select labelId="select-grade" label="学年を選択" sx={{ width: '100%' }} {...field}>
                  <MenuItem disabled value="">
                    <em>学年を選択</em>
                  </MenuItem>
                  <MenuItem value={6}>カスタム</MenuItem>
                  <MenuItem value={5}>修士2年</MenuItem>
                  <MenuItem value={4}>修士1年</MenuItem>
                  <MenuItem value={3}>学士4年</MenuItem>
                  <MenuItem value={2}>学士3年</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {watch('targetGrade') === 6 && (
            <UsersSelectPanel selectedState={[selected, setSelected]} />
          )}
          <Stack direction="row" spacing={2}>
            <Button size="medium" variant="contained" type="submit">
              {mkReviewDirMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
              <Typography sx={{ sx: 1, whiteSpace: 'nowrap' }}>作成</Typography>
            </Button>
            <Button onClick={closeM}>閉じる</Button>
          </Stack>
        </Stack>
      </Modal>
    </>
  );
};

export default React.memo(CreateReviewModal);
