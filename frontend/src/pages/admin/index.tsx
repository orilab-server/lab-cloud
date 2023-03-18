import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import ConfirmRequestsModal from '@/features/admin/components/misc/ConfirmRequestsModal';
import { Grid, Typography } from '@mui/material';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const collectionNames = ['news', 'researches', 'members'];

const Admin: NextPage = () => {
  const router = useRouter();

  return (
    <AdminLayout>
      {/* コンテンツ */}
      <Grid id="grid" container sx={{ width: '90vw' }} columns={12} spacing={1}>
        {collectionNames.map((colName) => (
          <Grid
            key={colName}
            item
            xs={3}
            onClick={() =>
              router.push({ pathname: '/admin/[collection]', query: { collection: colName } })
            }
            sx={{
              py: 15,
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '5px',
              mx: 1,
              my: 1,
              cursor: 'pointer',
              '&:hover': {
                background: 'rgba(0,0,0,0.3)',
              },
            }}
          >
            <Typography sx={{ p: 1, color: '#fff', fontSize: 18 }}>{colName}を編集</Typography>
          </Grid>
        ))}
        <ConfirmRequestsModal />
      </Grid>
    </AdminLayout>
  );
};

export default Admin;
