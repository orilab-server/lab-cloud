import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAddNewItem } from '../../api/addNewItem';
import { useAddUpdate } from '../../api/addUpdates';
import { LinksInput } from '../Misc/LinksInput';
import ModalForm from '../Misc/ModalForm';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

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
          <ModalForm onSubmit={handleSubmit(onSubmit)}>
            <UpdateImageArea edit fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              titleElement="日付"
              control={control}
              value={getValues('dateStr')}
              name="dateStr"
              edit
              placeholder="例 2000-01-01"
              type="date"
            />
            <TypographyOrTextField
              titleElement="タイトル"
              control={control}
              value={getValues('title')}
              name="title"
              edit
            />
            <TypographyOrTextField
              titleElement="内容"
              control={control}
              value={getValues('description')}
              name="description"
              edit
              multiline
            />
            <LinksInput links={links} setLinks={setLinks} />
            <div className="flex">
              <button type="submit" className="btn btn-info text-white">
                {addNewItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <span className="whitespace-nowrap">送信</span>
              </button>
            </div>
          </ModalForm>
        </ModalLayout>
      </Modal>
    </>
  );
};
