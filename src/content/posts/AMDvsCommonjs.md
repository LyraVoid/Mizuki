---
title: AMD&Commonjs模块体系
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'Java'
draft: false 
lang: ''
---

# JavaScript 模块系统对决：CommonJS vs AMD vs ES2015


## 概括点:

CommonJS（CJS）：同步加载模块，服务端（Node.js）出生。
AMD：异步加载模块，浏览器端出生。

二者都是早期JS的模块化规范,用来解决: 

1.  全局变量污染
2. 依赖混乱
3. 加载顺序问题


## 为什么我们需要 JavaScript 模块？

如果你熟悉其他**开发平台**，你大概对**封装**和**依赖**的概念有些了解。

(**开发平台:除了 JavaScript / 浏览器 之外的其他编程语言 + 运行环境。例如Java、C#、C++、Python、Swift、Objective-C、PHP 等传统后端 / 客户端开发环境**。)

(封装（encapsulation）:把内部实现藏起来，只暴露外部能用的接口。 
传统语言的典型特征：
1.  类内部的变量 / 方法设为 private（外部不能访问）
2.  只暴露 public 方法给外部使用
3.  **内部细节隐藏，防止被乱改、保证安全、降低耦合**

    class Person {
      private String name; // 封装：外部不能直接改
    
      public String getName() { // 公开接口
        return name;
      }
    }
   )
(依赖（dependency）:

A软件运行,必须要有B软件, B软件就是A软件的依赖

比如：
1.  你要用 jQuery 插件 → 依赖 jQuery
2.  你要用 Vue 组件 → 依赖 Vue
3.  Java 调用类库 → 依赖 jar 包

**依赖 = 模块之间的引用关系**

引申还有: 依赖管理,依赖注入,依赖加载(同步/异步),循环依赖
)

不同的软件通常会单独开发，直到某个需求需要由已有的软件满足。
当另一个**软件被引入项目**时，它和新代码之间会产生**依赖关系**。
由于这些软件需要协同工作，因此**确保软件之间不发生冲突**非常重要。
这听起来很简单，但如果没有某种封装 ，迟早两个模块会相互冲突。
这也是为什么 C 库中的元素通常带有前缀的原因之一：

    #ifndef MYLIB_INIT_H
    #define MYLIB_INIT_H
    
    enum mylib_init_code {
        mylib_init_code_success,
        mylib_init_code_error
    };
    
    enum mylib_init_code mylib_init(void);
    
    // (...)
    #endif //MYLIB_INIT_H


封装对于防止冲突和简化开发至关重要。


# CommonJS
CommonJS 是一个旨在定义一系列规范的项目，以帮助开发服务器端 JavaScript 应用。

CommonJS 模块的设计初衷是**服务器开发**。自然，**API 是同步的**。换句话说，模块在**源文件**中按其**需求的顺序**在当前加载。

## 运行时加载

代码执行到require才去加载.不是**编译时**

## 值拷贝
导入的是值的拷贝，不是引用（导出变了，导入不会自动变）。


## 优点和缺点

**优点:**

1.  上手简单,基本不用看文档就能掌握
2.  依赖管理是集成的:模块require其他模块，并按所需顺序加载。
3.  require可以被调用到任何地方,模块可以通过编程加载
4.  支持循环依赖关系

**缺点:**
1.  同步 API 使其不适合某些用途（客户端）。
2.  每个模块一个文件。
3.  浏览器需要加载器库或转译。
4.  模块没有构造函数（不过 Node 支持）
5.  静态代码分析器很难分析。

# Asynchronous Module Definition 异步模块定义（AMD）

1.核心特点

适合浏览器, 不会阻塞渲染

2. 语法:define定义, require加载:

    define(['dep1', 'dep2'], function (dep1, dep2) {
    
        //Define the module value by returning a value.
        return function () {};
    });
    
    // Or:
    define(function (require) {
        var dep1 = require('dep1'),
            dep2 = require('dep2');
    
        return function () {};
    });

**异步加载通过使用 JavaScript 传统的闭包语言实现：当请求的模块加载完成时调用函数。**

模块定义和导入模块由同一函数执行：定义模块后，其依赖关系被显式化。因此，AMD 加载器可以在运行时完整地了解某个项目的依赖图。因此，加载时不依赖的库可以同时加载。

这对浏览器尤为重要，因为启动时间对良好的用户体验至关重要。

优点:

1.  异步加载（启动时间更快）。
2.  支持循环依赖关系。
3.  需要require 和 exports 的兼容性
4.  依赖管理完全集成
5. 模块可以拆分成多个文件
6.  支持构造函数
7.  插件支持

缺点: 
1.  语法复杂
2. 除非转译,否则必须使用加载器库
3. **静态代码分析器很难分析**

# ES2015 Modules  ES2015 模块
ESM模式兼容同步和异步两种操作模式。

    //------ lib.js ------
    export const sqrt = Math.sqrt;
    export function square(x) {
        return x * x;
    }
    export function diag(x, y) {
        return sqrt(square(x) + square(y));
    }
    
    //------ main.js ------
    import { square, diag } from 'lib';
    console.log(square(11)); // 121
    console.log(diag(4, 3)); // 5


**Pros  优点:**

支持同步和异步加载。
句法简单。
**支持静态分析工具。**
它集成在语言中（最终在所有平台都支持，无需库）。
支持循环依赖。


**Cons  缺点:**
但也不是所有地方都支持。


# 总结
**CommonJS 是同步加载的模块化规范，主要用于 Node.js，采用 require 和 module.exports，运行时加载、值拷贝。**


**AMD 是异步加载规范，主要用于浏览器，由 RequireJS 实现，采用 define 定义模块，依赖前置。**

**两者都是早期模块化方案，现在基本被 ES Module（ESM） 取代。**
