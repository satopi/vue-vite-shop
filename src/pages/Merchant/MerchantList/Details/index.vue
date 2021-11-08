<template>
  <div id="merchantDetails">
    <el-dialog title="商家详情" v-model="dialogDescVisible" width="40vw" top="25vh">
      <el-descriptions size="small" :column="2">
        <el-descriptions-item label="商店名称：">{{ info.name }}</el-descriptions-item>
        <el-descriptions-item label="统一社会信用代码：">{{ info.code }} </el-descriptions-item>
        <el-descriptions-item label="法定代表人：">{{ info.legal }}</el-descriptions-item>
        <el-descriptions-item label="入驻日期：">{{ info.date }}</el-descriptions-item>
        <el-descriptions-item label="经营范围：">
          <el-tag size="small" :class="[index == 0 ? '' : 'm-l-5']" v-for="(item, index) in info.businessRange" :key="item">{{ item }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="经营场所：">{{ info.address }}</el-descriptions-item>
        <el-descriptions-item label="创建人：">{{ info.creator }}</el-descriptions-item>
        <el-descriptions-item label="创建人账号：">{{ info.creatorAccount }}</el-descriptions-item>
        <el-descriptions-item label="手机号：">{{ info.mobile }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" type="danger" @click="toDelete">删 除</el-button>
          <el-button size="small" type="warning" @click="toEdit">编 辑</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { IMerchant } from '../typing';

  const emit = defineEmits(['edit', 'delete']);
  const dialogDescVisible = ref(false);
  let info = ref();

  const show = (row: IMerchant) => {
    info.value = row;
    dialogDescVisible.value = true;
  };

  const close = () => (dialogDescVisible.value = false);

  const toEdit = () => {
    emit('edit', info.value);
  };

  const toDelete = () => {
    emit('delete', info.value);
  };
  defineExpose({ show, close });
</script>

<style lang="scss">
  #merchantDetails {
  }
</style>
