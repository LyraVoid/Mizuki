---
title: AI纯排泄--ES6新增特性一览
published: 2026-04-02
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---
# ES6 (ECMAScript 2015) 官方标准全特性详解
以下内容**严格遵循 ES6 官方规范**，按**是什么 → 核心作用 → 如何实现（语法+示例）** 结构化总结，覆盖所有 ES6 核心新特性，是前端学习/面试的完整标准指南。

---

## 一、块级作用域：let / const
### 1. 是什么
ES6 新增的**块级作用域变量声明关键字**，替代 `var`，`let` 声明可变变量，`const` 声明常量（只读变量）。
块级作用域：`{}` 包裹的代码块（if/for/while/函数内）。

### 2. 核心作用
1. 解决 `var` 变量提升、全局污染、循环变量泄露问题
2. `const` 强制常量不可修改，提升代码安全性和可读性
3. 块级作用域隔离变量，避免变量冲突

### 3. 如何实现（语法+示例）
```javascript
// 1. let：可变变量，块级作用域
if (true) {
  let a = 10; // 仅在 {} 内有效
}
// console.log(a); // 报错：a 未定义（块级隔离）

// 2. const：常量，声明必须赋值，不可重新赋值
const PI = 3.14159;
// PI = 3; // 报错：常量不可修改

// 注意：const 引用类型（对象/数组）可修改内部属性
const obj = { name: "ES6" };
obj.name = "ECMAScript"; // 允许
```

---

## 二、解构赋值
### 1. 是什么
从**数组/对象**中快速提取值，赋值给变量的语法糖。

### 2. 核心作用
1. 简化变量赋值代码，告别繁琐的 `.` 或 `[]` 取值
2. 快速交换变量、函数参数解析、默认值设置
3. 适配接口数据解析，提升开发效率

### 3. 如何实现（语法+示例）
```javascript
// 1. 对象解构（最常用）
const user = { name: "小明", age: 18 };
const { name, age } = user; // 直接提取属性

// 2. 数组解构
const arr = [1, 2, 3];
const [a, b, c] = arr;

// 3. 默认值 + 交换变量
const { sex = "男" } = user; // 无属性时用默认值
let x = 1, y = 2;
[x, y] = [y, x]; // 快速交换

// 4. 函数参数解构
function print({ name, age }) {
  console.log(name, age);
}
```

---

## 三、函数扩展
### （1）箭头函数
### 1. 是什么
ES6 新增**简洁函数语法**，用 `=>` 替代 `function`，无独立 `this`。

### 2. 核心作用
1. 简化回调函数、匿名函数写法
2. 固定 `this` 指向（继承外层作用域），解决 `this` 丢失问题

### 3. 如何实现（语法+示例）
```javascript
// 基础写法
const sum = (a, b) => a + b; // 单行省略 return 和 {}

// 多行逻辑
const fn = () => {
  const a = 1;
  return a;
};
```

---

### （2）函数默认参数
### 1. 是什么
函数声明时直接给参数设置**默认值**，调用不传参时使用默认值。

### 2. 核心作用
简化参数默认值判断逻辑，无需手动 `if` 判断。

### 3. 如何实现
```javascript
function log(name = "游客") {
  console.log(name);
}
log(); // 游客（默认值）
log("小明"); // 小明
```

---

### （3）rest 参数（剩余参数）
### 1. 是什么
用 `...变量名` 接收函数**多余实参**，替代 `arguments`。

### 2. 核心作用
1. 替代伪数组 `arguments`，得到**真数组**，可直接使用数组方法
2. 灵活接收不定长参数

### 3. 如何实现
```javascript
function fn(a, b, ...args) {
  console.log(args); // [3,4,5] 真数组
}
fn(1,2,3,4,5);
```

---

## 四、字符串扩展
### （1）模板字符串
### 1. 是什么
用反引号 `` ` `` 包裹的字符串，支持**变量嵌入、换行、表达式**。

### 2. 核心作用
1. 告别字符串拼接（`+`），代码更简洁
2. 支持多行书写，适配 HTML 模板

### 3. 如何实现
```javascript
const name = "小明";
const str = `我是${name}，今年${18+1}岁`; // 变量/表达式直接嵌入
```

---

### （2）字符串新方法
### 1. 是什么
ES6 为字符串新增的实用实例方法。

### 2. 核心作用
简化字符串判断、截取、填充等操作。

### 3. 如何实现
```javascript
const str = "ES6";
str.includes("S"); // 判断是否包含字符 → true
str.startsWith("E"); // 判断开头 → true
str.endsWith("6"); // 判断结尾 → true
str.repeat(2); // 重复字符串 → "ES6ES6"
```

---

## 五、数组扩展
### （1）扩展运算符 `...`
### 1. 是什么
用 `...` 将**数组转为逗号分隔的参数序列**。

### 2. 核心作用
1. 快速复制/合并数组
2. 类数组转真数组
3. 函数传参简化

### 3. 如何实现
```javascript
// 复制数组
const arr1 = [1,2];
const arr2 = [...arr1];

// 合并数组
const arr3 = [...arr1, ...arr2];

// 类数组转数组
const nodeList = document.querySelectorAll("div");
const arr = [...nodeList];
```

---

### （2）数组新方法
### 1. 是什么
ES6 新增数组静态/实例方法，简化数组操作。

### 2. 核心作用
快速实现数组创建、查找、去重等功能。

### 3. 如何实现
```javascript
// Array.from()：类数组转真数组
Array.from("123"); // [1,2,3]

// Array.of()：创建数组
Array.of(1,2,3); // [1,2,3]

