export interface IUnknowObject {
  [key: string]: any;
}

// 用户信息
export interface IUserInfo extends IUnknowObject {
  id: number;
  account: string;
  mobile: number;
  role: string;
  roleKey: number;
  power: string;
  nickName: string;
  headImgUrl: string;
}

// 分页参数
export interface IPaging<T> {
  pageCurrent: number;
  pageSize: number;
  total: number;
  pageData: Array<T>;
  loading?: boolean;
}

// 角色权限
export interface IPower {
  id: string;
  label: string;
  disabled: boolean;
  children?: Array<IPower>;
}
