import { ref } from 'vue';

export const currentRow = ref<any>({});

export const handleClickRow = (row: any) => {
  currentRow.value = row;
};
