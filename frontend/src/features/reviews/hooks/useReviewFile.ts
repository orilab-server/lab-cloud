import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useGetReviewFile } from '../api/files/getReviewFile';
import { extractPathFromPathname } from '../utils/url';

export const useReviewFile = () => {
  const router = useRouter();
  const fileId = extractPathFromPathname(router.query.file_id as string, 2);
  const [totalPages, setTotalPages] = useState<number>(0);
  const reviewFileQuery = useGetReviewFile();
  const reviewFile = reviewFileQuery.data;
  const queryClient = useQueryClient();

  const reloadFile = async () => {
    await queryClient.refetchQueries([fileId, 'reviewers']);
  };

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  // ObjectURLをrevoke
  useEffect(() => {
    return () => {
      if (reviewFile) {
        URL.revokeObjectURL(reviewFile);
      }
    };
  }, []);

  return { reviewFile, totalPages, onLoadSuccess, reloadFile };
};
