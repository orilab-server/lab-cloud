import { Timestamp } from 'firebase/firestore';

export type Collections = 'news' | 'researches' | 'members';

export type News = {
  type: 'news';
  id: string;
  date: Timestamp;
  title: string;
  description: string;
  links: string[];
  createdat: Timestamp;
};

export type Research = {
  type: 'researches';
  id: string;
  title: string;
  description: string;
  links: string[];
  createdat: Timestamp;
};

export type Member = {
  type: 'members';
  id: string;
  name: string;
  name_en: string;
  introduction: string;
  researches: string[];
  year: number;
};

export type CollectionTypes = {
  news: News;
  researches: Research;
  members: Member;
};

export type Update = {
  date: Timestamp;
  title: string;
};
