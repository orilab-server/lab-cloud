import { myAuthAxiosDelete } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const deleteReviewFile = async (reviewId: string, fileId: string) => {
  return await myAuthAxiosDelete(`/reviews/${reviewId}/files/${fileId}`);
};

type DeleteReviewFileMutationConfig = {
  reviewId: string;
  fileId: string;
};

export const useDeleteReviewFile = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation({
    mutationFn: async ({ reviewId, fileId }: DeleteReviewFileMutationConfig) =>
      deleteReviewFile(reviewId, fileId),
    onSuccess: async () => {
      await queryClient.invalidateQueries('review_files');
      setNotify({ severity: 'info', text: 'ファイルを削除しました！' });
    },
    onError: (error) => {
      console.log(error);
      setNotify({ severity: 'error', text: 'ファイルを削除できませんでした' });
    },
  });
};
