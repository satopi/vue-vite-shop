import { UserConfigExport, ConfigEnv, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { viteMockServe } from 'vite-plugin-mock';
import autoprefixer from 'autoprefixer';

const pathResolve = (dir: string) => resolve(__dirname, dir);
const envResolve = (mode: string, env: string) => loadEnv(mode, process.cwd())[env];

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  return {
    base: envResolve(mode, 'VITE_PUBLIC'),
    plugins: [
      vue(),
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve',
        prodEnabled: command !== 'serve' && Boolean(envResolve(mode, 'VITE_USE_MOCK')),
        injectCode: `
          import { setupProdMockServer } from './plugins/MockProdServer';
          setupProdMockServer();
        `,
        logger: true
      })
    ],
    resolve: {
      alias: {
        '@': pathResolve('./src'),
        pages: pathResolve('./src/pages'),
        components: pathResolve('./src/components'),
        assets: pathResolve('./src/assets'),
        utils: pathResolve('./src/utils'),
        typings: pathResolve('./src/typings'),
        requests: pathResolve('./src/requests'),
        hooks: pathResolve('./src/hooks'),
        style: pathResolve('./src/style'),
        configs: pathResolve('./src/configs'),
        store: pathResolve('./src/store'),
        plugins: pathResolve('./src/plugins')
      }
    },
    css: {
      postcss: {
        plugins: [autoprefixer()]
      }
    },
    server: {
      host: '0.0.0.0',
      port: 8086,
      open: true
    }
  };
};
