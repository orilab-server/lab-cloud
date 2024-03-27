import ContentsLayout from '@/app/(authorized)/_components/ContentsLayout';
import MainLayout from '@/app/(authorized)/_components/MainLayout';
import { redirect } from 'next/navigation';
import { getUser } from '../_utils/getUser';

type Props = {
  children: JSX.Element;
};

const Layout = async ({ children }: Props) => {
  const user = await getUser();

  if (!user || !user.is_login) {
    redirect('/login');
  }

  return (
    // @ts-expect-error Server Component
    <MainLayout user={user}>
      <ContentsLayout>{children}</ContentsLayout>
    </MainLayout>
  );
};

export default Layout;
