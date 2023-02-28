import React from 'react';

type ContentsLayoutProps = {
  children: React.ReactNode;
};

const ContentsLayout = ({ children }: ContentsLayoutProps) => {
  return (
    <div className="sm:ml-64 min-w-[800px]">
      <div className="rounded-lg border-gray-700 mt-14 w-full">{children}</div>
    </div>
  );
};

export default React.memo(ContentsLayout);
