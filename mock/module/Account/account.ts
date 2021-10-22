import { arrayToString } from '@/utils/tools';
import { roleList, userInfo } from '../../configs';
import { mock } from 'mockjs';

// 获取账号列表
const getAccountList = () => {
  const result: any[] = [];
  const roleKey: (number | undefined)[] = [];
  const role: (string | undefined)[] = [];
  const power: string[] = [];
  const len = roleList.length;
  roleList.forEach((p) => {
    roleKey.push(p.id);
    role.push(p.name);
    power.push(arrayToString(p.power));
  });
  for (let i = 1001; i < 1030; i++) {
    result.push(
      mock({
        id: i,
        'headImgUrl|1': [
          'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
          'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
          'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
          'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
        ],
        nickName: '@cname',
        'account|5': /[a-z][0-9]/,
        [`roleKey|+${len}`]: `@pick(${JSON.stringify(roleKey)})`,
        [`role|+${len}`]: `@pick(${JSON.stringify(role)})`,
        [`power|+${len}`]: `@pick(${JSON.stringify(power)})`,
        mobile: /^1(3|4|5|6|7|8|9)\d{9}$/,
        creator: '@cname',
        'creatorAccount|5': /[a-z][0-9]/,
        date: '@date("yyyy-MM-dd")'
      })
    );
  }
  result.unshift(userInfo);
  return result;
};

export const accountList = getAccountList();
