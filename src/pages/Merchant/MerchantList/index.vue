<template>
  <section id="merchant" class="flex-column">
    <el-row :gutter="15" justify="space-between">
      <el-col :span="8.5">
        <FilterBar @search="search" />
      </el-col>
      <el-col :span="2.5">
        <el-button type="default" icon="Refresh" size="small" plain @click="refreshTable">刷新</el-button>
        <el-button type="primary" size="small" @click="addMerchant">
          <i class="iconfont icon-iconfontruzhu el-icon--left f-s-14"></i>商家入驻
        </el-button>
      </el-col>
    </el-row>
    <el-card shadow="hover" class="flex-1 flex-column table-card">
      <el-table
        :data="merchantPaging.pageData"
        highlight-current-row
        class="flex-1 table"
        height="0"
        border
        header-cell-class-name="table-header"
        v-loading="pagingLoading"
        @row-click="handleClickRow"
        @row-dblclick="showDetails"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column prop="name" label="商店名称" tooltip-effect width="auto" align="center" />
        <el-table-column prop="rangeName" label="经营范围" tooltip-effect width="auto" align="center" />
        <el-table-column prop="code" label="统一社会信用代码" width="220" align="center" />
        <el-table-column prop="legal" label="法定代表人" tooltip-effect width="110" align="center" />
        <el-table-column prop="creator" label="创建人" tooltip-effect width="110" align="center" />
        <el-table-column prop="creatorAccount" label="创建人账号" tooltip-effect width="110" align="center" />
        <el-table-column prop="mobile" label="手机号码" tooltip-effect width="120" align="center" />
        <el-table-column prop="date" label="入驻日期" width="150" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button @click.prevent="editRow(scope.row)" type="warning" size="small"> 编辑 </el-button>
            <el-button @click.prevent="deleteRow(scope.$index)" type="danger" size="small"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:currentPage="merchantPaging.pageCurrent"
        :page-size="merchantPaging.pageSize"
        :total="merchantPaging.total"
        layout="prev, pager, next, jumper"
        class="pagination border-top"
      />
    </el-card>
  </section>
  <MerchantEditDialog ref="merchantAddOrEdit" @success="confirmAddOrEdit" />
  <MerchantDetailsDialog ref="merchantDetails" @edit="editRow" @delete="deleteRow" />
</template>

<script setup lang="ts">
  import FilterBar from '@/components/FilterBar/index.vue';
  import MerchantEditDialog from './AddOrEdit/index.vue';
  import MerchantDetailsDialog from './Details/index.vue';
  import { paging, pagingLoading } from '@/hooks/pagination';
  import { httpDeleteMerchant, httpGetBuinessRange, httpGetMerchantPaging } from '@/requests/merchant';
  import { currentRow, handleClickRow } from '@/hooks/table';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import { onMounted, provide, reactive, ref } from 'vue';
  import { IMerchant } from './typing';
  import { IFilterList } from '@/components/FilterBar/typing';

  const merchantPaging = ref(cloneDeep(paging));
  const filterList: Array<IFilterList> = reactive([
    { prop: 'input', key: 'keyword', value: '' },
    { prop: 'select', key: 'businessRange', value: '', placeholder: '请选择经营范围', options: [] }
  ]);
  const searchForm = reactive({});
  const merchantAddOrEdit = ref();
  const merchantDetails = ref();

  provide('filterList', filterList);

  onMounted(async () => {
    merchantPaging.value = await httpGetMerchantPaging();
    filterList[1].options = await httpGetBuinessRange();
  });

  /** 搜索商家 */
  const search = async (e: any) => {
    merchantPaging.value = await httpGetMerchantPaging(Object.assign(searchForm, e));
  };

  /** 刷新表格 */
  const refreshTable = async () => {
    merchantPaging.value = await httpGetMerchantPaging(searchForm);
    ElMessage.success('刷新成功！');
  };

  /** 查看商家详情 */
  const showDetails = (row: IMerchant) => {
    currentRow.value = row;
    merchantDetails.value.show(row);
  };

  /** 新增商家 */
  const addMerchant = () => {
    merchantAddOrEdit.value.show();
  };

  /** 编辑商家 */
  const editRow = (row: IMerchant) => {
    let info = currentRow.value;
    if (row) info = row;
    merchantAddOrEdit.value.show(info);
  };

  /** 编辑或新增后的回调 */
  const confirmAddOrEdit = async (row: any) => {
    if (row.isAdd) {
      row.rangeName = row.businessRange.join('、');
      merchantPaging.value.pageData.unshift(row);
    } else {
      merchantPaging.value.pageData.map((p: IMerchant) => {
        if (p.id == row.id) {
          for (const key in row) {
            p[key] = row[key];
          }
          p.rangeName = p.businessRange.join('、');
        }
      });
    }
  };

  /** 删除商家 */
  const deleteRow = (index: number) => {
    ElMessageBox.confirm('此操作将永久删除该商家, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      await httpDeleteMerchant({ id: currentRow.value.id });
      let idx = index;
      if (!idx)
        merchantPaging.value.pageData.forEach((p, i) => {
          if (p.id == currentRow.value.id) idx = i;
        });
      merchantPaging.value.pageData.splice(idx, 1);
      merchantDetails.value.close();
      ElMessage({ type: 'success', message: '删除成功!' });
    });
  };

  /** 分页切换 */
  const handleCurrentChange = async (val: string) => {
    merchantPaging.value = await httpGetMerchantPaging(searchForm, parseInt(val));
  };
</script>

<style lang="scss">
  #merchant {
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
