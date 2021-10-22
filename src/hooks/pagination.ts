import { IPaging } from '@/typings';
import { reactive, ref } from 'vue';

export const pagingLoading = ref(false);

export const paging = reactive<IPaging<any>>({
  pageData: [],
  pageSize: 20,
  total: 0,
  pageCurrent: 1
});

export const getPaging = (paging: IPaging<any>, data: IPaging<any>) => {
  paging.pageSize = data.pageSize;
  paging.total = data.total;
  paging.pageData = data.pageData;
  paging.pageCurrent = data.pageCurrent;
  return paging;
};
