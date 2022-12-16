import { notifyState } from '@/shared/stores';
import { myAxiosPost } from '@/shared/utils/axios';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const uploadFile = async (reviewId: string, reviewedId: string, formData: FormData) => {
  await myAxiosPost(`home/reviews/${reviewId}/reviewed/${reviewedId}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

type UploadFileMutationConfig = {
  reviewId: string;
  reviewedId: string;
  formData: FormData;
};

export const useUploadFile = () => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, reviewedId, formData }: UploadFileMutationConfig) =>
      await uploadFile(reviewId, reviewedId, formData),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('reviewed_files');
        setNotify({ severity: 'info', text: 'ファイルをアップロードしました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'アップロードに失敗しました' });
      },
    },
  );
};
