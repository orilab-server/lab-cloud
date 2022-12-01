import { Button, Grid, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useModal } from 'react-hooks-use-modal';
import { AiOutlinePlus } from 'react-icons/ai';
import { Research } from '../../types';
import { AddItem } from './AddItem';
import { ResearchItem } from './ResearchItem';

const gridSx = {
  border: '1px solid #ccc',
  borderRadius: 2,
  height: '12rem',
  m: 1,
  p: 3,
  '&:hover': {
    background: '#ccc',
  },
};

type ResearchContentsProps = {
  data: Research[];
};

export const ResearchContents = ({ data }: ResearchContentsProps) => {
  const addModals = useModal('research-contents', { closeOnOverlayClick: false });
  return (
    <Stack id="research-contents" spacing={5}>
      <AddItem modals={addModals}>
        <Button variant="outlined">
          <AiOutlinePlus style={{ marginRight: 3 }} />
          研究を追加する
        </Button>
      </AddItem>
      <Grid container columns={12}>
        {data.map((item) => {
          return (
            <Grid id={item.id} item key={item.id} sx={gridSx} xs={3}>
              <ResearchItem
                item={item}
                button={
                  <Stack>
                    <Typography sx={{ fontSize: 12, my: 0.1 }}>タイトル</Typography>
                    <Typography sx={{ fontSize: 16 }}>{item.title}</Typography>
                  </Stack>
                }
              />
            </Grid>
          );
        })}
      </Grid>
    </Stack>
  );
};
