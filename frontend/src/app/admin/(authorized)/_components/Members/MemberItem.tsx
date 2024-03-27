'use client';

import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useDeleteItem } from '@/app/admin/(authorized)/_actions/deleteItem';
import { useUpdateItem } from '@/app/admin/(authorized)/_actions/updateItem';
import { useUpdateOld } from '@/app/admin/(authorized)/_actions/updateToOld';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaUserGraduate } from 'react-icons/fa';
import { Member } from '../../_types/member';
import ModalForm from '../Misc/ModalForm';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type UserItemProps = {
  member: Member;
  image: string;
  buttonChild: ReactNode;
};

interface FormData {
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const MemberItem = ({ member, image, buttonChild }: UserItemProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const onToggleEdit = () => setEdit(!edit);

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
      await deleteItemMutation.mutateAsync({ docId: member.id }).finally(() => onClose());
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
      <button type="button" className="w-full h-full" onClick={onOpen}>
        {buttonChild}
      </button>
      <Modal isOpen={isOpen} title="" buttonTxt="送信" close={onClose}>
        <ModalForm>
          {member.old && (
            <div className="flex space-x-3 mt-5">
              <FaUserGraduate size={30} className="text-red-500" />
              <span className="text-red-500 font-semibold">OB・OG</span>
            </div>
          )}
          <UpdateImageArea url={image} edit={edit} fileState={[file, setFile]} />
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
      </Modal>
    </>
  );
};
