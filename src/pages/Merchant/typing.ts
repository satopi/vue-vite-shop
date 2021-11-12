export interface IMerchant {
  id: number;
  state: string;
  name: string;
  businessRange: string[];
  rangeName?: string;
  code: string;
  legal: string;
  address: string;
  creator: string;
  creatorAccount: string;
  mobile: number;
  date: string;
}
