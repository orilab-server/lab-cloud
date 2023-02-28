import { useUser } from '@/features/auth/api/getUser';
import { UserContext } from '@/features/auth/modules/contexts/user';
import ProfileList from '@/features/home/components/Profile/ProfileList';
import ContentsLayout from '@/shared/components/Layout/ContentsLayout';
import MainLayout from '@/shared/components/Layout/MainLayout';
import { NextPage } from 'next';

const Profile: NextPage = () => {
  const userQuery = useUser();
  const user = userQuery.data;

  return (
    <MainLayout>
      <ContentsLayout>
        <UserContext.Provider value={user}>
          <ProfileList />
        </UserContext.Provider>
      </ContentsLayout>
    </MainLayout>
  );
};

export default Profile;
