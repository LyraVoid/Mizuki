---
title: CORS
published: 2026-04-02
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# 一、什么是 CORS？
**Cross-Origin Resource Sharing**
## 跨域资源共享（CORS）是一种安全绕过同源策略的机制;也就是说，它允许网页访问与服务该网页域名不同的域名上的受限制资源。

浏览器自动机制：**跨域请求时，由后端通过响应头决定是否允许访问。**

---

# 二、简单请求（Simple Request）
## 满足**全部 3 条件** 才是简单请求：
1. 请求方法只能是：**GET、HEAD、POST** 三选一
2. 仅允许以下**安全请求头**（超出就触发预检）：
   - Accept
   - Accept-Language
   - Content-Language
   - Content-Type 只能是：
     - **application/x-www-form-urlencoded**
     - **multipart/form-data**
     - **text/plain**
3. **没有自定义请求头**（如 token、auth 等）

## 行为：
- **不发送 OPTIONS 预检请求**
- 直接发送真实请求
- 浏览器看**响应头**是否允许跨域

---

# 三、预检请求（Preflight Request）

在执行某些类型的跨域 Ajax 请求时，支持 CORS 的现代浏览器会发起额外的“预检”请求，以确定是否拥有执行该动作的权限。

交叉源请求之所以采用这种预检方式，是因为它们可能对用户数据产生影响。

    OPTIONS /
    Host: service.example.com
    Origin: http://www.example.com
    Access-Control-Request-Method: PUT

如果 service.example.com 愿意接受该动作，它可以用以下报头进行回应：

    Access-Control-Allow-Origin: http://www.example.com
    Access-Control-Allow-Methods: PUT
    
**只要不满足简单请求，就触发预检！**

常见触发情况：
- 方法：**PUT、DELETE、PATCH、OPTIONS**
- 自定义请求头：`token`、`Authorization`…
- Content-Type：**application/json**
- 带凭据（cookie）+ 跨域

## 行为：
1. 浏览器**先发 OPTIONS 请求**（试探）
2. 后端返回：允许的源、方法、请求头
3. 浏览器验证通过 → **再发真实请求**
4. 不通过 → 直接拦截，真实请求不发送

---

# 四、最核心区别（面试必背表格）
| 对比 | 简单请求 | 预检请求 |
| --- | --- | --- |
| 请求方法 | GET/HEAD/POST | PUT/DELETE/PATCH 等 |
| Content-Type | 仅限3种 | application/json 等 |
| 自定义头 | 不允许 | 允许 |
| OPTIONS | **不发** | **先发 OPTIONS** |
| 次数 | 1次请求 | 2次请求（OPTIONS+真实） |

---

# 五、一句话超级记忆
**GET/POST + 无自定义头 + 非JSON格式 = 简单请求，不预检。
其他全部 = 触发 OPTIONS 预检。**

---
# CORS与JSONP比较
JSONP 的主要优势在于能够在 CORS 支持出现之前的遗留浏览器上运行（ 如 Opera Mini 和 Internet Explorer 9 及更早版本）。CORS 现已被大多数现代浏览器支持,并可作为 JSONP 模式的现代替代方案。CORS 的优势包括：

1.  虽然 JSONP 只支持 GET 请求方法，但 CORS 也支持其他类型的 HTTP 请求。

2.  CORS 使网页程序员能够使用常规的 XMLHttpRequest，其错误处理优于 JSONP。

3.  当外部网站被攻破时，JSONP 可能导致跨站脚本（XSS） 问题，而 CORS 允许网站手动解析响应以提升安全性。


### 1. 什么是预检请求？
浏览器在**复杂跨域请求前**，自动发送 **OPTIONS 请求** 询问服务器是否允许跨域，允许后才发送真实请求。

### 2. 为什么要有预检？
防止跨域请求**直接对服务器造成修改/删除**等副作用，保护服务器安全。

### 3. application/json 为什么会触发预检？
因为它**不在简单请求的 Content-Type 白名单里**。

---
