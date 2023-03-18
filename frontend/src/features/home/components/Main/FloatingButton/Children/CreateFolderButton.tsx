import { useCreateFolder } from '@/features/home/api/main/createFolder';
import Modal from '@/shared/components/Elements/Modal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdCreateNewFolder } from 'react-icons/md';

type CreateFolderButtonProps = {
  open: boolean;
};

interface NewFolderNameInput {
  name: string;
}

const CreateFolderButton = ({ open }: CreateFolderButtonProps) => {
  const router = useRouter();
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState<boolean>(false);
  const createFolderMutation = useCreateFolder();
  const { register, getValues } = useForm<NewFolderNameInput>({
    defaultValues: {
      name: '',
    },
  });
  const create = async () => {
    const name = getValues('name');
    if (name.match('/') !== null) {
      alert('ファイル名に / (スラッシュ)は含められません');
      return;
    }
    if (name.trim()) {
      // pathのフォーマット : `${path}/${name}`
      const path = `${router.query.path || ''}/${name}`
        .split('/')
        .filter((p) => p)
        .join('/');
      await createFolderMutation.mutateAsync({ path });
      setCreateFolderModalOpen(false);
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setCreateFolderModalOpen(true)}
        className={`${
          open ? 'w-9 h-9' : 'w-0 h-0'
        } transition-all bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
      >
        <MdCreateNewFolder size={20} className="text-gray-400" />
      </button>
      <div className="hidden group-hover:block group absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
        新規フォルダ作成
      </div>
      <Modal
        title="新規フォルダ作成"
        close={() => setCreateFolderModalOpen(false)}
        buttonTxt="作成"
        go={create}
        isOpen={createFolderModalOpen}
      >
        <input
          id="name"
          type="text"
          placeholder="フォルダ1"
          className="input input-bordered w-full"
          {...register('name')}
        />
      </Modal>
    </div>
  );
};

export default CreateFolderButton;
