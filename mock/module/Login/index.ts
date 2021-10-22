import { arrayToString } from '@/utils/tools';
import { IncomingMessage, ServerResponse } from 'http';
import { roleList, userInfo } from '../../configs';

/** 登录 */
const login = [
  {
    url: '/api/login',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      const role = roleList.filter((p) => p.id == body.role)[0];
      if (body.account && body.password && body.role) {
        userInfo.account = body.account;
        userInfo.role = role.name;
        userInfo.roleKey = role.id;
        userInfo.power = arrayToString(role.power);
        return userInfo;
      }
    }
  },

  /** 退出登录 */
  {
    url: '/api/loginOut',
    method: 'post',
    rawResponse: (req: IncomingMessage, res: ServerResponse) => {
      res.setHeader('Content-Type', 'text/plain');
      res.end(`退出成功`);
    }
  }
];

export default login;
