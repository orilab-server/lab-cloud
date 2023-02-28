import { useGetComment } from '@/features/reviews/api/reviewers/getComment';

type CommentViewProps = {
  index: number;
};

const CommentView = ({ index }: CommentViewProps) => {
  // indexに応じてコメントを取得
  const commentQuery = useGetComment(index);
  const comment = commentQuery.data;
  console.log(comment);

  return (
    <div className="mx-5 w-full h-full">
      {comment ? <div>{comment.comment}</div> : <div>コメントなし</div>}
    </div>
  );
};

export default CommentView;
