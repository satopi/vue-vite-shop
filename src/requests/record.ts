import { GET_RECORD } from '@/configs/api';
import { axiosPost } from '@/utils/http';

/**
 * 获取操作记录
 * @param id 记录id
 * @param module 记录模块
 * @returns
 */
export const httpGetRecord = async (id: number | string, module: string) => {
  const { data } = await axiosPost(GET_RECORD, { id, module });
  return data;
};
