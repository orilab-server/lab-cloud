import { pdfReviewState } from '@/shared/stores';
import { Button, IconButton, Stack, TextField } from '@mui/material';
import { Box } from '@mui/system';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSetRecoilState } from 'recoil';
import { usePdfReview } from '../../api/download/pdfReview';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const reviewStyle = {
  width: '100vw',
  zIndex: 1000,
  position: 'absolute',
  background: '#eee',
  top: 0,
  left: 0,
  paddingTop: 5,
  overflow: 'scroll',
};

interface PdfReviewInputs {
  [key: string]: string;
}

const PdfReview = () => {
  const [totalPages, setTotalPages] = useState<number>(0);
  const setPdfReview = useSetRecoilState(pdfReviewState);
  const { url } = usePdfReview();

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  const { control, handleSubmit } = useForm<PdfReviewInputs>({
    defaultValues: {
      page_0: '',
    },
  });

  const onSubmit: SubmitHandler<PdfReviewInputs> = (data) => {
    console.log(data);
  };

  return (
    <Box sx={reviewStyle} component="form" onSubmit={handleSubmit(onSubmit)}>
      <IconButton
        onClick={() => setPdfReview(null)}
        sx={{ position: 'fixed', top: 0, right: 0, zIndex: 1001 }}
      >
        <AiFillCloseCircle size={30} />
      </IconButton>
      <Document file={url} onLoadSuccess={onLoadSuccess}>
        {Array.from(new Array(totalPages), (_, index) => (
          <Stack key={`page_${index}`} sx={{ width: '100%', height: '100%', pb: 5 }}>
            <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
              <Page pageNumber={index + 1} width={720} />
              <Controller
                control={control}
                name={`page_${index}`}
                render={({ field }) => (
                  <Stack
                    sx={{ width: '100%', mx: 5 }}
                    spacing={2}
                    justifyContent="start"
                    alignItems="start"
                  >
                    <TextField multiline sx={{ width: '100%' }} {...field} />
                    <Button variant="contained" onClick={() => console.log(field.value)}>
                      内容を保存
                    </Button>
                  </Stack>
                )}
              />
            </Stack>
          </Stack>
        ))}
        <Stack sx={{ width: '100%', mb: 5 }} alignItems="center">
          <Button variant="contained" type="submit">
            フィードバックを登録
          </Button>
        </Stack>
      </Document>
    </Box>
  );
};

export default React.memo(PdfReview);
