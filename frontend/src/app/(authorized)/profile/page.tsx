import ProfileList from '@/app/(authorized)/profile/_components/ProfileList';

const Profile = () => {
  // @ts-expect-error Server Component
  return <ProfileList />;
};

export default Profile;
