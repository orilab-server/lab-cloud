export const slieceEndFileName = (path: string) => {
  if (path[path.length - 1] === "/") {
    return path
      .slice(0, path.lastIndexOf("/"))
      .slice(path.lastIndexOf("/") + 1);
  }
  return path.slice(path.lastIndexOf("/") + 1);
};

export const sliceStartDirPath = (path: string) => {
  return path.slice(0, path.indexOf("/"));
};
