import { Button, Grid } from '@mui/material';
import { Stack } from '@mui/system';
import { useModal } from 'react-hooks-use-modal';
import { AiOutlinePlus } from 'react-icons/ai';
import { Member } from '../../types';
import { AddUser } from './AddMember';
import { UsersGradeBox } from './MembersGradeBox';

type UserContentsProps = {
  data: Member[];
};

const GRADUATION = 6;

// 5 → m2
// 4 → m1
// 3 → b4
// 2 → b3
const createGradeMembers = (members: Member[], grade: number) => {
  const date = new Date();
  const thisMonth = date.getMonth() + 1;
  const thisYear = thisMonth < 4 ? date.getFullYear() - 1 : date.getFullYear();
  return members.filter((member) =>
    grade >= GRADUATION ? thisYear - member.year >= GRADUATION : thisYear - member.year === grade,
  );
};

export const UserContents = ({ data }: UserContentsProps) => {
  const addModals = useModal('user-contents');
  // each grade members
  const m2 = createGradeMembers(data, 5);
  const m1 = createGradeMembers(data, 4);
  const b4 = createGradeMembers(data, 3);
  const b3 = createGradeMembers(data, 2);
  const graduate = createGradeMembers(data, GRADUATION);

  return (
    <Stack id="user-contents" spacing={5}>
      <AddUser modals={addModals}>
        <Button variant="outlined">
          <AiOutlinePlus style={{ marginRight: 3 }} />
          新規メンバーを追加する
        </Button>
      </AddUser>
      <Grid container columns={12}>
        <UsersGradeBox members={m2} grade={5} />
        <UsersGradeBox members={m1} grade={4} />
        <UsersGradeBox members={b4} grade={3} />
        <UsersGradeBox members={b3} grade={2} />
        <UsersGradeBox members={graduate} grade={6} />
      </Grid>
    </Stack>
  );
};
