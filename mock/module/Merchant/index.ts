import { IMerchant } from '@/pages/Merchant/typing';
import { IPaging } from '@/typings';
import { businessRange, userInfo } from '../../configs';
import { merchantList } from './merchant';

const merchant = [
  /** 获取商家分页 */
  {
    url: '/api/merchant/getPaging',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let index = (body.pageCurrent - 1) * 20;
      const keyword = body.keyword || '';
      const businessRange = body.businessRange || '';
      // 筛选商家
      const data = merchantList.filter((p) => {
        const range = p.businessRange.join(',');
        if (
          (p.creatorAccount.includes(keyword) || p.creator.includes(keyword) || p.name.includes(keyword) || p.code.includes(keyword)) &&
          range.includes(businessRange)
        )
          return p;
      });
      const result: IPaging<any> = {
        pageCurrent: body.pageCurrent,
        pageSize: body.pageSize || 20,
        total: data.length,
        pageData: data.slice(index, index + 20)
      };
      return result;
    }
  },

  /** 获取经营范围 */
  {
    url: '/api/merchant/getBusinessRange',
    method: 'post',
    response: () => {
      return businessRange;
    }
  },

  /** 新增商家 */
  {
    url: '/api/merchant/addMerchant',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      const merchant: IMerchant = {
        id: merchantList.length + 1,
        name: body.name,
        businessRange: body.businessRange,
        code: body.code,
        legal: body.legal,
        creator: userInfo.nickName,
        creatorAccount: userInfo.account,
        mobile: userInfo.mobile,
        date: new Date().format('yyyy-MM-dd')
      };
      merchantList.push(merchant);
      return merchant;
    }
  },

  /** 编辑商家 */
  {
    url: '/api/merchant/editMerchant',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = null;
      merchantList.map((p) => {
        if (p.id == body.id) {
          for (const key in body) {
            p[key] = body[key];
          }
          result = p;
        }
      });
      return result;
    }
  },

  /** 删除商家 */
  {
    url: '/api/merchant/deleteMerchant',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      merchantList.forEach((p, index) => {
        if (p.id == body.id) merchantList.splice(index, 1);
      });
      return true;
    }
  }
];

export default merchant;
