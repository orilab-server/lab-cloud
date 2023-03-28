import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Stack, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { News } from '../../types';
import { LinksInput } from '../Misc/LinksInput';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

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
  const onSubmit = async () => {
    const dateStr = getValues('dateStr');
    const title = getValues('title');
    const description = getValues('description');
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
          <Stack spacing={3} sx={{ width: '100%' }}>
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
                  <button onClick={onSubmit} className="btn btn-info text-white">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                    <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
                  </button>
                )}
                <button onClick={onToggleEdit} className="btn btn-info text-white">
                  {edit ? '戻る' : '編集する'}
                </button>
              </Stack>
              <button onClick={onDeleteDoc} className="btn btn-error text-white">
                {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>削除</Typography>
              </button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
