'use client';

import { db } from '@/app/_shared/lib/firebase';
import { notifyState } from '@/app/_shared/stores';
import { doc, setDoc } from 'firebase/firestore';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const updateOld = async (id: string, already?: boolean) => {
  // already === true => OB・OG登録済み
  const firestoreRes = await setDoc(doc(db, 'members', id), { old: !already }, { merge: true })
    .then(() => ({ error: null }))
    .catch((error: Error) => ({ error }));
  if (firestoreRes.error !== null) {
    throw firestoreRes.error;
  }
};

type UpdateOldMutationConfig = {
  id: string;
  already?: boolean;
};

export const useUpdateOld = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ id, already }: UpdateOldMutationConfig) => await updateOld(id, already),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: `OB・OGに設定しました` });
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
