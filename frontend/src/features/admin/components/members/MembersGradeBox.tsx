import { Member } from '../../types';
import { UserItem } from './MemberItem';

type UsersGradeBoxProps = {
  members: Member[];
  grade: number;
};

const extractGradeStr = (grade: number) => {
  switch (grade) {
    case 5:
      return '修士2年';
    case 4:
      return '修士1年';
    case 3:
      return '学士4年';
    case 2:
      return '学士3年';
    default:
      return '卒業生';
  }
};

export const UsersGradeBox = ({ members, grade }: UsersGradeBoxProps) => {
  if (members.length === 0) {
    return null;
  }

  const gradeStr = extractGradeStr(grade);

  return (
    <div className="w-full my-6 space-y-3">
      <span>{gradeStr}</span>
      <div className="w-full border-b" />
      <div className="grid grid-cols-3 gap-3">
        {members.map((member) => (
          <div id={member.id} key={member.id}>
            <UserItem
              member={member}
              button={
                <button className="card border bg-gray-200 px-2 w-full h-24 hover:bg-gray-500 hover:text-white">
                  <div className="card-body">
                    <div className="text-md font-semibold">{member.name}</div>
                  </div>
                </button>
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};
