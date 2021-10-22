<template>
  <el-header class="p-10 f-color-white bg-primary align-center">
    <h1 class="f-s-22 flex-center">
      <svg class="icon w-30 h-30 m-r-8" aria-hidden="true">
        <use xlink:href="#icon-cat" />
      </svg>
      MIMO电商平台
    </h1>
    <el-popover placement="bottom-end" :width="300" trigger="hover">
      <div class="flex">
        <div class="align-center">
          <el-avatar size="large" :src="store.state.user.userInfo?.headImgUrl" @error="() => true">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <div class="m-l-8">
            <p class="l-h-20">{{ store.state.user.userInfo?.nickName }}（{{ store.state.user.userInfo?.role }}）</p>
            <p class="l-h-20 f-color-third f-s-12">ID：{{ store.state.user.userInfo?.account }}</p>
          </div>
        </div>
        <div class="flex-shrink m-t-5" style="margin-left: auto">
          <el-tooltip class="item" effect="dark" content="编辑个人信息" placement="bottom">
            <edit class="f-color-primary w-18 h-18 m-r-5 edit" @click="editInfo" />
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="退出登录" placement="bottom">
            <switch-button class="f-color-danger w-18 h-18 login-out" @click="loginOut" />
          </el-tooltip>
        </div>
      </div>
      <template #reference>
        <div class="align-center info-box">
          <el-avatar size="large" :src="store.state.user.userInfo?.headImgUrl" @error="() => true">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <span class="m-l-8">欢迎，{{ store.state.user.userInfo?.nickName }}</span>
        </div>
      </template>
    </el-popover>
  </el-header>
  <EditInfo ref="editDialog" @confirm="confirmEdit" />
</template>

<script lang="ts" setup>
  import { httpLoginOut } from '@/requests/login';
  import { httpEditUserInfo } from '@/requests/user';
  import { useStore } from '@/store';
  import { session } from '@/utils/tools';
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import EditInfo from './EditInfo/index.vue';
  import { IAccountForm } from './EditInfo/typing';

  const store = useStore();
  const router = useRouter();
  const editDialog = ref();

  /** 打开用户信息编辑窗口 */
  const editInfo = () => {
    const editForm = reactive([
      { prop: 'headImgUrl', value: store.state.user.userInfo?.headImgUrl, disabled: false },
      { prop: 'account', value: store.state.user.userInfo?.account, disabled: true },
      { prop: 'nickName', value: store.state.user.userInfo?.nickName, disabled: false },
      { prop: 'mobile', value: store.state.user.userInfo?.mobile, disabled: false },
      { prop: 'roleKey', value: store.state.user.userInfo?.roleKey, disabled: true }
    ]);
    editDialog.value.show(editForm);
  };

  /** 确认编辑用户信息 */
  const confirmEdit = async (form: IAccountForm) => {
    let userInfo = Object.assign(store.state.user.userInfo, form);
    await httpEditUserInfo(userInfo);
    editDialog.value.close();
    ElMessage.success('修改成功！');
  };

  /** 退出登录 */
  const loginOut = async () => {
    await httpLoginOut();
    session.remove('userInfo');
    router.replace('/login');
  };
</script>

<style lang="scss" scoped>
  .info-box {
    margin-left: auto;
    transition: all 0.2s;
    &:hover {
      cursor: pointer;
      color: #ffd04b;
    }
  }
  .login-out,
  .edit {
    transition: all 0.3s;
    &:hover {
      cursor: pointer;
    }
    &:focus {
      outline: 0;
    }
  }
  .login-out:hover {
    filter: saturate(1.8) brightness(1.8);
  }
  .edit:hover {
    filter: saturate(2) brightness(1.2);
  }
</style>
