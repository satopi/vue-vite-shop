<template>
  <section id="account" class="flex-column">
    <el-row :gutter="15" justify="space-between">
      <el-col :span="8.5">
        <FilterBar @search="search" />
      </el-col>
      <el-col :span="2.5">
        <el-button type="default" icon="Refresh" size="small" plain @click="refreshTable">刷新</el-button>
        <el-button type="primary" size="small" @click="addNewRole" v-permission="'1004'">
          <i class="iconfont icon-xinzengzhanghao el-icon--left f-s-14"></i>新增账号
        </el-button>
      </el-col>
    </el-row>
    <el-card shadow="hover" class="flex-1 flex-column table-card">
      <el-table
        :data="accountPaging.pageData"
        highlight-current-row
        class="flex-1 table"
        height="0"
        border
        header-cell-class-name="table-header"
        v-loading="pagingLoading"
        @row-click="handleClickRow"
        @row-dblclick="editRow"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="headImgUrl" label="头像" width="auto" align="center">
          <template #default="scope">
            <el-avatar size="large" :src="scope.row.headImgUrl" @error="() => true">
              <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="昵称" tooltip-effect width="auto" align="center" />
        <el-table-column prop="account" label="账号" width="auto" align="center" />
        <el-table-column prop="role" label="角色" tooltip-effect width="120" align="center" />
        <el-table-column prop="mobile" label="手机号码" tooltip-effect width="120" align="center" />
        <el-table-column prop="creator" label="创建人" tooltip-effect width="110" align="center" />
        <el-table-column prop="creatorAccount" label="创建人账号" tooltip-effect width="110" align="center" />
        <el-table-column prop="date" label="创建日期" width="auto" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button @click.prevent="editRow(scope.row)" type="warning" size="small"> 编辑 </el-button>
            <el-button @click.prevent="deleteRow(scope.$index)" type="danger" size="small"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:currentPage="accountPaging.pageCurrent"
        :page-size="accountPaging.pageSize"
        :total="accountPaging.total"
        layout="prev, pager, next, jumper"
        class="pagination border-top"
      />
    </el-card>
  </section>
  <EditInfo ref="editDialog" @confirm="confirmAddOrEdit" />
</template>

<script lang="ts" setup>
  import { paging, pagingLoading } from '@/hooks/pagination';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { onMounted, provide, reactive, ref } from 'vue';
  import FilterBar from '@/components/FilterBar/index.vue';
  import { httpDeleteAccount, httpGetAccountPaging } from '@/requests/account';
  import { IAccount } from './typing';
  import { cloneDeep } from 'lodash-es';
  import EditInfo from '@/components/Header/EditInfo/index.vue';
  import { currentRow, handleClickRow } from '@/hooks/table';
  import { useStore } from '@/store';
  import { httpGetUserInfo } from '@/requests/user';
  import { filterAsyncRoutes } from '@/hooks/useRoutes';
  import { menuList } from '@/configs/common';
  import { useRouter } from 'vue-router';
  import { IFilterList } from '@/components/FilterBar/typing';

  const store = useStore();
  const router = useRouter();
  const accountPaging = ref(cloneDeep(paging));
  const filterList: Array<IFilterList> = reactive([{ prop: 'input', key: 'keyword', value: '' }]);
  const searchForm = reactive({});
  const editDialog = ref();

  provide('filterList', filterList);

  onMounted(async () => {
    accountPaging.value = await httpGetAccountPaging();
  });

  /** 搜索账号 */
  const search = async (e: any) => {
    accountPaging.value = await httpGetAccountPaging(Object.assign(searchForm, e));
  };

  /** 刷新表格 */
  const refreshTable = async () => {
    accountPaging.value = await httpGetAccountPaging(searchForm);
    ElMessage.success('刷新成功！');
  };

  /** 新增账号 */
  const addNewRole = () => {
    editDialog.value.show();
  };

  /** 编辑账号 */
  const editRow = (row: IAccount) => {
    editDialog.value.show(row);
  };

  /** 确认新增/编辑的回调 */
  const confirmAddOrEdit = async (row: any) => {
    if (row.isAdd) {
      accountPaging.value.pageData.unshift(row);
    } else {
      accountPaging.value.pageData.map((p: IAccount) => {
        if (p.id == row.id) {
          for (const key in row) {
            p[key] = row[key];
          }
        }
      });
      // 修改自己权限时立即刷新
      if (row.id == store.state.user.userInfo?.id) {
        await httpGetUserInfo();
        menuList.value = filterAsyncRoutes(router.options.routes.filter((p) => p.meta?.isMenu));
        router.replace({ path: '/auth' });
      }
    }
  };

  /** 删除账号 */
  const deleteRow = (index: number) => {
    ElMessageBox.confirm('此操作将永久删除该账号, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      await httpDeleteAccount({ id: currentRow.value.id });
      accountPaging.value.pageData.splice(index, 1);
      ElMessage({ type: 'success', message: '删除成功!' });
    });
  };

  /** 分页切换 */
  const handleCurrentChange = async (val: string) => {
    accountPaging.value = await httpGetAccountPaging(searchForm, parseInt(val));
  };
</script>

<style lang="scss">
  #account {
    width: 100%;
    height: 100%;
    padding: 10px;
    .table-card {
      border: 0;
      .el-card__body {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .pagination {
          border: 1px solid var(--el-border-color-lighter);
          border-top: 0;
          display: flex;
          justify-content: flex-end;
          padding: 8px 15px;
        }
      }
    }
  }
</style>
