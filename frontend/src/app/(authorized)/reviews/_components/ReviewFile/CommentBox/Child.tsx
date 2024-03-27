'use client';

import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSendComment } from '../../../_hooks/useSendComment';

type CommentBoxProps = {
  comment?: string;
  index: number;
  id: string;
};

interface CommentInputs {
  comment: string;
}

const CommentBoxChild = ({ id, index, comment }: CommentBoxProps) => {
  const sendCommentMutation = useSendComment(index);
  const { register, handleSubmit, setValue, watch } = useForm<CommentInputs>({
    defaultValues: {
      comment,
    },
  });
  const set = () => {
    if (comment) {
      setValue('comment', comment);
    }
  };

  const onSubmit: SubmitHandler<CommentInputs> = async ({ comment }) => {
    if (comment.trim()) {
      const formData = new FormData();
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
          disabled={watch('comment') === comment}
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

export default CommentBoxChild;
