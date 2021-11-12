<template>
  <div id="merchantCheck">
    <el-dialog title="商家入驻-审核" v-model="dialogCheckVisible" :close-on-click-modal="false" width="40vw">
      <BaseInfo :info="info" />
      <Title title="附件" />
      <FileList />
      <div v-if="info && info.state == '待审核'">
        <Title title="审核" />
        <el-form class="check" :model="form" ref="checkForm" @submit.native.prevent>
          <el-form-item prop="opinion" required :rules="[{ required: true, message: '审核意见不能为空', trigger: 'blur' }]">
            <el-input v-model="form.opinion" :rows="5" type="textarea" placeholder="请填写审核意见" />
          </el-form-item>
        </el-form>
        <div class="justify-end m-t-10">
          <el-button size="small" type="danger" @click="check(false)" class="m-r-8">驳 回</el-button>
          <el-button size="small" type="success" @click="check(true)">通 过</el-button>
        </div>
      </div>
      <Title title="操作记录" />
      <Record :list="recordList" class="record" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue';
  import { IMerchant } from '../typing';
  import Record from '@/components/Record/index.vue';
  import BaseInfo from '../Details/BaseInfo/index.vue';
  import FileList from '../Details/FileList/index.vue';
  import Title from '@/components/Title/index.vue';
  import { httpGetRecord } from '@/requests/record';
  import { recordList } from '@/configs/common';
  import { httpCheckMerchant } from '@/requests/merchant';
  import { ElMessage } from 'element-plus';

  const emit = defineEmits(['success']);
  const dialogCheckVisible = ref(false);
  const form = reactive({ opinion: '' });
  const checkForm = ref();
  let info = ref();

  const show = (row: IMerchant) => {
    info.value = row;
    dialogCheckVisible.value = true;
    nextTick(async () => {
      recordList.value = await httpGetRecord(info.value.id, 'merchant');
    });
  };

  const close = () => (dialogCheckVisible.value = false);

  const check = (isPass: boolean) => {
    checkForm.value.validate(async (valid: boolean) => {
      if (valid) {
        const parmas = {
          id: info.value.id,
          check: isPass,
          opinion: form.opinion
        };
        const { data } = await httpCheckMerchant(parmas);
        emit('success', data);
        ElMessage.success(`操作成功，${isPass ? '已允许商家入驻' : '已驳回商家申请'}！`);
      } else return false;
    });
  };

  defineExpose({ show, close });
</script>

<style lang="scss">
  #merchantCheck {
    .el-dialog__body {
      padding-top: 0;
    }
    .file-list,
    .record,
    .check {
      padding-left: 2em;
      box-sizing: border-box;
    }
  }
</style>
