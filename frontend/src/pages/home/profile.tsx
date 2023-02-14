import { useUser } from '@/features/auth/api/getUser';
import UserNameRow from '@/features/profile/components/UserNameRow';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Profile: NextPage = () => {
  const router = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;

  return (
    <Stack
      sx={{ width: '90vw', height: '100vh', mx: 'auto', py: 1 }}
      alignItems="center"
      justifyContent="start"
    >
      <Stack
        direction="row"
        sx={{ width: '100%', borderBottom: '2px solid rgba(0,0,0,0.5)', py: 2 }}
        justifyContent="space-between"
      >
        <Typography sx={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.6)' }}>
          {user?.name}のプロフィール
        </Typography>
        <Button onClick={() => router.push('/home')}>ホームへ</Button>
      </Stack>
      <UserNameRow userName={user?.name || ''} />
    </Stack>
  );
};

export default Profile;
