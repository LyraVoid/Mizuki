---
title: Ajax(asynchronous JavaScript and XML)技术
published: 2026-04-02
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# AJAX 技术（维基百科标准版）

## 一、AJAX 是什么？
**全称：Asynchronous JavaScript And XML（异步 JavaScript 和 XML）**
维基百科定义：
Ajax 是一套**客户端 Web 开发技术组合**，用于创建**异步 Web 应用**，让网页能**在后台与服务器交换数据**，**不刷新、不阻塞当前页面**的展示与交互。

核心组成（维基标准）：
- XMLHttpRequest（发起异步请求的核心对象）
- JavaScript（逻辑控制、DOM 更新）
- HTML/CSS（页面展示）
- 数据格式：早期 XML，现在主流 **JSON**

一句话记忆：
**AJAX = 异步请求 + 局部刷新，让网页像桌面应用一样流畅。**

---

## 二、AJAX 的核心作用
1. **异步通信**
   请求在后台发送，**不阻塞页面**，用户可继续操作。
2. **局部刷新**
   只更新需要改变的部分，**不整页刷新**。
3. **前后端分离**
   把数据交换层与表示层解耦，页面只负责渲染，API 负责数据。
4. **节省流量、减轻服务器压力**
   只传输必要数据，不重复加载 HTML/CSS/JS。

典型场景：
搜索联想、表单验证、无限滚动、聊天框、无刷新提交。

---

## 三、优点（维基百科明确列出）
1. **无刷新更新页面，体验大幅提升**
2. **异步非阻塞**，用户不用等待白屏加载
3. **减少数据传输**，降低服务器负载
4. **浏览器兼容性极好**，老 IE 到现代浏览器全覆盖
5. **提升交互性**，可做实时、动态应用

---

## 四、缺点（维基百科明确列出）
1. **破坏浏览器默认后退/前进**
   动态更新不会自动进入历史记录，后退可能异常。
2. **对 SEO 不友好**
   爬虫一般不执行 JS，异步内容不易被收录。
3. **依赖 JavaScript**
   禁用 JS 则功能失效。
4. **受同源策略限制**
   跨域需要 CORS/JSONP 等处理。
5. **回调嵌套易混乱**
   多个请求嵌套时代码难维护、难调试。
6. **弱网下体验不可控**
   延迟高时交互可能出现异常。

---

## 总结
AJAX 是异步 JavaScript + XML 的组合技术，核心是 **用 XMLHttpRequest 异步请求数据、实现页面局部刷新**，
不阻塞、不整页刷新。

优点是: 
**1.  交互性更好。来自服务器的新内容可以动态更改，无需重新加载整个页面。**
**2. 减少与服务器的连接，因为脚本和样式只需要被请求一次。节省流量**
**3. 状态可以维护在一个页面上。JavaScript 变量和 DOM 状态将得到保持，因为主容器页面未被重新加载。**

缺点是: 
**影响后退、对 SEO 不友好、依赖 JS、有跨域限制。**

---

# 使用原生AJAX代码的实例

    // 1. 创建 XMLHttpRequest 对象（AJAX 核心）
    const xhr = new XMLHttpRequest();
    
    // 2. 初始化请求：method、url、async(true=异步)
    xhr.open('GET', '/api/data', true);
    
    // 3. 监听请求状态变化
    xhr.onreadystatechange = function () {
      // readyState === 4 表示请求完成
      // status === 200 表示成功
      if (xhr.readyState === 4 && xhr.status === 200) {
        // 获取响应数据
        const data = JSON.parse(xhr.responseText);
        console.log('成功:', data);
        // 局部更新 DOM（AJAX 核心目的）
        // document.getElementById('box').innerHTML = data.msg;
      }
    };
    
    // 4. 发送请求
    xhr.send(null);


#  JSONP 的工作原理，它为什么不是真正的 Ajax？


# 一、JSONP 的工作原理
1. **浏览器允许 `<script src="...">` 跨域加载资源**，不受同源策略限制。

2. 前端**动态创建 `<script>` 标签**，`src` 指向跨域接口，并带上一个**回调函数名**（如 `?callback=abc`）。

3. 后端返回**一段可执行的 JS 代码**：`abc(数据)`。

4. 浏览器加载并执行这段代码，**调用前端预先定义的 abc 函数**，从而拿到数据。

**极简一句话：**
**JSONP = 利用 script 标签跨域特性，通过回调函数获取数据。**

---

# 二、JSONP 为什么**不是真正的 AJAX**？（核心考点）
真正 AJAX 的核心是：
**使用 XMLHttpRequest 对象 发起异步 HTTP 请求。**

而 JSONP：
1. **没有使用 XMLHttpRequest 对象**
2. **没有 HTTP 请求的概念**，只是加载 JS 文件
3. **只有 GET，没有 POST/PUT/DELETE**
4. **无法拿到状态码、请求头、进度事件**

所以：
**JSONP 只是跨域获取数据的技巧，不是 AJAX，不是异步 HTTP。**

---


## 代码示例

      <script>
      // 1. 预先定义一个全局回调函数
      function getData(res) {
      console.log('获取到数据：', res);
      }
      
      // 2. 动态创建 script 标签，发起跨域请求
      const script = document.createElement('script');
      // 关键：callback=getData
      script.src = 'https://cross-domain.com/api?callback=getData';
      
      // 3. 插入页面，发起请求
      document.body.appendChild(script);
      </script>
      
# 简单总结

**JSONP 利用 script 标签跨域，通过回调函数获取数据，没有 XHR，所以不是 AJAX，只支持 GET。**
