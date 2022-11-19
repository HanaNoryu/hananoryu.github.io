---
title: 搭建 Vite3 + Vue3 前端项目规范
date: 2022-11-19 15:37:48
updated: 2022-11-19 15:37:48
comments: false
tags:
- Vue3
- Vite3
- 项目规范
categories:
- 极光的小教程
toc: true
abbrlink: 20221119
---

## 前言

前段时间和小伙伴们一起合作开发新的项目，但是因为各种设备不同，IDE 编辑器的不同，甚至每个人的代码风格不同导致项目文件杂乱无章，合作起来的效率因此降低，而且也提高了后续代码维护的难度。所以为了让每个人的开发体验都提升（~~满足个别人的代码洁癖~~）,于是编写了这篇项目规范文档，好让大家都能够开开心心的码代码！
<!-- more -->
<div class="warning">

> 文章内容较多，可挑选需要的部分进行浏览

</div>

## 技术栈

- [Vite3](https://cn.vitejs.dev/) - 构建工具
- [Vue3](https://cn.vuejs.org) - 渐进式 JavaScript 框架
- [Vue Router](https://router.vuejs.org/zh) - Vue 官方路由管理工具
- [Pinia](https://pinia.vuejs.org/zh) - 值得你喜欢的 Vue Store
- [Sass](https://www.sass.hk/) - CSS 预处理器
- [Axios](https://axios-http.com/zh/) - 一个基于 promise 的网络请求库
- [Husky](https://typicode.github.io/husky/#/) + [Lint-Staged](https://github.com/okonet/lint-staged) - Git Hook 工具
- [EditorConfig](http://editorconfig.org) + [ESLint](http://eslint.cn) + [Prettier](https://prettier.cn) + [Stylelint](https://stylelint.cn) - 代码规范
- [Commitizen](https://cz-git.qbb.sh/zh) + [Commitlint](https://commitlint.js.org) - 提交规范
- [GitHub Actions](https://docs.github.com/cn/actions/learn-github-actions) - 自动部署

## 基础搭建

### 构建项目

确保你安装了最新版本的 [Node.js](https://nodejs.org/)，然后在命令行中运行以下命令：

```sh
# npm 6.x
npm create vite@latest <your-project-name> --template vue-ts

# npm 7+, extra double-dash is needed:
npm create vite@latest <your-project-name> -- --template vue-ts

# yarn
yarn create vite <your-project-name> --template vue-ts

# pnpm
pnpm create vite <your-project-name> --template vue-ts
```

### Vite 基础配置

本项目针对公共基础路径、自定义路径别名、服务器选项、构建选项等做了如下基础配置：

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    vue()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    // 是否开启 https
    https: false,
    // 端口号
    port: 3000,
    // 监听所有地址
    host: '0.0.0.0',
    // 服务启动时是否自动打开浏览器
    open: true,
    // 允许跨域
    cors: true,
    // 自定义代理规则
    proxy: {},
  },
  build: {
    // 设置最终构建的浏览器兼容目标
    target: 'es2015',
    // 构建后是否生成 source map 文件
    sourcemap: false,
    //  chunk 大小警告的限制（以 kbs 为单位）
    chunkSizeWarningLimit: 2000,
    // 启用/禁用 gzip 压缩大小报告
    reportCompressedSize: false,
  },
})
```

### 目录结构

```
├── public/                        // 公共资源目录
├── dist/
└── src/
    ├── api/                       // 接口请求目录
    ├── assets/                    // 静态资源目录
    ├── common/                    // 通用类库目录
    ├── components/                // 公共组件目录
    ├── plugins/                   // 插件配置目录
    ├── router/                    // 路由配置目录
    ├── store/                     // 状态管理目录
    ├── style/                     // 通用样式目录
    ├── utils/                     // 工具函数目录
    ├── views/                     // 页面组件目录
    ├── App.vue
    ├── main.ts
├── tests/                         // 单元测试目录
├── index.html
├── tsconfig.json                  // TypeScript 配置文件
├── vite.config.ts                 // Vite 配置文件
└── package.json
```

### 集成 Vue Router

安装：

```sh
pnpm add vue-router
```

创建文件：

```
└── src/
    ├── router/
    	├── modules/  // 路由模块
        ├── index.js  // 路由配置文件
```

根据功能的不同拆分到 `modules` 文件夹中

```typescript
// modules/base.ts
export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
];
```

```typescript
// index.ts
import { createRouter, createWebHistory } from 'vue-router';

import baseRouters from './modules/base';

const router = createRouter({
  history: createWebHistory(),
  routes: [...baseRouters],
  strict: false,
  scrollBehavior: () => ({ left: 0, top: 0 })
});

/**
 * @description 路由拦截 beforeEach
 * */
router.beforeEach(async (to, from, next) => {
  // to do something...
})

/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
	// to do something...
});

/**
 * @description 路由跳转错误
 * */
router.onError(error => {
	console.error({ title: "路由错误", message: error.message });
});

export default router;
```

### 集成 Pinia

安装：

```sh
pnpm add pinia
```

创建文件：

```
└── src/
    ├── store/
    	├── modules/  // 仓库模块
        ├── index.ts  // 仓库配置文件
```

```typescript
// modules/counter.ts
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 1,
  }),
  actions: {
    accumulate() {
      this.count++;
    },
  },
});
```

```typescript
// index.ts
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
export * from './modules/counter';

// piniaPersist(持久化)
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
```

将 Vue Router 和 Pinia 在 `main.ts` 中挂载

```typescript
import { createApp } from 'vue';

import App from './App.vue';
import store from './store';
import router from './router';

createApp(App).use(router).use(store).mount('#app');
```

### 集成 Axios

安装：

```sh
pnpm add axios
```

配置：

在 `utils` 目录下创建 `request.ts` 文件，配置好适合自己业务的请求拦截和响应拦截：

```
└── src/
	├── api  // 接口
  ├── utils/
      ├── request.ts  // axios 请求库二次封装
```

```typescript
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const config = {
  // 默认地址请求地址，可在 .env 开头文件中修改
  baseURL: import.meta.env.VITE_API_URL as string,
  // 指定请求超时的毫秒数
  timeout: 10000,
  // 表示跨域请求时是否需要使用凭证
  withCredentials: true,
};

class RequestHttp {
	service: AxiosInstance;
	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/**
		 * @description 请求拦截器
		 * 客户端发送请求 -> [请求拦截器] -> 服务器
		 */
		this.service.interceptors.request.use(
			(config: AxiosRequestConfig) => {
			  // do something...
        return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/**
		 * @description 响应拦截器
		 *  服务器换返回信息 -> [拦截统一处理] -> 客户端JS获取到信息
		 */
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data, config } = response;
				// * 成功请求（在页面上除非特殊情况，否则不用处理失败逻辑）
				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				// 请求超时单独判断，因为请求超时没有 response
				if (error.message.indexOf("timeout") !== -1) console.error("请求超时！请您稍后重试");
				return Promise.reject(error);
			}
		);
	}

  // * 常用请求方法封装
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
}

