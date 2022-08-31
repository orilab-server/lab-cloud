import { Skeleton, SkeletonProps } from '@mui/material';

type TextSkeltonProps = SkeletonProps;

export const TextSkelton = (props: TextSkeltonProps) => {
  return <Skeleton variant="text" {...props} />;
};
