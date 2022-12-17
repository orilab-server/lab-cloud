import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useGetComment } from '../api/getComment';
import { useSendComment } from '../api/sendComment';
import { TabPanelsProps } from '../hooks/useReviewerTab';

type CommentBoxProps = {
  url: string;
  page: number;
  reviewer: string;
  Panel: React.MemoExoticComponent<({ page, comment }: TabPanelsProps) => JSX.Element>;
  userId?: number;
  isOwn?: boolean;
};

interface CommentInput {
  [k: string]: string;
}

const CommentBox = ({ userId, url, page, reviewer, Panel, isOwn }: CommentBoxProps) => {
  const sendCommentMutation = useSendComment(`${url}/comment`);
  const commentQuery = useGetComment(`${url}/reviewers/${reviewer}/comment/${page}`, reviewer);
  const comment = commentQuery.data?.comment || '';
  const { control, handleSubmit, setValue } = useForm<CommentInput>({
    defaultValues: {
      comment: '',
    },
  });

  const onSubmit: SubmitHandler<CommentInput> = async (data) => {
    const formData = new FormData();
    formData.append('userId', String(userId));
    formData.append('pageNumber', String(page));
    formData.append('comment', data.comment);
    await sendCommentMutation.mutateAsync({ formData });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Panel page={page} comment={comment || ''} />
      {!isOwn && (
        <Stack sx={{ width: '100%', p: 2 }} spacing={2} justifyContent="start" alignItems="start">
          <Controller
            control={control}
            name={'comment'}
            rules={{ required: true }}
            render={({ field }) => <TextField multiline sx={{ width: '100%' }} {...field} />}
          />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" type="submit">
              {sendCommentMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
              <Typography sx={{ mx: 1, whiteSpace: 'nowrap' }}>内容を保存</Typography>
            </Button>
            <Button variant="outlined" onClick={() => setValue('comment', comment)}>
              <Typography sx={{ mx: 1, whiteSpace: 'nowrap' }}>途中から</Typography>
            </Button>
          </Stack>
        </Stack>
      )}
    </Box>
  );
};

export default React.memo(CommentBox);
