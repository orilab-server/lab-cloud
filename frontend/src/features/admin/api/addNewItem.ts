import { db, storage } from '@/shared/lib/firebase';
import { notifyState } from '@/shared/stores';
import { addDoc, collection } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useMutation, useQueryClient } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const addNewItem = async <T extends object>(
  targetData: T,
  collectionAndBucketName: string,
  file: File,
) => {
  const docRef = collection(db, collectionAndBucketName);
  const firestoreRes = await addDoc(docRef, {
    ...targetData,
  })
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: null, error }));
  if (firestoreRes.error !== null) {
    throw firestoreRes.error;
  }
  const id = firestoreRes.data?.id;
  const storageRef = ref(storage, `${collectionAndBucketName}/${id}.jpg`);
  const storageRes = await uploadBytes(storageRef, file)
    .then((data) => ({ data, error: null }))
    .catch((error) => ({ data: null, error }));
  if (storageRes.error !== null) {
    throw storageRes.error;
  }
  return id;
};

type AddNewDocMutationConfig<T extends object> = {
  data: T;
  file: File;
};

export const useAddNewItem = <T extends object>(
  collectionAndBucketName: string,
  ...queryKyes: string[]
) => {
  const setNotify = useSetRecoilState(notifyState);
  const queryClient = useQueryClient();

  return useMutation(
    async ({ data, file }: AddNewDocMutationConfig<T>) =>
      addNewItem(data, collectionAndBucketName, file),
    {
      onSuccess: async (id) => {
        setNotify({ severity: 'info', text: '登録しました' });
        await queryClient.invalidateQueries(collectionAndBucketName);
        // 配列でのクエリキー指定が効かないため一つずつ指定
        await Promise.all(queryKyes.map(async (key) => await queryClient.invalidateQueries(key)));
        return id;
      },
      onError: (error) => {
        console.log(error);
        setNotify({ severity: 'error', text: '送信に失敗しました' });
      },
    },
  );
};
