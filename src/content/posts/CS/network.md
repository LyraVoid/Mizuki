---
title: 一点点计算机网络的知识
published: 2026-03-27
description: '计算机科学与技术-计算机网络-协议'
image: ''
tags: ['HTTP']
category: 'CS'
draft: false 
lang: ''
---

# HTTP协议

## HTTP协议介绍
  通用描述:HTTP（HyperText Transfer Protocol，超文本传输协议）是计算机网络**应用层**中最核心的协议之一，用于在**客户端（如浏览器、Postman、移动 App）与服务器之间传输超文本（如 HTML、JSON、图片等）。**它是万维网（WWW）数据通信的基础。

## 定义
HTTP 是一种无状态、面向连接、基于请求-响应模型的应用层协议。

  ·**无状态**（Stateless）：每个请求独立，服务器不记录上下文（需靠 Cookie/JWT 等模拟状态)<br/>
  ·**可扩展**：通过 Header 字段支持新功能（如 **Authorization, Content-Encoding**）
  <br/>
  ·**媒体无关**：**可传输任意类型数据（文本、图片、视频等）**，由 **Content-Type** 标识

HTTP协议默认使用TCP作为传输层协议, HTTPS协议运行在TLS/SSL之上

## HTTP报文结构

HTTP报文的基本格式如下:
| 组成部分       | 
|----------------|
| 协议行         | 
| 协议头         | 
| 空行（`\r\n\r\n`）| 
| 协议体         | 

**HTTP请求报文结构:**

    POST /api/login HTTP/1.1\r\n
    Host: example.com\r\n
    User-Agent: Mozilla/5.0\r\n
    Content-Type: application/json\r\n
    Content-Length: 27\r\n
    Authorization: Bearer abc123\r\n
    \r\n
    {"username":"alice","pwd":"123"}

| 部分 | 内容 | 说明 |
|------|------|------|
| 起始行（Start Line） | `POST /api/login HTTP/1.1` | 方法 + 路径 + 协议版本 |
| 请求头（Headers） | `Host`, `Content-Type` 等 | 键值对，描述请求元信息 |
| 空行（CRLF） | `\r\n` | 分隔头和体（必须存在） |
| 请求体（Body） | JSON 数据 | 可选，仅 POST/PUT 等方法携带 |

抽象为对象为:

    {
      "startLine": {
        "method": "POST",
        "requestTarget": "/api/login",
        "httpVersion": "HTTP/1.1"
      },
      "headers": {
        "Host": "example.com",
        "User-Agent": "Mozilla/5.0",
        "Content-Type": "application/json",
        "Content-Length": "38",
        "Authorization": "Bearer abc123"
      },
      "body": "{\"username\":\"alice\",\"pwd\":\"123\"}"
    }
    
**HTTP响应报文结构**

    HTTP/1.1 200 OK\r\n
    Date: Mon, 27 Mar 2026 13:00:00 GMT\r\n
    Content-Type: application/json\r\n
    Content-Length: 32\r\n
    Server: nginx/1.18.0\r\n
    \r\n
    {"token":"xyz789","user_id":123}

| 部分 | 内容 | 说明 |
|------|------|------|
| 状态行（Status Line） | `HTTP/1.1 200 OK` | 协议版本 + 状态码 + 状态文本 |
| 响应头（Headers） | `Content-Type`, `Server` 等 | 描述响应元信息 |
| 空行 | `\r\n` | 分隔头和体 |
| 响应体（Body） | JSON 数据 | 实际返回内容 |

抽象为对象为:

    {
      "startLine": {
        "method": "POST",
        "requestTarget": "/api/login",
        "httpVersion": "HTTP/1.1"
      },
      "headers": {
        "Date": "Mon, 27 Mar 2026 13:00:00 GMT",
        "Content-Type": "application/json",
        "Content-Length": "32",
        "Server": "nginx/1.18.0"
      },
      "body": "{\"token\":\"xyz789\",\"user_id\":\"123\"}"
    }


**常见的响应状态码:**

根据RFC 9110（HTTP Semantics）第 15 节：
https://httpwg.org/specs/rfc9110.html#status.codes

| 类别 | 范围 | 含义 |
|------|------|------|
| 1xx | 100–199 | 信息响应（Informational）：请求已接收，继续处理 |
| 2xx | 200–299 | 成功（Success）：请求被成功接收、理解、接受 |
| 3xx | 300–399 | 重定向（Redirection）：需进一步操作以完成请求 |
| 4xx | 400–499 | 客户端错误（Client Error）：请求包含错误语法或无法满足条件 |
| 5xx | 500–599 | 服务器错误（Server Error）：服务器处理请求时出错 |


**常见的RESTful风格的响应状态码**

| 场景 | 状态码 |
|------|--------|
| 成功获取数据 | `200 OK` |
| 成功创建资源 | `201 Created` |
| 成功删除/更新（无返回） | `204 No Content` |
| 请求参数错误 | `400 Bad Request` |
| 未登录 | `401 Unauthorized` |
| 无权限 | `403 Forbidden` |
| 资源不存在 | `404 Not Found` |
| 数据冲突（如唯一键重复） | `409 Conflict` |
| 业务校验失败 | `422 Unprocessable Entity` |
| 触发限流 | `429 Too Many Requests` |
| 服务器内部错误 | `500 Internal Server Error` |
| 服务不可用 | `503 Service Unavailable` |

## HTTP工作原理

HTTP 本身不处理传输，而是依赖 **TCP 提供可靠连接**。

**流程: DNS解析->TCP三次握手->发送HTTP请求->服务器处理并返回响应->TCP四次挥手**

1：DNS 解析<br/>
客户端将域名（如 api.example.com）解析为 IP 地址（如 93.184.216.34）
 
2：TCP 三次握手<br/>
客户端 → 服务器：SYN<br/>
服务器 → 客户端：SYN-ACK<br/>
客户端 → 服务器：ACK<br/>
建立可靠连接

3：发送 HTTP 请求<br/>
客户端通过已建立的 TCP 连接，发送完整的 HTTP 请求报文

4：服务器处理并返回响应<br/>
服务器解析请求，执行业务逻辑，构造 HTTP 响应报文，通过同一TCP连接返回

5：TCP 四次挥手（或保持连接) <br/>
若 Connection: close，则关闭连接<br/>
若 Connection: keep-alive（HTTP/1.1 默认），则复用连接发送后续请求


# HTTP定位

位于应用层最顶层，直接为用户提供服务（如网页、API）
不关心底层如何传输，只定义“如何描述请求和响应”
依赖下层协议提供服务：
传输层：TCP（保证可靠、有序）
网络层：IP（负责路由）
链路层：以太网/Wi-Fi（物理传输）
