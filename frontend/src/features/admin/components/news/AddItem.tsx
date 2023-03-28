import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAddNewItem } from '../../api/addNewItem';
import { useAddUpdate } from '../../api/addUpdates';
import { LinksInput } from '../misc/LinksInput';
import { ModalLayout } from '../misc/ModalLayout';
import { TypographyOrTextField } from '../misc/TypographyOrTextField';
import { UpdateImageArea } from '../misc/UpdateImageArea';

type AddItemProps = {
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
  dateStr: string;
  title: string;
  description: string;
}

type NewDoc = Omit<FormData, 'dateStr'> & { links: string[]; date: Date; createdat: Date };

export const AddItem = ({ modals }: AddItemProps) => {
  const [Modal, openM, closeM] = modals;
  const [links, setLinks] = useState<{ [key: string]: string }>({ 'link-0': '' });
  const [file, setFile] = useState<File | null>(null);
  const addNewItemMutation = useAddNewItem<NewDoc>('news', 'hp');
  const addUpdateMutation = useAddUpdate();

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      dateStr: '',
      title: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (file === null) {
      alert('画像を選択してください');
      return;
    }
    const { dateStr, title, description } = data;
    await addUpdateMutation.mutateAsync({ collectionName: 'news', title: 'Newsを更新しました' });
    await addNewItemMutation
      .mutateAsync({
        data: {
          title,
          description,
          date: new Date(dateStr),
          links: Object.values(links),
          createdat: new Date(),
        },
        file,
      })
      .finally(() => closeM());
  };

  return (
    <>
      <button className="btn btn-outline btn-primary" onClick={openM}>
        <AiOutlinePlus className="mr-2" />
        ニュースを追加する
      </button>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <Stack
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={2}
            sx={{ width: '100%' }}
          >
            <UpdateImageArea edit={true} fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 2, fontSize: 20 }}>日付</Typography>}
              control={control}
              value={getValues('dateStr')}
              name="dateStr"
              edit={true}
              placeholder="例 2000-01-01"
              type="date"
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 2, fontSize: 20 }}>タイトル</Typography>}
              control={control}
              value={getValues('title')}
              name="title"
              edit={true}
            />
            <TypographyOrTextField
              sx={{ width: '80%' }}
              titleElement={<Typography sx={{ mx: 2, fontSize: 20 }}>内容</Typography>}
              control={control}
              value={getValues('description')}
              name="description"
              edit={true}
              multiline={true}
              rows={5}
            />
            <LinksInput links={links} setLinks={setLinks} />
            <Stack direction="row" spacing={3}>
              <button type="submit" className="btn btn-info text-white">
                {addNewItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <Typography sx={{ px: 1, whiteSpace: 'nowrap' }}>送信</Typography>
              </button>
            </Stack>
          </Stack>
        </ModalLayout>
      </Modal>
    </>
  );
};
