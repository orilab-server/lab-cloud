import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { useAddNewItem } from '../../api/addNewItem';
import ModalForm from '../Misc/ModalForm';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type AddUsersProps = {
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
  name: string;
  name_en: string;
  introduction: string;
  year: number;
}

export const AddUser = ({ modals }: AddUsersProps) => {
  const [Modal, openM, closeM] = modals;
  const [file, setFile] = useState<File | null>(null);
  const addNewItemMutation = useAddNewItem<FormData & { researches: string[] }>('members', 'hp');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      name: '',
      name_en: '',
      introduction: '',
      year: new Date().getFullYear() - 2,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (file === null) {
      alert('画像を選択してください');
      return;
    }
    await addNewItemMutation
      .mutateAsync({
        data: { ...data, researches: [] },
        file,
      })
      .finally(() => closeM());
  };

  return (
    <>
      <button onClick={openM} className="btn btn-outline btn-primary">
        <AiOutlinePlus style={{ marginRight: 3 }} />
        新規メンバーを追加する
      </button>
      <Modal>
        <ModalLayout closeModal={closeM}>
          <ModalForm onSubmit={handleSubmit(onSubmit)}>
            <UpdateImageArea edit={true} fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              titleElement="氏名"
              control={control}
              name="name"
              value={getValues('name')}
              edit
            />
            <TypographyOrTextField
              titleElement="入学年"
              control={control}
              name="year"
              value={getValues('year')}
              edit
            />
            <TypographyOrTextField
              titleElement="英語氏名"
              control={control}
              name="name_en"
              value={getValues('name_en')}
              edit
            />
            <TypographyOrTextField
              titleElement="自己紹介"
              control={control}
              name="introduction"
              value={getValues('introduction')}
              multiline
              edit
            />
            {/* 各種ボタン */}
            <div className="flex space-x-3">
              <button className="btn btn-primary" type="submit">
                {addNewItemMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
                <span className="pl-1 whitespace-nowrap">送信</span>
              </button>
            </div>
          </ModalForm>
        </ModalLayout>
      </Modal>
    </>
  );
};
