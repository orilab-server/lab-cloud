'use client';

import { useFileRename } from '@/app/(authorized)/home/_hooks/useFileRename';
import { contextMenuState } from '@/app/(authorized)/home/_stores';
import { FileNode } from '@/app/(authorized)/home/_types/storage';
import { extractDateInStr } from '@/app/_shared/utils/slice';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

interface RenameInputs {
  name: string;
}

type RenameInputProps = {
  storageItem: FileNode;
};

const RenameInput = ({ storageItem }: RenameInputProps) => {
  const contextMenu = useRecoilValue(contextMenuState);
  const { rename, renameCancel } = useFileRename();
  const { register, setValue, resetField, handleSubmit } = useForm<RenameInputs>({
    defaultValues: {
      name: contextMenu.rename,
    },
  });

  const onSubmit: SubmitHandler<RenameInputs> = async ({ name }) => {
    const oldName = contextMenu.rename;
    if (oldName && name.trim()) {
      await rename(name, oldName);
      resetField('name');
    }
  };

  useEffect(() => {
    if ('rename' in contextMenu && contextMenu.rename?.trim()) {
      const [fileName] = extractDateInStr(contextMenu.rename);
      if (fileName.trim()) {
        setValue(
          'name',
          Array.from(fileName).includes('.') ? fileName.slice(0, fileName.indexOf('.')) : fileName,
        );
      }
    }
  }, [contextMenu.rename]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-5 flex space-x-2 items-center">
      <input
        id="name"
        className="text-sm input input-ghost px-1 h-5"
        type="text"
        {...register('name')}
      />
      {Array.from(storageItem.name).includes('.') && (
        <span className="text-sm">{storageItem.name.slice(storageItem.name.indexOf('.'))}</span>
      )}
      <button
        type="submit"
        className="flex items-center justify-center w-5 h-5 hover:bg-slate-300 rounded-full"
      >
        ○
      </button>
      <button
        onClick={renameCancel}
        className="flex items-center justify-center w-5 h-5 hover:bg-slate-300 rounded-full"
      >
        ×
      </button>
    </form>
  );
};

export default RenameInput;
