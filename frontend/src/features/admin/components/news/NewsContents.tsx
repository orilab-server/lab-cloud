import { format } from 'date-fns';
import { useModal } from 'react-hooks-use-modal';
import { News } from '../../types';
import { AddItem } from './AddItem';
import { NewsItem } from './NewsItem';

type NewsContentsProps = {
  data: News[];
};

export const NewsContents = ({ data }: NewsContentsProps) => {
  const addModals = useModal('news-contents', { closeOnOverlayClick: false });
  return (
    <div className="grid grid-cols-1 gap-y-5" id="news-contents">
      <AddItem modals={addModals} />
      <div className="grid grid-cols-3 gap-3">
        {data.map((item) => {
          return (
            <div key={item.id} id={item.id}>
              <NewsItem
                item={item}
                button={
                  <button className="card border bg-gray-200 px-2 w-full h-48 hover:bg-gray-500 hover:text-white">
                    <div className="card-body">
                      <div className="text-sm">
                        {format(new Date(item.date.seconds * 1000), 'yyyy-MM-dd')}
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
