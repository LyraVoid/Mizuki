---
title: HTTP-cookie
published: 2026-04-06
description: ''
image: ''
tags: []
category: 'HTTP协议'
draft: false 
lang: ''
---


# HTTP Cookie

## HTTP Cookie（也叫 Web Cookie 或浏览器 Cookie）是服务器发送到用户浏览器并保存在本地的一小块数据

浏览器会存储 cookie 并在下次向同一服务器再发起请求时携带并发送到服务器上。

通常，它用于告知服务端两个请求是否来自同一浏览器——如保持用户的登录状态。Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。

Cookie 主要用于以下三个方面：

- 会话状态管理
如用户登录状态、购物车、游戏分数或其他需要记录的信息

- 个性化设置
如用户自定义设置、主题和其他设置

- 浏览器行为跟踪
如跟踪分析用户行为等

Cookie 曾一度用于客户端数据的存储，因当时并没有其他合适的存储办法而作为唯一的存储手段，但现在推荐使用现代存储 API。


由于服务器指定 Cookie 后，浏览器的每次请求都会携带 Cookie 数据，会带来额外的性能开销（尤其是在移动环境下）。新的浏览器 API 已经允许开发者直接将数据存储到本地，如使用 Web storage API（localStorage 和 sessionStorage）或 IndexedDB 。


# 创建 Cookie

服务器收到 HTTP 请求后，服务器可以在响应标头里面添加一个或多个 Set-Cookie 选项。浏览器收到响应后通常会保存下 Cookie，并将其放在 HTTP Cookie 标头内，向同一服务器发出请求时一起发送。你可以指定一个过期日期或者时间段之后，不能发送 cookie。你也可以对指定的域和路径设置额外的限制，以限制 cookie 发送的位置。


(Set-Cookie---Set-Cookie HTTP 响应标头用于将 cookie 由服务器发送到用户代理，以便用户代理在后续的请求中可以将其发送回服务器。要发送多个 cookie，则应在同一响应中发送多个 Set-Cookie 标头。)

## Set-Cookie 和 Cookie 标头

服务器使用 Set-Cookie 响应头部向用户代理（一般是浏览器）发送 Cookie 信息。一个简单的 Cookie 可能像这样：

    Set-Cookie: <cookie-name>=<cookie-value>

这指示服务器发送标头告知客户端存储一对 cookie：

    HTTP/1.0 200 OK
    Content-type: text/html
    Set-Cookie: yummy_cookie=choco
    Set-Cookie: tasty_cookie=strawberry
    
    [页面内容]

现在，对该服务器发起的每一次新请求，浏览器都会将之前保存的 Cookie 信息通过 Cookie 请求头部再发送给服务器。

    GET /sample_page.html HTTP/1.1
    Host: www.example.org
    Cookie: yummy_cookie=choco;tasty_cookie=strawberry

# 定义 Cookie 的生命周期

Cookie 的生命周期可以通过两种方式定义：

会话期 Cookie 会在当前的会话结束之后删除。浏览器定义了“当前会话”结束的时间，一些浏览器重启时会使用会话恢复。这可能导致会话 cookie 无限延长。
持久性 Cookie 在过期时间（Expires）指定的日期或有效期（Max-Age）指定的一段时间后被删除。

例如: 

    Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;

如果你的站点对用户进行身份验证，则每当用户进行身份验证时，它都应重新生成并重新发送会话 Cookie，甚至是已经存在的会话 Cookie。此技术有助于防止会话固定攻击（session fixation attacks），在该攻击中第三方可以重用用户的会话。

## 限制访问 Cookie

有两种方法可以确保 Cookie 被安全发送，并且不会被意外的参与者或脚本访问：Secure 属性和 HttpOnly 属性。

标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。

它永远不会使用不安全的 HTTP 发送（本地主机除外），这意味着中间人攻击者无法轻松访问它。不安全的站点（在 URL 中带有 http:）无法使用 Secure 属性设置 cookie。
。但是，Secure 不会阻止对 cookie 中敏感信息的访问。例如，有权访问客户端硬盘（或，如果未设置 HttpOnly 属性，则为 JavaScript）的人可以读取和修改它。

JavaScript Document.cookie API 无法访问带有 HttpOnly 属性的 cookie；此类 Cookie 仅作用于服务器。例如，持久化服务器端会话的 Cookie 不需要对 JavaScript 可用，而应具有 HttpOnly 属性。此预防措施有助于缓解跨站点脚本（XSS）攻击。

    Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly

