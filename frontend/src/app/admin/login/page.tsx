'use client';

import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useAdminLogin } from '@/app/admin/login/_hooks/useAdminLogin';
import { NextPage } from 'next';
import { SubmitHandler, useForm } from 'react-hook-form';

interface AdminLoginInputs {
  email: string;
  password: string;
}

const AdminLogin: NextPage = () => {
  const loginMutation = useAdminLogin();

  const { handleSubmit, register } = useForm<AdminLoginInputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onLogin: SubmitHandler<AdminLoginInputs> = ({ email, password }) => {
    loginMutation.mutate({ email, password });
  };

  return (
    <main className="w-full max-w-md">
      <form className="w-full" onSubmit={handleSubmit(onLogin)}>
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
        <button type="submit" className="btn btn-primary w-full my-2">
          <span className="mr-2">ログイン</span>
          {loginMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
        </button>
      </form>
    </main>
  );
};

export default AdminLogin;
