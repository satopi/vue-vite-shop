<template>
  <component :is="isAdmin ? Admin : Merchant" />
</template>

<script lang="ts" setup>
  import { useStore } from '@/store';
  import { ref } from 'vue';
  import Admin from './Admin/index.vue';
  import Merchant from './Merchant/index.vue';

  const store = useStore();
  const isAdmin = ref();
  isAdmin.value = store.state.user.userInfo?.power.includes('1000');
</script>
