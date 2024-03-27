'use client';

import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useDeleteItem } from '@/app/admin/(authorized)/_actions/deleteItem';
import { useUpdateItem } from '@/app/admin/(authorized)/_actions/updateItem';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ResearchForFront } from '../../_types/research';
import { LinksInput } from '../Misc/LinksInput';
import ModalForm from '../Misc/ModalForm';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type ResearchItemProps = {
  item: ResearchForFront;
  buttonChild: React.ReactNode;
  image: string;
};

interface FormData {
  title: string;
  description: string;
}

export const ResearchItem = ({ item, buttonChild, image }: ResearchItemProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<{ [key: string]: string }>(
    Object.fromEntries(item.links.map((link, index) => [`link-${index}`, link])),
  );
  const onToggleEdit = () => setEdit(!edit);

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
      await deleteItemMutation.mutateAsync({ docId: item.id }).finally(() => onClose());
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
      <button type="button" className="w-full h-full" onClick={onOpen}>
        {buttonChild}
      </button>
      <Modal isOpen={isOpen} title="" buttonTxt="送信" close={onClose}>
        <ModalForm>
          <UpdateImageArea url={image} fileState={[file, setFile]} edit={edit} />
          <TypographyOrTextField
            titleElement="タイトル"
            control={control}
            name="title"
            value={getValues('title')}
            edit={edit}
            multiline
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
                {edit ? '編集をやめる' : '編集する'}
              </button>
            </div>
            <button type="button" onClick={onDeleteDoc} className="btn btn-error text-white">
              {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
              <span className="whitespace-nowrap">削除</span>
            </button>
          </div>
        </ModalForm>
      </Modal>
    </>
  );
};
