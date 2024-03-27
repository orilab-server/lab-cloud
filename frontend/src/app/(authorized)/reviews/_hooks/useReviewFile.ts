import { useEffect, useState } from 'react';

export const useReviewFile = (reviewFile: string) => {
  const [totalPages, setTotalPages] = useState<number>(0);

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

  return { reviewFile, totalPages, onLoadSuccess };
};
