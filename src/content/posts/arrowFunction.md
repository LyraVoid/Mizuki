---
title: 箭头函数()=>{}
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---


# ES6 箭头函数 + 继承 官方标准解答
以下回答严格遵循 **ES6(ECMAScript 2015) 官方标准**，是前端开发的核心知识点，无自定义扩展。

---

## 1. 什么是箭头函数？
箭头函数（Arrow Function）是 **ES6 新增的函数定义语法**，使用 `=>` 符号替代传统的 `function` 关键字，是一种**更简洁、语法更紧凑**的函数表达式，**没有自己的 this、arguments、super、new.target**。

核心定义：
- 属于**函数表达式**，不能作为函数声明使用
- 语法简化了传统函数的书写，适合匿名函数、回调函数场景
- 是**匿名函数**，无法直接命名（可赋值给变量）

---

## 2. 箭头函数的 this 指向哪里？遵循哪些规则？
### 核心结论（官方标准）
**箭头函数没有自己的 this，它的 this 是** **词法作用域绑定** —— **继承自外层最近一层非箭头函数的 this**，**在定义时就确定，永远不会改变**。

### 严格遵循 3 条规则
1. **不绑定自身 this**：箭头函数内部的 `this` 不是调用时决定，而是**定义时**继承外层作用域的 `this`
2. **无法修改 this**：`call()`、`apply()`、`bind()` 都不能改变箭头函数的 `this` 指向
3. **全局环境中定义**：箭头函数的 `this` 指向 **全局对象**（浏览器 `window` / Node.js `globalThis`）

---

## 3. 箭头函数使用例子 + 与普通函数的区别
### 示例代码
```javascript
// 1. 传统普通函数
const sum1 = function(a, b) {
  return a + b;
};

// 2. 箭头函数（简化版）
const sum2 = (a, b) => a + b;

console.log(sum1(1,2)); // 3
console.log(sum2(1,2)); // 3

// 箭头函数常用场景：数组方法回调
const arr = [1,2,3];
const newArr = arr.map(item => item * 2); 
console.log(newArr); // [2,4,6]
```

### 箭头函数 vs 普通函数（核心区别）
| 特性 | 箭头函数 | 普通函数（function） |
|------|----------|----------------------|
| **this 指向** | 继承外层作用域，定义时确定 | 调用时确定，谁调用指向谁 |
| **arguments** | 无自身 arguments | 有自身 arguments 对象 |
| **构造函数** | 不能用 new 调用，无 prototype | 可作为构造函数，有原型 |
| **语法** | 简洁，支持简写 | 语法繁琐 |
| **yield** | 不能作为生成器函数 | 可使用 yield |

---

## 4. 在构造函数中使用箭头函数有什么好处？
### 核心好处：**永久绑定实例 this，解决回调函数 this 丢失问题**
构造函数中定义的箭头函数，`this` 会**永久绑定到构造函数创建的实例对象**，无论在什么场景调用，`this` 都不会改变。

### 示例
```javascript
// 构造函数
function Person(name) {
  this.name = name;

  // 箭头函数：this 永久绑定 Person 实例
  this.sayName = () => {
    console.log(this.name);
  };

  // 普通函数：this 会随调用者改变
  this.sayName2 = function() {
    console.log(this.name);
  };
}

const p = new Person("小明");

// 正常调用
p.sayName(); // 小明（箭头函数）
p.sayName2(); // 小明（普通函数）

// 单独调用（this 丢失）
const fn1 = p.sayName;
const fn2 = p.sayName2;
fn1(); // 小明（箭头函数：this 仍指向实例）
fn2(); // undefined（普通函数：this 指向全局）
```
### 如果需要让sayName2在正常函数调用中指向p实例对象需要: 

```javascript
// 构造函数
function Person(name) {
  this.name = name;

  // 箭头函数：this 永久绑定 Person 实例
  this.sayName = () => {
    console.log(this.name);
  };

  // 普通函数：this 会随调用者改变
  this.sayName2 = function() {
    console.log(this.name);
  };
}

const p = new Person("小明");

// 正常调用
p.sayName(); // 小明（箭头函数）
p.sayName2(); // 小明（普通函数）

// 单独调用（this 丢失）
const fn1 = p.sayName;
const fn2 = p.sayName2;
const fn3 = fn2.bind(p) //显式绑定对P对象实例
fn1(); // 小明（箭头函数：this 仍指向实例）
fn3(); // 小明（通过使用.bind方法改变this指向规则：this 指向实例）
```


### 总结好处
1. 无需手动 `bind(this)` 绑定上下文
2. 定时器、事件回调中不会丢失实例 `this`
3. 代码更简洁，可读性更高

---

## 5. ES6 继承（class extends）详解 + 与旧标准区别
### ES6 继承官方标准
ES6 用 **`class` + `extends` + `super()`** 实现继承，是**基于原型继承的语法糖**，语法更接近传统面向对象语言。

### 核心规则
1. 子类必须在 `constructor` 中**第一行调用 `super()`**，代表调用父类构造函数
2. `super` 既可以调用父类构造函数，也可以调用父类方法
3. 子类继承父类所有原型方法和实例属性
4. 本质还是**原型链继承**，只是语法简化

### ES6 继承示例
```javascript
// 父类
class Animal {
  constructor(name) {
    this.name = name;
  }
  eat() {
    console.log(this.name + "在吃饭");
  }
}

// 子类：extends 继承
class Dog extends Animal {
  constructor(name, color) {
    super(name); // 必须调用父类构造函数
    this.color = color;
  }
  bark() {
    console.log(this.name + "汪汪叫");
  }
}

const dog = new Dog("旺财", "黄色");
dog.eat(); // 旺财在吃饭（继承父类方法）
dog.bark(); // 旺财汪汪叫（子类自有方法）
```

---

### ES6 继承 vs ES5 传统继承（原型/构造函数继承）
| 特性 | ES6 class 继承 | ES5 传统继承（原型链/组合继承） |
|------|---------------|--------------------------------|
| **语法** | 简洁清晰，面向对象语义 | 繁琐，易出错，理解成本高 |
| **继承顺序** | 先创建父类实例 `this`，再子类修饰 | 先创建子类 `this`，再调用父类方法 |
| **super 关键字** | 专用关键字调用父类 | 手动用 `call/apply` 绑定 |
| **方法定义** | 直接写在 class 内，自动挂原型 | 手动挂载到 `prototype` |
| **严格模式** | 默认严格模式 | 需手动声明 |
| **本质** | 原型继承的语法糖 | 纯原型链 + 构造函数组合 |

---

# 总结
1. **箭头函数**：ES6 简洁函数语法，**无自身 this**
2. **this 指向**：继承外层作用域，**定义时绑定，不可修改**
3. **核心差异**：无 arguments、不能 new、this 固定
4. **构造函数中**：永久绑定实例 this，解决 this 丢失
5. **ES6 继承**：`class+extends+super`，语法糖，比 ES5 更简洁规范
