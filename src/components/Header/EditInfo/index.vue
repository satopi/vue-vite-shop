<template>
  <div id="editDialog">
    <el-dialog title="个人信息-编辑" v-model="dialogFormVisible" width="400px" center :close-on-click-modal="false">
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
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
          <el-select v-model="form.roleKey" placeholder="请选择角色" :disabled="disabledList.roleKey">
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

  const dialogFormVisible = ref(false);

  const uploadAvatar = ref(); // 上传控件ref
  const uploadUrl = location.origin + '/api' + UPLOAD_FILE; // 上传文件url

  const editForm = ref(); // 表单ref
  const roleOptions = ref<Array<IRole>>([]);
  const form = reactive({
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
  const show = async (formList: IEditForm[]) => {
    await getRoleOptions();
    // 格式化数据
    formList?.forEach((p: IEditForm) => {
      form[p.prop] = p.value;
      disabledList[p.prop] = p.disabled;
    });
    dialogFormVisible.value = true;
    nextTick(() => {
      editForm.value.clearValidate();
    });
  };

  /** 关闭对话框 */
  const close = () => (dialogFormVisible.value = false);

  /** 获取角色选项 */
  const getRoleOptions = async () => {
    const { data } = await httpGetRoleList();
    roleOptions.value = data;
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
        emit('confirm', form);
      } else return false;
    });
  };

  defineExpose({ show, close });
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
