import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type BreadCrumbsProps = {};

const BreadCrumbs = () => {
  const router = useRouter();
  const reviewName = router.query.review_name as string;

  return (
    <div className="text-sm breadcrumbs fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
      <ul>
        <li>
          <Link href="/reviews">
            <a>Reviews</a>
          </Link>
        </li>
        {reviewName && (
          <li>
            <p>{reviewName}</p>
          </li>
        )}
      </ul>
    </div>
  );
};

export default React.memo(BreadCrumbs);
