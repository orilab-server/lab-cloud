export const parseFileSizeStr = (size: number) => {
  if (size > 1000 * 1000 * 1000) {
    return `${(size / (1000 * 1000 * 1000)).toFixed(2)}GB`;
  }
  if (size > 1000 * 1000) {
    return `${(size / (1000 * 1000)).toFixed(2)}MB`;
  }
  if (size > 1000) {
    return `${(size / 1000).toFixed(2)}KB`;
  }
  return `${size}Byte`;
};
