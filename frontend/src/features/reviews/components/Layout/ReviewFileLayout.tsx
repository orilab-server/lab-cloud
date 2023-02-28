import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

type ReviewFileLayoutProps = {
  children: React.ReactNode;
};

const ReviewFileLayout = ({ children }: ReviewFileLayoutProps) => {
  const router = useRouter();
  const prevPageOpt = {
    pathname: '/reviews/[review_id]',
    query: {
      review_id: router.query.review_id as string,
      review_name: router.query.review_name as string,
    },
  };

  return (
    <div className="w-full h-full bg-gray-200">
      <Link href={prevPageOpt}>
        <a className="fixed top-5 right-5">
          <AiFillCloseCircle size={30} />
        </a>
      </Link>
      {children}
    </div>
  );
};

export default ReviewFileLayout;
