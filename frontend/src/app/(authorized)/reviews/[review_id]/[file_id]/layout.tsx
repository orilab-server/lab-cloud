import { ReviewPageProps } from '@/app/_types/pageProps';
import Link from 'next/link';
import React from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

type LayoutProps = ReviewPageProps & {
  children: React.ReactNode;
};

const ReviewFileLayout = ({ children, params, searchParams }: LayoutProps) => {
  const reviewId = params.review_id;
  const reviewName = (searchParams.review_name as string) || '';

  return (
    <div className="w-full h-full bg-gray-200">
      <Link
        className="fixed top-5 right-5"
        href={{ pathname: `/reviews/${reviewId}?review_name=${reviewName}` }}
      >
        <AiFillCloseCircle size={30} />
      </Link>
      {children}
    </div>
  );
};

export default ReviewFileLayout;
