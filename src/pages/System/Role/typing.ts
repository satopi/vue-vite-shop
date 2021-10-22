export interface IRole {
  id: number;
  name: string;
  description: string;
  power: string[];
  creator?: string;
  account?: string;
  date?: string;
}
