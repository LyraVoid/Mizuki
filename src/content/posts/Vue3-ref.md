---
title: Vue3-ref
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

#   Vue3 的 Ref 响应式体系

## 1. ref 官方定义
接受一个值，返回一个响应式 Ref 对象，该对象只有一个 .value 属性指向内部值。

## 2. 为什么需要 ref？
JS 中原始类型（string/number/boolean） 按值传递，无法被监听
Vue 用 Ref 包装，让原始类型也具备响应式
在 <template> 中会自动解包，不用写 .value

# isRef（判断工具）

判断一个值是否为 Ref 对象。

# shallowRef（浅响应式）

创建一个浅响应式的 ref：

- 只监听 .value 本身的修改
- 不深度递归监听内部对象 / 数组的变化

    const msg = shallowRef({ name: "小满" })
    msg.value.name = "大满" // 不触发响应式

因为 shallowRef 不会把内部对象转为 reactive。

直接替换 .value → 触发更新

    msg.value = { name: "大满" } // 触发更新

因为修改了 .value 本身。

# triggerRef（强制触发更新）

强制触发某个 shallowRef 的依赖更新，即使值没有被代理。

    const msg = shallowRef({ name: "小满" })
    const change = () => {
      msg.value.name = "大满"
      triggerRef(msg) // 强制更新视图
    }

# customRef（自定义 Ref）

用于自定义 ref，完全控制 get() 和 set() 逻辑。

工厂函数结构

    customRef((track, trigger) => {
      return {
        get() {
          track() // 收集依赖
          return 值
        },
        set(newVal) {
          值 = newVal
          trigger() // 触发更新
        }
      }
    })
