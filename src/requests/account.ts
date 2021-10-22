import { ADD_ACCOUNT, DELETE_ACCOUNT, EDIT_ACCOUNT, GET_ACCOUNT_PAGING } from '@/configs/api';
import { getPaging, paging, pagingLoading } from '@/hooks/pagination';
import { IAccount } from '@/pages/System/Account/typing';
import { axiosPost } from '@/utils/http';
import { cloneDeep } from 'lodash-es';

/**
 * 获取账号分页
 * @param parmas 筛选项
 * @param pageCurrent 页码
 */
export const httpGetAccountPaging = async (parmas: any = {}, pageCurrent = 1) => {
  pagingLoading.value = true;
  parmas.pageCurrent = pageCurrent;
  const { data } = await axiosPost(GET_ACCOUNT_PAGING, parmas, false);
  const accountPaging = cloneDeep(getPaging(paging, data));
  pagingLoading.value = false;
  return accountPaging;
};

/**
 * 新增账号
 * @param parmas 账号信息
 * @returns
 */
export const httpAddAccount = (parmas: IAccount) => {
  return axiosPost(ADD_ACCOUNT, parmas);
};

/**
 * 编辑账号
 * @param parmas 账号信息
 * @returns
 */
export const httpEditAccount = (parmas: IAccount) => {
  return axiosPost(EDIT_ACCOUNT, parmas);
};

/**
 * 删除账号
 * @param parmas 账号id
 * @returns
 */
export const httpDeleteAccount = (parmas: { id: string }) => {
  return axiosPost(DELETE_ACCOUNT, parmas);
};
