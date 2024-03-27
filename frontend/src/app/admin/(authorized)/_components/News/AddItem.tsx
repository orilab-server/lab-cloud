'use client';

import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { useAddNewItem } from '@/app/admin/(authorized)/_actions/addNewItem';
import { useAddUpdate } from '@/app/admin/(authorized)/_actions/addUpdates';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { LinksInput } from '../Misc/LinksInput';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

interface FormData {
  dateStr: string;
  title: string;
  description: string;
}

type NewDoc = Omit<FormData, 'dateStr'> & { links: string[]; date: Date; createdat: Date };

export const AddItem = () => {
  const { isOpen, onOpen, onClose } = useModal();
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

  const onSubmit = handleSubmit(async (data) => {
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
      .finally(() => onClose());
  });

  return (
    <>
      <button className="btn btn-outline btn-primary" onClick={onOpen}>
        <AiOutlinePlus className="mr-2" />
        ニュースを追加する
      </button>
      <Modal isOpen={isOpen} title="news" close={onClose} buttonTxt="送信" go={onSubmit}>
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
      </Modal>
    </>
  );
};
