import { Timestamp } from 'firebase/firestore';
import { Member } from './member';
import { Event } from './news';
import { Research } from './research';

export type Collections = 'news' | 'researches' | 'members';

export type CollectionTypes = {
  news: Event;
  researches: Research;
  members: Member;
};

export type Update = {
  date: Timestamp;
  title: string;
};
