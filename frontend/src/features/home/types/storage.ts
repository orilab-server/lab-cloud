export type Storage = {
  filepaths:
    | {
        path: string;
        type: 'dir' | 'file';
      }[];
  basedir: string;
  ishome: boolean;
  topdirs: string[];
};
