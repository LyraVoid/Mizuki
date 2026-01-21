---
title: Basic Auth类型的弹框实现免密码访问
published: 2026-01-03
pinned: false
description: 使用url拼接的形式让你的Basic Auth类验证不再输入密码

tags: []
category: '教程'
draft: false
date: 2026-01-03
image: "./assets/basicauth-nopass-cover.png"
---

# 前言

问题原因呢，是我在整理书签和密码填充工具的时候发现的一个问题，对于这样的弹框，因为是直接弹出在浏览器的，密码填充工具无法进行填充账号密码等信息。

下面的鉴权方式就是：`Basic Auth`

![](./assets/basicauth-nopass-cover.png)

# 什么是Basic Auth？

Basic Auth，也称为 HTTP 基本认证（HTTP Basic Authentication），是一种用于 HTTP 协议的简单认证机制。在 Basic Auth 中，客户端在发送请求时，将用户名和密码以 Base64 编码的形式包含在请求头的 Authorization 字段中发送给服务器，服务器收到请求后，会解码 Authorization 字段并验证用户名和密码。

**如何判断你这个web页面是不是Basic Auth？**

先看弹窗样式，弹窗样式紧贴浏览器的搜索栏(上图)

打开F12 查看请求的接口响应头信息，看到Www-Authenticate的值包含Basic，并且状态码为401

![](./assets/basicauth-nopass-1.png)

# 解决问题

那么堡垒机是怎么解决此类问题的？

selenium操作这里Basic Auth网站的实现方式是：直接把用户名和密码拼接到URL中进行访问。

```sql
from selenium import webdriver
driver = webdriver.Chrome()
driver.get('http://admin:password@10.1.13.80:9100')
```

于是，我就使用他的方式进行拼接了一下，就访问成功了。

```sql
# 格式
http://<用户名>:<密码>@<ip地址或域名>:<端口号，如果是80可以不填>
https://<用户名>:<密码>@<ip地址或域名>:<端口号，如果是443可以不填>

#例如：
http://admin:password@10.1.13.80:9100
```

但是会报一个错误`Get server info from frps failed!`

这个错误是正常的用户名密码的参数传递和请求的不符，把url后面的路径删掉在访问就可以了。