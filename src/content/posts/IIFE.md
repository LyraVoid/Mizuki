---
title: IIFE
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---

# IIFE（Immediately Invoked Function Expressions）代表立即执行函数


## 什么是IIFE

一个**被立即执行**的函数表达式。

关键要点（文章核心强调）
1.  **必须是函数表达式，不是函数声明**:
    函数声明：function fn() {}
    函数表达式：var fn = function() {} 或 (function() {})


4.  **定义完立刻执行，不需要调用、不需要名字**
5.  **自带独立作用域，不污染全局**

写法:

    (function(){ /* code */ })();

# IIFE 的创作背景（文章里的历史原因）

**背景 1：JS 没有块级作用域（早期）**

·ES6 之前，JS 只有函数作用域，没有 let/const。
·变量都会泄露到全局，造成污染。

**背景 2：函数声明不能立即执行**

    function(){}(); // SyntaxError
    
因为 JS 引擎把它当作函数声明，而函数声明必须有名字，且不能直接加 () 执行。

一般我们会进行如下操作: 
      function a (){
    }  //声明a 函数

    a()//在函数名后加()执行

**背景 3：需要一种 “创建作用域 + 立刻运行 + 不留痕迹” 的写法**


# IIFE 能用来干什么？

## 1.创建独立作用域，避免全局污染
**函数内部变量外部无法访问，实现私有化。**

    (function(){
      var a = 10; // 外部访问不到
    })();
    
    console.log(a); // ReferenceError




##  2.解决循环中闭包保存状态问题
**循环绑定事件时，锁定每次循环的 i 值**

    for (var i = 0; i < 5; i++) {
      (function(lockedInIndex) {
        elems[i].onclick = function() {
          alert(lockedInIndex); // 正确输出 0、1、2、3、4
        };
      })(i);
    }

##  3.实现模块化
IIFE 是模块化的基础。
·私有化变量
·暴露接口
·不污染全局
·早期 jQuery、所有库 都用它封装


## 接收全局变量，避免冲突
**可以把 window、jQuery 当参数传进去**


(function(window, $) {
  // 这里使用 $ 不会被外部干扰
})(window, jQuery);


# 总结

1.  IIFE 是 **立即执行的函数表达式**
2.  它不是自执行，不是必须匿名
3.  为了解决 **JS 无块级作用域、全局污染** 而诞生
4.  核心用途：**创建作用域、闭包保存状态、模块化、避免冲突**
5.  是 ES6 之前 JS 最核心的模块化 / 作用域方案
