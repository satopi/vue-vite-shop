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
        <el-table-column prop="state" label="状态" show-overflow-tooltip width="120" align="center">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.state == '已入驻'">{{ scope.row.state }}</el-tag>
            <el-tag type="danger" v-else-if="scope.row.state == '已驳回'">{{ scope.row.state }}</el-tag>
            <el-tag type="warning" v-else-if="scope.row.state == '待审核'">{{ scope.row.state }}</el-tag>
            <el-tag type="info" v-else>{{ scope.row.state }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商店名称" show-overflow-tooltip width="200" align="center" />
        <el-table-column prop="rangeName" label="经营范围" show-overflow-tooltip width="auto" align="center" />
        <el-table-column prop="code" label="统一社会信用代码" show-overflow-tooltip width="220" align="center" />
        <el-table-column prop="legal" label="法定代表人" show-overflow-tooltip width="110" align="center" />
        <el-table-column prop="creator" label="创建人" show-overflow-tooltip width="110" align="center" />
        <el-table-column prop="creatorAccount" label="创建人账号" show-overflow-tooltip width="110" align="center" />
        <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip width="120" align="center" />
        <el-table-column prop="date" label="入驻日期" width="150" align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-tooltip class="item" effect="dark" content="入驻审核" placement="top" v-if="scope.row.state == '待审核'">
              <el-button @click.prevent="checkRow(scope.row)" type="warning" size="small" circle plain>
                <i class="iconfont icon-BCshangjiashenhe f-s-14"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑商家信息" placement="top" v-if="scope.row.state == '已入驻'">
              <el-button @click.prevent="editRow(scope.row)" type="info" size="small" circle plain>
                <i class="iconfont icon-wenbenshuru f-s-14"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="重新入驻" placement="top" v-if="scope.row.state == '已撤离'">
              <el-button @click.prevent="reSettledRow(scope.row)" type="success" size="small" circle plain>
                <i class="iconfont icon-iconfontruzhu f-s-14"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="注销商家" placement="top" v-if="scope.row.state == '已入驻'">
              <el-button @click.prevent="cancelRow(scope.row)" type="danger" size="small" circle plain>
                <i class="iconfont icon-zhuxiao f-s-14"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商家信息" placement="top" v-else>
              <el-button @click.prevent="deleteRow(scope.$index)" type="danger" size="small" circle plain>
                <i class="iconfont icon-shanchu f-s-16"></i>
              </el-button>
            </el-tooltip>
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
  <MerchantDetailsDialog ref="merchantDetails" @edit="editRow" @delete="deleteRow" @check="checkRow" @reSettle="reSettledRow" @cancel="cancelRow" />
  <MerchantCheckDialog ref="merchantCheck" @success="confirmCheck" />
</template>

<script setup lang="ts">
  import FilterBar from '@/components/FilterBar/index.vue';
  import MerchantEditDialog from './AddOrEdit/index.vue';
  import MerchantDetailsDialog from './Details/index.vue';
  import MerchantCheckDialog from './Check/index.vue';
  import { paging, pagingLoading } from '@/hooks/pagination';
  import {
    httpCancelMerchant,
    httpDeleteMerchant,
    httpGetBuinessRange,
    httpGetBuinessState,
    httpGetMerchantPaging,
    httpReSettled
  } from '@/requests/merchant';
  import { currentRow, handleClickRow, updateData } from '@/hooks/table';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { cloneDeep } from 'lodash-es';
  import { onMounted, provide, reactive, ref } from 'vue';
  import { IMerchant } from './typing';
  import { IFilterList } from '@/components/FilterBar/typing';

  const merchantPaging = ref(cloneDeep(paging));
  const filterList: Array<IFilterList> = reactive([
    { prop: 'input', key: 'keyword', value: '' },
    { prop: 'select', key: 'businessRange', value: '', placeholder: '请选择经营范围', options: [] },
    { prop: 'select', key: 'state', value: '', placeholder: '请选择状态', options: [] }
  ]);
  const searchForm = reactive({});
  const merchantAddOrEdit = ref();
  const merchantDetails = ref();
  const merchantCheck = ref();

  provide('filterList', filterList);

  onMounted(async () => {
    merchantPaging.value = await httpGetMerchantPaging();
    filterList[1].options = await httpGetBuinessRange();
    filterList[2].options = await httpGetBuinessState();
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
      const { result, record } = row;
      result.rangeName = result.businessRange.join('、');
      merchantPaging.value.pageData = updateData(merchantPaging.value.pageData, result, record);
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

  /** 重新入驻 */
  const reSettledRow = (row: IMerchant) => {
    ElMessageBox.confirm('此操作将允许该商家重新入驻, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      const { result, record } = await httpReSettled({ id: String(row.id) });
      merchantPaging.value.pageData = updateData(merchantPaging.value.pageData, result, record);
      ElMessage({ type: 'success', message: '操作成功，商家已重新入驻!' });
    });
  };

  /** 注销商家 */
  const cancelRow = (row: IMerchant) => {
    ElMessageBox.confirm('此操作将注销该商家账号, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      center: true
    }).then(async () => {
      const { result, record } = await httpCancelMerchant({ id: String(row.id) });
      merchantPaging.value.pageData = updateData(merchantPaging.value.pageData, result, record);
      ElMessage({ type: 'success', message: '操作成功，商家账号已注销!' });
    });
  };

  /** 商家审核 */
  const checkRow = (row: IMerchant) => {
    currentRow.value = row;
    merchantCheck.value.show(row);
  };

  /** 审核后的回调 */
  const confirmCheck = (row: any) => {
    const { result, record } = row;
    merchantPaging.value.pageData = updateData(merchantPaging.value.pageData, result, record);
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
