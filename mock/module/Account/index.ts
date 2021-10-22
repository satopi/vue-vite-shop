import { IAccount } from '@/pages/System/Account/typing';
import { IPaging } from '@/typings';
import { arrayToString } from '@/utils/tools';
import { roleList, userInfo } from '../../configs';
import { accountList } from './account';
import '@/utils/jsExtend';

const account = [
  /** 获取账号分页 */
  {
    url: '/api/account/getPaging',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let index = (body.pageCurrent - 1) * 20;
      let data = accountList;
      // 筛选账号
      if (body.keyword && body.keyword != '') {
        data = accountList.filter((p) => p.account.includes(body.keyword) || p.nickName.includes(body.keyword));
      }
      const result: IPaging<any> = {
        pageCurrent: body.pageCurrent,
        pageSize: body.pageSize || 20,
        total: data.length,
        pageData: data.slice(index, index + 20)
      };
      return result;
    }
  },

  /** 新增账号 */
  {
    url: '/api/addAccount',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      const account: IAccount = {
        id: accountList.length + 1,
        headImgUrl: body.headImgUrl,
        nickName: body.nickName,
        mobile: body.mobile,
        account: body.account,
        role: '',
        roleKey: body.roleKey,
        power: [],
        creator: userInfo.nickName,
        creatorAccount: userInfo.account,
        date: new Date().format('yyyy-MM-dd')
      };
      roleList.forEach((p) => {
        if (p.id == body.roleKey) {
          account.power = p.power;
          account.role = p.name;
        }
      });
      accountList.push(account);
      return account;
    }
  },

  /** 编辑账号 */
  {
    url: '/api/editAccount',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = null;
      accountList.map((p) => {
        if (p.id == body.id) {
          for (const key in body) {
            p[key] = body[key];
          }
          result = p;
        }
      });
      if (userInfo.id == body.id) {
        roleList.forEach((p) => {
          if (p.id == body.roleKey) {
            userInfo.power = arrayToString(p.power);
            userInfo.role = p.name;
          }
        });
      }
      return result;
    }
  },

  /** 删除账号 */
  {
    url: '/api/deleteAccount',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      accountList.forEach((p, index) => {
        if (p.id == body.id) accountList.splice(index, 1);
      });
      return true;
    }
  }
];

export default account;
