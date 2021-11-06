import { IRole } from '@/pages/System/Role/typing';
import { IPaging } from '@/typings';
import { powerList, roleList, userInfo } from '../../configs';
import '@/utils/jsExtend';
import { accountList } from '../Account/account';

const role = [
  /** 获取角色分页 */
  {
    url: '/api/role/getPaging',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      const keyword = body.keyword || '';
      let index = (body.pageCurrent - 1) * 20;
      // 筛选角色
      const data = roleList.filter((p) => p.name.includes(keyword));
      const result: IPaging<any> = {
        pageCurrent: body.pageCurrent,
        pageSize: body.pageSize || 20,
        total: data.length,
        pageData: data.slice(index, index + 20)
      };
      return result;
    }
  },

  /** 获取角色列表 */
  {
    url: '/api/getRoleList',
    method: 'post',
    response: () => {
      return roleList;
    }
  },

  /** 获取角色权限列表 */
  {
    url: '/api/getPowerList',
    method: 'post',
    response: () => {
      return powerList;
    }
  },

  /** 新增角色 */
  {
    url: '/api/addRole',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      const role: IRole = {
        id: roleList.length + 1,
        name: body.name,
        description: body.description,
        power: body.power,
        creator: userInfo.nickName,
        account: userInfo.account,
        date: new Date().format('yyyy-MM-dd')
      };
      roleList.push(role);
      return role;
    }
  },

  /** 修改角色 */
  {
    url: '/api/editRole',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = null;
      roleList.map((p) => {
        if (p.id == body.id) {
          for (const key in body) {
            p[key] = body[key];
          }
          if (userInfo.roleKey == body.id) {
            userInfo.role = body.name;
            userInfo.power = body.power;
          }
          result = p;
        }
      });
      accountList.map((p) => {
        if (p.roleKey == body.id) {
          p.role = body.name;
          p.power = body.power;
        }
      });
      return result;
    }
  },

  /** 删除角色 */
  {
    url: '/api/deleteRole',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      roleList.forEach((p, index) => {
        if (p.id == body.id) roleList.splice(index, 1);
      });
      return true;
    }
  }
];

export default role;
