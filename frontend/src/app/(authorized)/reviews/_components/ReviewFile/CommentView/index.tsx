import { getComment } from '@/app/(authorized)/reviews/_utils/getComment';

type CommentViewProps = {
  reviewId: string;
  fileId: string;
  userId: number;
  index: number;
};

const CommentView = async ({ reviewId, fileId, userId, index }: CommentViewProps) => {
  const comment = await getComment(reviewId, fileId, userId, index);

  return (
    <div className="mx-5 w-full h-full">
      {comment ? <div>{comment}</div> : <div>コメントなし</div>}
    </div>
  );
};

export default CommentView;
