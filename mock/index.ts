import { MockMethod } from 'vite-plugin-mock';
import login from './module/Login';
import user from './module/User';
import file from './module/File';
import account from './module/Account';
import role from './module/Role';
import merchant from './module/Merchant';

let interfaceArr: Array<any> = [];
interfaceArr = interfaceArr.concat(login, user, file, account, role, merchant);

export default interfaceArr as MockMethod[];
