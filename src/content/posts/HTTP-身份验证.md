---
title: HTTP-身份验证
published: 2026-04-05
description: ''
image: ''
tags: []
category: 'HTTP协议'
draft: false 
lang: ''
---

# HTTP 身份验证

HTTP 提供一个用于权限控制和认证的通用框架。
本页介绍了通用的 HTTP 认证框架，并且展示了如何通过 HTTP 的“Basic”模式限制对你服务器的访问。

## 通用的 HTTP 认证框架

RFC 7235 定义了一个 HTTP 身份验证框架，服务器可以用来质询（challenge）客户端的请求，客户端则可以提供身份验证凭据。

质询与响应的工作流程如下：

1.  服务器端向客户端返回 401（Unauthorized，未被授权的）响应状态码，并在 WWW-Authenticate 响应标头提供如何进行验证的信息，其中至少包含有一种质询方式。
2.  之后，想要使用服务器对自己身份进行验证的客户端，可以通过包含凭据的 Authorization 请求标头进行验证。
3.  通常，客户端会向用户显示密码提示，然后发送包含正确的 Authorization 标头的请求。

# 代理认证

与上述同样的询问质疑和响应原理适用于代理认证。
由于资源认证和代理认证可以并存，区别于独立的标头和响应状态码。
对于代理，询问质疑的状态码是 407（必须提供代理证书），响应标头 Proxy-Authenticate 至少包含一个可用的质询，并且请求标头 Proxy-Authorization 用作向代理服务器提供凭据。

# 禁止访问

如果（代理）服务器收到无效的凭据，它应该响应 401 Unauthorized 或 407 Proxy Authentication Required，用户可以发送新的请求或替换 Authorization 标头字段。

如果（代理）服务器接受的有效凭据不足以访问给定的资源，服务器将响应 403 Forbidden 状态码。
与 401 Unauthorized 或 407 Proxy Authentication Required 不同的是，该用户无法进行身份验证并且浏览器不会提出新的尝试。

在所有情况下，服务器更可能返回 404 Not Found 状态码，以向没有足够权限或者未正确身份验证的用户隐藏页面的存在。

## 大白话

1.  401 Unauthorized / 407 Proxy Authentication Required
意思：你根本没登录、账号密码错了、凭证无效。
401/407 = 没登录 / 登录失败 → 可以重新登录。

2.  403 Forbidden
意思：你登录成功了，但你没权限看这个内容。
403 = 登录了，但没权限 → 死局，不能靠重新登录解决。

3.  404 Not Found
意思：服务器故意骗你，说 “页面不存在”。
因为如果直接返回 401/403，攻击者就知道：这个页面真的存在，只是我没权限。
目的：隐藏资源，不让坏人知道这里有东西.


# HTTP 认证的字符编码
浏览器使用 utf-8 编码用户名和密码。

## WWW-Authenticate 与 Proxy-Authenticate 标头

WWW-Authenticate 与 Proxy-Authenticate 响应标头指定了为获取资源访问权限而进行身份验证的方法。它们需要明确要进行验证的方案，这样希望进行授权的客户端就知道该如何提供凭据。

这两个标头的语法形式如下：

    WWW-Authenticate: <type> realm=<realm>
    Proxy-Authenticate: <type> realm=<realm>

# Authorization 与 Proxy-Authorization 标头

Authorization 与 Proxy-Authorization 请求标头包含有用来向（代理）服务器证明用户代理身份的凭据。这里同样需要指明验证的 <type>，其后跟有凭据信息，该凭据信息可以被编码或者加密，取决于采用的是哪种验证方案。

    Authorization: <type> <credentials>
    Proxy-Authorization: <type> <credentials>

# 身份验证方案

通用 HTTP 身份验证框架可以被多个验证方案使用。不同的验证方案会在安全强度以及在客户端或服务器端软件中可获得的难易程度上有所不同。

常见的验证方案包括：
Basic
参见 RFC 7617，base64 编码凭据。详情请参阅下文。

