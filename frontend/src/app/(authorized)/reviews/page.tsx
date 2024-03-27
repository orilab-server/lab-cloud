import BreadCrumbs from '@/app/(authorized)/reviews/_components/BreadCrumbs';
import GridEvents from '@/app/(authorized)/reviews/_components/GridEvents';
import { ReviewPageProps } from '@/app/_types/pageProps';
import { getUsers } from '@/app/_utils/getUsers';

const Page = async ({ searchParams }: ReviewPageProps) => {
  const reviewName = (searchParams.review_name as string) || '';

  const users = await getUsers();

  return (
    <div>
      {/* @ts-expect-error Server Component */}
      <GridEvents users={users} />
      <BreadCrumbs reviewName={reviewName} />
    </div>
  );
};

export default Page;
