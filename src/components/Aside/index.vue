<template>
  <el-aside width="200px" class="cu-aside">
    <el-menu router :default-active="defaultActive" class="cu-menu" background-color="#395b77" text-color="#fff" active-text-color="#ffd04b">
      <MenuItem :menu="menu" />
    </el-menu>
  </el-aside>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import MenuItem from './MenuItem/index.vue';

  const router = useRouter();
  const defaultActive = ref();
  defaultActive.value = router.currentRoute.value.path;

  const menu = ref();
  menu.value = router.options.routes.filter((p) => p.meta?.isMenu);
</script>

<style lang="scss">
  .cu-aside {
    background-color: #395b77;
    &::-webkit-scrollbar {
      width: 8px;
      height: 0 !important;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(77, 107, 133, 0) !important;
    }
    &:hover {
      &::-webkit-scrollbar-thumb {
        background: rgba(77, 107, 133, 1) !important;
      }
    }
    .el-menu {
      border: 0;
    }
  }
</style>