Bearer
参见 RFC 6750，bearer 令牌通过 OAuth 2.0 保护资源。

Digest
参见 RFC 7616，Firefox 93 及更高版本支持 SHA-256 算法。以前的版本仅支持 MD5 散列（不建议）。

HOBA
参见 RFC 7486，阶段三，HTTP Origin-Bound 认证，基于数字签名。

Mutual
参见 RFC 8120

Negotiate / NTLM
参见 RFC4599

VAPID
参见 RFC 8292

SCRAM
参见 RFC 7804

AWS4-HMAC-SHA256

# Basic 验证方案

“Basic”HTTP 验证方案是在 RFC 7617 中规定的，在该方案中，使用用户的 ID/密码作为凭据信息，并且使用 base64 算法进行编码。

## Basic 验证方案的安全性

由于用户 ID 与密码是是以明文的形式在网络中进行传输的（尽管采用了 base64 编码，但是 base64 算法是可逆的），所以基本验证方案并不安全。basic 验证方案应与 HTTPS/TLS 协议搭配使用。

## 使用 Apache 限制访问和 basic 身份验证
要对 Apache 服务器上的目录进行密码保护，你需要一个 .htaccess 和 a .htpasswd 文件。

该 .htaccess 文件格式通常看起来像这样：

    AuthType Basic
    AuthName "Access to the staging site"
    AuthUserFile /path/to/.htpasswd
    Require valid-user

该 .htaccess 文件引用一个 .htpasswd 文件，其中每行用冒号（:）分隔的用户名和密码。
你不能看到真实的密码因为它们是散列（在这个例子中是使用了 MD5）。
你可以命名 .htpasswd 文件为你所喜欢的名字，但是应该保证这个文件不被其他人访问。(Apache 通常配置阻止访问 .ht* 类的文件).

    aladdin:$apr1$ZjTqBB3f$IF9gdYAGlMrs2fuINjHsz.
    user2:$apr1$O04r.y2H$/vEkesPhVInBByJUkXitA/

# nginx 访问限制和 basic 认证

在 nginx 配置中，你需要指定一个要保护的 location 并且 auth_basic 指令提供密码保护区域的名称。

auth_basic_user_file 指令指定包含加密的用户凭据 .htpasswd 文件，就像上面的 apache 例子。

    location /status {
        auth_basic           "Access to the staging site";
        auth_basic_user_file /etc/apache2/.htpasswd;
    }

## 使用 URL 中的身份凭据进行的访问
许多客户端同时支持避免弹出登录框，而是使用包含用户名和密码的经过编码的 URL，如下所示：

    https://username:password@www.example.com/
    
这种 URL 已被弃用。在 Chrome 中，URL 中的 username:password@ 部分甚至会因为安全原因而被移除。

# 所有常用的 Token、认证信息,标准存放位置

1.  JWT / Token / AccessToken
→ 请求头 Authorization: Bearer <token>

2.  Basic Auth（账号密码）
→ Authorization: Basic base64 (用户：密码)

3.  Cookie Session
→ Cookie: JSESSIONID=xxx 或 session=xxx

4.  API Key（简单密钥）
→ 可放 Header 或 Query，但优先 Header

## 提问为什么JWT不能放在请求体中? 而要放在标头

1.  GET 请求根本没有请求体

GET、HEAD、OPTIONS 这些请求，HTTP 标准里就没有 body
你把 token 放 body，GET 直接用不了
而前端 90% 接口都是 GET（获取数据）

2.  请求体要被解析，标头不用解析

后端拿到请求：

- Header 直接读，一秒拿到 token
- Body 要解析 JSON/Form，慢、费性能、还要解码
认证是最早一步，必须最快拿到 token 判断是否放行

3.  网关、代理、防火墙不认请求体

Nginx、Kong、APISIX、CDN、防火墙等,只看 Header，不解析 Body！
token 放 body：网关根本拿不到,无法做限流、鉴权、路由 → 架构直接废掉

4.  HTTP 规范就是这么设计(人家有专门用于认证的请求头,你非要放在body里面解析)
