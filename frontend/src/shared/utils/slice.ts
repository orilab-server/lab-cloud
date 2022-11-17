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

// 入力文字列を任意の長さでスライス, オプション引数の ellipsis で省略記法 ... を選択できる
export const freeLengthStrSlicer = (str: string, length: number, ellipsis?: boolean) => {
  if (Array.from(str).length <= length) {
    return str;
  }
  return `${str.slice(0, length)}${ellipsis ? '...' : ''}`;
};
