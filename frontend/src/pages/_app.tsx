import { RouteGuard } from '@/components/RouteGuard';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import '../styles/globals.css';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <RouteGuard>
          <Component {...pageProps} />
        </RouteGuard>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

export default MyApp;
