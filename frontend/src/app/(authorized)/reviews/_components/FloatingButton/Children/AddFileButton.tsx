'use client';

import { useInputFile } from '@/app/(authorized)/reviews/_hooks/useInputFil';
import { Button } from '@/app/_shared/components/Elements/Button';
import Modal from '@/app/_shared/components/Elements/Modal';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdUploadFile } from 'react-icons/md';
import { useUploadReviewFile } from '../../../_hooks/useUploadReviewFile';

type Props = {
  reviewId: string;
  reviewName: string;
  userId: number;
  open: boolean;
};

const AddFileButton = ({ reviewId, reviewName, userId, open }: Props) => {
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const { getRootProps, getInputProps, file, delFile } = useInputFile();

  const uploadReviewFileMutation = useUploadReviewFile();

  const onUpload = async () => {
    if (Number.isInteger(userId) && file) {
      const formData = new FormData();
      formData.append('userId', String(userId));
      formData.append('reviewDir', reviewName);
      formData.append('url', location.href);
      formData.append('file', file);
      await uploadReviewFileMutation.mutateAsync({ reviewId, formData });
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
        {file ? (
          <div className="flex items-center justify-between py-1 my-1 w-full px-2 bg-gray-100 rounded">
            <div>{file.name}</div>
            <button onClick={delFile}>
              <AiFillCloseCircle />
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div>ファイルを選択してください</div>
            <div className="text-sm">※ PDF, Word, PowerPointのみ可</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AddFileButton;
