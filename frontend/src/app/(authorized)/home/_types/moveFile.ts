export type MoveFilesMutationConfig = {
  path: string;
  targetPaths: string;
  toFolder: string;
};

export type MoveFilesToHigherMutationConfig = {
  path: string;
  targetPaths: string;
  fromFolder: string;
};
