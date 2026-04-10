---
title: Vue3-配置环境
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# Vite核心优势
1. 原生ESM优先:开发环境免打包,浏览器原生加载模块,极速冷启动.

**冷启动 = 应用 / 服务从完全关闭状态，首次加载、编译、依赖分析、初始化、启动服务的全过程。**

**HMR 热更新 = 在应用运行期间，实时替换、添加、删除模块，而无需完全刷新页面或重启服务。**

2.  生产构建：基于 Rollup（新版逐步过渡到 Rolldown），开箱即用优化，兼容主流 Rollup 插件。

# Nodejs底层架构

## Node.js 本质是：V8 引擎 + 事件循环 + 异步 I/O 库 + 内置模块层 的运行时。


1.  V8 JavaScript Engine（Google）
负责编译、执行 JS 代码
JIT 即时编译：JS → 机器码
管理内存堆、调用栈、垃圾回收（GC）
不提供 I/O、网络、文件，只执行语言本身


2.  libuv（C 语言编写，Node 核心灵魂）
Node 跨平台异步 I/O 的基石
实现：**事件循环（Event Loop）**、线程池、文件 / 网络 / 定时器
所有异步操作：fs、net、http、dns 最终都走 libuv
提供：非阻塞 I/O，让单线程也能高并发

3.  内置绑定模块层（Bindings）
**C/C++ 底层能力 ↔ JS 层的桥梁**
让 JS 能调用：文件、网络、信号、进程等系统调用

4.  标准库（JS API）
fs、path、http、stream、events、buffer 等
给上层开发者使用

# Nodejs 官方事件循环模型--libuv真实顺序

Node 官方严格固定的 6 个阶段：
timers：执行 setTimeout、setInterval
pending callbacks：系统级延迟回调（如 TCP 错误）
idle/prepare：内部使用
poll：最核心阶段
等待新 I/O 事件
执行几乎所有异步回调（fs、网络等）
check：执行 setImmediate
close callbacks：执行 close 事件（如 socket.destroy）

微任务（官方优先级）
process.nextTick > Promise.then/finally/catch
每完成一个宏任务，就清空所有微任务队列
一句话：微任务永远插队在宏任务之间。

3. 单线程模型（官方重点）
JS 主线程永远只有 1 个
所有 JS 代码串行执行，绝不并行
但 I/O 操作不是 JS 线程执行，交给 libuv 线程池
因此：Node 是单线程执行 + 多线程异步 I/O

优点：
无锁、无竞争、无死锁
极高并发、极轻量连接

缺点：
CPU 密集任务会阻塞整个事件循环
→ 解决方案：worker_threads、cluster、任务拆分

# 4. 模块化演进

传统工具（Webpack/Rollup）在开发时必须**全量打包、生成依赖图、合并 bundle才能启动服务。**
项目越大、模块越多，启动越慢（几十秒很常见）
热更新需重新打包相关依赖，速度随项目膨胀而下降
**浏览器不原生支持 CommonJS，必须全程依赖打包器翻译**

## Node 官方模块化历史分三代：
1.  CommonJS（CJS）
同步加载：require()、module.exports
运行时解析，不能静态分析
不支持 Tree-shaking
浏览器不原生支持

2.  ES Modules（ESM）
官方标准：import / export
静态、编译期确定依赖
支持 Tree-shaking、顶层 await、异步加载
浏览器原生支持 → 这就是 Vite 快的根源

3.  Node 现在的官方策略（2026）
默认推荐 ESM
CommonJS 进入兼容维护模式
Vite、Next、Nuxt、Vue 全栈全面 ESM 化

5. 内存与 GC（官方简述）
V8 负责内存管理
分代回收：新生代（Scavenger）、老生代（Mark-Sweep/Mark-Compact）
避免：内存泄漏、全局变量、未清理监听、大缓存
