<template>
  <div id="merchantAddorEdit">
    <el-dialog :title="isAdd ? '商家 - 新增' : '商家 - 编辑'" v-model="dialogFormVisible" width="500px" :close-on-click-modal="false">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="editForm" @keyup.enter="submit">
        <el-form-item label="商店名称" prop="name" placeholder="请输入商店名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="经营范围" prop="businessRange" placeholder="请选择经营范围">
          <el-select v-model="form.businessRange" filterable clearable multiple :multiple-limit="3">
            <el-option v-for="item in rangeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="code" placeholder="请输入统一社会信用代码">
          <el-input v-model="form.code" />
        </el-form-item>
        <el-form-item label="法定代表人" prop="code" placeholder="请输入法定代表人">
          <el-input v-model="form.legal" />
        </el-form-item>
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
  import { httpAddMerchant, httpEditMerchant, httpGetBuinessRange } from '@/requests/merchant';
  import { ElMessage } from 'element-plus';
  import { nextTick, reactive, ref } from 'vue';
  import { IMerchant } from '../typing';

  const emit = defineEmits(['success']);
  const dialogFormVisible = ref(false);
  const isAdd = ref(true); // 是否为新增
  const rangeList = ref(); // 经营范围列表
  const editForm = ref(); // 表单ref
  const form = reactive<any>({
    name: '',
    businessRange: [],
    code: '',
    legal: ''
  });
  const rules = reactive({
    name: [{ required: true, message: '请输入商店名称', trigger: 'blur' }],
    businessRange: [{ required: true, message: '请选择经营范围', trigger: 'change' }],
    legal: [{ required: true, message: '请输入法定代表人', trigger: 'blur' }],
    code: [{ required: true, message: '请输入统一社会信用代码', trigger: 'blur' }]
  });

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
    } else {
      isAdd.value = true;
      for (const key in form) {
        form[key] = '';
      }
    }
    dialogFormVisible.value = true;
    nextTick(() => {
      editForm.value.clearValidate();
    });
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
