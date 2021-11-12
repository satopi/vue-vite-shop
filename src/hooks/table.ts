import { IRecord } from '@/components/Record/typing';
import { recordList } from '@/configs/common';
import { ref } from 'vue';

export const currentRow = ref<any>({});

/**
 * 赋值当前选中的行
 * @param row 选中的行
 */
export const handleClickRow = (row: any) => {
  currentRow.value = row;
};

/**
 * 更新表格数据
 * @param pageData 表格数据
 * @param row 需要更新的某一条数据
 * @param record 操作记录
 * @returns 已更新的表格数据
 */
export const updateData = (pageData: any, row: any, record?: IRecord[]) => {
  // 更新操作记录
  if (record) recordList.value = record;
  // 更新表格数据
  pageData.forEach((p: any) => {
    if (p.id == row.id) {
      for (const key in row) {
        p[key] = row[key];
      }
    }
  });
  return pageData;
};
