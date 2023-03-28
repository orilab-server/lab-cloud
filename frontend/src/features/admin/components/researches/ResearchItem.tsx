import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Box, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { Research } from '../../types';
import { LinksInput } from '../Misc/LinksInput';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

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

  const { control, getValues } = useForm<FormData>({
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
  const onSubmit = async () => {
    const data = { title: getValues('title'), description: getValues('description') };
    await updateItemMutation.mutateAsync({
      docId: item.id,
      data: { ...data, links: Object.values(links) },
      file,
    });
  };

  return (
    <>
      <Box sx={{ width: '100%', height: '100%', cursor: 'pointer' }} onClick={openM}>
        {button}
      </Box>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <div className="grid grid-cols-1 gap-3">
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
                  <button onClick={onSubmit} className="btn btn-info text-white">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                    <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
                  </button>
                )}
                <button onClick={onToggleEdit} className="btn btn-info text-white">
                  {edit ? '編集をやめる' : '編集する'}
                </button>
              </Stack>
              <button onClick={onDeleteDoc} className="btn btn-error text-white">
                {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>削除</Typography>
              </button>
            </Stack>
          </div>
        </ModalLayout>
      </Modal>
    </>
  );
};
