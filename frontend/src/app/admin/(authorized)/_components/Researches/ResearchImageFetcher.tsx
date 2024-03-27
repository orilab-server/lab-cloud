import { getImageURL } from '@/app/_shared/lib/firebase/server';
import { ResearchForFront } from '../../_types/research';
import { ResearchItem } from './ResearchItem';

type Props = {
  research: ResearchForFront;
};

export const ResearchImageFetcher = async ({ research }: Props) => {
  const image = await getImageURL('researches', research.id);

  return (
    <ResearchItem
      item={research}
      image={image}
      buttonChild={
        <div className="card border bg-gray-200 px-2 w-full h-48 hover:bg-gray-500 hover:text-white">
          <div className="card-body">
            <div className="text-sm">作成日 {research.createdat}</div>
            <div className="text-md line-clamp-3">{research.title}</div>
          </div>
        </div>
      }
    />
  );
};