// find()：查找第一个符合条件元素
[1,2,3].find(item => item>1); // 2

// findIndex()：查找索引
[1,2,3].findIndex(item => item>1); // 1
```

---

## 六、对象扩展
### （1）对象简写语法
### 1. 是什么
对象属性/方法的**简化书写**。

### 2. 核心作用
减少重复代码，让对象写法更简洁。

### 3. 如何实现
```javascript
const name = "ES6";
// 属性简写：键名=变量名时可省略
const obj = { name };

// 方法简写：省略 function
const obj2 = {
  say() { console.log("hi"); }
};
```

---

### （2）对象新方法
### 1. 是什么
ES6 新增 `Object` 静态方法。

### 2. 核心作用
简化对象合并、判断、遍历等操作。

### 3. 如何实现
```javascript
// Object.assign()：合并对象
const obj1 = {a:1}, obj2={b:2};
const obj = Object.assign({}, obj1, obj2);

// Object.keys()/values()/entries()：遍历键/值/键值对
Object.keys({a:1}); // ["a"]
```

---

## 七、Symbol 数据类型
### 1. 是什么
ES6 新增**原始数据类型**，表示**独一无二的值**。

### 2. 核心作用
1. 防止对象属性名冲突
2. 用作私有属性标识
3. 定义内置常量

### 3. 如何实现
```javascript
const s1 = Symbol("唯一标识");
const s2 = Symbol("唯一标识");
s1 === s2; // false（永不相等）

// 用作对象属性
const obj = { [s1]: "私有值" };
```

---

## 八、Set / Map 数据结构
### （1）Set
### 1. 是什么
**无重复值的集合**，类数组结构。

### 2. 核心作用
快速实现**数组去重**、存储唯一值。

### 3. 如何实现
```javascript
const set = new Set([1,2,2,3]);
[...set]; // [1,2,3] 数组去重

set.add(4); // 添加
set.delete(1); // 删除
set.has(2); // 判断存在 → true
```

---

### （2）Map
### 1. 是什么
**键值对集合**，键可以是**任意类型**（对象/函数/原始值）。

### 2. 核心作用
解决对象键只能是字符串/ Symbol 的限制。

### 3. 如何实现
```javascript
const map = new Map();
map.set("name", "ES6"); // 设置
map.get("name"); // 获取 → ES6
map.has("name"); // 判断
map.delete("name"); // 删除
```

---

## 九、class 类（面向对象）
### 1. 是什么
ES6 提供的**类语法**，是原型继承的语法糖，统一面向对象写法。

### 2. 核心作用
1. 替代 ES5 构造函数+原型的繁琐写法
2. 标准化面向对象编程，支持继承、构造函数、方法

### 3. 如何实现
```javascript
class Person {
  // 构造函数
  constructor(name) {
    this.name = name;
  }
  // 原型方法
  say() { console.log(this.name); }
}

const p = new Person("小明");
```

---

## 十、extends 继承
### 1. 是什么
ES6 基于 `class` 的**继承语法**，用 `extends + super` 实现。

### 2. 核心作用
简化继承写法，标准化子类父类关系。

### 3. 如何实现
```javascript
// 父类
class Animal {}
// 子类继承
class Dog extends Animal {
  constructor(name) {
    super(); // 必须调用父类构造函数
    this.name = name;
  }
}
```

---

## 十一、Promise 异步编程
### 1. 是什么
ES6 内置的**异步处理对象**，解决回调地狱问题。

### 2. 核心作用
1. 标准化异步操作（请求/定时器）
2. 链式调用，代码更清晰
3. 支持异步状态管理（pending/fulfilled/rejected）

### 3. 如何实现
```javascript
// 创建 Promise
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("成功"), 1000);
});

// 链式调用
p.then(res => console.log(res))
 .catch(err => console.log(err));
```

---

## 十二、模块化：import / export
### 1. 是什么
ES6 官方**模块化规范**，实现代码拆分、复用、隔离。

### 2. 核心作用
1. 替代 CommonJS/AMD 等非标准模块化
2. 支持静态导入导出，编译时优化
3. 实现工程化开发

### 3. 如何实现
```javascript
// 导出模块 a.js
export const name = "ES6";
export function fn() {}
export default {}; // 默认导出

// 导入模块 b.js
import { name, fn } from "./a.js";
import obj from "./a.js";
```

---

## 十三、for...of 循环
### 1. 是什么
ES6 新增**统一遍历语法**，可遍历数组/字符串/Set/Map 等可迭代对象。

### 2. 核心作用
统一遍历方式，替代 `for`/`forEach`/`for...in` 等零散写法。

### 3. 如何实现
```javascript
const arr = [1,2,3];
for (let item of arr) {
  console.log(item); // 1 2 3
}
```

---

## 十四、尾调用优化
### 1. 是什么
函数**最后一步操作是调用另一个函数**，ES6 会对其进行内存优化。

### 2. 核心作用
避免递归爆栈，减少内存占用。

### 3. 如何实现
```javascript
// 尾调用：最后一步仅调用函数
function fn1() {}
function fn2() { return fn1(); }
```

---

# ES6 全特性核心总结（记忆版）
1. **作用域**：let/const 块级隔离，替代 var
2. **简化语法**：解构、模板字符串、对象/函数简写
3. **函数增强**：箭头函数、默认参数、rest 参数
4. **数据结构**：Symbol、Set（去重）、Map（任意键）
5. **面向对象**：class/extends 标准化类与继承
6. **异步方案**：Promise 解决回调地狱
7. **工程化**：import/export 官方模块化
8. **工具方法**：数组/字符串/对象新增 API 提升效率
