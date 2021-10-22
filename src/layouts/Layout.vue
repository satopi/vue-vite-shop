<template>
  <el-container style="width: 100%; height: 100%; flex-direction: column">
    <Header />
    <el-container class="cu-container">
      <Aside />
      <el-container class="flex-column" style="width: 100%; height: 100%">
        <!-- <div class="bg-white p-l-10 p-r-10 p-t-15 p-b-15 light-shadow" style="width: 100%">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
        <el-main>
          <router-view v-slot="{ Component }" v-if="route.meta.keepAlive">
            <keep-alive :max="10">
              <component :is="Component" />
            </keep-alive>
          </router-view>
          <router-view v-else />
        </el-main>
        <el-footer height="40px" class="bg-white dark-shadow p-10 align-center">
          <p class="f-s-15">@Designed By Ring</p>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
  import Aside from '@/components/Aside/index.vue';
  import Header from '@/components/Header/index.vue';
  import { useRoute } from 'vue-router';

  const route = useRoute();
</script>

<style lang="scss" scoped>
  .cu-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    .el-main {
      --el-main-padding: 0;
    }
  }
</style>
