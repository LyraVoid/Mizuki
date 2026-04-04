---
title: 函数式编程范式带来的思考
published: 2026-04-04
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

### 文章链接: https://codewords.recurse.com/issues/one/an-introduction-to-functional-programming

# 文章核心
> **函数式编程 = 没有副作用。**
> 不依赖外部变量，不修改外部变量。
> 其他所有特性（map、reduce、管道、高阶函数）都是从这一条推导出来的。

---

# 一、专业概念

## 1. 函数式编程（Functional Programming）
**文章定义：**
用**纯函数**写代码，**没有副作用**，数据流动清晰，不修改外部状态。

**JS 大白话：**
- 数据进来 → 计算 → 新数据出去
- 不修改变量、不发请求、不改 DOM
- 靠**组合函数**实现逻辑，不靠循环+修改变量

---

## 2. 副作用（Side Effect）
**文章定义：**
函数**修改了外部世界**，或**依赖外部不确定状态**。

**文章里的坏例子（Python）：**
```python
a = 0
def increment():
    global a
    a += 1  # 修改外部变量 → 副作用
```

**JS 对照（副作用）：**
```js
let count = 0
function add() {
  count++ // 改外部 ❌
  console.log('hi') // 打印 ❌
  fetch('/api') // 网络 ❌
}
```

**副作用包括：**
- 修改外部变量
- 打印 log
- 网络请求
- 读写文件
- 操作 DOM
- 随机、时间
- 改变传入的对象/数组

---

## 3. 纯函数（Pure Function）
**文章定义：**
1. **相同输入 → 永远相同输出**
2. **无副作用**
3. **不依赖外部状态**

**文章好例子（Python）：**
```python
def increment(a):
    return a + 1
```

**JS 对照（纯函数 ✅）：**
```js
function add(a, b) {
  return a + b
}
```

**纯函数的好处（文章强调）：**
- 可预测
- 可缓存
- 可测试
- 可并行
- 好维护
- 不会莫名其妙出 bug

---

## 4. 命令式 vs 声明式（文章核心对比）
### 命令式（Imperative）
**文章定义：**
告诉计算机**一步步怎么做**。
用循环、变量、if、一步步改状态。

**JS 例子：**
```js
const arr = [1,2,3]
const newArr = []
for (let i=0; i<arr.length; i++) {
  newArr.push(arr[i] * 2) // 一步步教电脑做
}
```

### 声明式（Declarative）
**文章定义：**
告诉计算机**要什么**，不关心怎么做。
用 map / reduce / filter。

**JS 例子：**
```js
const newArr = arr.map(x => x * 2)
```

**文章总结：**
- 命令式 = 你指挥每一步
- 声明式 = 你描述结果

---

## 5. map（文章重点）
**文章定义：**
对列表里**每一项做变换**，返回**新列表**。

**JS 写法：**
```js
const names = ["Mary", "Isla", "Sam"]
const lengths = names.map(name => name.length)
// [4,4,3]
```

**作用：**
- 1对1转换
- 纯函数
- 不修改原数组

---

## 6. reduce（文章重点）
**文章定义：**
把列表**聚合成一个值**（求和、计数、平均、拼接…）

**JS 求和：**
```js
const total = [1,2,3,4].reduce((sum, current) => sum + current, 0)
// 10
```

**文章里的“计数器”JS 版：**
```js
const sentences = [
  'Mary read a story to Sam and Isla.',
  'Isla cuddled Sam.',
  'Sam chortled.'
]

const samCount = sentences.reduce((count, sentence) => {
  return count + (sentence.includes('Sam') ? 1 : 0)
}, 0)

// 3
```

---

## 7. filter（文章提到）
**作用：**
按条件**保留某些项**，返回新数组。

**JS：**
```js
const numbers = [1,2,3,4,5]
const even = numbers.filter(x => x % 2 === 0)
// [2,4]
```

---

