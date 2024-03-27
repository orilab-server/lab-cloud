import { ReviewFile } from '@/app/(authorized)/reviews/_types/review';
import { getWithAuth } from '@/app/_shared/lib/fetch';
import ReviewFileList from './ReviewFileList';

type Props = {
  reviewId: string;
};

export const ReviewFileListFetcher = async ({ reviewId }: Props) => {
  const reviewFiles = await getReviewFiles(reviewId);

  return <ReviewFileList reviewId={reviewId} reviewFiles={reviewFiles} />;
};

export const getReviewFiles = async (reviewId: string) => {
  try {
    const res = await getWithAuth(`/reviews/${reviewId}/files`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as { files: ReviewFile[] | null };
    return json.files || [];
  } catch (e) {
    return [];
  }
};