## 定义 Cookie 发送的位置
Domain 和 Path 标识定义了 Cookie 的作用域：即允许 Cookie 应该发送给哪些 URL。

## Domain 属性

Domain 指定了哪些主机可以接受 Cookie。如果不指定，该属性默认为同一 host 设置 cookie，不包含子域名。如果指定了 Domain，则一般包含子域名。因此，指定 Domain 比省略它的限制要少。但是，当子域需要共享有关用户的信息时，这可能会有所帮助。

例如，如果设置 Domain=mozilla.org，则 Cookie 也包含在子域名中（如 developer.mozilla.org）。

Path 属性

Path 属性指定了一个 URL 路径，该 URL 路径必须存在于请求的 URL 中，以便发送 Cookie 标头。以字符 %x2F (“/”) 作为路径分隔符，并且子路径也会被匹配

例如，设置 Path=/docs，则以下地址都会匹配：

    /docs
    /docs/
    /docs/Web/
    /docs/Web/HTTP

但是这些请求路径不会匹配以下地址：

    /
    /docsets
    /fr/docs

## SameSite 属性

SameSite 属性允许服务器指定是否/何时通过跨站点请求发送（其中站点由注册的域和方案定义：http 或 https）。这提供了一些针对跨站点请求伪造攻击（CSRF）的保护。它采用三个可能的值：Strict、Lax 和 None。

使用 Strict，cookie 仅发送到它来源的站点。Lax 与 Strict 相似，只是在用户导航到 cookie 的源站点时发送 cookie。例如，通过跟踪来自外部站点的链接。None 指定浏览器会在同站请求和跨站请求下继续发送 cookie，但仅在安全的上下文中（即，如果 SameSite=None，且还必须设置 Secure 属性）。如果没有

## 大白话讲解:

SameSite 就是浏览器给 Cookie 加的一个 **「跨站访问门禁」**。\
你在 A 网站登录后，浏览器会存 A 网站的 Cookie（相当于你的「家门钥匙」）\
正常情况：你访问 A 网站，浏览器自动把钥匙给 A，没问题\
风险情况：你点了一个恶意网站 B 的链接，B 偷偷给 A 网站发请求，如果浏览器把 A 的钥匙给了 B，B 就能冒充你操作 A 网站（这就是 CSRF 攻击）\
SameSite 的作用：规定「什么时候能把钥匙给别人」，防止坏人偷用你的钥匙

## 三个值：Strict / Lax / None，大白话翻译

### 1. Strict（最严：只给自家，外人一概不给）

人话翻译：我的钥匙，只有我自己开门能用，别人碰都别想碰。\
规则：只有「完全同站」的请求，才会带 Cookie\
同站：域名、协议（http/https）完全一样，比如你在 https://a.com 访问 https://a.com/xxx
跨站：从 https://b.com 跳转到 https://a.com，哪怕是点链接，也绝对不带 

Cookie生活类比：你家门钥匙，只有你自己掏出来开门能用，你朋友、快递员、陌生人，谁都不能用你的钥匙开门
适用场景：银行、支付、核心账号操作等极高安全要求的场景
缺点：太严了！比如你在微信里点朋友发的银行链接，打开后会直接显示「未登录」，因为 Strict 不让跨站带 Cookie

### 2. Lax（宽松：自家能用，安全的跨站也能用，危险的不给）

人话翻译：我的钥匙，自己开门能用，正常的「点链接跳转」也能用，但偷偷摸摸的请求绝对不给。\
规则：同站请求必带，安全的跨站请求（GET 跳转）带，危险的跨站请求（POST 提交、iframe 嵌入、AJAX 请求）绝对不带\
允许带的情况：你点了一个 https://b.com 页面里的 <a href="https://a.com"> 链接，跳转到 A 网站，会带 Cookie（正常的用户主动跳转）
禁止带的情况：B 网站偷偷用 <form action="https://a.com/transfer" method="POST"> 给 A 发转账请求，绝对不带 Cookie，转账失败\
生活类比：你家门钥匙，自己开门能用，朋友给你递钥匙（正常点链接）也能用，但陌生人偷偷配钥匙、撬锁（偷偷发请求），绝对用不了

适用场景：绝大多数网站的默认选择（现在浏览器已经把 Lax 设为 Cookie 的默认 SameSite 值了）
优点：安全 + 体验平衡，既防 CSRF，又不影响正常的跨站跳转登录

### 3. None（无限制：谁要都给，必须加 Secure）

