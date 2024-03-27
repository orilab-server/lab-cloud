'use client';

import { db } from '@/app/_shared/lib/firebase';
import { notifyState } from '@/app/_shared/stores';
import { deleteDoc as delDoc, doc } from 'firebase/firestore';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const deleteItem = async (collectionAndBucketName: string, docId: string) => {
  const firestoreRes = await delDoc(doc(db, collectionAndBucketName, docId))
    .then(() => ({ error: null }))
    .catch((error: Error) => ({ error }));
  if (firestoreRes.error !== null) {
    throw firestoreRes.error;
  }
  // const storageRes = await deleteObject(ref(storage, `${collectionAndBucketName}/${docId}.jpg`))
  //   .then(() => ({ error: null }))
  //   .catch((error: Error) => ({ error }));
  // if (storageRes.error !== null) {
  //   throw storageRes.error;
  // }
};

type DeleteDocMutationConfig = {
  docId: string;
};

export const useDeleteItem = (collectionAndBucketName: string, ...queryKeys: string[]) => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ docId }: DeleteDocMutationConfig) => await deleteItem(collectionAndBucketName, docId),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '削除しました' });
      },
      onError: (error) => {
        setNotify({ severity: 'error', text: '削除に失敗しました' });
        console.log(error);
      },
    },
  );
};
