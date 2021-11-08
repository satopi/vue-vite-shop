import { businessRange } from '../../configs';
import { mock } from 'mockjs';

// 获取商家列表
const getMerchantList = () => {
  const result: any[] = [];
  const range = businessRange;
  for (let i = 1001; i < 1045; i++) {
    result.push(
      mock({
        id: i,
        name: '@ctitle(3, 7)',
        businessRange: `@pick(${JSON.stringify(range)}, 1, 3)`,
        'code|9': /[A-Z][0-9]/,
        legal: '@cname',
        address: 'MIMO电商平台：@url()',
        creator: '@cname',
        'creatorAccount|5': /[a-z][0-9]/,
        mobile: /^1(3|4|5|6|7|8|9)\d{9}$/,
        date: '@date("yyyy-MM-dd")'
      })
    );
  }
  return result;
};

export const merchantList = getMerchantList();
