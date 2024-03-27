import { Review } from '@/app/(authorized)/reviews/_types/review';
import Link from 'next/link';

type Props = {
  reviews: Review[];
};

const Events = async ({ reviews }: Props) => {
  return (
    <div>
      {reviews.map((r) => (
        <Link
          key={r.id}
          className="min-w-[300px] w-[25vw] aspect-square bg-gray-200 hover:bg-gray-300 flex flex-col justify-center items-center"
          href={`/reviews/${r.id}?review_name=${r.year}_${r.name}`}
        >
          <span className="my-1">{r.year}</span>
          <span>{r.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Events;
