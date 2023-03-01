import { useUploadFolders } from '@/features/home/api/main/uploadFolders';
import { useUploadFolder } from '@/features/home/hooks/main/useUploadFolder';
import { foldersState, folderUploadProgressesState } from '@/features/home/modules/stores';
import { Button } from '@/shared/components/Elements/Button';
import Modal from '@/shared/components/Elements/Modal';
import { sleep } from '@/shared/utils/sleep';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdDriveFolderUpload } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';

// webkitdirectory属性のビルドエラー回避
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    webkitdirectory?: string;
  }
}

type CreateFolderButtonProps = {
  open: boolean;
};

const AddFolderButton = ({ open }: CreateFolderButtonProps) => {
  const [addFolderModalOpen, setAddFolderModalOpen] = useState<boolean>(false);
  const { inputRef, handleClickOpen, onChangeFolder } = useUploadFolder();
  const [folders, setFolders] = useRecoilState(foldersState);
  const setProgresses = useSetRecoilState(folderUploadProgressesState);
  const uploadFoldersMutation = useUploadFolders();
  const topFolderNames = Array.from(new Set(folders.map((f) => f.top)));
  const delFolder = (name: string) => setFolders((old) => old.filter((f) => f.top !== name));
  const delAll = () => setFolders([]);
  const onUpload = async () => {
    if (folders.length > 0) {
      setProgresses(
        folders.map((f) => ({
          name: f.top,
          progress: 0,
          status: 'pending' as 'pending',
          target: f,
        })),
      );
      setFolders([]);
      setAddFolderModalOpen(false);
      await sleep(4);
      await uploadFoldersMutation.mutateAsync();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setAddFolderModalOpen(true)}
        className={`${
          open ? 'w-9 h-9' : 'w-0 h-0'
        } transition-all bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
      >
        <MdDriveFolderUpload size={20} className="text-gray-400" />
      </button>
      <div className="hidden group-hover:block absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
        フォルダ追加
      </div>
      <Modal
        title="フォルダ追加"
        isOpen={addFolderModalOpen}
        buttonTxt="アップロード"
        footerButton={
          <Button onClick={handleClickOpen} variant="inverseContained">
            選択
            <input
              hidden
              onChange={onChangeFolder}
              type="file"
              multiple
              ref={inputRef}
              webkitdirectory="true"
            />
          </Button>
        }
        go={onUpload}
        close={() => setAddFolderModalOpen(false)}
      >
        {topFolderNames.length > 0 ? (
          <>
            {topFolderNames.map((f) => (
              <div
                key={f}
                className="flex items-center justify-between py-1 my-1 w-full px-2 bg-gray-100 rounded"
              >
                <div>{f}</div>
                <button onClick={() => delFolder(f)}>
                  <AiFillCloseCircle />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-center py-1 my-1 w-full px-2 bg-red-100 rounded hover:bg-red-200">
              <button className="text-red-600 font-semibold w-full" onClick={delAll}>
                全削除
              </button>
            </div>
          </>
        ) : (
          <div>フォルダを選択してください</div>
        )}
      </Modal>
    </div>
  );
};

export default AddFolderButton;
