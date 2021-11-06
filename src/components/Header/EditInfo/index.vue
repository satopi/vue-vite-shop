<template>
  <div id="editDialog">
    <el-dialog :title="isAdd ? '账号信息-新增' : '账号信息-编辑'" v-model="dialogFormVisible" width="400px" center :close-on-click-modal="false">
      <!-- 头像上传 -->
      <el-upload
        ref="uploadAvatar"
        class="avatar-uploader m-b-30 flex-center"
        :disabled="disabledList.headImgUrl"
        :action="uploadUrl"
        :show-file-list="false"
        :auto-upload="false"
        :on-change="handleChangeAvatar"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="form.headImgUrl" :src="form.headImgUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><plus style="width: 2em; height: 2em; vertical-align: middle" /></el-icon>
      </el-upload>
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="editForm" @keyup.enter="submit">
        <el-form-item label="账号" prop="account" placeholder="请输入账号">
          <el-input v-model="form.account" :disabled="disabledList.account" />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName" placeholder="请输入昵称">
          <el-input v-model="form.nickName" :disabled="disabledList.nickName" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile" placeholder="请输入手机号码">
          <el-input v-model.number="form.mobile" :disabled="disabledList.mobile" />
        </el-form-item>
        <el-form-item label="角色" prop="roleKey">
          <el-select v-model="form.roleKey" placeholder="请选择角色" :disabled="disabledList.roleKey" @change="changeRole">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in roleOptions" :key="index" />
          </el-select>
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
  import { UPLOAD_FILE } from '@/configs/api';
  import { ElMessage } from 'element-plus';
  import { reactive, ref, nextTick } from 'vue';
  import { httpGetRoleList } from '@/requests/role';
  import { checkPhone } from '@/hooks/validator';
  import { cloneDeep } from 'lodash-es';
  import { IEditForm } from './typing';
  import { IRole } from '@/pages/System/Role/typing';
  import { httpAddAccount, httpEditAccount } from '@/requests/account';
  import { useStore } from '@/store';

  const store = useStore();
  const dialogFormVisible = ref(false);
  const isAdd = ref(true); // 是否为新增

  const uploadAvatar = ref(); // 上传控件ref
  const uploadUrl = location.origin + '/api' + UPLOAD_FILE; // 上传文件url

  const editForm = ref(); // 表单ref
  const roleOptions = ref<Array<IRole>>([]);
  const form = reactive<any>({
    headImgUrl: '',
    account: '',
    nickName: '',
    mobile: '',
    roleKey: ''
  });
  const rules = reactive({
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    mobile: [{ required: true, validator: checkPhone, trigger: 'blur' }],
    roleKey: [{ required: true, message: '请选择角色', trigger: 'change' }]
  });
  const disabledList = reactive(cloneDeep(form)); // 控制表单项是否禁用

  const emit = defineEmits(['confirm']);

  /** 显示对话框 */
  const show = async (row: IEditForm[]) => {
    await getRoleOptions();
    if (row) {
      isAdd.value = false;
      for (const key in row) {
        disabledList[key] = false;
        form[key] = row[key];
        if (key == 'account') disabledList[key] = true;
        // 系统管理员才允许修改账号角色
        if (store.state.user.userInfo?.roleKey != 1) disabledList.roleKey = true;
      }
    } else {
      isAdd.value = true;
      for (const key in form) {
        disabledList[key] = false;
        form[key] = '';
        if (key == 'account') disabledList[key] = false;
      }
    }
    dialogFormVisible.value = true;
    nextTick(() => {
      editForm.value.clearValidate();
    });
  };

  /** 获取角色选项 */
  const getRoleOptions = async () => {
    const { data } = await httpGetRoleList();
    roleOptions.value = data;
  };

  /** 角色改变时的钩子 */
  const changeRole = (e: number) => {
    roleOptions.value.forEach((p) => {
      if (p.id == e) form.role = p.name;
    });
  };

  /** 头像改变时的钩子 */
  const handleChangeAvatar = (file: any) => {
    uploadAvatar.value.clearFiles();
    form.headImgUrl = URL.createObjectURL(file.raw);
  };

  /** 头像上传前的钩子 */
  const beforeAvatarUpload = (file: any) => {
    const isJPG = file.type === 'image/jpeg';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      ElMessage.error('上传头像图片只能是 JPG 格式!');
    }
    if (!isLt2M) {
      ElMessage.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPG && isLt2M;
  };

  /** 提交 */
  const submit = () => {
    editForm.value.validate(async (valid: boolean) => {
      if (valid) {
        await uploadAvatar.value.submit();
        if (isAdd.value) {
          const { data } = await httpAddAccount(form);
          emit('confirm', Object.assign(data, { isAdd: true }));
          ElMessage.success('新增账号成功！');
        } else {
          const { data } = await httpEditAccount(form);
          emit('confirm', Object.assign(data, { isAdd: false }));
          ElMessage.success('编辑账号信息成功！');
        }
        dialogFormVisible.value = false;
      } else return false;
    });
  };

  defineExpose({ show });
</script>

<style lang="scss">
  #editDialog {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: var(--el-color-primary);
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
    }
  }
</style>
