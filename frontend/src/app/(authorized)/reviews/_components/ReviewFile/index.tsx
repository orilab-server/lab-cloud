'use client';

import { useReviewFile } from '@/app/(authorized)/reviews/_hooks/useReviewFile';
import { LoadingSpinner } from '@/app/_shared/components/LoadingSpinner';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useShareComment } from '../../_hooks/useShareComment';
import { CommentBox } from './CommentBox';
import CommentView from './CommentView';
import { ReviewersTab } from './ReviewersTab';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

type Props = {
  reviewId: string;
  fileId: string;
  userId: number;
  isReviewHost: boolean;
  reviewFile: string;
};

const ReviewFile = ({ reviewId, fileId, userId, isReviewHost, reviewFile }: Props) => {
  const { totalPages, onLoadSuccess } = useReviewFile(reviewFile);
  // コメントをメールで通知
  const shareCommentMutation = useShareComment(reviewId, fileId, userId);
  const shareComment = async () => {
    await shareCommentMutation.mutateAsync();
  };

  const MailNotify = () => (
    <>
      {!isReviewHost && (
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
      {!isReviewHost === null && <MailNotify />}
      {reviewFile ? (
        <div className="mx-10 py-10">
          {/* 全員のレビュー内容はホストのみ閲覧可能(記述者は自分のもののみ参照可能) */}
          {/* @ts-expect-error Server Component */}
          {isReviewHost && <ReviewersTab reviewId={reviewId} fileId={fileId} />}
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
                    {!(isReviewHost === null) && (
                      <>
                        {isReviewHost ? (
                          // @ts-expect-error Server Component
                          <CommentView index={index} />
                        ) : (
                          // @ts-expect-error Server Component
                          <CommentBox
                            id={`page_${index}`}
                            reviewId={reviewId}
                            fileId={fileId}
                            userId={userId}
                            index={index}
                          />
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
