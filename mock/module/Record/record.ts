import { IRecord } from '@/components/Record/typing';
import { recordList, userInfo } from '../../configs';

export const addRecord = (list: any, module: string, desc = '创建') => {
  if (Array.isArray(list))
    list.forEach((p: any) => {
      const obj = {
        id: p.id,
        module,
        name: `【${p.creator || userInfo.nickName} (ID: ${p.creatorAccount || userInfo.account})】`,
        desc,
        timestamp: p.date || new Date().format()
      };
      recordList.unshift(obj);
    });
  else {
    const obj = {
      id: list.id,
      module,
      name: `【${list.creator || userInfo.nickName} (ID: ${list.creatorAccount || userInfo.account})】`,
      desc,
      timestamp: list.date || new Date().format()
    };
    recordList.unshift(obj);
  }
};

export const getRecord = (id: number | string, module: string) => {
  let result: IRecord[] = [];
  recordList.forEach((p) => {
    if (p.id == id && p.module == module) result.push(p);
  });
  return result;
};
