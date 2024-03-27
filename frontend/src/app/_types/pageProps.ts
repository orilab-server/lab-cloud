export type PageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export type ReviewPageProps = PageProps & {
  params: { review_id: string; file_id: string };
};

export type AdminPageProps = PageProps & {
  params: { collection: string };
};
