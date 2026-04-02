---
title: 闭包(Closure)
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---

# 什么是闭包

闭包 = 函数 + 它被创建时所在的词法环境（外部作用域）的引用。

**函数能够记住并访问它定义时的外部作用域，即使函数在外部作用域执行完毕后执行。**


# 二、闭包的核心原理（MDN 重点）

1.  **词法作用域（Lexical Scoping）**
函数在**定义的位置**决定它能访问哪些变量，不是调用的位置。

2.  **函数执行完，作用域不会销毁**
如果内部函数被返回 / 保存，外部函数的作用域会被**闭包保留**，不会被垃圾回收。

3.  **闭包在函数创建时就自动生成**
只要写嵌套函数，就一定产生闭包。

# 三.闭包的核心作用

1.  **保留变量状态（记住数据）**
让函数一直持有某个值，不会被释放。

2.  **模拟私有变量 / 封装（数据隐藏）**
JS 没有原生 private，闭包可以实现变量私有化。

3.  **函数工厂（批量生成带不同状态的函数）**
生成一批功能相同、但携带不同数据的函数。

4.  **解决循环中变量共享问题**
在 var 时代，闭包是循环绑定事件的唯一正确方案。


# 闭包案例

    // 外部函数
    function makeFunc() {
      // 外部变量（会被闭包保留）
      var name = "Mozilla";
    
      // 内部函数 → 形成闭包
      function displayName() {
        console.log(name); // 访问外部作用域的变量
      }
    
      // 返回内部函数
      return displayName;
    }
    
    // 拿到闭包函数
    var myFunc = makeFunc();
    
    // 执行时依然能访问 name
    myFunc(); // 输出 Mozilla


## 函数工厂

    批量制造带不同状态的函数：

    function makeAdder(x) {
      return function(y) {
        return x + y;
      };
    }
    
    const add5 = makeAdder(5);
    const add10 = makeAdder(10);
    
    console.log(add5(2));  // 7
    console.log(add10(2)); // 12

·add5 闭包保留 x=5
·add10 闭包保留 x=10
·互不干扰


# 模块化 + 私有变量

    const counter = (function() {
      // 私有变量（外部无法访问）
      let privateCounter = 0;
    
      function changeBy(val) {
        privateCounter += val;
      }
    
      // 暴露公共方法
      return {
        increment: () => changeBy(1),
        decrement: () => changeBy(-1),
        value: () => privateCounter
      };
    })();

counter.increment();
console.log(counter.value()); // 1

·privateCounter 是私有变量
·只有暴露的方法能访问 → 闭包实现封装


# 解决循环闭包问题

    // 错误写法：var全局作用域,整个for循环共享同一个 i
    for (var i = 0; i < 3; i++) {
      setTimeout(() => console.log(i), 100);
    }
    // 输出 3 3 3
    
    // 正确写法：闭包保存每次的 i
    for (var i = 0; i < 3; i++) {
      (function (locked) {
        setTimeout(() => console.log(locked), 100);
      })(i);
    }
    // 输出 0 1 2

事件循环过程:
进入 for 循环：
i = 0 → 注册第一个 setTimeout（回调函数 A）
i = 1 → 注册第二个 setTimeout（回调函数 B）
i = 2 → 注册第三个 setTimeout（回调函数 C）
当 i = 3 时，循环条件 i < 3 失败，循环结束。
此时全局变量 i 的值已经是 3。
