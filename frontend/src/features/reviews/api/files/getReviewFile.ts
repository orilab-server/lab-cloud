import { myAuthAxiosGet } from '@/shared/lib/axios';
import { getMimeType } from '@/shared/utils/mime';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { extractParamFromQuery, extractPathFromPathname } from '../../utils/url';

export const getReviewFile = async (reviewId: string, fileId: string, fileName: string) => {
  const blob = await myAuthAxiosGet<Blob>(`/reviews/${reviewId}/files/${fileId}/download`, {
    responseType: 'blob',
  });
  const asFile = new File([blob.data], fileName, {
    type: getMimeType(fileName),
  });

  return URL.createObjectURL(asFile);
};

export const useGetReviewFile = () => {
  const router = useRouter();
  const reviewId = extractPathFromPathname(router.query.review_id as string, 1);
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);
  const fileName = extractParamFromQuery(router.query.file_name as string, 'file_name');

  return useQuery({
    queryKey: ['review_file', fileId],
    queryFn: async () => getReviewFile(reviewId, fileId, fileName),
  });
};