export default new RequestHttp(config);
```
之后在 api 文件夹中以业务模型对接口进行拆分，举个例子，将所有跟用户相关接口封装在 User 类中，此类称作用户模型。

在 User 类中比如有登录、注册、获取用户信息等方法，如果有业务逻辑变动，只需要修改相关方法即可。

把每个业务模型独立成一个 ts 文件，声明一个类通过其属性和方法来实现这个模型相关的数据获取，这样可以大大提升代码的可读性与可维护性。

### 集成 CSS 预处理器

安装：

```sh
pnpm add sass -D
```

在 `vite.config.ts` 配置文件中新增 CSS 预处理器相关配置即可实现 sass 全局样式：

```typescript
export default defineConfig({
  ...
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/base.scss";`
      }
    }
  },
})
```

在 Vue3 中，改变了以往样式穿透的语法，如果继续使用 `::v-deep`、`/deep/`、`>>>` 等语法的话，会出现一个警告，下面是新的语法：

```css
/* 深度选择器 */
:deep(selector) {
  /* ... */
}

/* 插槽选择器 */
:slotted(selector) {
  /* ... */
}

/* 全局选择器 */
:global(selector) {
  /* ... */
}
```

接下来增加代码规范约束、提交规范约束、单元测试、自动部署等，让其更完善、更健壮。

## 代码规范

在同一个项目中，因为每个人的前端能力程度不等，他们往往会用不同的编码风格和习惯在项目中写代码，长此下去，势必会让项目的健壮性越来越差。解决这些问题，理论上讲，口头约定和代码审查都可以，但是这种方式无法实时反馈，而且沟通成本过高，不够灵活，更关键的是无法把控。不以规矩，不能成方圆，我们不得不在项目使用一些工具来约束代码规范。

本文讲解如何使用 **EditorConfig + ESLint + Prettier + Stylelint** 组合来实现代码规范化。

这样做带来好处：

- 解决团队之间代码不规范导致的可读性差和可维护性差的问题。
- 解决团队成员不同编辑器导致的编码规范不统一问题。
- 提前发现代码风格问题，给出对应规范提示，及时修复。
- 减少代码审查过程中反反复复的修改过程，节约时间。
- 自动格式化，统一编码风格，从此和脏乱差的代码说再见。

### 集成 EditorConfig 配置

**EditorConfig** 帮助开发人员在 **不同的编辑器** 和 **IDE** 之间定义和维护一致的编码样式。

在项目根目录下添加 `.editorconfig` 文件：

```ini
# http://editorconfig.org
# 表示是最顶层的 EditorConfig 配置文件
root = true

# 表示所有文件适用
[*]
# 设置文件字符集为 utf-8
charset = utf-8
# 控制换行类型(lf | cr | crlf)
end_of_line = lf
# 始终在文件末尾插入一个新行
insert_final_newline = true
# 缩进风格（tab | space）
indent_style = space

# 表示仅 md 文件适用以下规则
[*.md]
# 关闭最大行长度限制
max_line_length = off
# 关闭末尾空格修剪
trim_trailing_whitespace = false

# 表示仅 ts、js、vue、css 文件适用以下规则
[*.{ts,js,vue,css}]
# 缩进大小
indent_size = 2
```

> 很多 IDE 中会默认支持此配置，但是也有些不支持，如：VSCode、Atom、Sublime Text 等。
>
> 具体列表可以参考官网，如果在 VSCode 中使用需要安装 `EditorConfig for VS Code` 插件。

### 集成 ESLint

安装：

```sh
pnpm add -D eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

| 依赖                             | 作用描述                                                     |
| -------------------------------- | ------------------------------------------------------------ |
| eslint                           | ESLint 核心库                                                |
| eslint-config-prettier           | 关掉所有和 Prettier 冲突的 ESLint 的配置                     |
| eslint-plugin-prettier           | 将 Prettier 的 rules 以插件的形式加入到 ESLint 里面          |
| eslint-plugin-vue                | 为 Vue 使用 ESlint 的插件                                    |
| @typescript-eslint/eslint-plugin | ESLint 插件，包含了各类定义好的检测 TypeScript 代码的规范    |
| @typescript-eslint/parser        | ESLint 的解析器，用于解析 TypeScript，从而检查和规范 TypeScript 代码 |

