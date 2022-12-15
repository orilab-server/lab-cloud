import { Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Reviewer } from '../types/review';

export type TabPanelsProps = {
  page: number;
  comment: string;
};

type ReturnType = [
  React.MemoExoticComponent<() => JSX.Element>,
  React.MemoExoticComponent<({ page, comment }: TabPanelsProps) => JSX.Element>,
  string,
];

export const useReviewerTab = (reviewers: Reviewer[]): ReturnType => {
  const [value, setValue] = useState<string>(reviewers[0]?.id || '');

  const onChange = (e: React.SyntheticEvent, value: string) => setValue(value);

  const ReviewerTabs = () => {
    return (
      <Tabs
        value={value}
        onChange={onChange}
        sx={{ maxWidth: '60vw' }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {reviewers.map((reviewer) => (
          <Tab key={reviewer.id} value={reviewer.id} label={reviewer.name} />
        ))}
      </Tabs>
    );
  };

  const TabPanels = ({ page, comment }: TabPanelsProps) => {
    return (
      <>
        {reviewers.map((reviewer) => (
          <React.Fragment key={reviewer.id}>
            {reviewer.id === value && (
              <Stack sx={{ width: '100%', p: 1 }}>
                <Chip sx={{ width: '100%' }} label={`${page}ページ目のコメント`} color="warning" />
                <Typography sx={{ p: 1, whiteSpace: 'pre-line' }}>
                  {comment || 'コメントはありません'}
                </Typography>
              </Stack>
            )}
          </React.Fragment>
        ))}
      </>
    );
  };

  return [React.memo(ReviewerTabs), React.memo(TabPanels), value];
};
