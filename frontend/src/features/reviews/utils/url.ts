export const extractPathFromPathname = (defaultPath: string | undefined, index: number) => {
  return defaultPath ? defaultPath : location.pathname.split('/').filter((p) => p)[index];
};

export const extractParamFromQuery = (defaultValue: string | undefined, query: string) => {
  return defaultValue ? defaultValue : new URLSearchParams(location.search).get(query) || '';
};
