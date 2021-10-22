# MIMO电商平台后台管理系统

### 项目简介

- 基于 Vue3 + Vite2 + Typescript 开发的电子商务平台，组件库使用 element plus；
- 数据为 mock 模拟,登录账号密码随意填写；
- 项目处于快速迭代阶段，最新版在 **[国内仓库](https://gitee.com/ring456/vite2-vue3-ts-mock-shop-pc) (development分支)**；
- 本项目仅供学习交流使用，不足之处望海涵，欢迎提 issue 交流学习 ━(_｀ ∀´_)ノ亻!
- 目前已完成模块：登录、首页（管理员/商家）、系统管理

### 系统截图
[![5cm5mq.png](https://z3.ax1x.com/2021/10/22/5cm5mq.png)](https://imgtu.com/i/5cm5mq)
[![5cnPhD.png](https://z3.ax1x.com/2021/10/22/5cnPhD.png)](https://imgtu.com/i/5cnPhD)
[![5cnl9g.png](https://z3.ax1x.com/2021/10/22/5cnl9g.png)](https://imgtu.com/i/5cnl9g)

### 技术栈

- **[Vite v2.5.10](https://vitejs.dev/)**
- **[Vue v3.2.20](https://v3.vuejs.org/)**
- **[Typescript v4.1.5](https://www.typescriptlang.org/)**
- **[Axios](http://www.axios-js.com/zh-cn/)**
- **[vite-plugin-mock v2.9.4](https://github.com/anncwb/vite-plugin-mock.git)**
- **[Element-plus v1.1.0-beta.24](https://element-plus.org/#/zh-CN/component/installation)**

### 项目规范

1. 所有组件的文件夹命名和文件命名用大驼峰，出口文件使用 index 命名；
2. 插件命名使用大驼峰，其他所有文件和文件夹均使用小驼峰；
3. 样式通过 scss 编写，所有的 css 类名全部小写，并用-连接；
4. 全局类型声明和静态数据类型声明在 typings 文件夹中，各模块对应的类型声明在各模块的 typing.ts 中编写；
5. 全局参数管理、api 接口管理都在 configs 文件夹中；
6. 工具方法统一放在 utils 文件夹中，再分类管理；
7. 插件统一放在 plugins 文件夹中；
8. 自定义 hooks 统一放在 hooks 文件夹中；
9. 页面组件和业务模块组件统一放在 pages 文件夹中，页面组件作为容器组件，用于处理数据、逻辑和布局，业务模块组件是对应页面的 UI 组件，只负责 UI 不负责逻辑；
10. 通用组件和其它 UI 组件统一放在 components 中；
11. 组件内部书写顺序：
    - 定义响应式数据（ref，reactive）
    - 解构自定义 hooks
    - 定义 computed
    - 生命周期函数
    - 其他逻辑代码
    - watch 和 watchEffect
12. vuex 规范：
    - 每个页面模块有自己独立的 vuex 模块，在 store 文件夹中模块化管理
    - state、mutations、getters、actions 分离，在 index 中导入
    - 事件类型，在 actionTypes 中管理
13. mock 规范：
    - 每个模块有自己独立的 mock，统一放在 mock/module 文件夹中
    - mock 工具方法放在 mock/tool.ts 中
    - mock 全局参数管理防止 mock/configs 中

### 项目运行

#### clone 项目

```
git clone
```

#### 安装依赖（如果没有 yarn 推荐使用 cnpm）

```
npm install cnpm -g --registry=https://registry.npm.taobao.org
yarn install
cnpm install
```

#### 本地运行

```
yarn dev
npm run dev
```

#### 打包

```
yarn build
npm run build
```

#### 生产环境预览

```
yarn preview
npm run preview
```

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request
