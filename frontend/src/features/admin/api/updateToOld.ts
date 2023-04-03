import { db } from '@/shared/lib/firebase';
import { notifyState } from '@/shared/stores';
import { doc, setDoc } from 'firebase/firestore';
import { useMutation, useQueryClient } from 'react-query';
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
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, already }: UpdateOldMutationConfig) => await updateOld(id, already),
    {
      onSuccess: async () => {
        setNotify({ severity: 'info', text: `OB・OGに設定しました` });
        await queryClient.invalidateQueries(['hp', 'members']);
      },
      onError: (error) => {
        console.error(error);
      },
    },
  );
};
