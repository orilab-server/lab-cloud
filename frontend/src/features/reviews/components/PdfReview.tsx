import { ScreenLoading } from '@/shared/components/ScreenLoading';
import { pdfReviewState } from '@/shared/stores';
import { Chip, IconButton, Stack } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSetRecoilState } from 'recoil';
import { useGetReviewers } from '../api/getReviewers';
import { usePdfReview } from '../api/getReviewPdf';
import { useReviewerTab } from '../hooks/useReviewerTab';
import CommentBox from './CommentBox';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const reviewStyle = {
  width: '100vw',
  zIndex: 1000,
  position: 'absolute',
  background: '#eee',
  py: 1,
  top: 0,
  left: 0,
  overflow: 'scroll',
};

type PdfReviewProps = {
  pathName: string;
  fileId: string;
  userId?: number;
  isOwn?: boolean;
};

const PdfReview = ({ pathName, fileId, userId, isOwn }: PdfReviewProps) => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const setPdfReview = useSetRecoilState(pdfReviewState);
  const reviewersQuery = useGetReviewers(`${pathName}/${fileId}/reviewers`);
  const reviewers = reviewersQuery.data || [];
  const [ReviewerTabs, TabPanels, reviewer] = useReviewerTab(reviewers);
  const { url, loading } = usePdfReview(pathName);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  if (loading) {
    return <ScreenLoading />;
  }

  return (
    <Box sx={reviewStyle}>
      <IconButton
        onClick={() => setPdfReview(null)}
        sx={{ position: 'fixed', top: 0, right: 0, zIndex: 1001 }}
      >
        <AiFillCloseCircle size={30} />
      </IconButton>
      <Stack
        direction="row"
        spacing={2}
        sx={{ width: '100%', my: 1, fontSize: '14px', color: '#333' }}
        justifyContent="center"
        alignItems="end"
      >
        <Chip label="レビュアー" variant="outlined" color="primary" />
        <ReviewerTabs />
      </Stack>
      <Document
        file={url}
        onLoadSuccess={onLoadSuccess}
        options={{
          cMapUrl: 'https://unpkg.com/pdfjs-dist@2.16.105/cmaps/',
          cMapPacked: true,
        }}
      >
        {Array.from(new Array(totalPages), (_, index) => {
          return (
            <Stack key={`page_${index}`} sx={{ width: '100%', height: '100%', pb: 5 }}>
              <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
                <Page pageNumber={index + 1} width={720} />
                <CommentBox
                  userId={userId}
                  url={`${pathName}/${fileId}`}
                  page={index + 1}
                  reviewer={reviewer}
                  Panel={TabPanels}
                  isOwn={isOwn || reviewers.find((r) => r.id === reviewer)?.userId !== userId}
                />
              </Stack>
            </Stack>
          );
        })}
      </Document>
    </Box>
  );
};

export default React.memo(PdfReview);
