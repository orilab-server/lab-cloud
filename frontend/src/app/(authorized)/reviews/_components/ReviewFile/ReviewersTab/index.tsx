import { Reviewer } from '@/app/(authorized)/reviews/_types/review';
import { getWithAuth } from '@/app/_shared/lib/fetch';
import ReviewersTabChild from './Child';

type Props = {
  reviewId: string;
  fileId: string;
};

export const ReviewersTab = async ({ reviewId, fileId }: Props) => {
  const reviewers = await getReviewers(reviewId, fileId);

  return <ReviewersTabChild reviewers={reviewers} />;
};

export const getReviewers = async (reviewId: string, fileId: string) => {
  try {
    const res = await getWithAuth(`/reviews/${reviewId}/files/${fileId}/reviewers`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as { reviewers: Reviewer[] };
    return json.reviewers;
  } catch (e) {
    return [];
  }
};
