import { useRouter } from 'next/router';
import { useState } from 'react';
import LabIcon from '../../../../public/oritaken_logo.png';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const BeforeLoginForms = () => {
  const router = useRouter();
  const [isRegisterForm, setIsRegisterForm] = useState<boolean>(false);

  return (
    <main className="mx-auto max-w-md">
      <div className="mt-16 flex flex-col items-center">
        <div className="m-1">
          <img width="180px" style={{ aspectRatio: '16/9' }} src={LabIcon.src} alt="" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold">Orilab Cloud Storage</span>
          <div className="badge badge-neutral badge-lg">{process.env.NEXT_PUBLIC_APP_VERSION}</div>
        </div>
        <span className="text-xl font-semibold my-1">
          {isRegisterForm ? '登録申請' : 'ログイン'}
        </span>
        {isRegisterForm ? (
          <RegisterForm setIsRegisterForm={setIsRegisterForm} />
        ) : (
          <LoginForm setIsRegisterForm={setIsRegisterForm} />
        )}
        <button className="btn btn-link" onClick={() => router.push('/reset-password/request')}>
          パスワードを忘れた方
        </button>
      </div>
    </main>
  );
};
