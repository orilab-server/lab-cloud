import { useUser } from '@/features/auth/api/getUser';
import { SignUpComplete } from '@/features/auth/components/SignUpForm';
import { UserContext } from '@/features/auth/modules/contexts/user';
import { useFilePaths } from '@/features/home/api/main/getFilePaths';
import DownloadToasts from '@/features/home/components/Main/DownloadToasts';
import FileList from '@/features/home/components/Main/FileList';
import { ContextMenuContextProvider } from '@/features/home/modules/contetexts/contextMenu';
import { StorageContext } from '@/features/home/modules/contetexts/storage';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const userQuery = useUser();
  const storageQuery = useFilePaths();
  const isLoading = userQuery.isLoading || storageQuery.isLoading;

  if (userQuery.data?.is_temporary) {
    return <SignUpComplete />;
  }

  return (
    <UserContext.Provider value={userQuery.data}>
      <StorageContext.Provider value={storageQuery.data}>
        <MainLayout>
          <ContentsLayout>
            {isLoading ? null : (
              <ContextMenuContextProvider>
                <FileList />
              </ContextMenuContextProvider>
            )}
            <DownloadToasts />
          </ContentsLayout>
        </MainLayout>
      </StorageContext.Provider>
    </UserContext.Provider>
  );
};

export default Home;
