import { db, getCollection } from '@/shared/lib/firebase';
import { notifyState } from '@/shared/stores';
import { add, format } from 'date-fns';
import { addDoc, collection, WhereFilterOp } from 'firebase/firestore';
import { useMutation } from 'react-query';
import { useSetRecoilState } from 'recoil';

export const addUpdate = async (collectionName: string, title: string) => {
  // 当日に各コレクション内で更新したものが既にあれば登録しない
  const today = new Date(format(new Date(), 'yyyy-MM-dd'));
  const todayRange = [
    { target: 'createdat', threthhold: '>=' as WhereFilterOp, base: today },
    { target: 'createdat', threthhold: '<' as WhereFilterOp, base: add(today, { days: 1 }) },
  ];
  const todayUpdates = await getCollection(collectionName, { where: todayRange });
  console.log(todayUpdates);
  if (todayUpdates.length === 0) {
    const docRef = collection(db, 'updates');
    const res = await addDoc(docRef, {
      date: new Date(),
      title,
    })
      .then((data) => ({ data, error: null }))
      .catch((error) => ({ data: null, error }));
    if (res.error !== null) {
      throw res.error;
    }
  }
};

type AddUpdateMutationConfig = {
  collectionName: string;
  title: string;
};

export const useAddUpdate = () => {
  const setNotify = useSetRecoilState(notifyState);

  return useMutation(
    async ({ collectionName, title }: AddUpdateMutationConfig) => addUpdate(collectionName, title),
    {
      onSuccess: () => {
        setNotify({ severity: 'info', text: '更新情報を追加しました' });
      },
      onError: (error) => {
        setNotify({ severity: 'error', text: '更新情報を追加できませんでした' });
      },
    },
  );
};
