import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store, { key } from './store/index';
import './utils/jsExtend';
import './style/index.scss';
import { components, plugins, icons } from './plugins/ElementPlus';
const app = createApp(App);

// 按需引入Element组件和插件
components.forEach((component) => {
  app.component(component.name, component);
});
icons.forEach((component) => {
  app.component(component.name, component);
});
plugins.forEach((plugin) => {
  app.use(plugin);
});

app.use(router).use(store, key);
app.directive('permission', {
  mounted(el, binding) {
    if (!store.state.user.userInfo?.power.includes(binding.value)) el.style.display = 'none';
  }
});
app.mount('#app');