人话翻译：我的钥匙，谁要都给，但必须走「安全通道」（HTTPS）。\
规则：不管是同站还是跨站，所有请求都带 Cookie，但强制要求必须是 HTTPS 协议（必须加 Secure 属性，否则浏览器直接拒绝）\
生活类比：你家门钥匙，谁要都给，但只能在「有保安的安全通道」里递钥匙，绝对不能在大街上随便给
适用场景：必须跨站共享 Cookie 的场景，比如：\

第三方登录（微信 / QQ 登录第三方网站）
跨域 iframe 嵌入（比如把 A 网站的支付页面嵌到 B 网站里）\
前后端分离的跨域请求（但现在更推荐用 JWT 存 Cookie 加 Lax/Strict）\
风险：如果不加 Secure，等于把钥匙随便给所有人，CSRF 风险极高，现在浏览器已经不允许 HTTP 下用 SameSite=None 了

下面是例子：

    Set-Cookie: mykey=myvalue; SameSite=Strict


# Cookie 前缀

cookie 的机制使得服务器无法确认 cookie 是在安全来源上设置的，甚至无法确定 cookie 最初是在哪里设置的。

子域上的易受攻击的应用程序可以使用 Domain 属性设置 cookie，从而可以访问所有其他子域上的该 cookie。会话劫持攻击中可能会滥用此机制。有关主要缓解方法，请参阅会话劫持（session fixation）。

__Host-
如果 cookie 名称具有此前缀，则仅当它也用 Secure 属性标记、从安全来源发送、不包括 Domain 属性，并将 Path 属性设置为 / 时，它才在 Set-Cookie 标头中接受。这样，这些 cookie 可以被视为“domain-locked”。

__Secure-
如果 cookie 名称具有此前缀，则仅当它也用 Secure 属性标记，是从安全来源发送的，它才在 Set-Cookie 标头中接受。

该前缀限制要弱于 __Host- 前缀。

带有这些前缀的 Cookie，如果不符合其限制的会被浏览器拒绝。请注意，这确保了如果子域要创建带有前缀的 cookie，那么它将要么局限于该子域，要么被完全忽略。由于应用服务器仅在确定用户是否已通过身份验证或 CSRF 令牌正确时才检查特定的 cookie 名称，因此，这有效地充当了针对会话劫持的防御措施。


## JavaScript 通过 Document.cookie 访问 Cookie

通过 Document.cookie 属性可创建新的 Cookie。如果未设置 HttpOnly 标记，你也可以从 JavaScript 访问现有的 Cookie。

    document.cookie = "yummy_cookie=choco";
    document.cookie = "tasty_cookie=strawberry";
    console.log(document.cookie);
    // logs "yummy_cookie=choco; tasty_cookie=strawberry"

通过 JavaScript 创建的 Cookie 不能包含 HttpOnly 标志。

请留意在安全章节提到的安全隐患问题，JavaScript 可以通过跨站脚本攻击（XSS）的方式来窃取 Cookie。

# 安全

缓解涉及 Cookie 的攻击的方法：

使用 HttpOnly 属性可防止通过 JavaScript 访问 cookie 值。
用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短，并且 SameSite 属性设置为 Strict 或 Lax。在支持 SameSite 的浏览器中，这样做的作用是确保不与跨站点请求一起发送身份验证 cookie。因此，这种请求实际上不会向应用服务器进行身份验证。


# 跟踪和隐私

## 第三方 Cookie

Cookie 与特定域和方案（例如，http 或 https）相关联，如果设置了 Set-Cookie Domain 属性，也可能与子域相关联。如果该 cookie 域和方案匹配当前的页面，则认为该 cookie 和该页面来自同一站点，则称为第一方 cookie（first-party cookie）。

如果域和方案不同，则它不认为来自同一个站点，被称为第三方 cookie（third-party cookie）。虽然托管网页的服务器设置第一方 Cookie 时，但该页面可能包含存储在其他域中的服务器上的图像或其他组件（例如，广告横幅），这些图像或其他组件可能会设置第三方 Cookie。这些主要用于在网络上进行广告和跟踪。例如，谷歌使用的 cookie 类型。

第三方服务器可以基于同一浏览器在访问多个站点时发送给它的 cookie 来建立用户浏览历史和习惯的配置文件。Firefox 默认情况下会阻止已知包含跟踪器的第三方 cookie。第三方 cookie（或仅跟踪 cookie）也可能被其他浏览器设置或扩展程序阻止。阻止 Cookie 会导致某些第三方组件（例如社交媒体窗口小部件）无法正常运行。
