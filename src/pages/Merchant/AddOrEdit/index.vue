<template>
  <div id="merchantAddorEdit">
    <el-dialog :title="isAdd ? '商家 - 新增' : '商家 - 编辑'" v-model="dialogFormVisible" width="500px" :close-on-click-modal="false">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="editForm" @keyup.enter="submit" @submit.native.prevent>
        <el-form-item label="商店名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入商店名称" />
        </el-form-item>
        <el-form-item label="经营范围" prop="businessRange">
          <el-select v-model="form.businessRange" filterable clearable multiple :multiple-limit="3" placeholder="请选择经营范围">
            <el-option v-for="item in rangeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经营场所" prop="address">
          <el-input v-model="form.address" placeholder="请输入经营场所" />
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="code">
          <el-input v-model="form.code" placeholder="请输入统一社会信用代码" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="legal">
          <el-input v-model="form.legal" placeholder="请输入法定代表人" />
        </el-form-item>
        <!-- <el-upload ref="upload" class="upload-demo" :action="uploadUrl" :auto-upload="false">
          <template #trigger>
            <el-button size="small" type="primary">select file</el-button>
          </template>
        </el-upload> -->
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
  // import { UPLOAD_FILE } from '@/configs/api';
  import { httpAddMerchant, httpEditMerchant, httpGetBuinessRange } from '@/requests/merchant';
  import { ElMessage } from 'element-plus';
  import { nextTick, reactive, ref } from 'vue';
  import { IMerchant } from '../typing';

  const emit = defineEmits(['success']);
  const dialogFormVisible = ref(false);
  // const uploadUrl = location.origin + '/api' + UPLOAD_FILE; // 上传文件url
  const isAdd = ref(true); // 是否为新增
  const rangeList = ref(); // 经营范围列表
  const editForm = ref(); // 表单ref
  const form = reactive<any>({
    name: '',
    businessRange: [],
    code: '',
    legal: '',
    address: ''
  });
  const rules = reactive({
    name: [{ required: true, message: '请输入商店名称', trigger: 'blur' }],
    businessRange: [{ required: true, message: '请选择经营范围', trigger: 'change' }],
    address: [{ required: true, message: '请输入经营场所', trigger: 'blur' }],
    legal: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
    code: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }]
  });

  console.log(window.origin);

  /** 显示对话框 */
  const show = async (row?: IMerchant) => {
    rangeList.value = await httpGetBuinessRange();
    if (row) {
      isAdd.value = false;
      form.name = row.name;
      form.code = row.code;
      form.legal = row.legal;
      form.businessRange = row.businessRange;
      form.id = row.id;
      form.address = row.address;
    } else {
      isAdd.value = true;
      for (const key in form) {
        if (key == 'businessRange') form[key] = [];
        else form[key] = '';
      }
    }
    nextTick(() => {
      editForm.value.clearValidate();
    });
    dialogFormVisible.value = true;
  };

  /** 提交 */
  const submit = () => {
    editForm.value.validate(async (valid: boolean) => {
      if (valid) {
        if (isAdd.value) {
          const { data } = await httpAddMerchant(form);
          emit('success', Object.assign(data, { isAdd: true }));
          ElMessage.success('商家入驻成功！');
        } else {
          const { data } = await httpEditMerchant(form);
          emit('success', Object.assign(data, { isAdd: false }));
          ElMessage.success('修改商家信息成功！');
        }
        dialogFormVisible.value = false;
      } else return false;
    });
  };

  defineExpose({ show });
</script>

<style lang="scss">
  #merchantAddorEdit {
    .el-select {
      width: 100%;
    }
  }
</style>
