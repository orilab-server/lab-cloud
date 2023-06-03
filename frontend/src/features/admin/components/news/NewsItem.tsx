import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { format } from 'date-fns';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { News } from '../../types';
import { LinksInput } from '../Misc/LinksInput';
import ModalForm from '../Misc/ModalForm';
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
          <ModalForm>
            <UpdateImageArea url={image.data} fileState={[file, setFile]} edit={edit} />
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
          </ModalForm>
        </ModalLayout>
      </Modal>
    </>
  );
};
