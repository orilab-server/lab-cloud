import { BeforeLoginForms } from '@/features/auth/components/BeforeLoginForms';
import { NextPage } from 'next';
import Link from 'next/link';

const Login: NextPage = () => {
  return (
    <>
      <Link href="/admin">
        <a className="absolute top-2 right-2 link link-primary">管理者ページ</a>
      </Link>
      <BeforeLoginForms />
    </>
  );
};

export default Login;
