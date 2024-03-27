import { Timestamp } from 'firebase-admin/firestore';

export type Event = {
  type: 'news';
  id: string;
  date: Timestamp;
  title: string;
  description: string;
  links: string[];
  createdat: Timestamp;
};

export type EventForFront = {
  type: 'news';
  id: string;
  date: string;
  title: string;
  description: string;
  links: string[];
  createdat: string;
};
