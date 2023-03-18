import UserName from './Items/UserName';

const ProfileList = () => {
  return (
    <div className="h-screen bg-gray-100">
      <div className="p-5 grid grid-cols-3 gap-3">
        <UserName />
      </div>
    </div>
  );
};

export default ProfileList;