## 8. 管道 / 流水线（Pipeline）（文章高级重点）
**文章定义：**
把多个函数**按顺序串起来**，数据像水管一样流过。

```
数据 → fn1 → fn2 → fn3 → 结果
```

**JS 实现管道（文章 pipeline_each）：**
```js
const pipeline = (data, fns) => {
  return fns.reduce((result, fn) => fn(result), data)
}
```

**使用（文章乐队例子 JS 版）：**
```js
const bands = [
  { name: 'sunset rubdown', country: 'UK', active: false }
]

// 纯函数1
const setCanada = band => ({ ...band, country: 'Canada' })
// 纯函数2
const stripDot = band => ({ ...band, name: band.name.replace('.','') })
// 纯函数3
const capitalize = band => ({ ...band, name: band.name.toUpperCase() })

// 管道调用
const result = pipeline(bands, [
  list => list.map(setCanada),
  list => list.map(stripDot),
  list => list.map(capitalize)
])
```

**文章说管道好处：**
- 可读性极高
- 每个函数可单独测试
- 可复用
- 可并行

---

## 9. 高阶函数（Higher-Order Function）
**文章定义：**
- 接收函数作为参数
**或**
- 返回一个函数

**文章里的 call() 就是高阶函数：**
```js
function call(fn, key) {
  return function(record) {
    return { ...record, [key]: fn(record[key]) }
  }
}
```

**使用：**
```js
const setCanada = call(() => 'Canada', 'country')
const newBand = setCanada(band)
```

---

## 10. 闭包（Closure）（文章讲到）
**文章解释：**
函数记住并访问它**定义时的作用域**，即使在别的地方执行。

```js
function call(fn, key) {
  // 下面的函数会记住 fn 和 key
  return function(record) {
    return { ...record, [key]: fn(record[key]) }
  }
}
```

---

## 11. 不可变性（Immutable）（文章强调）
**定义：**
数据不修改，**永远返回新副本**。
不修改原对象/数组。

**坏（可变）：**
```js
function setCountry(band) {
  band.country = 'Canada' // 改原对象 ❌
}
```

**好（不可变）：**
```js
function setCountry(band) {
  return { ...band, country: 'Canada' } // 返回新对象 ✅
}
```

---

# 二、文章最核心的 3 段代码（翻译成 JS，必看）

## 1. 坏代码（命令式 + 副作用）
```js
let time = 5
let carPositions = [1,1,1]

while (time) {
  time--
  for (let i=0; i<carPositions.length; i++) {
    if (Math.random() > 0.3) {
      carPositions[i]++ // 修改变量 ❌
    }
  }
  console.log(carPositions.map(p => '-'.repeat(p)))
}
```

## 2. 好代码（纯函数 + 不可变 + 递归）
```js
function moveCar(p) {
  return Math.random() > 0.3 ? p + 1 : p
}

function race(state) {
  console.log(state.carPositions.map(p => '-'.repeat(p)))
  if (state.time === 0) return

  race({
    time: state.time - 1,
    carPositions: state.carPositions.map(moveCar)
  })
}

race({ time: 5, carPositions: [1,1,1] })
```

---

# 三、文章总结（作者原话翻译成 JS 世界观）
1. **函数式编程 = 无副作用**
2. **纯函数 = 相同输入 → 相同输出**
3. **用 map / reduce / filter 替代循环**
4. **写声明式，不写命令式**
5. **数据不可变，不修改原对象/数组**
6. **用管道组合函数，代码更清晰**
7. **高阶函数 + 闭包 = 超强复用**

---
# 四、简单总结
- **纯函数**：相同输入必定相同输出，无副作用，不依赖外部。
- **副作用**：修改外部、打印、网络、DOM、随机、时间。
- **高阶函数**：接收函数 或 返回函数。
- **map**：一一转换，返回新数组。
- **reduce**：聚合，返回一个值。
- **声明式**：描述要什么。
- **命令式**：描述怎么做。
- **不可变**：不修改原数据，返回新副本。
---
