import { ADD_MERCHANT, DELETE_MERCHANT, EDIT_MERCHANT, GET_BUSINESS_RANGE, GET_MERCHANT_PAGING } from '@/configs/api';
import { getPaging, paging, pagingLoading } from '@/hooks/pagination';
import { IMerchant } from '@/pages/Merchant/MerchantList/typing';
import { IOption } from '@/typings';
import { axiosPost } from '@/utils/http';
import { cloneDeep } from 'lodash-es';

/**
 * 获取商家分页
 * @param parmas 筛选项
 * @param pageCurrent 页码
 */
export const httpGetMerchantPaging = async (parmas: any = {}, pageCurrent = 1) => {
  pagingLoading.value = true;
  parmas.pageCurrent = pageCurrent;
  const { data } = await axiosPost(GET_MERCHANT_PAGING, parmas, false);
  data.pageData.forEach((p: IMerchant) => (p.rangeName = p.businessRange.join('、')));
  const accountPaging = cloneDeep(getPaging(paging, data));
  pagingLoading.value = false;
  return accountPaging;
};

/**
 * 获取经营范围
 * @returns 经营范围选项
 */
export const httpGetBuinessRange = async () => {
  const { data } = await axiosPost(GET_BUSINESS_RANGE, {}, false);
  const range: IOption[] = [];
  data.forEach((p: string) => range.push({ label: p, value: p }));
  return range;
};

/**
 * 商家入驻
 * @param parmas 商家信息
 * @returns
 */
export const httpAddMerchant = (parmas: IMerchant) => {
  return axiosPost(ADD_MERCHANT, parmas);
};

/**
 * 编辑商家信息
 * @param parmas 商家信息
 * @returns
 */
export const httpEditMerchant = (parmas: IMerchant) => {
  return axiosPost(EDIT_MERCHANT, parmas);
};

/**
 * 删除商家
 * @param parmas 商家id
 * @returns
 */
export const httpDeleteMerchant = (parmas: { id: string }) => {
  return axiosPost(DELETE_MERCHANT, parmas);
};
