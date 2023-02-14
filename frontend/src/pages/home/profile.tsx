import { useUser } from '@/features/auth/api/getUser';
import SettingLayout from '@/features/home/components/layout/SettingLayout';
import { Button, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const Profile: NextPage = () => {
  const router = useRouter();
  const userQuery = useUser();
  const user = userQuery.data;

  return (
    <SettingLayout>
      <Typography sx={{ fontSize: 24, color: 'rgba(0, 0, 0, 0.6)' }}>
        {user?.name}のプロフィール
      </Typography>
      <Button onClick={() => router.push('/home')}>ホームへ</Button>
    </SettingLayout>
  );
};

export default Profile;
