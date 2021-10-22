<template>
  <span ref="numGrow" :data-time="time" class="number-grow" :data-value="value">0</span>
</template>
<script lang="ts" setup>
  import { onMounted, watch, ref } from 'vue';

  const numGrow = ref();

  interface Props {
    time?: number;
    value: number;
    fixed?: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    time: 2,
    value: 0,
    fixed: 0
  });

  onMounted(() => numberGrow(numGrow.value));

  const numberGrow = (ele: any, value = props.value, defaultVal = 0) => {
    const step = (value * 10) / (props.time * 1000);
    let current = defaultVal;
    let start = defaultVal;
    let timer: NodeJS.Timer | null = setInterval(() => {
      start += step;
      if (start > value) {
        clearInterval(Number(timer));
        start = value;
        timer = null;
      }
      if (current === start) return;
      current = start;
      ele.innerHTML = current
        .toFixed(props.fixed)
        .toString()
        .replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,');
    }, 0.01);
  };

  watch(
    () => props.value,
    (newVal, oldVal) => {
      numberGrow(numGrow.value, newVal, oldVal);
    }
  );
</script>
