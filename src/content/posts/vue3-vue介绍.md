---
title: vue3-vue介绍
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# 、Vue 3 基础定位（官方标准）

Vue 是一套用于构建用户界面的渐进式框架，核心关注视图层，自底向上逐层应用，易上手、易整合、可支撑大型单页应用。

MVVM 架构（官方理解）
View：视图层 → 模板 / UI（只负责展示）
ViewModel：视图模型 → Vue 响应式系统 + 渲染逻辑（自动同步 View 与 Model）
Model：数据层 → 业务数据、接口、状态（ref/reactive 定义的响应式数据）
核心：数据驱动视图，View 与 Model 不直接通信，由 ViewModel 自动双向同步。

# Vue 2 vs Vue 3：API 范式对比
1. Options API（Vue 2 传统）
按选项分类：data、methods、computed、watch、created…问题：同一功能逻辑被拆碎，大型组件难维护、复用差、TS 不友好。
2. Composition API（Vue 3 主推）
按业务逻辑聚合代码，用函数式 API 组织状态与行为，配合 <script setup> 语法糖，逻辑内聚、复用强、TS 原生友好、Tree‑shaking 友好。

三、Vue 3 响应式系统：Proxy 重写双向绑定（官方核心)

1. 原理对比
Vue 2：Object.defineProperty → 逐个属性劫持，无法监听数组索引 / 长度、新增 / 删除属性
Vue 3：Proxy + Reflect → 代理整个对象，支持全场景拦截，天然监听数组、动态属性、删除

2. Proxy 官方优势
一次代理整个对象，无需递归遍历初始化
支持监听：新增属性、删除属性、数组索引 /length、in 操作等
配合 Reflect 保持原生行为、避免 this 指向异常
惰性响应式：访问嵌套对象时才代理，提升首屏性能

# 四、虚拟 DOM 编译优化：PatchFlag + 静态提升

1. Vue 2 问题
全量 Diff：每次更新遍历整棵 VNode，静态内容也反复对比，浪费性能。

2. Vue 3 编译优化（官方三大件）
静态提升（HoistStatic）
静态节点只创建一次，渲染时直接复用，不参与 Diff。

PatchFlag（补丁标记）
编译期给动态节点打位标记，运行时只对比动态部分，跳过静态节点。
常用标记：
TEXT=1：仅动态文本
CLASS=2：仅动态 class
STYLE=4：仅动态 style
PROPS=8：动态属性（不含 class/style）

Block Tree
把模板拆成稳定块，Diff 复杂度从 O (n) 降到 O (动态节点数)。

# 五、Fragment（多根节点）官方规范
Vue 3 模板允许多个根节点，不再必须套一层 div，DOM 结构更干净。

      <template>
      <div>根1</div>
      <div>根2</div>
      </template>

同时原生支持 render 函数 / JSX 写法，支持多根返回。

# 六、Tree‑shaking 支持（官方标准)

Vue 3 源码全模块拆分、按需引入，未使用的 API 不会被打包，生产包体积更小。

    // 只引入用到的 API
    import { ref, computed, watch } from 'vue'

Vue 2 是单例对象，捆绑工具无法剔除未用属性，包体积更大。

# Composition API 核心（官方最新）

1. 核心 API（标准用法）
ref：基本类型响应式，访问用 .value
reactive：对象 / 数组深层响应式
computed：计算属性
watch / watchEffect：侦听
toRefs / toRaw：响应式解构与原始对象
生命周期：onMounted、onUpdated、onUnmounted…

2. <script setup> 语法糖（官方推荐）
无需 setup() 函数、无需 return 暴露
组件自动导入、TS 类型完美
是 Vue 3 单文件组件标准写法

      <script setup>
      import { ref } from 'vue'
      const count = ref(0)
      const increment = () => count.value++
      </script>

# Suspense：异步组件 / 异步 setup 加载占位（稳定可用）
<Suspense> 是 Vue 3 内置组件，用于等待异步组件 / 异步 setup 执行完成，在等待期间显示加载占位 UI，加载完成后自动切换到真实内容。

一句话：异步加载时显示 loading，加载完显示内容。

适用场景
异步组件（defineAsyncComponent）
setup 是 async 函数的组件
路由懒加载配合使用
标准语法

      <Suspense>
      <!-- 成功：等待完成后显示 -->
      <template #default>
          <AsyncComponent /> <!-- 异步组件 / 异步setup组件 -->
      </template>
      
      <!-- 等待：加载中显示 -->
      <template #fallback>
          <div>加载中...</div> <!-- 占位UI，可放骨架屏 -->
      </template>
      </Suspense>
