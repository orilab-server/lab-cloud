import { useDeleteReviewFile } from '@/features/reviews/api/files/deleteFile';
import { ReviewFileIDContext } from '@/features/reviews/modules/contexts/reviewFileID';
import { ReviewIDContext } from '@/features/reviews/modules/contexts/reviewID';
import { useContext } from 'react';

const DeleteButton = () => {
  const deleteFileMutation = useDeleteReviewFile();
  const reviewID = useContext(ReviewIDContext);
  const reviewFileID = useContext(ReviewFileIDContext);

  const deleteReviewFile = async () => {
    deleteFileMutation.mutateAsync({ reviewId: reviewID, fileId: reviewFileID });
  };

  return (
    <button onClick={deleteReviewFile} className="text-white hover:bg-gray-700 px-3 py-1">
      ファイルを削除
    </button>
  );
};

export default DeleteButton;
