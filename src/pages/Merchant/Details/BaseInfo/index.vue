<template>
  <el-descriptions size="small" :column="2" id="merchantBaseInfo">
    <template #title>
      <Title title="基本信息" />
    </template>
    <template #extra>
      <el-tag type="success" size="medium" v-if="props.info.state == '已入驻'">{{ props.info.state }}</el-tag>
      <el-tag type="danger" size="medium" v-else-if="props.info.state == '已驳回'">{{ props.info.state }}</el-tag>
      <el-tag type="warning" size="medium" v-else-if="props.info.state == '待审核'">{{ props.info.state }}</el-tag>
      <el-tag type="info" size="medium" v-else>{{ props.info.state }}</el-tag>
    </template>
    <el-descriptions-item label="商家编号："> {{ props.info.id }}</el-descriptions-item>
    <el-descriptions-item label="商店名称："> {{ props.info.name }}</el-descriptions-item>
    <el-descriptions-item label="法定代表人：">{{ props.info.legal }}</el-descriptions-item>
    <el-descriptions-item label="统一社会信用代码：">{{ props.info.code }} </el-descriptions-item>
    <el-descriptions-item label="经营范围：">
      <el-tag size="small" :class="[index == 0 ? '' : 'm-l-5']" v-for="(item, index) in props.info.businessRange" :key="item">{{ item }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="经营场所：">{{ props.info.address }}</el-descriptions-item>
    <el-descriptions-item label="创建人：">{{ props.info.creator }}</el-descriptions-item>
    <el-descriptions-item label="创建人账号：">{{ props.info.creatorAccount }}</el-descriptions-item>
    <el-descriptions-item label="手机号：">{{ props.info.mobile }}</el-descriptions-item>
    <el-descriptions-item label="入驻日期：">{{ props.info.date || '未入驻' }}</el-descriptions-item>
  </el-descriptions>
</template>

<script lang="ts" setup>
  import { IMerchant } from '../../typing';
  import Title from '@/components/Title/index.vue';

  const props = defineProps<{
    info: IMerchant;
  }>();
</script>

<style lang="scss">
  #merchantBaseInfo {
    .el-descriptions__header {
      margin-bottom: 0;
    }
    .el-descriptions__body {
      padding-left: 2em;
      box-sizing: border-box;
    }
  }
</style>
