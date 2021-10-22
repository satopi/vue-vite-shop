import { createStore, Store } from 'vuex';
import { IRootState } from './typing';
import { InjectionKey } from 'vue';
import { useStore as baseUseStore } from 'vuex';
import user from './user';

export default createStore<IRootState>({
  modules: {
    user
  }
});

/**
 * vuex 类型推断配置
 * 使用方法：
 * 在页面中导入即可 import { useStore } from "@/store";
 */
export const key: InjectionKey<Store<IRootState>> = Symbol('vue-store');
export function useStore() {
  return baseUseStore(key);
}
