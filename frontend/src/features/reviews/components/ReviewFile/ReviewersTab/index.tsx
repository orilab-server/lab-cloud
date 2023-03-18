import { useGetReviewers } from '@/features/reviews/api/reviewers/getReviewers';
import { reviewerState } from '@/features/reviews/modules/stores';
import { useRecoilState } from 'recoil';

const ReviewersTab = () => {
  const [reviewer, setReviewer] = useRecoilState(reviewerState);
  // reviewerを取得(コメントは不要)
  const reviewersQuery = useGetReviewers();
  const reviewers = reviewersQuery.data || [];
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

export default ReviewersTab;
