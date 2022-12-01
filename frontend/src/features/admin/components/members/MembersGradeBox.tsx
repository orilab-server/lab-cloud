import { Box, Grid, Stack, Typography } from '@mui/material';
import { Member } from '../../types';
import { UserItem } from './MemberItem';

const gridSx = {
  border: '1px solid #ccc',
  m: 1,
  borderRadius: 2,
  '&:hover': {
    background: '#ccc',
  },
};

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
    <Stack id="user-contents" spacing={1} sx={{ width: '100%', my: 2 }}>
      <Typography>{gradeStr}</Typography>
      <Box sx={{ width: '100%', borderBottom: '2px rgba(0,0,0,0.5) solid' }} />
      <Grid container columns={12}>
        {members.map((member) => (
          <Grid id={member.id} key={member.id} item sx={gridSx} xs={3}>
            <UserItem
              member={member}
              button={<Box sx={{ width: '100%', height: '100%', p: 3 }}>{member.name}</Box>}
            />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};
