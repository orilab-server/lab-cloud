import { useUser } from '@/features/auth/api/getUser';
import { useUploadReviewFile } from '@/features/reviews/api/files/uploadReviewFile';
import { useInputFile } from '@/features/reviews/hooks/useInputFil';
import { Button } from '@/shared/components/Elements/Button';
import Modal from '@/shared/components/Elements/Modal';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { MdUploadFile } from 'react-icons/md';

type CreateFolderButtonProps = {
  open: boolean;
};

const AddFileButton = ({ open }: CreateFolderButtonProps) => {
  const router = useRouter();
  const [addFileModalOpen, setAddFileModalOpen] = useState<boolean>(false);
  const { getRootProps, getInputProps, file, delFile } = useInputFile();
  const reviewId = (() => {
    const id = router.query.review_id as string;
    return id ? id : location.pathname.slice(location.pathname.lastIndexOf('/') + 1);
  })();
  const reviewName = router.query.review_name as string;
  const userQuery = useUser();

  const uploadReviewFileMutation = useUploadReviewFile();

  const onUpload = async () => {
    if (userQuery.data && file) {
      const formData = new FormData();
      formData.append('userId', userQuery.data.id.toString());
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
