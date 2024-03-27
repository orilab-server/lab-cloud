import { Timestamp } from 'firebase/firestore';

export type Research = {
  type: 'researches';
  id: string;
  title: string;
  description: string;
  links: string[];
  createdat: Timestamp;
};

export type ResearchForFront = {
  type: 'researches';
  id: string;
  title: string;
  description: string;
  links: string[];
  createdat: string;
};
