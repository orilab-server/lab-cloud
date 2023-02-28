import { useGetReviews } from '@/features/reviews/api/reviews/getReviews';
import Link from 'next/link';

const Events = () => {
  const reviewsQuery = useGetReviews();
  const reviews = reviewsQuery.data || [];

  if (reviewsQuery.isLoading) {
    // Skelton
    return (
      <>
        {Array.from(new Array(3), (_, i) => (
          <div
            key={i}
            className="animate-pulse min-w-[300px] max-w-[360px] aspect-square bg-gray-400"
          ></div>
        ))}
      </>
    );
  }

  return (
    <>
      {reviews.map((r) => (
        <Link
          key={r.id}
          href={{
            pathname: '/reviews/[review_id]',
            query: {
              review_id: r.id,
              review_name: `${r.year}_${r.name}`,
            },
          }}
        >
          <a className="min-w-[300px] w-[25vw] aspect-square bg-gray-200 hover:bg-gray-300 flex flex-col justify-center items-center">
            <span className="my-1">{r.year}</span>
            <span>{r.name}</span>
          </a>
        </Link>
      ))}
    </>
  );
};

export default Events;
