import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ReactNode, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { Member } from '../../types';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type UserItemProps = {
  member: Member;
  button: ReactNode;
};

interface FormData {
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const UserItem = ({ member, button }: UserItemProps) => {
  const [Modal, openM, closeM] = useModal(member.id);
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

  const image = useStorageImage('members', member.id);
  const deleteItemMutation = useDeleteItem('members', 'hp');
  const updateItemMutation = useUpdateItem('members', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      name: member.name,
      name_en: member.name_en,
      introduction: member.introduction,
      year: member.year,
    },
  });
  const onDeleteDoc = async () => {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      await deleteItemMutation.mutateAsync({ docId: member.id }).finally(() => closeM());
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) =>
    await updateItemMutation.mutateAsync({ docId: member.id, data, file });

  return (
    <>
      <Box sx={{ width: '100%', height: '100%', cursor: 'pointer' }} onClick={openM}>
        {button}
      </Box>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={3}
            sx={{ width: '100%' }}
          >
            <UpdateImageArea url={image.data} edit={edit} fileState={[file, setFile]} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>氏名</Typography>}
              control={control}
              name="name"
              value={getValues('name')}
              edit={edit}
            />
            <TypographyOrTextField
              sx={{ width: '30%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>入学年</Typography>}
              control={control}
              name="year"
              value={getValues('year')}
              edit={edit}
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 16 }}>英語氏名</Typography>}
              control={control}
              name="name_en"
              value={getValues('name_en')}
              edit={edit}
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
              edit={edit}
              rows={5}
            />
            {/* 各種ボタン */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                {edit && (
                  <Button type="submit" variant="contained" color="secondary">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
                    <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
                  </Button>
                )}
                <Button onClick={onToggleEdit} variant="contained">
                  {edit ? '戻る' : '編集する'}
                </Button>
              </Stack>
              <Button onClick={onDeleteDoc} variant="contained" color="error">
                {deleteItemMutation.isLoading && <LoadingSpinner size="sm" color="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>削除</Typography>
              </Button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};