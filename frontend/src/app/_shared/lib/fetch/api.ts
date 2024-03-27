export const getWithApi = async (endPoint: `/${string}`, config?: RequestInit) => {
  return await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api${endPoint}`, {
    ...config,
    method: 'GET',
  });
};

export const postWithApi = async (endPoint: `/${string}`, config?: RequestInit) => {
  return await fetch(`${process.env.NEXT_PUBLIC_CLIENT_URL}/api${endPoint}`, {
    ...config,
    method: 'POST',
  });
};
