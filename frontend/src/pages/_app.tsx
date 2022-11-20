import { NotifyBar } from '@/shared/components/NotifyBar';
import { RouteGuard } from '@/shared/components/RouteGuard';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <NotifyBar />
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default MyApp;
