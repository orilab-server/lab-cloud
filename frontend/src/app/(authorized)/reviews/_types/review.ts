export type Review = {
  id: string;
  name: string;
  target: number;
  year: number;
};

export type ReviewUser = {
  id: string;
};

export type Reviewed = {
  id: string;
  name: string;
};

export type ReviewFile = {
  id: string;
  user_id: number;
  user_name: string;
  created_at: string;
  file_name: string;
  reviewer_count: number;
};

export type TeacherReviewedFiles = {
  id: string;
  file_name: string;
  created_at: string;
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
  created_at: string;
};
