import store from '@/store';
import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

/**
 * 判断路由权限
 * @param route
 * @param power
 * @returns
 */
export const hasPermission = (route: RouteRecordRaw | RouteLocationNormalized, power = '') => {
  if (route.meta?.power) {
    let flag = false;
    (route.meta?.power as string[]).forEach((p) => {
      if (power.includes(p)) flag = true;
    });
    return flag;
  } else return true;
};

/**
 * 过滤权限路由
 * @param routes
 * @returns
 */
export const filterAsyncRoutes = (routes: Array<RouteRecordRaw>) => {
  routes.map((p) => {
    if (p.meta) p.meta.isShow = true;
    if (p.children && p.children.length != 0) filterAsyncRoutes(p.children);
    // 无权限路由不显示
    if (!hasPermission(p, store.state.user.userInfo?.power)) {
      if (p.meta) p.meta.isShow = false;
    }
    // 子路由都不显示时，隐藏主路由
    if (p.children && !p.children.some((it) => it.meta?.isShow)) {
      if (p.meta) p.meta.isShow = false;
    }
    return p;
  });
  return routes;
};

/**
 * 格式化路由
 * @param routes
 * @returns
 */
export const formatRoutes = (routes: Array<RouteRecordRaw>) => {
  routes.map((p) => {
    if (p.meta) {
      p.meta.isShow = true;
      if (!p.meta.hasOwnProperty('isMenu')) p.meta.isMenu = true;
      if (!p.meta.hasOwnProperty('isOne')) p.meta.isOne = false;
      if (!p.meta.hasOwnProperty('keepAlive')) p.meta.keepAlive = false;
    }
    if (p.children) formatRoutes(p.children);
    return p;
  });
  return routes;
};
