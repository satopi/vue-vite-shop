import { ADD_ROLE, DELETE_ROLE, EDIT_ROLE, GET_POWER_LIST, GET_ROLE_LIST, GET_ROLE_PAGING } from '@/configs/api';
import { getPaging, paging, pagingLoading } from '@/hooks/pagination';
import { IRole } from '@/pages/System/Role/typing';
import { IPower } from '@/typings';
import { axiosPost } from '@/utils/http';
import { cloneDeep } from 'lodash-es';

/**
 * 获取角色分页
 * @param parmas 筛选项
 * @param pageCurrent 页码
 */
export const httpGetRolePaging = async (parmas: any = {}, pageCurrent = 1) => {
  pagingLoading.value = true;
  parmas.pageCurrent = pageCurrent;
  const { data } = await axiosPost(GET_ROLE_PAGING, parmas, false);
  const rolePaging = cloneDeep(getPaging(paging, data));
  pagingLoading.value = false;
  return rolePaging;
};

/**
 * 获取角色列表
 * @returns
 */
export const httpGetRoleList = async () => {
  return axiosPost(GET_ROLE_LIST);
};

/**
 * 获取角色权限列表
 * @returns
 */
export const httpGetPowerList = async (disabled = false) => {
  const { data } = await axiosPost(GET_POWER_LIST);
  if (disabled) {
    const recursion = (arr: Array<IPower>) => {
      arr.forEach((p) => {
        p.disabled = true;
        if (p.children && p.children.length > 0) recursion(p.children);
      });
    };
    recursion(data);
  }
  return data;
};

/**
 * 新增角色
 * @param parmas 角色信息
 * @returns
 */
export const httpAddRole = (parmas: IRole) => {
  return axiosPost(ADD_ROLE, parmas);
};

/**
 * 编辑角色
 * @param parmas 角色信息
 * @returns
 */
export const httpEditRole = (parmas: IRole) => {
  return axiosPost(EDIT_ROLE, parmas);
};

/**
 * 删除角色
 * @returns
 */
export const httpDeleteRole = (parmas: { id: string }) => {
  return axiosPost(DELETE_ROLE, parmas);
};
