'use state';

import { useCreateFolder } from '@/app/(authorized)/home/_hooks/useCreateFolder';
import { useModal } from '@/app/_hooks/useModal';
import Modal from '@/app/_shared/components/Elements/Modal';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { MdCreateNewFolder } from 'react-icons/md';

type CreateFolderButtonProps = {
  open: boolean;
};

interface NewFolderNameInput {
  name: string;
}

const CreateFolderButton = ({ open }: CreateFolderButtonProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const searchParams = useSearchParams();
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
      const path = `${searchParams.get('path') || ''}/${name}`
        .split('/')
        .filter((p) => p)
        .join('/');
      await createFolderMutation.mutateAsync({ path });
      onClose();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={onOpen}
        className={`${
          open ? 'w-9 h-9' : 'w-0 h-0'
        } transition-all bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
      >
        <MdCreateNewFolder size={20} className="text-gray-400" />
      </button>
      <div className="hidden group-hover:block group absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
        新規フォルダ作成
      </div>
      <Modal title="新規フォルダ作成" close={onClose} buttonTxt="作成" go={create} isOpen={isOpen}>
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
