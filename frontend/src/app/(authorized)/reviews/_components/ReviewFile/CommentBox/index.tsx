import { getWithAuth } from '@/app/_shared/lib/fetch';
import { Comment } from '../../../_types/review';
import CommentBoxChild from './Child';

type Props = {
  id: string;
  reviewId: string;
  fileId: string;
  userId: number;
  index: number;
};

export const CommentBox = async ({ id, reviewId, fileId, userId, index }: Props) => {
  const comment = await getComment(reviewId, fileId, userId, index);

  return <CommentBoxChild comment={comment} index={index} id={id} />;
};

const getComment = async (
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
