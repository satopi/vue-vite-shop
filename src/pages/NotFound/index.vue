<template>
  <div id="not-found" class="flex-center">
    <el-empty :image="notFound" description="网页走丢啦(ｷ｀ﾟДﾟ´)!!" :image-size="600" />
  </div>
</template>

<script lang="ts" setup>
  import notFound from 'assets/notFound.svg';
</script>

<style lang="scss">
  #not-found {
    width: 100%;
    height: 100%;
  }
</style>
