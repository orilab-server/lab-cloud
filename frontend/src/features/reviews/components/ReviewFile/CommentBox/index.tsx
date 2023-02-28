import { useUser } from '@/features/auth/api/getUser';
import { useGetOwnComment } from '@/features/reviews/api/reviewers/getOwnComment';
import { useSendComment } from '@/features/reviews/api/reviewers/sendComment';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type CommentBoxProps = {
  index: number;
  id: string;
};

interface CommentInputs {
  comment: string;
}

const CommentBox = ({ id, index }: CommentBoxProps) => {
  const commentQuery = useGetOwnComment(index);
  const comment = commentQuery.data;
  const sendCommentMutation = useSendComment(index);
  const userQuery = useUser();
  const { register, handleSubmit, setValue, watch } = useForm<CommentInputs>({
    defaultValues: {
      comment: comment?.comment || '',
    },
  });
  const set = () => {
    if (comment?.comment) {
      setValue('comment', comment.comment);
    }
  };

  const onSubmit: SubmitHandler<CommentInputs> = async ({ comment }) => {
    if (comment.trim() && userQuery.data) {
      const formData = new FormData();
      formData.append('userId', userQuery.data.id.toString());
      formData.append('comment', comment);
      await sendCommentMutation.mutateAsync({ formData });
    }
  };

  useEffect(() => {
    set();
  }, [comment]);

  return (
    <form className="mx-5 w-full h-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-x-3">
        <button
          disabled={watch('comment') === comment?.comment}
          type="submit"
          className="btn btn-accent h-3 mb-3 px-8"
        >
          登録
        </button>
        <button type="button" onClick={set} className="btn btn-primary h-3 mb-3 px-8">
          前の状態に戻す
        </button>
      </div>
      <textarea
        id={id}
        className="textarea textarea-bordered w-full h-[calc(1018px_-_60px)]"
        placeholder="コメント"
        {...register('comment')}
      ></textarea>
    </form>
  );
};

export default CommentBox;
