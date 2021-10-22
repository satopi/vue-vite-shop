<template>
  <el-form :inline="true" :model="searchForm" class="search-form" @keyup.enter="search">
    <el-form-item>
      <el-input size="medium" placeholder="请输入关键字" clearable prefix-icon="el-icon-search" v-model="searchForm.keyword" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';

  const emit = defineEmits(['search']);
  const searchForm = reactive({ keyword: '' });

  const search = () => {
    emit('search', searchForm);
  };
</script>

<style lang="scss">
  .search-form .el-form-item {
    margin-bottom: 10px;
  }
</style>
