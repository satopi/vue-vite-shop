import { axiosPost } from '@/utils/http';
import { GET_USERINFO, EDIT_USERINFO } from '@/configs/api';
import store from '@/store';
import { SET_USERINFO } from '@/store/user/actionTypes';
import { session } from '@/utils/tools';
import { IUserInfo } from '@/typings';

/**
 * 刷新用户信息
 * @returns 用户信息
 */
export const httpGetUserInfo = async () => {
  const { data } = await axiosPost(GET_USERINFO);
  store.commit(SET_USERINFO, data);
  session.set('userInfo', JSON.stringify(data));
};

/**
 * 编辑用户信息
 * @param userInfo 用户信息
 */
export const httpEditUserInfo = async (userInfo: IUserInfo) => {
  const { data } = await axiosPost(EDIT_USERINFO, userInfo);
  store.commit(SET_USERINFO, data);
  session.set('userInfo', JSON.stringify(data));
};