配置：

```typescript
// .eslintrc.js
// @see: http://eslint.cn

module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true
	},
  plugins: ['vue'],
	/* 指定如何解析语法 */
	parser: "vue-eslint-parser",
	/* 优先级低于 parse 的语法解析配置 */
	parserOptions: {
		parser: "@typescript-eslint/parser",
		ecmaVersion: "latest",
		sourceType: "module",
    allowImportExportEverywhere: true,
		ecmaFeatures: {
			jsx: true
		}
	},
	/* 继承某些已有的规则 */
	extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended"
  ],
	/*
	 * "off" 或 0    ==>  关闭规则
	 * "warn" 或 1   ==>  打开的规则作为警告（不影响代码执行）
	 * "error" 或 2  ==>  规则作为一个错误（代码不能执行，界面报错）
	 */
	rules: {
		// eslint (http://eslint.cn/docs/rules)
		"no-var": "error", // 要求使用 let 或 const 而不是 var
		"no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
		"no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
		"prefer-const": "off", // 此规则旨在标记使用 let 关键字声明但在初始分配后从未重新分配的变量，要求使用 const
		"no-irregular-whitespace": "off", // 禁止不规则的空白

		// typeScript (https://typescript-eslint.io/rules)
		"@typescript-eslint/no-unused-vars": "error", // 禁止定义未使用的变量
		"@typescript-eslint/no-inferrable-types": "off", // 可以轻松推断的显式类型可能会增加不必要的冗长
		"@typescript-eslint/no-namespace": "off", // 禁止使用自定义 TypeScript 模块和命名空间。
		"@typescript-eslint/no-explicit-any": "off", // 禁止使用 any 类型
		"@typescript-eslint/ban-ts-ignore": "off", // 禁止使用 @ts-ignore
		"@typescript-eslint/ban-types": "off", // 禁止使用特定类型
		"@typescript-eslint/explicit-function-return-type": "off", // 不允许对初始化为数字、字符串或布尔值的变量或参数进行显式类型声明
		"@typescript-eslint/no-var-requires": "off", // 不允许在 import 语句中使用 require 语句
		"@typescript-eslint/no-empty-function": "off", // 禁止空函数
		"@typescript-eslint/no-use-before-define": "off", // 禁止在变量定义之前使用它们
		"@typescript-eslint/ban-ts-comment": "off", // 禁止 @ts-<directive> 使用注释或要求在指令后进行描述
		"@typescript-eslint/no-non-null-assertion": "off", // 不允许使用后缀运算符的非空断言(!)
		"@typescript-eslint/explicit-module-boundary-types": "off", // 要求导出函数和类的公共类方法的显式返回和参数类型

		// vue (https://eslint.vuejs.org/rules)
		"vue/script-setup-uses-vars": "error", // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
		"vue/v-slot-style": "error", // 强制执行 v-slot 指令样式
		"vue/no-mutating-props": "off", // 不允许组件 prop的改变（明天找原因）
		"vue/custom-event-name-casing": "off", // 为自定义事件名称强制使用特定大小写
		"vue/attributes-order": "off", // vue api使用顺序，强制执行属性顺序
		"vue/one-component-per-file": "off", // 强制每个组件都应该在自己的文件中
		"vue/html-closing-bracket-newline": "off", // 在标签的右括号之前要求或禁止换行
		"vue/max-attributes-per-line": "off", // 强制每行的最大属性数
		"vue/multiline-html-element-content-newline": "off", // 在多行元素的内容之前和之后需要换行符
		"vue/singleline-html-element-content-newline": "off", // 在单行元素的内容之前和之后需要换行符
		"vue/attribute-hyphenation": "off", // 对模板中的自定义组件强制执行属性命名样式
		"vue/require-default-prop": "off", // 此规则要求为每个 prop 为必填时，必须提供默认值
		"vue/multi-word-component-names": "off" // 要求组件名称始终为 “-” 链接的单词
	}
};
```

