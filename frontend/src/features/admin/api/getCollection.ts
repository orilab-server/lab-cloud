import { getCollection, GetCollectionOptions } from '@/shared/lib/firebase';
import { useQuery } from 'react-query';
import { Collections, CollectionTypes } from '../types';

// news, researches, users の文字列から型を自動抽出

export const useCollection = <T extends Collections>(
  collectionName: T,
  options?: GetCollectionOptions | undefined,
) => {
  return useQuery({
    queryKey: ['hp', collectionName],
    queryFn: async () => getCollection<CollectionTypes[T]>(collectionName, options),
    staleTime: Infinity,
  });
};
