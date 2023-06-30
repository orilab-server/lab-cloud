import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Dispatch, SetStateAction } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLogin } from '../api/login';

type LoginFormProps = {
  setIsRegisterForm: Dispatch<SetStateAction<boolean>>;
};

interface LoginInputs {
  email: string;
  password: string;
}

export const LoginForm = ({ setIsRegisterForm }: LoginFormProps) => {
  const loginMutation = useLogin();
  const goRegisterForm = () => setIsRegisterForm(true);
  const { handleSubmit, register } = useForm<LoginInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginInputs> = ({ email, password }) => {
    if (email && password) {
      loginMutation.mutate({ email, password });
    } else {
      alert('メールアドレスとパスワードを入力してください');
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label text-sm">Email</label>
        <input
          {...register('email')}
          type="text"
          placeholder="Eメールを入力"
          className="input input-bordered w-full"
          autoComplete="email"
          required
          autoFocus
        ></input>
      </div>
      <div className="form-control mb-3">
        <label className="label text-sm">Password</label>
        <input
          {...register('password')}
          type="password"
          placeholder="パスワードを入力"
          className="input input-bordered w-full"
          autoComplete="password"
          required
        ></input>
      </div>
      <button type="submit" className="btn btn-primary w-full my-1 flex items-center">
        <span className="mr-2">ログイン</span>
        {loginMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
      </button>
      <button type="button" className="btn btn-secondary w-full my-1" onClick={goRegisterForm}>
        登録申請フォームへ
      </button>
    </form>
  );
};
