import { Providers } from '@/app/_shared/providers';

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props) => {
  return (
    <html lang="ja">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default Layout;
