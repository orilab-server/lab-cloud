import { PageProps } from '@/app/_types/pageProps';
import { getUser } from '@/app/_utils/getUser';
import { Suspense } from 'react';
import { DirFetcher } from './_components/DirFetcher';
import { SignUpCompleteForm } from './_components/SignUpCompleteForm';

const Page = async ({ searchParams }: PageProps) => {
  const user = await getUser();

  if (user?.is_temporary) {
    return <SignUpCompleteForm />;
  }

  return (
    // TODO: FallBackを定義
    <Suspense fallback={<></>}>
      {/* @ts-expect-error Server Component */}
      <DirFetcher currentPath={(searchParams.path as string) || ''} />
    </Suspense>
  );
};

export default Page;
