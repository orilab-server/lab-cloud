import { getUser } from '@/app/_utils/getUser';
import UserName from './Items/UserName';

const ProfileList = async () => {
  const user = await getUser();

  return (
    <div className="h-screen bg-gray-100">
      <div className="p-5 grid grid-cols-3 gap-3">{user && <UserName user={user} />}</div>
    </div>
  );
};

export default ProfileList;
