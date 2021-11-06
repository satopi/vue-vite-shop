import { formatRoutes, hasPermission } from '@/hooks/useRoutes';
import store from '@/store';
import { session } from '@/utils/tools';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Layout from '../layouts/Layout.vue';

/**
 * isMenu       是否为菜单        默认true
 * isOne        是否为一级路由    默认false
 * isShow       是否在菜单中显示  默认true
 * keepAlive    是否为状态保持    默认false
 */

// 公共路由
const commonRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login/index.vue'),
    meta: {
      title: '登录',
      isMenu: false
    }
  }
];

// 权限路由
const asyncRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Layout,
    redirect: '/home',
    meta: { isOne: true },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/pages/Home/index.vue'),
        meta: {
          title: '首页',
          icon: 'icon-shuju',
          power: ['1000', '1006']
        }
      }
    ]
  },
  {
    path: '/merchant',
    name: 'Merchant',
    component: Layout,
    redirect: '/merchant/list',
    meta: { isOne: true },
    children: [
      {
        path: '/merchant/list',
        name: 'MerchantList',
        component: () => import('@/pages/Merchant/index.vue'),
        meta: {
          title: '商家管理',
          icon: 'icon-sr_boss_1',
          power: ['1001']
        }
      }
    ]
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Layout,
    redirect: '/shop/list',
    meta: { isOne: true },
    children: [
      {
        path: '/shop/list',
        name: 'ShopList',
        component: () => import('@/pages/Shop/index.vue'),
        meta: {
          title: '店铺管理',
          icon: 'icon-shangjia1',
          power: ['1002']
        }
      }
    ]
  },
  {
    path: '/order',
    name: 'Order',
    component: Layout,
    redirect: '/order/list',
    meta: { isOne: true },
    children: [
      {
        path: '/order/list',
        name: 'OrderList',
        component: () => import('@/pages/Order/index.vue'),
        meta: {
          title: '订单管理',
          icon: 'icon-dingdan',
          power: ['1003']
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/role',
    meta: {
      title: '系统管理',
      icon: 'icon-shezhi'
    },
    children: [
      {
        path: '/system/account',
        name: 'Account',
        component: () => import('@/pages/System/Account/index.vue'),
        meta: {
          title: '账号管理',
          icon: 'icon-zhanghaoguanli',
          power: ['1004'],
          keepAlive: true
        }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: () => import('@/pages/System/Role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'icon-quanxian',
          power: ['1005'],
          keepAlive: true
        }
      }
    ]
  }
];

// 异常路由 404 500
const errorRoutes: Array<RouteRecordRaw> = [
  {
    path: '/auth',
    name: 'Auth',
    component: Layout,
    meta: { isOne: true, isMenu: false },
    children: [
      {
        path: '/noPower',
        name: 'NoPower',
        component: () => import('@/pages/NoPower/index.vue'),
        meta: {
          title: '权限不足',
          isMenu: false
        }
      },
      {
        path: '/notFound',
        name: 'NotFound',
        component: () => import('@/pages/NotFound/index.vue'),
        meta: {
          title: '404 网页走丢啦',
          isMenu: false
        }
      }
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/notFound' }
];

// 格式化路由
export const routes = formatRoutes(commonRoutes.concat(asyncRoutes, errorRoutes));

// 创建路由
const router = createRouter({
  routes,
  history: createWebHashHistory()
});

// 导航守卫
router.beforeEach((to, from, next) => {
  document.title = '';
  const title = to.meta && (to.meta.title as string);
  if (title) document.title = to.query.title ? (to.query.title as string) : title;
  if (to.path === '/login') next();
  else if (session.get('userInfo') == null) next('/login');
  else if (to.meta.power && !hasPermission(to, JSON.parse(JSON.parse(session.get('userInfo') || '')).power)) next('/noPower');
  else if (to.path == '/auth') {
    // 判断账号/角色管理权限动态变化
    if (hasPermission(from, store.state.user.userInfo?.power)) next(from.path);
    else next('/noPower');
  } else next();
});

export default router;
