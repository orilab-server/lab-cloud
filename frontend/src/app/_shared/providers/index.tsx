'use client';

import { NotifyBar } from '@/app/_shared/components/NotifyBar';
import '@/app/_styles/globals.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';

type Props = {
  children: JSX.Element;
};

const queryClient = new QueryClient();

export const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <NotifyBar />
        {children}
      </RecoilRoot>
    </QueryClientProvider>
  );
};
