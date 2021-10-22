import { IUserInfo } from '@/typings';

export interface IUserState {
  userInfo: IUserInfo | null;
}

const state: IUserState = {
  userInfo: null
};

export default state;
