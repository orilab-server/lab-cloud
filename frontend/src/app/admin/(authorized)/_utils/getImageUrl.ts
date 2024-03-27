import { getImageURL } from '@/app/_shared/lib/firebase/server';

export const getImageUrl = async (bucket: string, name: string) => {
  const url = await getImageURL(bucket, name);
  return url;
  // const blob = await getImage(bucket, name);
  // return URL.createObjectURL(blob);
};