> 关于更多配置项信息，请前往 ESLint 官网查看 [ESLint-Configuring](http://eslint.cn/docs/user-guide/configuring)

创建 ESLint 过滤规则

在项目根目录添加一个 `.eslintignore` 文件，内容如下：

```vbnet
dist
node_modules
!.prettierrc.js
components.d.ts
auto-imports.d.ts
```

在 `package.json` 中添加

```json
"scripts": {
	"lint:eslint": "eslint . --fix",
},
```

### 集成 Prettier

安装：

```sh
pnpm add prettier -D
```

配置 Prettier：

```yaml
# Settings will be read from (listed by priority):
# 1 Prettier configuration file
# 2.editorconfig
# 3 Visual Studio Code Settings (Ignored if any other configuration is present)
# Visual Studio Code Settings https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode

# A "prettier" key in your package.json file.
# A .prettierrc file written in JSON or YAML.
# A .prettierrc.json, .prettierrc.yml, .prettierrc.yaml, or .prettierrc.json5 file.
# A .prettierrc.js, .prettierrc.cjs, prettier.config.js, or prettier.config.cjs file that exports an object using module.exports.
# A .prettierrc.toml file.

# options from https://prettier.io/docs/en/options.html

# 最大行长
printWidth: 120

# 指定每个缩进级别的空格数
tabWidth: 2

# 使用制表符而不是空格缩进行
useTabs: false

# 在语句的末尾打印分号
semi: false

# 使用单引号而不是双引号
singleQuote: true

# 引用对象中的属性时更改
# "as-needed"- 仅在需要时在对象属性周围添加引号。
# "consistent"- 如果对象中的至少一个属性需要引号，请引用所有属性。
# "preserve"- 尊重对象属性中引号的输入使用。
quoteProps: "as-needed"

# 在 JSX 中使用单引号而不是双引号
jsxSingleQuote: false

# 在多行逗号分隔的句法结构中尽可能打印尾随逗号
# "es5"- 在 ES5 中有效的尾随逗号（对象、数组等）。TypeScript 中的类型参数中没有尾随逗号。
# "none"- 没有尾随逗号。
# "all"- 尽可能使用尾随逗号（包括函数参数和调用）。要运行，以这种方式格式化的 JavaScript 代码需要一个支持 ES2017（Node.js 8+ 或现代浏览器）或下级编译的引擎。这还可以在 TypeScript 中的类型参数中启用尾随逗号（自 2018 年 1 月发布的 TypeScript 2.7 起支持）。
trailingComma: "es5"

# 在对象文字中的括号之间打印空格
bracketSpacing: true

# 将>多行 HTML（HTML、JSX、Vue、Angular）元素放在最后一行的末尾，而不是单独放在下一行（不适用于自闭合元素）
bracketSameLine: true

# 在唯一的箭头函数参数周围包含括号。
# always"- 始终包括括号。例子：(x) => x
# "avoid"- 尽可能省略括号。例子：x => x
arrowParens: "always"

# 仅格式化文件的一部分。
# 这两个选项可用于格式化以给定字符偏移量开始和结束的代码（分别为包含和不包含）。范围将扩大：
# 回到包含所选语句的第一行的开头。
# 转发到所选语句的末尾。
# 这些选项不能与 一起使用cursorOffset。
# rangeStart: <int>
# rangeEnd: <int>

# 指定要使用的解析器。
# Prettier 会自动从输入文件路径推断解析器，因此您不必更改此设置。
# parser: "<string>"

# 指定用于推断要使用的解析器的文件名。
# filepath: "<string>"

# 需要编译指示
# Prettier 可以将自己限制为仅格式化文件顶部包含特殊注释（称为 pragma）的文件。这在将大型、未格式化的代码库逐渐过渡到 Prettier 时非常有用。
# requirePragma: <bool>

# 插入编译指示
# insertPragma: <bool>

# markdown 文本的换行
# 默认情况下，Prettier 不会更改 markdown 文本的换行，因为某些服务使用换行敏感的渲染器，例如 GitHub 评论和 BitBucket。要让 Prettier 将散文包装到打印宽度，请将此选项更改为“始终”。如果您希望 Prettier 强制所有散文块在一行上并依赖编辑器/查看器软包装，您可以使用"never".
# "always"- 如果散文超过打印宽度，则换行。
# "never"- 将每个散文块展开成一行。
# "preserve"- 什么都不做，让散文保持原样。首次在 v1.9.0 中可用
proseWrap: "preserve"

# HTML 空白敏感性
# 指定 HTML、Vue、Angular 和 Handlebars 的全局空格敏感性。有关详细信息，请参阅空格敏感格式。
# "css"- 尊重 CSSdisplay属性的默认值。对于与处理相同的车把strict。
# "strict"- 所有标签周围的空格（或缺少空格）被认为是重要的。
# "ignore"- 所有标签周围的空白（或缺少它）被认为是微不足道的。
htmlWhitespaceSensitivity: "css"

# Vue 文件脚本和样式标签缩进
# 是否缩进 Vue 文件中的代码<script>和<style>标签。有些人（比如Vue 的创建者）不会缩进来保存缩进级别，但这可能会破坏编辑器中的代码折叠。
# false- 不要在 Vue 文件中缩进脚本和样式标签。
# true- 在 Vue 文件中缩进脚本和样式标签。
vueIndentScriptAndStyle: false

# 行结束
# "lf"– 仅换行 ( \n)，常见于 Linux 和 macOS 以及 git repos 内部
# "crlf"- 回车 + 换行字符 ( \r\n)，常见于 Windows
# "cr"- 仅回车字符 ( \r)，很少使用
# "auto"- 保持现有的行尾（一个文件中的混合值通过查看第一行之后使用的内容进行标准化）
endOfLine: "lf"

# 嵌入式语言格式
# 控制 Prettier 是否格式化文件中嵌入的引用代码。
# "auto"- 如果 Prettier 可以自动识别嵌入代码，请格式化它。
# "off"- 永远不要自动格式化嵌入代码。
embeddedLanguageFormatting: "auto"

# 每行单个属性
# 在 HTML、Vue 和 JSX 中每行强制执行单个属性。
# false- 不要每行强制执行单个属性。
# true- 每行强制执行单个属性。
singleAttributePerLine: false
```

创建 Prettier 过滤规则：

在项目根目录添加一个 `.prettierignore` 文件，内容如下：

```shell
## OS
.DS_Store
.idea
.editorconfig
pnpm-lock.yaml
.npmrc

# Ignored suffix
*.log
*.md
*.svg
*.png
*.ico
*ignore

## Local
.husky

## Built-files
.cache
dist
```

自动格式化：

Visual Studio Code 在 `settings.json` 设置文件中，增加以下代码：

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  }
}
```

### 集成 Stylelint

Stylelint 是一个强大、先进的 CSS 代码检查器（linter），可以帮助你规避 CSS 代码中的错误并保持一致的编码风格。

安装：

| 依赖                              | 作用描述                                                     |
| --------------------------------- | ------------------------------------------------------------ |
| stylelint                         | stylelint 核心库                                             |
| stylelint-config-html             | Stylelint 的可共享 HTML（和类似 HTML）配置，捆绑 postcss-html 并对其进行配置。 |
| stylelint-config-recommended-scss | 扩展 stylelint-config-recommended 共享配置，并为 SCSS 配置其规则 |
| stylelint-config-recommended-vue  | 扩展 stylelint-config-recommended 共享配置，并为 Vue 配置其规则 |
| stylelint-config-standard         | 打开额外的规则来执行在规范和一些 CSS 样式指南中发现的通用约定，包括：惯用 CSS 原则，谷歌的 CSS 样式指南，Airbnb 的样式指南，和 @mdo 的代码指南。 |
| stylelint-config-standard-scss    | 扩展 stylelint-config-standard 共享配置，并为 SCSS 配置其规则 |
| postcss                           | postcss-html 的依赖包                                        |
| postcss-html                      | 用于解析 HTML（和类似 HTML）的 PostCSS 语法                  |
| stylelint-config-recess-order     | 属性的排序（插件包）                                         |
| stylelint-config-prettier         | 关闭所有不必要的或可能与 Prettier 冲突的规则                 |

在目录的 .vscode 文件中新建 settings.json：

```
{
	"editor.formatOnSave": true,
	"stylelint.enable": true,
	"editor.codeActionsOnSave": {
		"source.fixAll.stylelint": true
	},
	"stylelint.validate": ["css", "less", "postcss", "scss", "vue", "sass", "html"],
	"files.eol": "\n"
}
```

> 😎 也可以在 vscode 中全局配置上述 json 代码

配置 stylelint.config.js

```js
// @see: https://stylelint.io

