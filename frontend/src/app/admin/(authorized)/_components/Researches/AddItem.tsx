'use client';

import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useAddNewItem } from '@/app/admin/(authorized)/_actions/addNewItem';
import { useAddUpdate } from '@/app/admin/(authorized)/_actions/addUpdates';
import { useUpdateItem } from '@/app/admin/(authorized)/_actions/updateItem';
import { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiOutlinePlus } from 'react-icons/ai';
import { Member } from '../../_types/member';
import { LinksInput } from '../Misc/LinksInput';
import ModalForm from '../Misc/ModalForm';
import { ModalLayout } from '../Misc/ModalLayout';
import { TypographyOrTextField } from '../Misc/TypographyOrTextField';
import { UpdateImageArea } from '../Misc/UpdateImageArea';

type Props = {
  members: Member[];
};

interface FormData {
  title: string;
  description: string;
  memberId: string;
}

type NewItem = Omit<FormData, 'memberId'> & { links: string[]; createdat: Date };

export const AddItem = ({ members }: Props) => {
  const { isOpen, onOpen, onClose } = useModal();
  const [links, setLinks] = useState<{ [key: string]: string }>({ 'link-0': '' });
  const [file, setFile] = useState<File | null>(null);
  const addNewItemMutation = useAddNewItem<NewItem>('researches', 'hp');
  const addUpdateMutation = useAddUpdate();
  const updateMemberMutation = useUpdateItem('members');

  const { control, handleSubmit, getValues } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      memberId: '',
    },
  });
  const onSubmit: SubmitHandler<FormData> = async ({ title, description, memberId }) => {
    if (file === null) {
      alert('画像を選択してください');
      return;
    }
    await addUpdateMutation.mutateAsync({
      collectionName: 'researches',
      title: 'RESEARCHページを更新しました',
    });
    const dispatchData = { title, description, links: Object.values(links), createdat: new Date() };
    const id = await addNewItemMutation
      .mutateAsync({
        data: dispatchData,
        file,
      })
      .finally(() => onClose());
    const targetMember = members.find((member) => Object.is(member.id, memberId));
    const newResearches = [...(targetMember?.researches || []), id || ''].filter(
      (item) => item !== '',
    );
    await updateMemberMutation.mutateAsync({
      docId: memberId,
      data: { researches: newResearches },
    });
  };

  return (
    <>
      <button onClick={onOpen} className="btn btn-outline btn-primary">
        <AiOutlinePlus style={{ marginRight: 3 }} />
        研究を追加する
      </button>
      <Modal isOpen={isOpen} close={onClose} title="研究" buttonTxt="送信">
        <ModalLayout closeModal={onClose}>
          <ModalForm onSubmit={handleSubmit(onSubmit)}>
            <UpdateImageArea edit={true} fileState={[file, setFile]} url={undefined} />
            <TypographyOrTextField
              titleElement="タイトル"
              control={control}
              name="title"
              value={getValues('title')}
              edit
            />
            <TypographyOrTextField
              titleElement="内容"
              control={control}
              name="description"
              value={getValues('description')}
              multiline
              edit
            />
            <Controller
              name="memberId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <div className="form-control w-full">
                  <label className="label" id="researching-member">
                    名前
                  </label>
                  <select
                    id="researching-member"
                    className="select select-bordered w-full"
                    {...field}
                  >
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            />
            <LinksInput links={links} setLinks={setLinks} />
            {/* 各種ボタン */}
            <div className="flex space-x-2">
              <button type="submit" className="btn btn-info">
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
