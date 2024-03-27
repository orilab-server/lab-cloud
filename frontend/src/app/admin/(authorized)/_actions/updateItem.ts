'use client';

import { db } from '@/app/_shared/lib/firebase';
import { notifyState } from '@/app/_shared/stores';
import { doc, updateDoc } from 'firebase/firestore';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const updateItem = async (
  collectionAndBucketName: string,
  docId: string,
  data: { [key: string]: any },
  file?: File | null,
) => {
  const firestoreRes = await updateDoc(doc(db, collectionAndBucketName, docId), data)
    .then(() => ({ error: null }))
    .catch((error: Error) => ({ error }));
  if (firestoreRes.error !== null) {
    throw firestoreRes.error;
  }
  if (file) {
    // const storageRef = ref(storage, `${collectionAndBucketName}/${docId}.jpg`);
    // const uploadRes = await uploadBytes(storageRef, file)
    //   .then(() => ({ error: null }))
    //   .catch((error: Error) => ({ error }));
    // if (uploadRes.error) {
    //   throw uploadRes.error;
    // }
  }
};

type UpdateItemMutationConfig = {
  docId: string;
  data: {
    [key: string]: any;
  };
  file?: File | null;
};

export const useUpdateItem = (collectionAndBucketName: string, ...queryKeys: string[]) => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ data, docId, file }: UpdateItemMutationConfig) =>
      await updateItem(collectionAndBucketName, docId, data, file),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '更新しました' });
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: '更新に失敗しました' });
      },
    },
  );
};
