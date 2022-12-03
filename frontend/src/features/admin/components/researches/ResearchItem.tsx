import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { Research } from '../../types';
import { LinksInput } from '../misc/LinksInput';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type ResearchItemProps = {
  item: Research;
  button: React.ReactNode;
};

interface FormData {
  title: string;
  description: string;
}

export const ResearchItem = ({ item, button }: ResearchItemProps) => {
  const [Modal, openM, closeM] = useModal(item.id, { closeOnOverlayClick: true });
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<{ [key: string]: string }>(
    Object.fromEntries(item.links.map((link, index) => [`link-${index}`, link])),
  );
  const onToggleEdit = () => setEdit(!edit);

  const image = useStorageImage('researches', item.id);
  const deleteItemMutation = useDeleteItem('researches', 'hp');
  const updateItemMutation = useUpdateItem('researches', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      title: item.title,
      description: item.description,
    },
  });
  const onDeleteDoc = async () => {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      await deleteItemMutation.mutateAsync({ docId: item.id }).finally(() => closeM());
    }
  };
  const onSubmit: SubmitHandler<FormData> = async (data) =>
    await updateItemMutation.mutateAsync({
      docId: item.id,
      data: { ...data, links: Object.values(links) },
      file,
    });

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
            <UpdateImageArea url={image.data} fileState={[file, setFile]} edit={edit} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={
                <Typography sx={{ mx: 1, fontSize: 20, whiteSpace: 'nowrap' }}>タイトル</Typography>
              }
              control={control}
              name="title"
              value={getValues('title')}
              edit={edit}
              multiline={true}
              rows={4}
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={
                <Typography sx={{ mx: 1, fontSize: 20, whiteSpace: 'nowrap' }}>内容</Typography>
              }
              control={control}
              name="description"
              value={getValues('description')}
              edit={edit}
              multiline
              rows={10}
            />
            <LinksInput links={links} setLinks={setLinks} edit={edit} />
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
                  {edit ? '編集をやめる' : '編集する'}
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
