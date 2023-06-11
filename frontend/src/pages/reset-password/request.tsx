import { useResetPassword } from '@/features/auth/api/reset-password';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import Link from 'next/link';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface ResetPasswordInputs {
  email: string;
}

const ResetPasswordRequest = () => {
  const [send, setSend] = useState<boolean>(false);
  const resetPasswordMutation = useResetPassword();
  const { register, handleSubmit } = useForm<ResetPasswordInputs>({
    defaultValues: {
      email: '',
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async ({ email }) => {
    const param = new URLSearchParams();
    param.append('email', email);
    await resetPasswordMutation.mutateAsync({ param, request: true }).then(() => setSend(true));
  };

  return (
    <div className="w-[90vw] h-screen mx-auto flex flex-col items-center">
      {/* ヘッダー(的存在) */}
      <div className="flex items-center justify-around w-full border-b my-3 py-1">
        <span className="w-full text-lg">パスワードリセット</span>
        <Link href="/login">
          <a className="btn btn-link">戻る</a>
        </Link>
      </div>
      {send ? (
        <div className="w-full flex flex-col items-start space-y-3">
          <span className="text-lg">
            登録したメールアドレス宛にリセット用のリンクを送信しました
          </span>
          <Link href="/login">
            <a className="link link-primary">ログイン画面に戻る</a>
          </Link>
        </div>
      ) : (
        <form
          className="w-full flex flex-col items-start space-y-3"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-1/3 form-control">
            <label className="label text-sm text-gray-600">
              登録しているメールアドレスを入力してください
            </label>
            <input
              {...register('email')}
              type="text"
              placeholder="Eメールを入力"
              className="input input-bordered w-full min-w-md"
              autoComplete="email"
              required
              autoFocus
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            {resetPasswordMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
            <span className="px-3">送信</span>
          </button>
        </form>
      )}
    </div>
  );
};

export default React.memo(ResetPasswordRequest);
