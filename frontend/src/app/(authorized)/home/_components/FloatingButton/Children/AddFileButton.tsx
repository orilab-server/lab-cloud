'use client';

import { usePreparingUploadFile } from '@/app/(authorized)/home/_hooks/usePreparingUploadFile';
import { filesState, fileUploadProgressesState } from '@/app/(authorized)/home/_stores';
import { useModal } from '@/app/_hooks/useModal';
import { Button } from '@/app/_shared/components/Elements/Button';
import Modal from '@/app/_shared/components/Elements/Modal';
import { sleep } from '@/app/_shared/utils/sleep';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdUploadFile } from 'react-icons/md';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { useUploadFiles } from '../../../_hooks/useUploadFiles';

type CreateFolderButtonProps = {
  open: boolean;
};

const AddFileButton = ({ open }: CreateFolderButtonProps) => {
  const { isOpen, onOpen, onClose } = useModal();
  const { getRootProps, getInputProps } = usePreparingUploadFile();
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
      onClose();
      await sleep(4);
      await uploadFilesMutation.mutateAsync();
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
        <MdUploadFile size={20} className="text-gray-400" />
        <input hidden {...getInputProps()} />
      </button>
      <div className="hidden group-hover:block absolute w-28 text-xs text-white rounded whitespace-nowrap bg-gray-700 py-2 pl-2 top-[2px] -left-[120px]">
        ファイル追加
      </div>
      <Modal
        isOpen={isOpen}
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
        close={onClose}
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
