import { BeforeLoginForms } from '@/features/auth/components/BeforeLoginForms';
import { Button } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Login: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Button sx={{ position: 'absolute', top: 0, right: 0 }} onClick={() => router.push('/admin')}>
        管理者ページ
      </Button>
      <BeforeLoginForms />
    </>
  );
};

export default Login;