module.exports = {
	/* 继承某些已有的规则 */
	extends: [
		"stylelint-config-standard", // 配置stylelint拓展插件
		"stylelint-config-html/vue", // 配置 vue 中 template 样式格式化
		"stylelint-config-standard-scss", // 配置stylelint scss插件
		"stylelint-config-recommended-vue/scss", // 配置 vue 中 scss 样式格式化
		"stylelint-config-recess-order", // 配置stylelint css属性书写顺序插件,
		"stylelint-config-prettier" // 配置stylelint和prettier兼容
	],
	overrides: [
		// 扫描 .vue/html 文件中的<style>标签内的样式
		{
			files: ["**/*.{vue,html}"],
			customSyntax: "postcss-html"
		}
	],
	/**
	 * null  => 关闭该规则
	 */
	rules: {
		"no-descending-specificity": null, // 禁止在具有较高优先级的选择器后出现被其覆盖的较低优先级的选择器
		"function-url-quotes": "always", // 要求或禁止 URL 的引号 "always(必须加上引号)"|"never(没有引号)"
		"string-quotes": "double", // 指定字符串使用单引号或双引号
		"unit-case": null, // 指定单位的大小写 "lower(全小写)"|"upper(全大写)"
		"color-hex-case": "lower", // 指定 16 进制颜色的大小写 "lower(全小写)"|"upper(全大写)"
		"color-hex-length": "long", // 指定 16 进制颜色的简写或扩写 "short(16进制简写)"|"long(16进制扩写)"
		"rule-empty-line-before": "never", // 要求或禁止在规则之前的空行 "always(规则之前必须始终有一个空行)"|"never(规则前绝不能有空行)"|"always-multi-line(多行规则之前必须始终有一个空行)"|"never-multi-line(多行规则之前绝不能有空行。)"
		"font-family-no-missing-generic-family-keyword": null, // 禁止在字体族名称列表中缺少通用字体族关键字
		"block-opening-brace-space-before": "always", // 要求在块的开大括号之前必须有一个空格或不能有空白符 "always(大括号前必须始终有一个空格)"|"never(左大括号之前绝不能有空格)"|"always-single-line(在单行块中的左大括号之前必须始终有一个空格)"|"never-single-line(在单行块中的左大括号之前绝不能有空格)"|"always-multi-line(在多行块中，左大括号之前必须始终有一个空格)"|"never-multi-line(多行块中的左大括号之前绝不能有空格)"
		"property-no-unknown": null, // 禁止未知的属性(true 为不允许)
		"no-empty-source": null, // 禁止空源码
		"declaration-block-trailing-semicolon": null, // 要求或不允许在声明块中使用尾随分号 string："always(必须始终有一个尾随分号)"|"never(不得有尾随分号)"
		"selector-class-pattern": null, // 强制选择器类名的格式
		"scss/at-import-partial-extension": null, // 解决不能引入scss文件
		"value-no-vendor-prefix": null, // 关闭 vendor-prefix(为了解决多行省略 -webkit-box)
		"selector-pseudo-class-no-unknown": [
			true,
			{
				ignorePseudoClasses: ["global", "v-deep", "deep"]
			}
		]
	}
};
```

创建 Stylelint 过滤规则

在项目根目录添加一个 `.stylelintignore` 文件，内容如下：

```plain
# .stylelintignore
# 旧的不需打包的样式库
*.min.css

# 其他类型文件
*.js
*.jpg
*.woff

