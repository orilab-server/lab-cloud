import { format } from 'date-fns';
import { useModal } from 'react-hooks-use-modal';
import { Research } from '../../types';
import { AddItem } from './AddItem';
import { ResearchItem } from './ResearchItem';

type ResearchContentsProps = {
  data: Research[];
};

export const ResearchContents = ({ data }: ResearchContentsProps) => {
  const addModals = useModal('research-contents', { closeOnOverlayClick: false });
  return (
    <div className="flex flex-col space-y-6" id="research-contents">
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
    </div>
  );
};
