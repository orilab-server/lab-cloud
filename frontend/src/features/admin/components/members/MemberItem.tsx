import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useModal } from 'react-hooks-use-modal';
import { FaUserGraduate } from 'react-icons/fa';
import { useDeleteItem } from '../../api/deleteItem';
import { useStorageImage } from '../../api/getStorageImage';
import { useUpdateItem } from '../../api/updateItem';
import { useUpdateOld } from '../../api/updateToOld';
import { Member } from '../../types';
import ModalForm from '../Misc/ModalForm';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type UserItemProps = {
  member: Member;
  button: ReactNode;
};

interface FormData {
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const UserItem = ({ member, button }: UserItemProps) => {
  const [Modal, openM, closeM] = useModal(member.id);
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

  const image = useStorageImage('members', member.id);
  const deleteItemMutation = useDeleteItem('members', 'hp');
  const updateItemMutation = useUpdateItem('members', 'hp');
  const updateOldMutation = useUpdateOld();

  const { control, getValues } = useForm<FormData>({
    defaultValues: {
      name: member.name,
      name_en: member.name_en,
      introduction: member.introduction,
      year: member.year,
    },
  });
  const onDeleteDoc = async () => {
    const ok = window.confirm('削除しますか？');
    if (ok) {
      await deleteItemMutation.mutateAsync({ docId: member.id }).finally(() => closeM());
    }
  };
  const onSubmit = async () => {
    const data: FormData = {
      name: getValues('name'),
      name_en: getValues('name_en'),
      introduction: getValues('introduction'),
      year: getValues('year'),
    };
    await updateItemMutation.mutateAsync({ docId: member.id, data, file });
  };

  return (
    <>
      <button className="w-full h-full" onClick={openM}>
        {button}
      </button>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <ModalForm>
            {member.old && (
              <div className="flex space-x-3 mt-5">
                <FaUserGraduate size={30} className="text-red-500" />
                <span className="text-red-500 font-semibold">OB・OG</span>
              </div>
            )}
            <UpdateImageArea url={image.data} edit={edit} fileState={[file, setFile]} />
            <TypographyOrTextField
              titleElement="氏名"
              control={control}
              name="name"
              value={getValues('name')}
              edit={edit}
            />
            <TypographyOrTextField
              titleElement="入学年"
              control={control}
              name="year"
              value={getValues('year')}
              edit={edit}
            />
            <TypographyOrTextField
              titleElement="英語氏名"
              control={control}
              name="name_en"
              value={getValues('name_en')}
              edit={edit}
            />
            <TypographyOrTextField
              titleElement="自己紹介"
              control={control}
              name="introduction"
              value={getValues('introduction')}
              multiline
              edit={edit}
            />
            {/* 各種ボタン */}
            <div className="flex justify-between w-full">
              <div className="flex space-x-2">
                {edit && (
                  <button type="button" onClick={onSubmit} className="btn btn-info text-white">
                    {updateItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                    <span className="px-1 whitespace-nowrap">送信</span>
                  </button>
                )}
                <button type="button" onClick={onToggleEdit} className="btn text-white">
                  {edit ? '戻る' : '編集する'}
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={async () =>
                    await updateOldMutation.mutateAsync({
                      id: member.id,
                      already: Boolean(member.old),
                    })
                  }
                  className="btn btn-warning"
                >
                  {member.old ? 'OB・OGを解除' : 'OB・OGに設定'}
                </button>
                <button type="button" onClick={onDeleteDoc} className="btn btn-error text-white">
                  {deleteItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                  <span className="px-1 whitespace-nowrap">削除</span>
                </button>
              </div>
            </div>
          </ModalForm>
        </ModalLayout>
      </Modal>
    </>
  );
};
