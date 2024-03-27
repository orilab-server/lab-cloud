'use client';

import { Reviewer } from '@/app/(authorized)/reviews/_types/review';
import { useState } from 'react';

type Props = {
  reviewers: Reviewer[];
};

const ReviewersTabChild = ({ reviewers }: Props) => {
  const [reviewer, setReviewer] = useState<string>('');
  const selectReviewer = (id: string) => setReviewer(id);

  if (reviewers.length === 0) {
    return <div className="my-3">レビュアーなし</div>;
  }

  return (
    <div className="tabs my-3">
      {reviewers.map((r) => (
        <a
          onClick={() => selectReviewer(r.id)}
          key={r.id}
          className={`tab tab-bordered ${reviewer === r.id ? 'tab-active' : ''}`}
        >
          {r.name}
        </a>
      ))}
    </div>
  );
};

export default ReviewersTabChild;
