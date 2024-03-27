'use client';

import Link from 'next/link';
import React from 'react';

type Props = {
  reviewName: string;
};

const BreadCrumbs = ({ reviewName }: Props) => {
  return (
    <div className="text-sm breadcrumbs fixed bottom-0 w-full pl-2 py-1 bg-white border-t flex space-x-2 text-gray-500">
      <ul>
        <li>
          <Link href="/reviews">Reviews</Link>
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
