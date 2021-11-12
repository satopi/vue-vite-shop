import { IRecord } from '@/components/Record/typing';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';

// 导航菜单列表
export const menuList = ref<Array<RouteRecordRaw>>();

// 操作记录列表
export const recordList = ref<IRecord[]>([]);