# 测试和打包目录
/test/
/dist/*
/public/*
public/*
/node_modules/
```

### 集成 husky 和 lint-staged

在项目中已集成 ESLint 和 Prettier，在编码时，这些工具可以对代码进行实时校验，在一定程度上能有效规范所写代码，但有些人可能觉得这些限制很麻烦，从而选择视“提示”而不见，依旧按自己编程风格来写代码，或者干脆禁用掉这些工具，开发完成就直接把代码提交到了仓库，日积月累，ESLint 也就形同虚设。

所以，还需要做一些限制，让没通过 ESLint 检测和修复的代码禁止提交，从而保证仓库代码都是符合规范的。

为了解决这个问题，需要用到 Git Hook，在本地执行 `git commit` 的时候，就对所提交的代码进行 ESLint 检测和修复（即执行 `eslint --fix`），如果这些代码没通过 ESLint 规则校验，则禁止提交。

安装：

```sh
git init
pnpm add husky -D

# 编辑 package.json > prepare 脚本并运行一次
# 设置 scripts 中 "prepare": "husky install"
npm run prepare
```

安装：

lint-staged 一般结合 husky 来使用，它可以让 husky 的 `hook` 触发的命令只作用于 `git` 暂存区的文件，而不会影响到其他文件。

安装：

```bash
pnpm add lint-staged -D
```

新增配置:

添加 ESlint Hook（在.husky 文件夹下添加 pre-commit 文件）：

作用：通过钩子函数，判断提交的代码是否符合规范，并使用 prettier 格式化代码

```sh
npx husky add .husky/pre-commit "npx lint-staged"
```

新增 **lint-staged.config.js** 文件：

```js
module.exports = {
  '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write'],
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': ['prettier --write--parser json'],
  'package.json': ['prettier --write'],
  '*.vue': ['eslint --fix', 'prettier --write', 'stylelint --fix'],
  '*.{scss,less,styl,html}': ['stylelint --fix', 'prettier --write'],
  '*.md': ['prettier --write'],
}
```

## 提交规范

多人协作项目中，在提交代码环节，也存在一种情况：不能保证每个人对提交信息的准确描述，因此会出现提交信息紊乱、风格不一致的情况。

如果 `git commit` 的描述信息精准，在后期维护和 Bug 处理时会变得有据可查，项目开发周期内还可以根据规范的提交信息快速生成开发日志，从而方便我们追踪项目和把控进度。

### Commit Message 格式规范

`commit message` 由 Header、Body、Footer 组成。

```css
<Header>

<Body>

<Footer>
```

#### Header

Header 部分包括三个字段 type（必需）、scope（可选）和 subject（必需）。

```xml
<type>(<scope>): <subject>
```

**type**

type 用于说明 commit 的提交类型（必须是以下几种之一）。

| 值       | 描述                                                         |
| -------- | ------------------------------------------------------------ |
| feat     | 新增特性（A new feature）                                    |
| fix      | 修复 bug（A bug fix）                                        |
| docs     | 仅包含文档的修改（Documnetation only changes）               |
| style    | 修改代码格式，不影响代码逻辑（white-space,formatting,missing semi colons,ect） |
| refactor | 代码重构（refactor）                                         |
| perf     | 提高性能的修改（A code change that improves performance）    |
| test     | 添加或修改测试代码（Adding missing tests or correcting existing tests） |
| build    | 构建工具或外部依赖包的修改（例如 scopes: webpack、gulp、npm 等） |
| ci       | 更改持续集成软件的配置文件或 package 中的 scripts 命令，例如 scopes: Travis, Circle 等 |
| chore    | 变更构建流程或辅助工具，杂项                                 |
| revert   | 代码回退，撤销某次提交                                       |

**scope**

scope 用于指定本次 commit 影响的范围。

scope 依据项目而定，例如在业务项目中可以依据菜单或者功能模块划分，如果是组件库开发，则可以依据组件划分。

**subject**

subject 是本次 commit 的简洁描述，长度约定在 50 个字符以内，通常遵循以下几个规范：

- 用动词开头，第一人称现在时表述，例如：change 代替 changed 或 changes
- 第一个字母小写
- 结尾不加句号（.）

#### Body

body 是对本次 commit 的详细描述，可以分成多行。

跟 subject 类似，用动词开头，body 应该说明修改的原因和更改前后的行为对比。

#### Footer

如果本次提交的代码是突破性的变更或关闭缺陷，则 Footer 必需，否则可以省略。

- 突破性的变更

  当前代码与上一个版本有突破性改变，则 Footer 以 BREAKING CHANGE 开头，后面是对变动的描述、以及变动的理由。

- 关闭缺陷

  如果当前提交是针对特定的 issue，那么可以在 Footer 部分填写需要关闭的单个 issue 或一系列 issues。

#### 参考例子

- feat

  ```vbnet
  feat(browser): onUrlChange event (popstate/hashchange/polling)
  
  Added new event to browser:
  - forward popstate event if available
  - forward hashchange event if popstate not available
  - do polling when neither popstate nor hashchange available
  
  Breaks $browser.onHashChange, which was removed (use onUrlChange instead)
  ```
  
- fix

  ```vbnet
  fix(compile): couple of unit tests for IE9
  
  Older IEs serialize html uppercased, but IE9 does not...
  Would be better to expect case insensitive, unfortunately jasmine does
  not allow to user regexps for throw expectations.
  
  Closes #392
  Breaks foo.bar api, foo.baz should be used instead
  复制代码
  ```

- style

  ```scss
  style(location): add couple of missing semi colons
  ```
  
- chore

  ```scss
  chore(release): v3.4.2
  ```

### 集成 cz-git 实现规范提交

> 一款工程性更强，轻量级，高度自定义，标准输出格式的 [commitizen](https://github.com/commitizen/cz-cli) 适配器
>
> 官方网站：[cz-git](https://cz-git.qbb.sh/zh/)

![cz-git](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12d9e35b52304043a0ee99b1d0bde6b9~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp)

安装：

```bash
pnpm add cz-git -D

// 安装 commitizen，如此一来可以快速使用 cz 或 git cz 命令进行启动。
pnpm add commitizen -D
```

修改 `package.json` 文件，添加 `config` 指定使用的适配器

```json
{
  "scripts": {},
  "config": {
    "commitizen": {
      "path": "node_modules/cz-git"
    }
  }
}
```

自定义配置（可选）

新建 `commitlint.config.js` 文件

```js
// @see: https://cz-git.qbenben.com/zh/guide
/** @type {import('cz-git').UserConfig} */

