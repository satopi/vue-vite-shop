<template>
  <div id="login" class="flex-center">
    <div style="width: 40%">
      <img src="../../assets/home.svg" style="transform: scale(0.6)" />
    </div>
    <el-card class="login-card flex-center">
      <h1 class="logo m-b-20"></h1>
      <el-form :model="form" :rules="rules" ref="loginForm" label-width="auto" class="login-form" @keyup.enter="login">
        <el-form-item prop="account">
          <el-input v-model="form.account" placeholder="请输入账号" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="role">
          <el-radio-group v-model="form.role">
            <el-radio :label="1">系统管理员</el-radio>
            <el-radio :label="2">商家</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import { httpLogin } from '@/requests/login';
  import { reactive, ref } from 'vue';
  import { useStore } from '@/store';
  import { SET_USERINFO } from '@/store/user/actionTypes';
  import { session } from '@/utils/tools';

  const router = useRouter();
  const store = useStore();

  const loginForm = ref();
  const form = reactive({
    account: 'admin',
    password: '123456',
    role: 1
  });
  const rules = reactive({
    account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    role: [{ required: true, message: '请选择角色', trigger: 'change' }]
  });

  /** 登录 */
  const login = () => {
    loginForm.value.validate(async (valid: boolean) => {
      if (valid) {
        const { data } = await httpLogin(form);
        store.commit(SET_USERINFO, data);
        session.set('userInfo', JSON.stringify(data));
        router.replace('/home');
      } else return false;
    });
  };
</script>

<style lang="scss">
  #login {
    width: 100%;
    height: 100%;

    .login-card {
      width: 400px;
      height: 550px;

      .el-card__body {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .logo {
          background-image: url(../../assets/logo.svg);
          background-size: cover;
          width: 125px;
          height: 150px;
        }

        .login-form {
          width: 85%;
        }
      }
    }
  }
</style>
