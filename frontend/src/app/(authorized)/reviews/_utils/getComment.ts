import { Comment } from '@/app/(authorized)/reviews/_types/review';
import { getWithAuth } from '@/app/_shared/lib/fetch';

export const getComment = async (
  reviewId: string,
  fileId: string,
  userId: number | undefined,
  index: number,
) => {
  try {
    const res = await getWithAuth(
      `/reviews/${reviewId}/files/${fileId}/own/${userId}/comments/${index}`,
    );
    const json = (await res.json()) as { comment: Comment };
    return json.comment?.comment;
  } catch (e) {
    return '';
  }
};
