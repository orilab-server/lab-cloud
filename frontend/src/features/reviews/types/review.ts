export type Review = {
  id: string;
  name: string;
  target: number;
};

export type ReviewUser = {
  id: string;
};

export type Reviewed = {
  id: string;
  name: string;
};

export type ReviewedFile = {
  id: string;
  file_name: string;
  created_at: string;
  reviewer_count: number;
};

export type Reviewer = {
  id: string;
  userId: number;
  name: string;
};

export type Comment = {
  id: string;
  page_number: number;
  comment: string;
};
