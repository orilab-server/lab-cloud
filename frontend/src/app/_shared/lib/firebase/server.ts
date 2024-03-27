import { FIREBASE_STORAGE_BUCKET } from '@/app/_consts/firebase';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { WhereFilterOp, getFirestore } from 'firebase-admin/firestore';
import { getDownloadURL, getStorage } from 'firebase-admin/storage';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string;

export type GetCollectionOptions = {
  limit?: Limit;
  where?: Where | Where[];
  orderby?: OrderBy;
};

type Limit = number;
type Where = {
  target: string;
  threthhold: WhereFilterOp;
  base: unknown;
};
type OrderBy = {
  target: string;
  desc?: boolean;
};

const app =
  getApps().length === 0
    ? initializeApp({
        credential: cert(JSON.parse(serviceAccountKey)),
        // storageBucket: 'lab-hp-3dd13.appspot.com',
      })
    : getApp();

export const adminAuth = getAuth(app);

export const adminDB = getFirestore(app);

export const adminStorage = getStorage(app);

export const getCollection = async <T>(name: string, options?: GetCollectionOptions) => {
  const ref = adminDB.collection(name);
  const res: T[] = [];
  const snapshot = await ref.get();
  if (snapshot.empty) {
    return [];
  }

  snapshot.forEach((doc) => res.push({ type: name, id: doc.id, ...doc.data() } as T));
  return res;
};

export const getImageURL = async (storage: string, fileName: string) => {
  try {
    const fileRef = adminStorage.bucket(FIREBASE_STORAGE_BUCKET).file(`${storage}/${fileName}.jpg`);
    const url = await getDownloadURL(fileRef);

    return url;
  } catch (e) {
    return '';
  }
};