异步组件 + Suspense 完整示例

      <script setup>
      import { defineAsyncComponent } from 'vue'
      // 定义异步组件（自动代码分割，懒加载）
      const AsyncComponent = defineAsyncComponent(() => import('./AsyncComponent.vue'))
      </script>
      
      <template>
      <Suspense>
          <AsyncComponent />
          <template #fallback>
          页面加载中...
          </template>
      </Suspense>
      </template>
异步 setup 组件

      <script async>
      // 异步请求
      const data = await fetch('/api/data').then(res => res.json())
      </script>
  
父组件用 Suspense 包裹，会自动等待请求完成再渲染。

官方重要注意点
Suspense 是实验性稳定功能，推荐在业务中使用
必须包裹异步依赖的组件，否则不生效
一个 Suspense 下只能有一个根组件（default 插槽里）

# Teleport：将内容传送至任意 DOM 节点（常用于弹窗）
Teleport —— 传送门组件（官方最实用弹窗方案）
官方定义
<Teleport> 可以把组件的 DOM 结构传送到页面任意指定 DOM 节点下渲染，但逻辑、数据、作用域完全保留在当前组件。

一句话：DOM 位置搬家，逻辑不搬家。

解决的痛点
弹窗、提示框、抽屉，经常被父组件的 overflow:hidden / z-index 遮挡，用 Teleport 直接传送到 <body>，完美解决。

标准语法
<Teleport to="目标选择器">
  要传送的内容
</Teleport>

最常用示例：弹窗

      <Teleport to="body">
      <div class="modal">
          我是弹窗，DOM 直接渲染在 body 下，不会被遮挡！
      </div>
      </Teleport>
      
官方关键特性
to 接收选择器：body、#app、.modal-target
disabled：可禁用传送，变回普通组件

    <Teleport to="body" :disabled="isDisabled">
    
多 Teleport 可挂载到同一个目标，会按顺序拼接

样式、事件、响应式全部正常工作

最佳实践
弹窗、全局提示、抽屉 → 全部用 Teleport 送到 body
避免 CSS 层级冲突、溢出隐藏问题

# 多 v-model：一个组件可绑定多个 v-model，简化双向通信

官方定义
Vue 3 支持在一个组件上使用多个 v-model，分别绑定不同数据，实现多属性双向同步，替代了 Vue 2 繁琐的 .sync。

解决的痛点
一个组件既要改 name、又要改 age、又要改 visible，以前要写一堆 emit，现在直接多 v-model。

标准语法
父组件：

    <Child
      v-model:name="userName"
      v-model:age="userAge"
    />
子组件接收：
<script setup>
const props = defineProps(['name', 'age'])
const emit = defineEmits(['update:name', 'update:age'])

// 修改 name
const updateName = (val) => {
  emit('update:name', val)
}
</script>

官方简化写法（Vue 3.4+）
Vue 3.4 推出 defineModel，代码减少 80%：

子组件：
      <script setup>
      const name = defineModel('name')
      const age = defineModel('age')
      </script>
      
      <template>
      <input v-model="name" />
      <input v-model="age" />
      </template>

父组件：

      <Child v-model:name="name" v-model:age="age" />
      
直接赋值，无需写 emit！ 官方最强双向绑定语法。 
      
适用场景
      表单组件
      弹窗组件（v-model:visible）
      复杂筛选面板
# 更好的 TS：全量类型定义，自动推导，无需额外配置
官方定位
Vue 3 全量使用 TS 重写，自带完整类型定义，无需配置、无需插件，在 <script setup> 中享受原生 TS 支持。

四大核心优势
1. 类型自动推导（无需声明）
<script setup>
import { ref } from 'vue'
const count = ref(0) // 自动推导为 Ref<number>
count.value = '123' // ❌ 直接报错：不能赋值字符串
</script>

2. 组件 Props 类型定义（官方标准）
<script setup lang="ts">
interface User {
  name: string
  age: number
}
const props = defineProps<{
  user: User
  visible: boolean
}>()
</script>

父组件传错类型 → 编辑器直接报错。

3. defineEmits 类型定义
<script setup lang="ts">
const emit = defineEmits<{
  change: [id: number]
  update: [name: string]
}>()
</script>
4. 计算属性、异步函数、引用全部自动推导类型

所有 API 自带类型，不用写任何泛型，TS 零成本上手。

Vue 3 + TS 官方最佳实践
单文件组件使用 <script setup lang="ts">
用 interface 定义数据类型
Props 用泛型 defineProps<Type>()
复杂状态用 reactive + 接口
