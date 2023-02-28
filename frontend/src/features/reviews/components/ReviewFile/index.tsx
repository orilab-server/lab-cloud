import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useIsReviewHost } from '../../api/files/getIsReviewHost';
import { useShareComment } from '../../api/reviewers/shareComments';
import { useReviewFile } from '../../hooks/useReviewFile';
import CommentBox from './CommentBox';
import CommentView from './CommentView';
import ReviewersTab from './ReviewersTab';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ReviewFile = () => {
  const { reviewFile, totalPages, onLoadSuccess, reloadFile } = useReviewFile();
  const isReviewHostQuery = useIsReviewHost();
  // コメントをメールで通知
  const shareCommentMutation = useShareComment();
  const shareComment = async () => {
    await shareCommentMutation.mutateAsync();
  };

  const MailNotify = () => (
    <>
      {!isReviewHostQuery.data && (
        <div className="w-full flex justify-center py-10">
          <button onClick={shareComment} className="btn btn-secondary px-5 flex">
            {shareCommentMutation.isLoading && <LoadingSpinner size="sm" />}
            <span className="mx-1 flex-1">メールで本人に通知</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="w-full">
      {!isReviewHostQuery.data === null && <MailNotify />}
      {reviewFile ? (
        <div className="mx-10 py-10">
          {/* 全員のレビュー内容はホストのみ閲覧可能(記述者は自分のもののみ参照可能) */}
          {isReviewHostQuery.data && <ReviewersTab />}
          <Document
            file={reviewFile}
            onLoadSuccess={onLoadSuccess}
            options={{
              cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
              cMapPacked: true,
            }}
          >
            {Array.from(new Array(totalPages), (_, index) => {
              return (
                <div key={`page_${index}`} className="w-full h-full pb-5">
                  <div className="w-full h-full flex justify-between">
                    <Page pageNumber={index + 1} width={720} />
                    {!(isReviewHostQuery.data === null) && (
                      <>
                        {isReviewHostQuery.data ? (
                          <CommentView index={index} />
                        ) : (
                          <CommentBox id={`page_${index}`} index={index} />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </Document>
        </div>
      ) : (
        <div className="w-full h-screen flex justify-center items-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </div>
  );
};

export default ReviewFile;
