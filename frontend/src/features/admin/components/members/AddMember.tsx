import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, Typography } from '@mui/material';
import { Box, Stack } from '@mui/system';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAddNewItem } from '../../api/addNewItem';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type AddUsersProps = {
  children: React.ReactNode;
  modals: [
    React.FC<{
      children: React.ReactNode;
    }>,
    () => void,
    () => void,
    boolean,
  ];
};

interface FormData {
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const AddUser = ({ children, modals }: AddUsersProps) => {
  const [Modal, openM, closeM] = modals;
  const [file, setFile] = useState<File | null>(null);
  const addNewItemMutation = useAddNewItem<FormData & { researches: string[] }>('members', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      name: '',
      name_en: '',
      introduction: '',
      year: new Date().getFullYear() - 2,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (file === null) {
      alert('画像を選択してください');
      return;
    }
    await addNewItemMutation
      .mutateAsync({
        data: { ...data, researches: [] },
        file,
      })
      .finally(() => closeM());
  };

  return (
    <>
      <Box onClick={openM} sx={{ width: '100%', height: '100%' }}>
        {children}
      </Box>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            alignItems="start"
            spacing={3}
            sx={{ width: '100%' }}
          >
            <UpdateImageArea edit={true} fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>氏名</Typography>}
              control={control}
              name="name"
              value={getValues('name')}
              edit
            />
            <TypographyOrTextField
              sx={{ width: '30%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>入学年</Typography>}
              control={control}
              name="year"
              value={getValues('year')}
              edit
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>英語氏名</Typography>}
              control={control}
              name="name_en"
              value={getValues('name_en')}
              edit
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={
                <Typography sx={{ mx: 1, fontSize: 16, whiteSpace: 'nowrap' }}>自己紹介</Typography>
              }
              control={control}
              name="introduction"
              value={getValues('introduction')}
              multiline={true}
              edit
              rows={5}
            />
            {/* 各種ボタン */}
            <Stack direction="row" spacing={2}>
              <Button type="submit" variant="contained" color="secondary">
                {addNewItemMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
                <Typography sx={{ pl: 1, whiteSpace: 'nowrap' }}>送信</Typography>
              </Button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
