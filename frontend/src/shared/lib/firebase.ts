// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  collection,
  doc,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  where,
  WhereFilterOp,
  WithFieldValue,
} from 'firebase/firestore';
import { getBlob, getStorage, ref } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MESUREMENT_ID,
};

export const converter = <T>(): FirestoreDataConverter<T> => {
  return {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    toFirestore: (data: WithFieldValue<T>) => {
      return data;
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fromFirestore: (snapshot: QueryDocumentSnapshot<T>, option) => {
      const data = snapshot.data();
      return data;
    },
  };
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

type GetCollectionOptions = {
  limit?: Limit;
  where?: Where;
  orderby?: OrderBy;
};

type Limit = number;
type Where = {
  target: string;
  threthhold: WhereFilterOp;
  base: string | number;
};
type OrderBy = {
  target: string;
  desc?: boolean;
};

export const getCollection = async <T>(collectionName: string, options?: GetCollectionOptions) => {
  const res: T[] = [];
  const collRef = collection(db, collectionName).withConverter(converter<T>());
  const querySnapShot = await (async () => {
    if (options) {
      const params = Object.entries(options).map(([key, val]) => {
        if (key === 'limit') {
          return limit(val as Limit);
        } else if (key === 'where') {
          const wheres = val as Where;
          return where(wheres.target, wheres.threthhold, wheres.base);
        }
        const orderbys = val as OrderBy;
        if (orderbys.desc) {
          return orderBy(orderbys.target, 'desc');
        }
        return orderBy(orderbys.target);
      });
      const q = query(collRef, ...params);
      return await getDocs(q);
    }
    return await getDocs(collRef);
  })();
  querySnapShot.forEach((doc) => res.push({ type: collectionName, id: doc.id, ...doc.data() }));
  return res;
};

export const getDocument = async <T>(collName: string, docId: string) => {
  const docRef = doc(db, collName, docId).withConverter(converter<T>());
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.data();
};

export const getImage = async (bucket: string, itemName: string) => {
  const imageRef = ref(storage, `${bucket}/${itemName}.jpg`);
  return await getBlob(imageRef);
};
