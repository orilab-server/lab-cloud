'use server';

export const getBlobStreamReader = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
  });
  const rstream = res.body;
  const reader = rstream?.getReader();

  return {
    blobPromise: res.blob(),
    reader,
    total: parseInt(res.headers.get('Content-Length') || '0', 10),
  };
};
