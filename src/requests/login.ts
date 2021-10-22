import { axiosPost } from '@/utils/http';
import { COMMON_LOGIN, COMMON_LOGINOUT } from '@/configs/api';

interface ILoginInfo {
  account: string;
  password: string;
}

/**
 * 登录
 * @param parmas 登录表单
 * @returns
 */
export const httpLogin = (parmas: ILoginInfo) => {
  return axiosPost(COMMON_LOGIN, parmas);
};

/**
 * 退出登录
 * @returns
 */
export const httpLoginOut = () => {
  return axiosPost(COMMON_LOGINOUT);
};
