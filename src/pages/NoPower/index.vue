<template>
  <div id="not-found" class="flex-center">
    <el-empty :image="noPower" description="权限不够啦ε(┬┬﹏┬┬)3 " :image-size="600" />
  </div>
</template>

<script lang="ts" setup>
  import noPower from 'assets/noPower.svg';
</script>

<style lang="scss">
  #not-found {
    width: 100%;
    height: 100%;
  }
</style>
