import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Button, Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ReactNode, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { News } from '../../types';
import { LinksInput } from '../misc/LinksInput';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type NewsItemProps = {
  item: News;
  button: ReactNode;
};

interface FormData {
  dateStr: string;
  title: string;
  description: string;
}

export const NewsItem = ({ item, button }: NewsItemProps) => {
  const [Modal, openM, closeM] = useModal(item.id);
  const [edit, setEdit] = useState<boolean>(false);
  const [links, setLinks] = useState<{ [key: string]: string }>(
    Object.fromEntries(item.links.map((link, index) => [`link-${index}`, link])),
  );
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

  const image = useStorageImage('news', item.id);
  const updateItemMutation = useUpdateItem('news', 'hp');
  const deleteItemMutation = useDeleteItem('news', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      dateStr: format(new Date(item.date.seconds * 1000), 'yyyy-MM-dd'),
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
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const { dateStr, title, description } = data;
    const dispatchData = {
      title,
      description,
      date: new Date(dateStr),
      links: Object.values(links),
    };
    await updateItemMutation
      .mutateAsync({ docId: item.id, data: dispatchData, file })
      .finally(() => closeM());
  };

  return (
    <>
      <div onClick={openM}>{button}</div>
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
              titleElement={<Typography sx={{ mx: 1, fontSize: 20 }}>日付</Typography>}
              control={control}
              name="dateStr"
              value={getValues('dateStr')}
              edit={edit}
              type="date"
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 1, fontSize: 20 }}>タイトル</Typography>}
              control={control}
              name="title"
              value={getValues('title')}
              edit={edit}
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
              rows={5}
            />
            <LinksInput links={links} setLinks={setLinks} edit={edit} />
            {/* 各種ボタン */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                {edit && (
                  <Button type="submit" variant="contained" color="secondary">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                    <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
                  </Button>
                )}
                <Button onClick={onToggleEdit} variant="contained">
                  {edit ? '戻る' : '編集する'}
                </Button>
              </Stack>
              <Button onClick={onDeleteDoc} variant="contained" color="error">
                {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>削除</Typography>
              </Button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
