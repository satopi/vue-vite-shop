<template>
  <el-timeline class="record">
    <el-timeline-item v-for="(item, index) in recordList" :key="index" hide-timestamp :color="index == 0 ? '#395b77' : ''">
      <template #default>
        <p class="justify-between">
          <span>{{ item.name }}：{{ item.desc }}</span>
          <span>{{ item.timestamp }}</span>
        </p>
      </template>
    </el-timeline-item>
  </el-timeline>
</template>

<script lang="ts" setup>
  import { recordList } from '@/configs/common';
</script>
