'use client';

import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useDeleteItem } from '@/app/admin/(authorized)/_actions/deleteItem';
import { useUpdateItem } from '@/app/admin/(authorized)/_actions/updateItem';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { EventForFront } from '../../_types/news';
import { LinksInput } from '../Misc/LinksInput';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type NewsItemProps = {
  item: EventForFront;
  image: string;
  button: ReactNode;
};

interface FormData {
  dateStr: string;
  title: string;
  description: string;
}

export const NewsItem = ({ item, image, button }: NewsItemProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [edit, setEdit] = useState<boolean>(false);
  const [links, setLinks] = useState<{ [key: string]: string }>(
    Object.fromEntries(item.links.map((link, index) => [`link-${index}`, link])),
  );
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

  const updateItemMutation = useUpdateItem('news', 'hp');
  const deleteItemMutation = useDeleteItem('news', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      dateStr: item.date,
      title: item.title,
      description: item.description,
    },
  });
  const onDeleteDoc = async () => {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      await deleteItemMutation.mutateAsync({ docId: item.id }).finally(() => onClose());
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
      .finally(() => onClose());
  };

  return (
    <>
      <div onClick={onOpen}>{button}</div>
      <Modal isOpen={isOpen} title="ニュース" buttonTxt="送信" close={onClose}>
        <UpdateImageArea url={image} fileState={[file, setFile]} edit={edit} />
        <TypographyOrTextField
          titleElement="日付"
          control={control}
          name="dateStr"
          value={getValues('dateStr')}
          edit={edit}
          type="date"
        />
        <TypographyOrTextField
          titleElement="タイトル"
          control={control}
          name="title"
          value={getValues('title')}
          edit={edit}
        />
        <TypographyOrTextField
          titleElement="内容"
          control={control}
          name="description"
          value={getValues('description')}
          edit={edit}
          multiline
        />
        <LinksInput links={links} setLinks={setLinks} edit={edit} />
        {/* 各種ボタン */}
        <div className="w-full flex justify-between space-x-2">
          <div className="flex space-x-2">
            {edit && (
              <button type="button" onClick={onSubmit} className="btn btn-info text-white">
                {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <span className="whitespace-nowrap">送信</span>
              </button>
            )}
            <button type="button" onClick={onToggleEdit} className="btn text-white">
              {edit ? '戻る' : '編集する'}
            </button>
          </div>
          <button type="button" onClick={onDeleteDoc} className="btn btn-error text-white">
            {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
            <span className="whitespace-nowrap">削除</span>
          </button>
        </div>
      </Modal>
    </>
  );
};
