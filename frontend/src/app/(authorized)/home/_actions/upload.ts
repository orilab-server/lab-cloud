'use server';

export const getUploadStreamReader = async (url: string, formData: FormData) => {
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.body?.getReader();
};
