---
title: Vue3-项目讲解
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# Vite 项目目录结构与作用

    ├── public/       静态资源，**不编译、不加工**，直接复制到 dist
    ├── src/
    │   ├── assets/  会被 Vite 编译、压缩、加哈希的资源（图片/样式）
    │   ├── components/  公共组件
    │   ├── App.vue  根组件
    │   ├── main.ts  项目入口 JS/TS
    │   └── index.html **Vite 唯一入口文件**
    ├── vite.config.ts  Vite 配置文件
    └── package.json
  
  关键概念：Vite 以 index.html 为入口
  
  - Webpack/Rollup 入口是 JS 文件
  - Vite 入口是 HTML
  - **浏览器请求 HTML → 遇到 <script type="module"> → 浏览器主动请求模块 → Vite 拦截并按需编译**
  - 
  这就是 Vite 冷启动快的原因。 很聪明的作用, 使用script 异步发送依赖请求,做到按需编译更新
  
  
# Vue 单文件组件（SFC）规范

一个 .vue 文件由 4 部分组成：
## 1. <template>
只能有一个
写模板，最终编译成 render 函数

## 2. <script>
普通选项式 API 写法
导出组件配置对象
可写多个

## 3. <script setup>（Vue3 官方推荐）
只能一个
顶层变量、函数自动暴露给模板
相当于组件的 setup() 入口
代码更简洁、编译优化更强

## 4. <style>
可写多个
scoped：样式只作用当前组件（组件隔离）
module：CSS Modules 模式


# npm run dev 到底是怎么跑起来的（底层原理）
## 1.  执行流程
运行 npm run dev
npm 读取 package.json 的 scripts
找到 "dev": "vite"
去 node_modules/.bin/ 找 vite 脚本
执行 vite.js 启动开发服务器

## 2. 关键概念：.bin 目录是什么？
node_modules/.bin/ 存放软链接 / 脚本
来自包的 package.json → bin 字段
npm install 时自动生成
作用：让你在项目里直接使用命令

## 3. 为什么不能直接敲 vite？
直接敲 vite 会去系统环境变量找
项目依赖的 vite 只在当前项目 node_modules 里
必须用 npm run dev 让 npm 帮你找到它

## 4. 多平台脚本（Windows /macOS/ Linux）
.bin 里会生成 3 个文件：
vite → macOS / Linux
vite.cmd → Windows cmd
vite.ps1 → Windows PowerShell
系统会自动匹配执行。

# 问题1:向浏览器发送请求获取依赖是什么意思？

1. 通俗比喻
Vite 开发环境下，浏览器像 “点菜的顾客”，Vite 服务器像 “大厨”。
浏览器需要某个模块（如 import { ref } from 'vue'）→ 就是 “点菜”。
浏览器直接向 Vite 服务器发送请求 → 就是 “下单”。
Vite 服务器处理并返回模块 → 就是 “上菜”。

2. 具体流程（核心！）

以 import { createApp } from 'vue' 为例：
1.  浏览器请求 HTML：
访问 http://localhost:5173，服务器返回 index.html。

2.  HTML 里有 ESM 脚本：

        <script type="module" src="/src/main.ts"></script>

3. 浏览器请求 main.ts：

Vite 服务器拦截请求，按需编译（TS → JS、Vue 模板 → 渲染函数），返回给浏览器。

4.  main.ts 里 import 了依赖：

如 import { createApp } from 'vue'。

浏览器解析到这个 import，再次自动发起请求获取 vue 模块。

5.  Vite 处理依赖请求：
Vite 会把 vue 转换成浏览器能识别的 ESM 格式，返回给浏览器。

关键特点:
浏览器主动发起请求获取每一个依赖。
Vite 服务器按需编译，不是一次性打包所有文件。

# 问题2.浏览器把依赖存放在哪里？

## 1. 存放位置：内存（Memory）

浏览器获取到 ESM 模块后，会**加载到内存中**运行，而不是保存在硬盘上（和后端服务器不同）。

具体过程

1.下载：从网络获取模块代码。
2.解析：检查语法错误，构建模块的抽象语法树（AST）。
3.编译：将代码编译成机器能执行的字节码（现代浏览器用 JIT 即时编译）。
4.实例化：创建模块的 **模块环境记录（Module Environment Record）**，绑定导出的变量。
5.执行：运行模块代码，给变量赋值。
6.缓存：同一模块只加载一次，后续 import 直接从内存读取，不重复下载和执行。

## 2. 浏览器缓存（硬盘上的缓存）

除了内存，浏览器还会在硬盘上缓存模块，以提升下次访问速度。
两种主要缓存方式

1.  HTTP 缓存
**强缓存**： 响应头含 Cache-Control: max-age=31536000，浏览器直接从硬盘读取，不发请求。
**协商缓存**：发请求问服务器 “文件变了吗？”，服务器返回 304 Not Modified，浏览器用缓存。

2.  Service Worker 缓存
高级缓存策略，可手动控制缓存哪些文件，适合 PWA 应用。

比喻
内存：像你办公桌的桌面，正在用的文件放在这里，拿取最快。
硬盘缓存：像你的文件柜，不常用但下次可能要用的文件存在这里，下次用可以直接从柜子里拿，不用再去买。
