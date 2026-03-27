---
title: Regarding the experience with Nuxt, NuxtUI, and SSR
published: 2026-01-19
description: ''
image: ''
tags: [Nuxt4,Vue,NuxtUi]
category: 'Nuxt4'
draft: false 
lang: ''
---

# Nuxt和Nuxt ui使用初体验,SSR大冒险!

# 1. 使用官方Nuxt nuxt-tiptap-editor 插件, 编写富文本编辑器导致组件自调用,堆栈溢出

2026-03-02 20:18:29  我依然没能解决使用这个插件在父组件创造富文本编辑器并进行组件通讯问题,并且在加载页面时出现:

    RangeError: Maximum call stack size exceeded

这出现了Vue组件系统中的组件自引用问题,导致堆栈溢出页面崩溃

1.  根据官方文档中的内容, 可以在nuxt.config.ts 配置文件中配置tiptap 中的prefix为:"Tiptap"
然后在commponets 文件夹中创建TiptapEditor.vue 封装相关的编辑器组件

但如果同时创建了TiptapEditor组件, 并在其中使用TiptapEditor全局注册的组件则会导致:
*1. Vue 尝试渲染 <TiptapEditor>*
*2. 加载 components/TiptapEditor.vue*
*3. 该组件的模板中又包含 <TiptapEditor>*
*4. 再次加载 components/TiptapEditor.vue*
*5. 无限递归 → 调用栈爆炸 → 浏览器崩溃*

**<h2> 关键点：Vue 会自动注册 components/ 目录下的组件为全局或局部组件。当你在 TiptapEditor.vue 中写 <TiptapEditor>，它解析的就是自己！</h2>**

2. v-model 透传:

*透传（Transparent Transmission / Pass-through） 是指：某个中间层（组件、服务、模块）在处理数据时，不对特定字段或属性做任何修改、解析或拦截，而是原封不动地将其传递给下一层。*

**v-model 在vue中的语法糖使用**

      <MyComponent v-model="value" />
       <!-- 等价于 -->
      <MyComponent :modelValue="value" @update:modelValue="value = $event" />

封装组件并透传v-model的逻辑为:

      const innerValue = computed({
      get: () => props.modelValue,
      set: (val) => emit('update:modelValue', val)
      })

**透传的价值**
| 价值 | 说明 |
|------|------|
|  解耦 | 中间层不关心业务细节，只负责传递 |
|  扩展性 | 下游新增功能，上游无需修改 |
|  兼容性 | 支持未来未知的属性/字段 |
|  性能 | 避免不必要的解析和序列化 |


3.  Nuxt4官方中 ClientOnly api 的使用:

*Nuxt 官方提供的内置组件，用于将部分内容限制在客户端（浏览器）渲染，跳过服务端渲染（SSR）阶段。*
这个api 能解决什么问题?
## 1.避免 SSR 报错:
某些代码依赖浏览器专属 API（如 window、document、localStorage），在服务端（Node.js 环境）执行时会报错：

      // 错误示例：在 setup() 中直接使用 window
      const width = window.innerWidth // ❌ ReferenceError: window is not defined

## 2.延迟加载重型客户端组件
比如富文本编辑器（Tiptap）、地图（Google Maps）、图表库（Chart.js）等，体积大且仅需在浏览器运行。用 ClientOnly 可：
1.  避免阻塞 SSR
2.  减小服务端 bundle 体积
3.  提升首屏加载速度

用法:

    <template>
    <div>
    <!-- 这部分始终渲染（包括 SSR） -->
    <h1>我的页面</h1>

    <!-- 这部分仅在客户端渲染 -->
    <ClientOnly>
      <MyHeavyComponent />
    </ClientOnly>
    </div>
    </template>

注意事项:
| 事项 | 说明 |
|------|------|
| 不阻止 JS 执行 | `<ClientOnly>` 只包裹模板，组件的 JS 逻辑（如 `setup()`）仍会在 SSR 阶段执行（如果被 import）。*安全做法：动态导入组件* |
| SEO 影响 | 被 `<ClientOnly>` 包裹的内容不会出现在 SSR HTML 中，搜索引擎可能无法索引 |
| 非万能 | 对于需要 SEO 的内容（如文章正文），不要用 `<ClientOnly>` |
