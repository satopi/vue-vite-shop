<template>
  <div id="roleAddOrEdit">
    <el-dialog :title="isAdd ? '角色 - 新增' : '角色 - 编辑'" v-model="dialogFormVisible" width="500px" :close-on-click-modal="false">
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="editForm" @keyup.enter="submit" @submit.native.prevent>
        <el-form-item label="角色名称" prop="name" placeholder="请输入角色名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description" placeholder="请输入角色描述">
          <el-input type="textarea" v-model="form.description" />
        </el-form-item>
        <el-form-item label="角色权限" prop="power">
          <el-tree ref="powerTree" :data="powerList" show-checkbox node-key="id" default-expand-all @check-change="handleCheckChange" />
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
  import { menuList } from '@/configs/common';
  import { filterAsyncRoutes } from '@/hooks/useRoutes';
  import { httpAddRole, httpEditRole, httpGetPowerList } from '@/requests/role';
  import { httpGetUserInfo } from '@/requests/user';
  import { ElMessage } from 'element-plus';
  import { reactive, ref, nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  import { IRole } from '../typing';

  const emit = defineEmits(['success']);
  const router = useRouter();
  const dialogFormVisible = ref(false);
  const isAdd = ref(true); // 是否为新增
  const powerTree = ref();
  const powerList = ref(); // 权限列表
  const editForm = ref(); // 表单ref
  const form = reactive<any>({
    name: '',
    description: '',
    power: ''
  });
  const rules = reactive({
    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
    power: [{ required: true, message: '请选择角色权限', trigger: 'change' }]
  });

  /** 显示对话框 */
  const show = async (row?: IRole) => {
    await getPowerList();
    if (row) {
      isAdd.value = false;
      form.name = row.name;
      form.description = row.description;
      form.power = row.power;
      form.id = row.id;
    } else {
      isAdd.value = true;
      for (const key in form) {
        form[key] = '';
      }
    }
    dialogFormVisible.value = true;
    nextTick(async () => {
      if (isAdd.value) await powerTree.value.setCheckedKeys([]);
      else await powerTree.value.setCheckedKeys(row?.power);
      editForm.value.clearValidate();
    });
  };

  /** 获取权限列表 */
  const getPowerList = async () => {
    const data = await httpGetPowerList();
    powerList.value = data;
  };

  /** 权限选择发生改变时 */
  const handleCheckChange = () => {
    form.power = powerTree.value.getCheckedKeys();
  };

  /** 提交 */
  const submit = () => {
    editForm.value.validate(async (valid: boolean) => {
      if (valid) {
        if (isAdd.value) {
          const { data } = await httpAddRole(form);
          emit('success', Object.assign(data, { isAdd: true }));
          ElMessage.success('新增角色成功！');
        } else {
          const { data } = await httpEditRole(form);
          // 角色权限更新后刷新个人信息，重置权限路由
          await httpGetUserInfo();
          menuList.value = filterAsyncRoutes(router.options.routes.filter((p) => p.meta?.isMenu));
          router.replace({ path: '/auth' });
          emit('success', Object.assign(data, { isAdd: false }));
          ElMessage.success('修改角色信息成功！');
        }
        dialogFormVisible.value = false;
      } else return false;
    });
  };

  defineExpose({ show });
</script>
