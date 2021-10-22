import { IUserInfo } from '@/typings';
import { SET_USERINFO } from './actionTypes';
import { IUserState } from './state';

export default {
  [SET_USERINFO](state: IUserState, userInfo: IUserInfo) {
    state.userInfo = userInfo;
  }
};
