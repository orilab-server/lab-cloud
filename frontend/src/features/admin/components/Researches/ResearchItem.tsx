import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { Research } from '../../types';
import { LinksInput } from '../Misc/LinksInput';
import ModalForm from '../Misc/ModalForm';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type ResearchItemProps = {
  item: Research;
  buttonChild: React.ReactNode;
};

interface FormData {
  title: string;
  description: string;
}

export const ResearchItem = ({ item, buttonChild }: ResearchItemProps) => {
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
      <button type="button" className="w-full h-full" onClick={openM}>
        {buttonChild}
      </button>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <ModalForm>
            <UpdateImageArea url={image.data} fileState={[file, setFile]} edit={edit} />
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
        </ModalLayout>
      </Modal>
    </>
  );
};
