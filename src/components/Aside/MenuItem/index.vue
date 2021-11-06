<template>
  <template v-for="item in menuList" :key="item">
    <!-- 一级路由 -->
    <el-menu-item :index="item.children?.[0].path" v-if="item.meta?.isOne && item.meta?.isShow">
      <i :class="['iconfont', 'm-r-8', item.children?.[0].meta?.icon]"></i>
      <template #title>{{ item.children?.[0].meta?.title }}</template>
    </el-menu-item>
    <!-- 多级路由 -->
    <el-sub-menu :index="item.path" v-if="!item.meta?.isOne && item.meta?.isShow">
      <template #title>
        <i :class="['iconfont', 'm-r-8', item.meta?.icon]"></i>
        <span>{{ item.meta?.title }}</span>
      </template>
      <!-- 子路由 递归调用 -->
      <template v-for="it in item.children" :key="it">
        <MenuItem :menu="item.children" v-if="it.children && it.meta?.isShow" />
        <el-menu-item :index="it.path" v-if="!it.children && it.meta?.isShow">
          <i :class="['iconfont', 'm-r-8', it.meta?.icon]"></i>
          <template #title>{{ it.meta?.title }}</template>
        </el-menu-item>
      </template>
    </el-sub-menu>
  </template>
</template>

<script lang="ts">
  export default {
    name: 'MenuItem'
  };
</script>
<script lang="ts" setup>
  import { menuList } from '@/configs/common';
  import { filterAsyncRoutes } from '@/hooks/useRoutes';
  import { RouteRecordRaw } from 'vue-router';

  interface Props {
    menu: Array<RouteRecordRaw> | Array<never>;
  }
  const props = withDefaults(defineProps<Props>(), {
    menu: () => []
  });

  // 过滤权限路由
  menuList.value = filterAsyncRoutes(props.menu);
</script>
