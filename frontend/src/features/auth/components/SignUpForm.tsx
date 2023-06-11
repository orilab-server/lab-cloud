import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import React, { useEffect, useState } from 'react';
import { useRegister } from '../api/register';

export const SignUpComplete = () => {
  const registerMutation = useRegister();
  const [routeChangeComplete, setRouteChangeComplete] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = data.get('password')?.toString();
    if (newPassword) {
      const params = new URLSearchParams();
      params.append('newPassword', newPassword);
      registerMutation.mutate({ params });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setRouteChangeComplete(true);
    }, 2 * 1000);
  }, []);

  if (!routeChangeComplete) {
    return null;
  }

  return (
    <main className="w-full max-w-md mx-auto mt-24">
      <div className="w-full flex flex-col items-center">
        <span className="w-full text-2xl font-medium text-center">Sign Up</span>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="form-control mb-3">
            <label className="label text-sm text-gray-600">New Password</label>
            <input
              name="password"
              type="password"
              placeholder="パスワードを入力"
              className="input input-bordered w-full"
              autoComplete="password"
              required
            ></input>
          </div>
          <button type="submit" className="btn btn-primary w-full my-1">
            <span className="mr-2">送信</span>
            {registerMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
          </button>
        </form>
      </div>
    </main>
  );
};
