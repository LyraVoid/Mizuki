---
title: Vue3-模板语法
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

---

# 一、模板插值语法 {{ }}
## 官方定义
**Mustache 语法（双大括号）**：用于将组件数据**文本渲染**到视图。

### 官方规则
1. **里面只能写表达式（Expression）**
   不能写语句（if/for/var）。
2. **会自动转义 HTML**，防止 XSS。
3. **数据变化 → 视图自动更新**。

---

## 文章里的 4 种用法

### 1. 基础变量渲染
```vue
<div>{{ message }}</div>
```
- 从 `<script setup>` 取变量，渲染到页面。

### 2. 三元表达式（合法表达式）
```vue
<div>{{ message === 0 ? '是' : '否' }}</div>
```
- 三元运算属于**表达式**，Vue 官方明确支持。

### 3. 数学运算
```vue
<div>{{ message + 1 }}</div>
```
- 本质还是 JS 表达式。

### 4. 调用方法 / 字符串方法
```vue
<div>{{ message.split('，') }}</div>
```
- 只要返回值可渲染，都可以写。

---

# 二、Vue 官方指令大全
所有 `v-` 开头都是 **Vue 内置指令**，官方规定。

## 1. v-text
- 等价 `{{ text }}`
- 覆盖元素 innerText，**不解析 HTML**

## 2. v-html（官方警告：慎用！）
- 渲染富文本、HTML 片段
- **存在 XSS 风险**，只对可信内容使用

## 3. v-if / v-else-if / v-else
**官方定义：条件渲染，真的创建/销毁 DOM**
- 切换成本高
- 不满足条件**不会渲染到页面**

## 4. v-show
**CSS 显示隐藏：display: none / block**
- 无论真假都会创建 DOM
- 频繁切换用 v-show 性能更好

## 5. v-on：事件绑定（简写 @）
- 官方标准：`v-on:click` = `@click`
- 支持事件修饰符

### 文章里的修饰符（官方标准）
- `.stop` → 阻止冒泡（调用 `event.stopPropagation()`）
- `.prevent` → 阻止默认行为（`event.preventDefault()`）

## 6. v-bind：属性绑定（简写 :）
- 动态绑定标签属性：src、href、class、style
- 简写 `:`

### 绑定 class 的两种官方写法
1. 数组写法
```vue
<div :class=[a ? 'c1' : 'c2', 'c3']"></div>
```
2. 对象写法
```vue
<div :class={ c1: a, c2: b }"></div>
```

### 绑定 style（对象写法）
```vue
<div :style="{ color: 'red' }"></div>
```

## 7. v-model：双向绑定
**官方核心机制**
- 视图变 → 数据变
- 数据变 → 视图变
- 底层：`v-bind` + `@input`

必须配合**响应式数据**：`ref` / `reactive`

## 8. v-for：列表渲染
- 遍历数组/对象/数字
- **官方必须写 key**（文章没提，但必须记住）

## 9. v-once
- 只渲染一次
- 之后数据变化**不再更新**
- 用于静态内容优化

## 10. v-memo（Vue3 新增）
- 缓存模板块
- 依赖不变就不重新渲染
- 性能优化用

---

# 三、底层 JS 知识（ECMAScript 标准）
## 1. {{ }} 里写的是 **表达式**
ECMA 定义：
- **表达式**：有返回值（a+1、fn()、三元）
- **语句**：没有返回值（if、for、var）

Vue 只支持表达式。

## 2. 响应式数据必须用 ref / reactive
- `const message = 'xxx'` → 不是响应式
- `const message = ref('xxx')` → 响应式

这是 Vue3 **Proxy 响应式系统**的标准规则。

## 3. 事件对象 event
- `@click` 会自动传入 event
- `.stop` / `.prevent` 都是操作原生 event

## 4. 类型语法属于 TypeScript
- `const flag: boolean`
- 属于 ES 超集，不影响运行时
