---
title: Vue3-reactive
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

我现在**完全对照这篇文章（小满reactive四个API）+ Vue3 官方文档 + 真实源码**，**逐段、逐概念、超细致讲解**，不讲废话、全部是**源码级原理**，保证你彻底理解这四个 API：

# 整篇文章内容：
**reactive / shallowReactive / readonly / shallowReadonly**
（Vue3 响应式核心的 **4 大基础 API）**

我会讲清楚：
**定义、源码原理、ECMA 标准、内部结构、为什么这样设计、区别、场景**

---

# 一、前置核心原理（必须先懂）
## 1. Vue3 响应式的唯一底层：**ES6 Proxy（ECMAScript 2015 标准）**
官方源码：`packages/reactivity/src/reactive.ts`

```js
new Proxy(target, {
  get(target, key) {     // 读取属性 → track 收集依赖
    track(target, key)
    return Reflect.get(target, key)
  },
  set(target, key, val) { // 修改属性 → trigger 触发更新
    const result = Reflect.set(target, key, val)
    trigger(target, key)
    return result
  }
})
```

### 官方铁律：
- **Proxy 只能代理 对象/数组/函数**
- **不能代理 string/number/boolean/undefined/null**

## 2. Vue3 所有响应式对象，都来自同一个创造函数：
### **`createReactiveObject`（源码唯一入口）**
```ts
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
) {
  // 缓存，避免重复代理
  const proxyMap = isReadonly ? readonlyMap : reactiveMap
  const existingProxy = proxyMap.get(target)
  if (existingProxy) return existingProxy

  // 创建 Proxy
  const proxy = new Proxy(target, baseHandlers)
  proxyMap.set(target, proxy)
  return proxy
}
```

**四个 API 都是这个函数的不同参数！**

---

# 二、reactive（深度响应式）
## 官方定义
返回一个**深度响应式代理**，嵌套对象会**自动递归转为响应式**。

## 源码调用
```ts
export function reactive(target: object) {
  return createReactiveObject(
    target,
    false, // 不是只读
    mutableHandlers, // 可读写的深层代理
    mutableCollectionHandlers
  )
}
```

## 底层原理（mutableHandlers）
- **get：自动递归 reactive 子对象**
- **get：track 收集依赖**
- **set：trigger 触发更新**
- 深度监听所有层级

## 文章示例解释
```js
const person = reactive({
  name: 'zs',
  age: 18,
  friend: { name: 'ls' }
})

person.name = 'ww'          // ✅ 响应式
person.friend.name = 'zl'   // ✅ 响应式（深度）
```

## 特点
- 深度递归代理
- 读写正常
- 嵌套对象自动变响应式

---

# 三、shallowReactive（浅响应式）
## 官方定义
**只有第一层属性是响应式，深层对象不代理、不递归。**

## 源码调用
```ts
export function shallowReactive(target: object) {
  return createReactiveObject(
    target,
    false,
    shallowHandlers, // ✨ 关键：浅处理函数
    shallowCollectionHandlers
  )
}
```

## 底层原理（shallowHandlers）
**get 直接返回原值，不递归、不转为 reactive**
```js
get(target, key) {
  return target[key] // 直接返回，不做深层代理
}
```

## 文章示例解释
```js
const person = shallowReactive({
  name: 'zs',
  friend: { name: 'ls' }
})

person.name = 'ww'        // ✅ 触发更新（第一层）
person.friend.name = 'zl'// ❌ 不触发（深层不是Proxy）
```

## 作用
**性能优化：大数据列表、第三方对象、不希望深度监听的场景**

---

# 四、readonly（深度只读）
## 官方定义
返回一个**深度只读代理**：
**任何层级都不能修改，只能读**。

## 源码调用
```ts
export function readonly(target: object) {
  return createReactiveObject(
    target,
    true, // ✨ 只读
    readonlyHandlers,
    readonlyCollectionHandlers
  )
}
```

## 底层原理（readonlyHandlers）
- **get：正常收集依赖**
- **set：抛出警告，不修改**
- **deleteProperty：禁止删除**
```js
set() {
  console.warn(`只读对象，不可修改`)
  return true
}
```

## 文章示例解释
```js
const state = readonly({
  name: 'zs',
  friend: { name: 'ls' }
})

state.name = 'ww'           // ❌ 警告
state.friend.name = 'zl'    // ❌ 警告（深度只读）
```

## 官方用途
- props 就是 readonly
- 配置、默认数据、禁止修改的状态

---

# 五、shallowReadonly（浅只读）
## 官方定义
**只有第一层只读，深层可以修改，且不是响应式。**

## 源码调用
```ts
export function shallowReadonly(target: object) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers
  )
}
```

## 底层原理
- 第一层：**set 拦截 → 只读**
- 深层：**直接返回原对象，不代理、可修改**

## 文章示例解释
```js
const state = shallowReadonly({
  name: 'zs',
  friend: { name: 'ls' }
})

state.name = 'ww'         // ❌ 禁止
state.friend.name = 'zl'  // ✅ 允许修改
```

---

# 六、源码级核心区别（最精华）
Vue3 源码中，**4 个API 只由 3 个维度控制**：

1. **isReadonly**：是否只读
2. **isShallow**：是否浅层
3. **deep：true/false**：是否递归代理

## 对应关系（官方真实）
| API | 只读 | 浅层 | 深层 | 内部对象 |
|---|:-:|:-:|:-:|---|
| reactive | ❌ | ❌ | 深度代理 | 响应式 |
| shallowReactive | ❌ | ✅ | 不代理 | 普通对象 |
| readonly | ✅ | ❌ | 深度只读 | 只读 |
| shallowReadonly | ✅ | ✅ | 不代理 | 普通对象 |

---

# 七、官方总结
1. **四个 API 底层都是 `createReactiveObject` + Proxy**
2. **reactive：深度响应式，全层级代理**
3. **shallowReactive：浅响应，仅第一层代理**
4. **readonly：深度只读，全层级不可修改**
5. **shallowReadonly：第一层只读，深层可修改**
6. 全部基于 **ES6 Proxy**，无 ES5 兼容性，无法被 polyfill

---
