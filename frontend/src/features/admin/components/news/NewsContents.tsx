import { Box, Button, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { format } from 'date-fns';
import { useModal } from 'react-hooks-use-modal';
import { AiOutlinePlus } from 'react-icons/ai';
import { News } from '../../types';
import { AddItem } from './AddItem';
import { NewsItem } from './NewsItem';

const gridSx = {
  border: '1px solid #ccc',
  borderRadius: 2,
  m: 1,
  p: 3,
  '&:hover': {
    background: '#ccc',
  },
};

type NewsContentsProps = {
  data: News[];
};

export const NewsContents = ({ data }: NewsContentsProps) => {
  const addModals = useModal('news-contents', { closeOnOverlayClick: false });
  return (
    <Stack id="news-contents" spacing={2} sx={{ width: '100%' }}>
      <AddItem
        button={
          <Button sx={{ width: '20%', mx: 1 }} variant="outlined">
            <AiOutlinePlus style={{ marginRight: 3 }} />
            ニュースを追加する
          </Button>
        }
        modals={addModals}
      />
      <Grid container columns={12} sx={{ width: '100%' }}>
        {data.map((item) => {
          return (
            <Grid item key={item.id} id={item.id} sx={gridSx} xs={3}>
              <NewsItem
                item={item}
                button={
                  <Box sx={{ cursor: 'pointer' }}>
                    <Typography sx={{ fontSize: 12 }}>
                      {format(new Date(item.date.seconds * 1000), 'yyyy-MM-dd')}
                    </Typography>
                    <Typography sx={{ fontSize: 16 }}>{item.title}</Typography>
                  </Box>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
