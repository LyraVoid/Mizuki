---
title: AI排泄-防抖节流
published: 2026-04-07
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

---

## 一、先搞懂：防抖、节流到底是干嘛的？
### 一句话核心概念
**防抖（Debounce）**：**频繁触发的事件，只认最后一次**（等你停了再执行）
**节流（Throttle）**：**频繁触发的事件，单位时间内只执行一次**（冷却时间）

### 大白话场景
1. **防抖 = 电梯关门**
   有人进电梯就重新计时，**直到没人进了，才关门运行**。
   → 搜索框输入、窗口 resize、按钮点击防重复

2. **节流 = 技能冷却**
   放完技能必须等CD，**CD没好，你点烂了也没用**。
   → 滚动监听、鼠标移动、高频点击

---

## 二、大厂面试核心考点（必背）
### 1. 防抖（Debounce）
- **核心**：**延迟执行，频繁触发会重置计时**
- **触发规则**：n 秒内**最后一次**才执行
- **使用场景**：
  - 搜索框输入联想（输完再请求）
  - 窗口大小变化 resize
  - 按钮防止重复点击
  - 表单验证

### 2. 节流（Throttle）
- **核心**：**单位时间内只执行一次，有冷却**
- **触发规则**：n 秒内**只执行一次**
- **使用场景**：
  - 滚动加载（scroll）
  - 鼠标移动（mousemove）
  - 高频点击、游戏操作
  - 视频播放时间记录

---

## 三、原生 JS 手写实现（面试必写）
### 1. 防抖实现（最简版）
```js
function debounce(fn, delay = 300) {
  let timer = null; // 闭包保存定时器
  return function (...args) {
    if (timer) clearTimeout(timer); // 频繁触发就清空
    timer = setTimeout(() => {
      fn.apply(this, args); // 最后执行
    }, delay);
  };
}
```

### 2. 节流实现（时间戳版，推荐）
```js
function throttle(fn, delay = 300) {
  let lastTime = 0; // 上次执行时间
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= delay) { // 时间到了才执行
      lastTime = now;
      fn.apply(this, args);
    }
  };
}
```

---

## 四、Vue 中的防抖节流composable
### 方案 1：直接用手写工具函数

### 防抖
```vue
function useDebounce(fn, delay = 300) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
```

### 节流

```vue
function useThrottle(fn, delay = 300) {
  let lastTime = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn(...args)
      lastTime = now
    }
  }
}
```
---

### 方案 2：Vue 自定义指令

#### 1）防抖指令 v-debounce
```js
// main.js
app.directive('debounce', {
  mounted(el, binding) {
    const [fn, delay = 300] = binding.value
    el.timer = null
    el.addEventListener('input', () => {
      if (el.timer) clearTimeout(el.timer)
      el.timer = setTimeout(() => fn(), delay)
    })
  }
})
```
使用：
```vue
<input v-debounce="[search, 500]" />
```

#### 2）节流指令 v-throttle
```js
app.directive('throttle', {
  mounted(el, binding) {
    const [fn, delay = 300] = binding.value
    let last = 0
    el.addEventListener('click', () => {
      const now = Date.now()
      if (now - last >= delay) {
        fn()
        last = now
      }
    })
  }
})
```
使用：
```vue
<button v-throttle="[submit, 1000]">提交</button>
```

---

## 五、总结
### 防抖
- **核心**：频繁触发 → **只执行最后一次**
- **场景**：搜索输入、窗口变化、防重复点击
- **实现**：定时器 + 清空重开

### 节流
- **核心**：频繁触发 → **单位时间只执行一次**
- **场景**：滚动、鼠标移动、高频点击
- **实现**：时间戳/定时器控制冷却

### Vue 使用
1. 工具函数包装事件（最简单）
2. 自定义指令（优雅、复用强）
---

## 标准答案
> 防抖是让频繁触发的事件，在停止操作后延迟执行最后一次；节流是让事件在单位时间内只执行一次，防止高频触发。
> 防抖用于搜索输入、防重复点击；节流用于滚动、鼠标移动。
> 实现上防抖用定时器清空重开，节流用时间戳判断冷却。在Vue中可以封装成工具函数或自定义指令使用。

---
