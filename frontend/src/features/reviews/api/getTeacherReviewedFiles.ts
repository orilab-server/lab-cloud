import { myAuthAxiosGet } from '@/shared/lib/axios';
import { useQuery } from 'react-query';
import { TeacherReviewedFiles } from '../types/review';

export const getTeacherReviewedFiles = async (reviewId: string, reviewedId: string) => {
  const res = await myAuthAxiosGet<{ files: TeacherReviewedFiles[]; user_id: string }>(
    `/reviews/${reviewId}/reviewed/${reviewedId}/teacher/files`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};

export const useGetTeacherReviewedFiles = (reviewId: string, reviewedId: string) => {
  return useQuery({
    queryKey: ['teacher_reviewed_files', reviewId, reviewedId],
    queryFn: async () => await getTeacherReviewedFiles(reviewId, reviewedId),
    staleTime: Infinity,
  });
};
