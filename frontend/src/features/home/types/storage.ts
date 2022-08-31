export type Storage = {
  filepaths:
    | {
        path: string;
        type: string;
      }[];
  basedir: string;
  ishome: boolean;
  topdirs: string[];
};
