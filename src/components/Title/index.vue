<template>
  <div class="flex m-t-15 m-b-15" id="title">
    <p class="f-s-17 title relative f-bold f-color-black">{{ props.title }}</p>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps<{
    title: string;
  }>();
</script>

<style lang="scss">
  #title {
    .title::after {
      content: '';
      display: block;
      position: absolute;
      right: -11px;
      bottom: 2px;
      width: 100%;
      opacity: 0.3;
      height: 4px;
      background: var(--el-color-primary);
      border-radius: 2px;
    }
  }
</style>
