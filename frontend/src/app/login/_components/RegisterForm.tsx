'use client';

import { useMailSender } from '@/app/_hooks/useMailSender';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { useRequestRegister } from '@/app/login/_hooks/useRequestRegister';
import { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

type RegisterFormProps = {
  setIsRegisterForm: Dispatch<SetStateAction<boolean>>;
};

interface RegisterFormInputs {
  name: string;
  email: string;
  grade: string;
}

export const RegisterForm = ({ setIsRegisterForm }: RegisterFormProps) => {
  const sendMailMutation = useMailSender();
  const registerRequestMutation = useRequestRegister();
  const [isRegisterSend, setIsRegisterSend] = useState<boolean>(false);
  const backLoginForm = () => setIsRegisterForm(false);
  const confirmSendAndBack = () => {
    setIsRegisterForm(false);
    setIsRegisterSend(false);
  };

  const { handleSubmit, register } = useForm<RegisterFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      grade: '',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = async ({ name, email, grade }) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('grade', grade);
    await registerRequestMutation.mutateAsync({ formData });
    await sendMailMutation
      .mutateAsync({
        name,
        subject: '登録申請',
        mime: 'MIME-version: 1.0;\nContent-Type: text/html; charset="UTF-8";\n\n',
        body: `
      <html>
        <body>
        <h2>登録申請が来ています</h2>
        <p>名前 : ${name}</p>
        <p>メールアドレス : ${email}</p>
        <p>============================</p><br/>
        <a href="${process.env.NEXT_PUBLIC_CLIENT_URL}/admin">リンクからアクセス</a>
        </body>
      </html>
      `,
      })
      .then(() => {
        setIsRegisterSend(true);
      });
  };

  if (isRegisterSend) {
    return (
      <div className="mt-10 w-full h-full flex flex-col items-center">
        <span className="w-full text-center py-6 rounded text-xl mb-10 font-bold bg-neutral/20">
          登録申請メールを送信しました
        </span>
        <button
          type="button"
          onClick={confirmSendAndBack}
          className="btn btn-secondary w-full my-1"
        >
          ログイン画面に戻る
        </button>
      </div>
    );
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-control">
        <label className="label text-sm text-gray-600">Eメール</label>
        <input
          {...register('email')}
          type="text"
          placeholder="sample@chiba-u.jp"
          className="input input-bordered w-full"
          autoComplete="email"
          required
          autoFocus
        ></input>
      </div>
      <div className="form-control">
        <label className="label text-sm text-gray-600">氏名</label>
        <input
          {...register('name')}
          type="text"
          placeholder="氏名を入力"
          className="input input-bordered w-full"
          autoComplete="name"
          required
          autoFocus
        ></input>
      </div>
      <div className="form-control">
        <label className="label text-sm text-gray-600">入学年度</label>
        <input
          {...register('grade')}
          type="text"
          placeholder="2020"
          className="input input-bordered w-full"
          required
          autoFocus
        ></input>
        <label className="label text-sm mt-[-4px] text-gray-600">
          ※教職員の方は数字の1を入力してください
        </label>
      </div>
      <button type="submit" className="btn btn-primary w-full mt-3 my-1">
        <span className="mr-2">送信</span>
        {sendMailMutation.isLoading && <LoadingSpinner size="sm" variant="inherit" />}
      </button>
      <button onClick={backLoginForm} className="btn btn-secondary w-full my-1">
        戻る
      </button>
    </form>
  );
};
