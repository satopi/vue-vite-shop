<template>
  <el-form :inline="true" class="search-form" @keyup.enter="search">
    <template v-for="it in filterList" :key="it">
      <el-form-item size="small" v-if="it.prop == 'select'">
        <el-select v-model="it.value" filterable clearable :placeholder="it.placeholder || '请选择'">
          <el-option v-for="item in it.options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item size="small" v-else-if="it.prop == 'input'">
        <el-input :placeholder="it.placeholder || '请输入关键字'" clearable prefix-icon="Search" v-model="it.value" />
      </el-form-item>
    </template>
    <el-form-item>
      <el-button type="primary" icon="Search" size="small" @click="search">搜索</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { inject } from 'vue';
  import { IFilterList } from './typing';

  const filterList: Array<IFilterList> | undefined = inject('filterList');

  const emit = defineEmits(['search']);

  const search = () => {
    const searchForm = {};
    if (filterList) filterList.forEach((p) => (searchForm[p.key] = p.value));
    emit('search', searchForm);
  };
</script>

<style lang="scss">
  .search-form .el-form-item {
    margin-bottom: 10px;
  }
</style>
