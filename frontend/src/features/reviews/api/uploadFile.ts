import { myAuthAxiosPost } from '@/shared/lib/axios';
import { notifyState } from '@/shared/stores';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const uploadFile = async (reviewId: string, reviewedId: string, formData: FormData) => {
  await myAuthAxiosPost(`/reviews/${reviewId}/reviewed/${reviewedId}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

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

export const useUploadFile = (type?: 'pdf' | 'docx') => {
  const queryClient = useQueryClient();
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ reviewId, reviewedId, formData }: UploadFileMutationConfig) => {
      if (!type || type === 'pdf') {
        await uploadFile(reviewId, reviewedId, formData);
      } else if (type === 'docx') {
        await uploadFileToTeacher(reviewId, reviewedId, formData);
      }
    },
    {
      onSuccess: async () => {
        type === 'docx'
          ? await queryClient.invalidateQueries('teacher_reviewed_files')
          : await queryClient.invalidateQueries('reviewed_files');
        setNotify({ severity: 'info', text: 'ファイルをアップロードしました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: 'アップロードに失敗しました' });
      },
    },
  );
};
