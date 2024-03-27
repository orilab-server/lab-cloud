import { cookies } from 'next/headers';

const apiUrl = process.env.NEXT_PUBLIC_SERVER_URL as string;

const getCookie = () => {
  const session = cookies().get('mysession');

  return `${session?.name}=${session?.value}`;
};

export const get = async (endPoint: `/${string}`, config?: RequestInit) => {
  const headers = config?.headers;
  return await fetch(`${apiUrl}${endPoint}`, {
    ...config,
    method: 'GET',
    credentials: 'include',
    headers: {
      ...headers,
      Cookie: getCookie(),
    },
  });
};

export const getWithAuth = async (endPoint: `/${string}`, config?: RequestInit) => {
  const headers = config?.headers;
  return await fetch(`${apiUrl}/auth${endPoint}`, {
    ...config,
    method: 'GET',
    credentials: 'include',
    headers: {
      ...headers,
      Cookie: getCookie(),
    },
  });
};
