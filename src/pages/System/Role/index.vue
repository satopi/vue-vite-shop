<template>
  <section id="role" class="flex">
    <el-card shadow="hover" class="flex-1 flex-column table-card m-r-20">
      <el-row :gutter="15" justify="space-between">
        <el-col :span="8.5">
          <FilterBar @search="search" />
        </el-col>
        <el-col :span="2.5">
          <el-button type="default" icon="el-icon-refresh" size="small" plain @click="refreshTable">刷新</el-button>
          <el-button type="primary" icon="el-icon-plus" size="small" @click="addNewRole">新增角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="rolePaging.pageData"
        highlight-current-row
        class="flex-1 table"
        height="0"
        border
        header-cell-class-name="table-header"
        v-loading="pagingLoading"
        @row-click="handleRowClick"
        @row-dblclick="editRow"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="name" label="角色" width="150" align="center" />
        <el-table-column prop="description" label="角色描述" tooltip-effect width="200" />
        <el-table-column prop="creator" label="创建人" width="auto" align="center" />
        <el-table-column prop="account" label="创建人账号" tooltip-effect width="110" align="center" />
        <el-table-column prop="date" label="创建日期" width="auto" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button @click.prevent="editRow(scope.row)" type="warning" size="small"> 编辑 </el-button>
            <el-button @click.prevent="deleteRow(scope.$index)" type="danger" size="small"> 移除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:currentPage="rolePaging.pageCurrent"
        :page-size="rolePaging.pageSize"
        :total="rolePaging.total"
        layout="prev, pager, next, jumper"
        class="pagination border-top"
      />
    </el-card>
    <el-card class="power-card">
      <template #header>
        <div class="card-header justify-between align-center">
          <h3 class="f-s-18">角色权限</h3>
          <el-button class="button" type="text" @click="refreshPowerList">刷新</el-button>
        </div>
      </template>
      <el-tree ref="powerTree" :data="powerList" show-checkbox node-key="id" default-expand-all v-loading="treeLoading" />
    </el-card>
  </section>
  <RoleDialog ref="roleAddOrEdit" @success="confirmAddOrEdit" />
</template>

<script lang="ts" setup>
  import { paging, pagingLoading } from '@/hooks/pagination';
  import { httpDeleteRole, httpGetPowerList, httpGetRolePaging } from '@/requests/role';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { onMounted, reactive, ref } from 'vue';
  import FilterBar from '@/components/FilterBar/index.vue';
  import RoleDialog from './AddOrEdit/index.vue';
  import { IRole } from './typing';
  import { cloneDeep } from 'lodash-es';
  import { currentRow } from '@/hooks/table';

  const rolePaging = ref(cloneDeep(paging));
  const searchForm = reactive({ keyword: '' });
  const powerList = ref();
  const powerTree = ref();
  const treeLoading = ref(false);
  const roleAddOrEdit = ref();

  onMounted(async () => {
    rolePaging.value = await httpGetRolePaging();
    powerList.value = await httpGetPowerList(true);
  });

  /** 刷新权限列表 */
  const refreshPowerList = async () => {
    treeLoading.value = true;
    const data = await httpGetPowerList(true);
    powerList.value = data;
    treeLoading.value = false;
    ElMessage.success('刷新成功！');
  };

  /** 刷新表格 */
  const refreshTable = async () => {
    rolePaging.value = await httpGetRolePaging(searchForm);
    ElMessage.success('刷新成功！');
  };

  /** 单击表格行数据时显示角色权限 */
  const handleRowClick = (row: any) => {
    currentRow.value = row;
    powerTree.value.setCheckedKeys([]);
    row.power.forEach((p: string) => {
      powerTree.value.setChecked(p, true);
    });
  };

  /** 搜索角色 */
  const search = async (e: any) => {
    rolePaging.value = await httpGetRolePaging(Object.assign(searchForm, e));
  };

  /** 新增角色 */
  const addNewRole = () => {
    roleAddOrEdit.value.show();
  };

  /** 编辑角色 */
  const editRow = (row: IRole) => {
    roleAddOrEdit.value.show(row);
  };

  /** 编辑或新增后的回调 */
  const confirmAddOrEdit = async (row: any) => {
    if (row.isAdd) {
      rolePaging.value.pageData.unshift(row);
    } else {
      powerTree.value.setCheckedKeys([]);
      row.power.forEach((p: string) => {
        powerTree.value.setChecked(p, true);
      });
      rolePaging.value.pageData.map((p: IRole) => {
        if (p.id == row.id) {
          for (const key in row) {
            p[key] = row[key];
          }
        }
      });
    }
  };

  /** 删除角色 */
  const deleteRow = (index: number) => {
    ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      await httpDeleteRole({ id: currentRow.value.id });
      rolePaging.value.pageData.splice(index, 1);
      ElMessage({ type: 'success', message: '删除成功!' });
    });
  };

  /** 分页切换 */
  const handleCurrentChange = async (val: string) => {
    rolePaging.value = await httpGetRolePaging(searchForm, parseInt(val));
  };
</script>

<style lang="scss">
  #role {
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
    .power-card {
      width: 300px;
      .el-card__body {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        &:hover {
          &::-webkit-scrollbar-thumb {
            background: rgba(216, 216, 216, 1);
          }
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
          background-color: var(--el-color-primary);
          border-color: var(--el-color-primary);
        }
        .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
          border-color: white;
        }
        .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
          background-color: white;
        }
      }
    }
  }
</style>
