import { Stack } from '@mui/system';
import { format } from 'date-fns';
import { useModal } from 'react-hooks-use-modal';
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
      <AddItem modals={addModals} />
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => {
          return (
            <div id={item.id} key={item.id}>
              <ResearchItem
                item={item}
                button={
                  <button className="card border bg-gray-200 px-2 w-full h-48 hover:bg-gray-500 hover:text-white">
                    <div className="card-body">
                      <div className="text-sm">
                        作成日 {format(new Date(item.createdat.seconds * 1000), 'yyyy-MM-dd')}
                      </div>
                      <div className="text-md line-clamp-3">{item.title}</div>
                    </div>
                  </button>
                }
              />
            </div>
          );
        })}
      </div>
    </Stack>
  );
};
