---
title: Learning Vue is really painful, but also very enjoyable~
published: 2025-12-12
description: 'A reflection on my long-term learning experience with Vue.'
image: ''
tags: ['vue','blog']
category: 'Front-end engineering'
draft: false 
lang: ''
---

1.我的一些学习感想
=========
 
![Alt text](../posts/guide/post2.webp)

学习Vue和TypeScript真的很久,从了解vue2,到做有关vue2的项目就花了我一个月左右.
可以说,学习vue2是我接触前端工程开发的又一段学习, 同时也是我第一次接触spa
写这篇博客为了再次复习回忆一下之前学过的vue的知识

# Vue的一些基本知识
 
## vue是啥?  为啥要使用它呢?  我可以使用它解决哪些问题?

Vue (发音为 /vjuː/，类似 view) 是一款用于构建用户界面的 JavaScript 框架。它基于标准 HTML、CSS 和 JavaScript 构建，并提供了一套声明式的、组件化的编程模型(引用官方文档)

使用Vue的原因很简单,就是它拥有更容易入手的生态,并且在开发领域中的功能覆盖了大部分前端开发常见的需求
Vue在性能方面也是与React不相上下(虽然尤老大说react其实不如vue...)

最后,我们可以在很多需求场景去使用Vue,例如:
## 单页应用(SPA),全栈/服务端渲染(SSR),Jamstack/静态站点生成(SSG),开发桌面端、移动端、WebGL，甚至是命令行终端中的界面

###### 如何快速使用到Vue?

在学习完vue2的时候,我在网上找vue3的课程.在这个过程中,我在freecodecamp官方号找到了一位印度老哥最近四个月内的的教程,并学习了大部分(后来实在因为口音和字幕就放弃了...)

>不需要起任何脚手架,在vscode中创建一个index.html文件,然后使用Vue他们的CDN资源

  然后在body中创建script脚本标签后,写下:

        const {createApp,ref} = Vue;

### 在引入CDN时,Vue就会被注册为一个全局变量Vue

  然后创建一个简单的模板:

        <div id="app">
        <h1>{{ message }}</h1>
        </div>

在新建的script中写出这些:

       const app = createApp({
        setup() {
          const message = ref("Hello! Vue3");
          return {
            message,
          };
        },
      }).mount("#app");
