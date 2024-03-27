import { getWithAuth } from '@/app/_shared/lib/fetch';
import { User } from '@/app/_types/user';
import { Suspense } from 'react';
import { Review } from '../../_types/review';
import Events from './Events';
import RegisterModal from './RegisterModal';

type Props = {
  users: User[];
};

const GridEvents = async ({ users }: Props) => {
  const reviews = await getReviews();

  return (
    <div className="min-w-[1100px] py-3 flex flex-col items-center">
      <div className="my-5 text-xl">イベント</div>
      <div className="grid grid-cols-3 gap-8">
        <RegisterModal users={users} />
        <Suspense fallback={<EventsLoading />}>
          {/* @ts-expect-error Server Component */}
          <Events reviews={reviews} />
        </Suspense>
      </div>
    </div>
  );
};

export default GridEvents;

const EventsLoading = () => {
  return (
    <div>
      {Array.from(new Array(3), (_, i) => (
        <div
          key={i}
          className="animate-pulse min-w-[300px] max-w-[360px] aspect-square bg-gray-400"
        ></div>
      ))}
    </div>
  );
};

const getReviews = async () => {
  try {
    const res = await getWithAuth('/reviews', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as { reviews: Review[] };

    return json.reviews;
  } catch (e) {
    return [];
  }
};
