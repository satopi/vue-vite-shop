import { userInfo } from '../../configs';

/** 用户相关 */
const user = [
  /** 获取用户信息 */
  {
    url: '/api/getUserInfo',
    method: 'post',
    response: () => {
      return userInfo;
    }
  },

  /** 编辑用户信息 */
  {
    url: '/api/editUserInfo',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      for (const key in body) {
        if (userInfo[key]) {
          userInfo[key] = body[key];
        }
      }
      return userInfo;
    }
  }
];

export default user;
