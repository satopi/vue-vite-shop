<template>
  <div id="app">
    <Suspense>
      <el-config-provider :locale="zhCn">
        <template #default>
          <router-view />
        </template>
        <template #fallback>
          <el-empty description="网页迷路啦(｡-人-｡)请耐心等待或刷新试试" style="height: 80%">
            <el-button type="primary" @click="router.go(0)">刷新</el-button>
          </el-empty>
        </template>
      </el-config-provider>
    </Suspense>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import zhCn from 'element-plus/es/locale/lang/zh-cn';
  import { httpGetUserInfo } from './requests/user';
  import { onMounted, provide } from 'vue';
  import { useStore } from './store';
  import { session } from './utils/tools';
  import { SET_USERINFO } from './store/user/actionTypes';
  import * as echarts from 'echarts';

  const router = useRouter();
  const store = useStore();

  if (session.get('userInfo') != null) store.commit(SET_USERINFO, JSON.parse(session.get('userInfo') as string));

  onMounted(async () => {
    if (import.meta.env.DEV) {
      await httpGetUserInfo();
      console.log('用户信息', store.state.user.userInfo);
    }
  });

  provide('ec', echarts);
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;

    // 异常页文字样式
    .el-empty__description p {
      color: #395b77;
      font-size: var(--el-font-size-medium);
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(216, 216, 216, 0);
      border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
      display: none;
    }
    ::-webkit-scrollbar-track-piece {
      display: none;
    }

    .el-main {
      &::-webkit-scrollbar-thumb {
        background: rgba(216, 216, 216, 1);
      }
    }

    // 表格样式
    .table {
      width: 100%;
      .table-header {
        color: #909399;
        background: #f5f7fa;
      }
      &:hover {
        .el-table__body-wrapper {
          &::-webkit-scrollbar-thumb {
            background: rgba(216, 216, 216, 1);
          }
        }
      }
    }
  }
</style>
