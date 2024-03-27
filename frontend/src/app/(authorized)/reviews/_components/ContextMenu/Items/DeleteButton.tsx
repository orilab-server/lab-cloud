'use client';

import { useDeleteReviewFile } from '../../../_hooks/useDeleteFile';

type Props = {
  reviewId: string;
  fileId: string;
};

const DeleteButton = ({ reviewId, fileId }: Props) => {
  const deleteFileMutation = useDeleteReviewFile();

  const deleteReviewFile = async () => {
    deleteFileMutation.mutateAsync({ reviewId, fileId });
  };

  return (
    <button onClick={deleteReviewFile} className="text-white hover:bg-gray-700 px-3 py-1">
      ファイルを削除
    </button>
  );
};

export default DeleteButton;
