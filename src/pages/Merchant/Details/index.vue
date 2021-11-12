<template>
  <div id="merchantDetails">
    <el-dialog title="商家-详情" v-model="dialogDescVisible" width="40vw">
      <BaseInfo :info="info" />
      <Title title="附件" />
      <FileList />
      <Title title="操作记录" />
      <Record class="record" />
      <template #footer>
        <span class="dialog-footer">
          <el-button size="small" type="warning" @click="toEdit" v-if="info && info.state == '已入驻'">编 辑</el-button>
          <el-button size="small" type="warning" @click="toCheck" v-if="info && info.state == '待审核'">审 核</el-button>
          <el-button size="small" type="success" @click="toReSettle" v-if="info && info.state == '已撤离'">入 驻</el-button>
          <el-button size="small" type="info" @click="toCancel" v-if="info && info.state == '已入驻'">注 销</el-button>
          <el-button size="small" type="danger" @click="toDelete" v-else>删 除</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, ref } from 'vue';
  import { IMerchant } from '../typing';
  import { httpGetRecord } from '@/requests/record';
  import Record from '@/components/Record/index.vue';
  import BaseInfo from './BaseInfo/index.vue';
  import FileList from './FileList/index.vue';
  import Title from '@/components/Title/index.vue';
  import { recordList } from '@/configs/common';

  const emit = defineEmits(['edit', 'delete', 'check', 'reSettle', 'cancel']);
  const dialogDescVisible = ref(false);
  let info = ref();

  const show = (row: IMerchant) => {
    info.value = row;
    dialogDescVisible.value = true;
    nextTick(async () => {
      recordList.value = await httpGetRecord(info.value.id, 'merchant');
    });
  };

  const close = () => (dialogDescVisible.value = false);

  // 编辑
  const toEdit = () => {
    emit('edit', info.value);
  };

  // 删除
  const toDelete = () => {
    emit('delete', info.value);
  };

  // 审核
  const toCheck = () => {
    emit('check', info.value);
  };

  // 入驻
  const toReSettle = () => {
    emit('reSettle', info.value);
  };

  // 注销
  const toCancel = () => {
    emit('cancel', info.value);
  };

  defineExpose({ show, close });
</script>

<style lang="scss">
  #merchantDetails {
    .el-dialog__body {
      padding-top: 0;
    }
    .file-list,
    .record {
      padding-left: 2em;
      box-sizing: border-box;
    }
  }
</style>
