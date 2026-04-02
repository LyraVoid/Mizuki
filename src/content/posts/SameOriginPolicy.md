---
title: 同源策略(Same-origin policy)
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'CS'
draft: false 
lang: ''
---

# 同源策略（Same-Origin Policy）
## 维基百科权威完整版讲解

### 一、什么是同源策略？
**同源策略是浏览器最核心、最基础的安全机制**。
**源被定义为 URI、主机名和端口号的组合。**
它限制了：**一个源的脚本，只能访问当前源的数据与文档，不能随意访问另一个源的数据**。
目的：**防止恶意网站窃取用户隐私、Cookie、账号信息**。

---

### 二、什么是“同源”？
必须同时满足 **3 个条件完全相同**：
1. **协议**（http / https）
2. **域名**（www.xxx.com）
3. **端口**（80 / 443 / 8080…）

只要有一个不同，就是**跨域**。

#### 举例判断
以 `http://example.com:8080/index.html` 为基准：
- `http://example.com:8080/home.html` → **同源**
- `https://example.com:8080` → **跨域（协议不同）**
- `http://api.example.com:8080` → **跨域（域名不同）**
- `http://example.com:3000` → **跨域（端口不同）**

---

### 三、同源策略限制哪些行为？（核心）
浏览器对跨域行为有 3 类严格限制：
1. **无法读取跨域的存储数据**
   Cookie、LocalStorage、SessionStorage、IndexedDB
2. **无法获取/操作跨域的 DOM**
   不能获取另一个域 iframe 里的元素
3. **无法发送跨域 AJAX/Fetch 请求**
   浏览器会拦截响应，前端拿不到数据

---

### 四、哪些标签**不受**同源策略限制？
这些标签可以**加载跨域资源**，但**不能读取资源内容**：
- `<script src="跨域地址">`
- `<link href="跨域地址">`
- `<img src="跨域地址">`
- `<video>、`
- `<iframe src="跨域地址">`

这也是 **JSONP 能跨域** 的原因。

---

### 五、为什么必须有同源策略？
如果没有：
- 恶意网站能**偷走你的登录 Cookie**
- 冒充你操作银行、邮箱、社交账号
- 窃取你的本地隐私数据
同源策略是浏览器**保护用户安全**的底线。

---

### 六、常见跨域解决方案（维基标准）
## ① CORS（Cross-Origin Resource Sharing）**最标准、最推荐**
- 后端设置响应头：`Access-Control-Allow-Origin`
- 支持**所有请求方法**（GET/POST/PUT/DELETE）
- 分为**简单请求**、**预检请求（OPTIONS）**

## ② 代理服务器（webpack-dev-server / Nginx）
- 浏览器请求**同域代理**，代理转发到目标服务器
- **浏览器无跨域，跨域交给后端**

## ③ JSONP
- 利用 `<script>` 可跨域
- **只支持 GET**
- **没有 XHR，不是 AJAX**

## ④ postMessage
- 用于 **iframe 之间跨域通信**

## ⑤ document.domain
- 仅限**主域相同，子域不同**（如 `a.example.com` ↔ `b.example.com`）
---

### 总结
同源策略是浏览器的**安全机制**，要求**协议、域名、端口**三者相同，限制跨域访问 **Cookie、DOM、AJAX**，防止数据泄露。`img/script` 可加载跨域资源但不能读取内容，主流跨域方案是 **CORS、代理、JSONP**。
---
