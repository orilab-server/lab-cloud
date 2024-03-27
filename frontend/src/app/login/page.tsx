import { NextPage } from 'next';
import Link from 'next/link';
import { LoginOrRegisterForm } from './_components/LoginOrRegisterForm';

const Login: NextPage = () => {
  return (
    <>
      <Link className="absolute top-2 right-2 link link-primary" href="/admin">
        管理者ページ
      </Link>
      <LoginOrRegisterForm />
    </>
  );
};

export default Login;
