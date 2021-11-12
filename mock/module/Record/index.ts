import { IRecord } from '@/components/Record/typing';
import { recordList } from '../../configs';

const record = [
  /** 获取操作记录 */
  {
    url: '/api/record/getList',
    method: 'post',
    response: (options: { body: Record<string, any> }) => {
      const { body } = options;
      let result: IRecord[] = [];
      recordList.forEach((p) => {
        if (p.id == body.id && p.module == body.module) result.push(p);
      });
      return result;
    }
  }
];

export default record;
