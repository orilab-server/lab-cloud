export const endFilenameSlicer = (path: string) => {
  if (path[path.length - 1] === '/') {
    return path.slice(0, path.lastIndexOf('/')).slice(path.lastIndexOf('/') + 1);
  }
  return path.slice(path.lastIndexOf('/') + 1);
};

export const withoutLastPathSlicer = (path: string) => {
  return path.slice(0, path.lastIndexOf('/'));
};

export const startDirPathSlicer = (path: string) => {
  return path.slice(0, path.indexOf('/'));
};

export const multiSlicer = <T extends unknown[]>(list: T, divider: number) => {
  const length = Math.ceil(list.length / divider);
  return new Array(length).fill(0).map((_, i) => list.slice(i * divider, (i + 1) * divider)) as T[];
};

export const relativePathSlicer = (current: string, base: string) => {
  if (current === base) {
    return '/';
  }
  return current.replace(base, '');
};
