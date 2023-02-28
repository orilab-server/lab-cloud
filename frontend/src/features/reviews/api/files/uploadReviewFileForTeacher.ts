import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const uploadFileToTeacher = async (
  reviewId: string,
  reviewedId: string,
  formData: FormData,
) => {
  await myAuthAxiosPost(
    `/reviews/${reviewId}/reviewed/${reviewedId}/teacher/files/upload`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

type UploadFileMutationConfig = {
  reviewId: string;
  reviewedId: string;
  formData: FormData;
};

export const useUploadReviewFileForTeacher = (type?: 'pdf' | 'docx') => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, reviewedId, formData }: UploadFileMutationConfig) => {
      await uploadFileToTeacher(reviewId, reviewedId, formData);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries('teacher_reviewed_files');
        setNotify({ severity: 'info', text: 'ファイルをアップロードしました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'アップロードに失敗しました' });
      },
    },
  );
};