module.exports = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [2, 'always', 108],
    'subject-empty': [2, 'never'],
    'type-empty': [2, 'never'],
    'subject-case': [0],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'build',
        'ci',
        'chore',
        'revert',
        'wip',
        'workflow',
        'types',
        'release',
      ],
    ],
  },
  prompt: {
    messages: {
      type: "Select the type of change that you're committing:",
      scope: 'Denote the SCOPE of this change (optional):',
      customScope: 'Denote the SCOPE of this change:',
      subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
      body: 'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
      breaking: 'List any BREAKING CHANGES (optional). Use "|" to break new line:\n',
      footerPrefixsSelect: 'Select the ISSUES type of changeList by this change (optional):',
      customFooterPrefixs: 'Input ISSUES prefix:',
      footer: 'List any ISSUES by this change. E.g.: #31, #34:\n',
      confirmCommit: 'Are you sure you want to proceed with the commit above?',
      // 中文版
      // type: "选择你要提交的类型 :",
      // scope: "选择一个提交范围（可选）:",
      // customScope: "请输入自定义的提交范围 :",
      // subject: "填写简短精炼的变更描述 :\n",
      // body: '填写更加详细的变更描述（可选）。使用 "|" 换行 :\n',
      // breaking: '列举非兼容性重大的变更（可选）。使用 "|" 换行 :\n',
      // footerPrefixsSelect: "选择关联issue前缀（可选）:",
      // customFooterPrefixs: "输入自定义issue前缀 :",
      // footer: "列举关联issue (可选) 例如: #31, #I3244 :\n",
      // confirmCommit: "是否提交或修改commit ?"
    },
    types: [
      {
        value: 'feat',
        name: 'feat:     🚀  A new feature',
        emoji: '🚀',
      },
      {
        value: 'fix',
        name: 'fix:      🧩  A bug fix',
        emoji: '🧩',
      },
      {
        value: 'docs',
        name: 'docs:     📚  Documentation only changes',
        emoji: '📚',
      },
      {
        value: 'style',
        name: 'style:    🎨  Changes that do not affect the meaning of the code',
        emoji: '🎨',
      },
      {
        value: 'refactor',
        name: 'refactor: ♻️   A code change that neither fixes a bug nor adds a feature',
        emoji: '♻️',
      },
      {
        value: 'perf',
        name: 'perf:     ⚡️  A code change that improves performance',
        emoji: '⚡️',
      },
      {
        value: 'test',
        name: 'test:     ✅  Adding missing tests or correcting existing tests',
        emoji: '✅',
      },
      {
        value: 'build',
        name: 'build:    📦️   Changes that affect the build system or external dependencies',
        emoji: '📦️',
      },
      {
        value: 'ci',
        name: 'ci:       🎡  Changes to our CI configuration files and scripts',
        emoji: '🎡',
      },
      {
        value: 'chore',
        name: "chore:    🔨  Other changes that don't modify src or test files",
        emoji: '🔨',
      },
      {
        value: 'revert',
        name: 'revert:   ⏪️  Reverts a previous commit',
        emoji: '⏪️',
      },
      // 中文版
      // { value: "特性", name: "特性:   🚀  新增功能", emoji: "🚀" },
      // { value: "修复", name: "修复:   🧩  修复缺陷", emoji: "🧩" },
      // { value: "文档", name: "文档:   📚  文档变更", emoji: "📚" },
      // { value: "格式", name: "格式:   🎨  代码格式（不影响功能，例如空格、分号等格式修正）", emoji: "🎨" },
      // { value: "重构", name: "重构:   ♻️  代码重构（不包括 bug 修复、功能新增）", emoji: "♻️" },
      // { value: "性能", name: "性能:   ⚡️  性能优化", emoji: "⚡️" },
      // { value: "测试", name: "测试:   ✅  添加疏漏测试或已有测试改动", emoji: "✅" },
      // { value: "构建", name: "构建:   📦️  构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等）", emoji: "📦️" },
      // { value: "集成", name: "集成:   🎡  修改 CI 配置、脚本", emoji: "🎡" },
      // { value: "回退", name: "回退:   ⏪️  回滚 commit", emoji: "⏪️" },
      // { value: "其他", name: "其他:   🔨  对构建过程或辅助工具和库的更改（不影响源文件、测试用例）", emoji: "🔨" }
    ],
    useEmoji: true,
    emojiAlign: 'center',
    themeColorCode: '',
    scopes: [],
    allowCustomScopes: true,
    allowEmptyScopes: true,
    customScopesAlign: 'bottom',
    customScopesAlias: 'custom',
    emptyScopesAlias: 'empty',
    upperCaseSubject: false,
    allowBreakingChanges: ['feat', 'fix'],
    breaklineNumber: 100,
    breaklineChar: '|',
    skipQuestions: [],
    issuePrefixs: [{ value: 'closed', name: 'closed:   ISSUES has been processed' }],
    customIssuePrefixsAlign: 'top',
    emptyIssuePrefixsAlias: 'skip',
    customIssuePrefixsAlias: 'custom',
    allowCustomIssuePrefixs: true,
    allowEmptyIssuePrefixs: true,
    confirmColorize: true,
    maxHeaderLength: Infinity,
    maxSubjectLength: Infinity,
    minSubjectLength: 0,
    scopeOverrides: undefined,
    defaultBody: '',
    defaultIssues: '',
    defaultScope: '',
    defaultSubject: '',
  },
}
```

全局使用（可选）

> 全局安装的好处在于：在任何项目下都可以利用 `cz` 或 `git cz` 命令启动命令行工具，生成标准化 commit message

安装全局依赖

```sh
pnpm add cz-git commitizen -g
```

全局配置适配器类型

```sh
echo '{ "path": "cz-git" }' > ~/.czrc
```

自定义配置（可选）

**方式一：** 编辑 `~/.czrc` 文件以 **json** 形式添加配置，例如：

```json
{
  "path": "cz-git",
  "useEmoji": true
}
```

**方式二：与 commitlint 配合**，在 `$HOME` 路径下创建配置文件 ([↓ 配置模板](https://cz-git.qbb.sh/zh/config/))

### 集成 commitlint 验证规范提交

在“代码规范”章节中提到，尽管制定了规范，但在多人协作的项目中，总有些人依旧我行我素。

因此提交代码这个环节，也增加一个限制：**只让符合 Angular 规范的 commit message 通过**。

此功能需借助 `@commitlint/config-conventional` 和 `@commitlint/cli` 工具来实现。

安装：

- [`@commitlint/cli`](https://link.juejin.cn/?target=https%3A%2F%2Fcommitlint.js.org) - Commitlint 本体
- [`@commitlint/config-conventional`](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fconventional-changelog%2Fcommitlint) - 通用提交规范

```bash
pnpm add @commitlint/cli @commitlint/config-conventional -D
```

配置：

使用 husky 命令在 `.husky` 目录下创建 `commit-msg` 文件，并在此执行验证命令：

```bash
npx husky add .husky/commit-msg “npx --no-install commitlint --edit $1”
```

在 `package.json` 中添加

```json
"script": {
  "cz": "git-cz"
}
```

这时当要 commit 的时候只需要 `npm run cz`即可。

## 自动部署

本章节将介绍如何使用 CI（Continuous Integration 持续集成）服务来完成项目部署工作。

常见的 CI 工具有 GitHub Actions、GitLab CI、Travis CI、Circle CI 等。

本项目使用 `GitHub Actions` 来完成这一操作。

🔗 参考链接：[GitHub Actions 入门教程](https://www.ruanyifeng.com/blog/2019/09/getting-started-with-github-actions.html)

<details>
<summary>很多时候并用不到自动部署这一环节，如果需要的话，可以浏览</summary>

### 创建 GitHub 仓库

因为 GitHub Actions 只对 GitHub 仓库有效，所以[创建 GitHub 仓库](https://github.com/new)来托管项目代码。

- `master` 分支存储项目源代码
- `gh-pages` 分支存储打包后的静态文件

### 创建 GitHub Token

创建一个有 **repo** 和 **workflow** 权限的 [GitHub Token](https://github.com/settings/tokens/new)

> 注意：新生成的 Token 只会显示一次。

### 添加 Actions secret

将上述创建的 Token 添加到 GitHub 仓库中的 `Secrets` 里，并将这个新增的 `secret` 命名为 `VITE_VUE_DEPLOY` 。

步骤：仓库 -> `Settings` -> `Secrets` -> `Actions` -> `New repository secret`。

> 注意：新创建的 secret `VITE_VUE_DEPLOY` 在 Actions 配置文件中要用到，两个地方需保持一致！

### 修改 package.json

打开 `package.json` 文件，新增 `homepage` 字段，表示该应用发布后的根目录（参见[官方文档](https://create-react-app.dev/docs/deployment#building-for-relative-paths)）。

```json
"homepage": "https://[username].github.io/github-actions-demo",
```

上面代码中，将 `[username]` 替换成你的 GitHub 用户名。

### 创建 Actions 配置文件

（1）在项目根目录下创建 `.github` 目录。

（2）在 `.github` 目录下创建 `workflows` 目录。

（3）在 `workflows` 目录下创建 `deploy.yml` 文件。

```yaml
name: Vite Vue Deploy

on:
  push:
    # master 分支有 push 时触发
    branches: [master]

jobs:
  deploy:
    # 指定虚拟机环境
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [14.x, 16.x]

    steps:
      - name: Checkout
        # 拉取 GitHub 仓库代码
        uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        # 设定 Node.js 环境
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}

      - name: Install
        # 安装依赖
        run: npm install

      - name: Build
        # 打包
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          # 部署打包目录
          folder: dist
          # 密钥名
          token: ${{ secrets.VITE_VUE_DEPLOY }}
          # 分支
          branch: gh-pages
```

</details>

## 写在最后

经历了一步一步的配置，终于我们拥有了一个统一的项目规范。虽然过程很麻烦，但是为了以后合作开发的顺利进行，以及为了降低后续维护工作的困难度，这些过程也算是变得有价值了一些。

最后，希望每一个人的开发过程都可以流畅，顺利。这篇文章就到这里吧，我们下次再见。
