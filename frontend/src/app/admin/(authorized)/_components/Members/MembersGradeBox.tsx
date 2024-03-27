import { Suspense } from 'react';
import { Member } from '../../_types/member';
import { MemberImageFetcher } from './MemberImageFetcher';

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

export const MembersGradeBox = ({ members, grade }: UsersGradeBoxProps) => {
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
            <Suspense fallback={<></>}>
              {/* @ts-expect-error Server Component */}
              <MemberImageFetcher item={member} />
            </Suspense>
          </div>
        ))}
      </div>
    </div>
  );
};
