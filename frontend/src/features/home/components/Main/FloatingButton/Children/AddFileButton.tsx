import { useUploadFiles } from '@/features/home/api/main/uploadFiles';
import { useUploadFile } from '@/features/home/hooks/main/useUploadFile';
import { filesState, fileUploadProgressesState } from '@/features/home/modules/stores';
import { Button } from '@/shared/components/Elements/Button';
import Modal from '@/shared/components/Elements/Modal';
import { sleep } from '@/shared/utils/sleep';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdUploadFile } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';

type CreateFolderButtonProps = {
  open: boolean;
};

const AddFileButton = ({ open }: CreateFolderButtonProps) => {
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const { getRootProps, getInputProps } = useUploadFile();
  const uploadFilesMutation = useUploadFiles();
  const [files, setFiles] = useRecoilState(filesState);
  const setProgresses = useSetRecoilState(fileUploadProgressesState);
  const delFile = (name: string) => setFiles((old) => old.filter((f) => f.file.name !== name));
  const delAll = () => setFiles([]);
  const onUpload = async () => {
    if (files.length > 0) {
      setProgresses(
        files.map((f) => ({
          name: f.file.name,
          progress: 0,
          status: 'pending' as 'pending',
          target: f,
        })),
      );
      setFiles([]);
      setAddFileModalOpen(false);
      await sleep(4);
      await uploadFilesMutation.mutateAsync();
    }
  };

  return (
    <div className="relative group">
      <button
        onClick={() => setAddFileModalOpen(true)}
        className={`${
          open ? 'w-9 h-9' : 'w-0 h-0'
        } transition-all bg-gray-800 hover:bg-gray-300 rounded-full flex items-center justify-center`}
      >
        <MdUploadFile size={20} className="text-gray-400" />
        <input hidden {...getInputProps()} />
      </button>
      <div className="hidden group-hover:block absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
        ファイル追加
      </div>
      <Modal
        isOpen={addFileModalOpen}
        title="ファイル追加"
        buttonTxt="アップロード"
        footerButton={
          <div {...getRootProps()}>
            <Button variant="inverseContained">
              選択
              <input hidden {...getInputProps()} />
            </Button>
          </div>
        }
        go={onUpload}
        close={() => setAddFileModalOpen(false)}
      >
        {files.length > 0 ? (
          <>
            {files.map((f) => (
              <div
                key={f.file.name}
                className="flex items-center justify-between py-1 my-1 w-full px-2 bg-gray-100 rounded"
              >
                <div>{f.file.name}</div>
                <button onClick={() => delFile(f.file.name)}>
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
          <div>ファイルを選択してください</div>
        )}
      </Modal>
    </div>
  );
};

export default AddFileButton;
