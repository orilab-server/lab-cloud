import { LoadingSpinner } from './LoadingSpinner';

export const ScreenLoading = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
};
