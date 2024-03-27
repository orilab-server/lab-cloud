export type Member = {
  type: 'members';
  id: string;
  name: string;
  name_en: string;
  introduction: string;
  researches: string[];
  year: number;
  old?: boolean;
};
