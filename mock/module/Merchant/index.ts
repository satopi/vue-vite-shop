import { IMerchant } from '@/pages/Merchant/typing';
import { IPaging } from '@/typings';
import { businessRange, businessState, userInfo } from '../../configs';
import { addRecord, getRecord } from '../Record/record';
import { merchantList } from './merchant';

// 创建操作记录
addRecord(merchantList, 'merchant', '创建商家');

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
      const state = body.state || '';
      // 筛选商家
      const data = merchantList.filter((p) => {
        const range = p.businessRange.join(',');
        if (
          (p.creatorAccount.includes(keyword) || p.creator.includes(keyword) || p.name.includes(keyword) || p.code.includes(keyword)) &&
          range.includes(businessRange) &&
          p.state.includes(state)
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

  /** 获取商家状态 */
  {
    url: '/api/merchant/getBusinessState',
    method: 'post',
    response: () => {
      return businessState;
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
        state: '已入驻',
        name: body.name,
        businessRange: body.businessRange,
        code: body.code,
        legal: body.legal,
        address: body.address,
        creator: userInfo.nickName,
        creatorAccount: userInfo.account,
        mobile: userInfo.mobile,
        date: new Date().format()
      };
      merchantList.push(merchant);
      addRecord(merchant, 'merchant', '创建商家');
      return merchant;
    }
  },

  /** 编辑商家 */
  {
    url: '/api/merchant/editMerchant',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result: IMerchant[] = [];
      merchantList.map((p) => {
        if (p.id == body.id) {
          for (const key in body) {
            p[key] = body[key];
          }
          result = p;
        }
      });
      addRecord(body, 'merchant', '编辑商家信息');
      const record = getRecord(body.id, 'merchant');
      return { result, record };
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
      addRecord(body, 'merchant', `删除商家`);
      return true;
    }
  },

  /** 重新入驻 */
  {
    url: '/api/merchant/reSettled',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = {};
      merchantList.forEach((p) => {
        if (p.id == body.id) {
          p.state = '已入驻';
          result = p;
        }
      });
      addRecord(body, 'merchant', '批准商家重新入驻');
      const record = getRecord(body.id, 'merchant');
      return { result, record };
    }
  },

  /** 注销商家 */
  {
    url: '/api/merchant/cancel',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = {};
      merchantList.forEach((p) => {
        if (p.id == body.id) {
          p.state = '已撤离';
          result = p;
        }
      });
      addRecord(body, 'merchant', '注销商家');
      const record = getRecord(body.id, 'merchant');
      return { result, record };
    }
  },

  /** 商家审核 */
  {
    url: '/api/merchant/check',
    methos: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result = {};
      merchantList.forEach((p) => {
        if (p.id == body.id) {
          p.state = body.check ? '已入驻' : '已驳回';
          result = p;
        }
      });
      addRecord(body, 'merchant', `${body.check ? '同意' : '驳回'}商家入驻：${body.opinion}`);
      const record = getRecord(body.id, 'merchant');
      return { result, record };
    }
  }
];

export default merchant;
