---
title: web常见的攻击类型及安全防范总结
published: 2026-04-06
description: ''
image: ''
tags: []
category: 'HTTP'
draft: false 
lang: ''
---

# 点击劫持

点击劫持是欺骗用户点击一个并不是用户认知上的链接、按钮等的行为。
这可用于窃取登录凭据或在用户不知情的情况下获取安装恶意软件的权限。
点击劫持有时被称为“用户界面纠正”，尽管这是对“纠正”一词的误用。

## 手段背景
iframe（Inline Frame） 是 HTML 里的一个标签，作用是在当前网页里嵌入另一个独立的网页。
以下是它的正经用途: 

- 相当于在页面里开了一个 “小窗口”，加载另一个网站的内容
- 拥有独立的 DOM、独立的 Cookie、独立的 JavaScript 环境
- 常用于嵌入地图、播放器、广告、第三方组件等

        <iframe src="https://example.com" width="500" height="300"></iframe>

## iframe 与点击劫持（Clickjacking）的关系

点击劫持是一种视觉欺骗攻击：
攻击者把目标网站（比如银行、登录页）用透明 iframe 铺满页面，然后在上面覆盖诱导性按钮（如 “点击领取奖品”）。

用户以为点的是奖品按钮，实际点到了透明 iframe 里的真实按钮，从而在不知情下完成**转账、授权、删除、关注等操作。**

## 如何防范点击劫持

## 1. 使用 X-Frame-Options 响应头（最常用、最有效）
服务器返回 HTTP 头，控制页面是否允许被 iframe 嵌入。

可选值：

    DENY：完全禁止被任何页面嵌入（最安全）
    SAMEORIGIN：只允许同域名页面嵌入
    ALLOW-FROM uri：仅允许指定域名嵌入（部分浏览器已废弃）

Nginx 示例：

    add_header X-Frame-Options "DENY" always;

Apache：

    Header always set X-Frame-Options "DENY"

## 2. 使用 CSP：frame-ancestors（现代标准，更强大）
**Content-Security-Policy** 中的 **frame-ancestors** 可以精确控制哪些域名能嵌入当前页面。
示例（禁止任何页面嵌入）：

    add_header Content-Security-Policy "frame-ancestors 'none';" always;

允许自身域名：

    frame-ancestors 'self';

frame-ancestors 优先级高于 X-Frame-Options。

## 前端 JS 防嵌套（兜底方案）
通过判断 window.top 是否等于 window，检测是否被嵌套：

    if (window.top !== window.self) {
      window.top.location = window.self.location;
    }

缺点：可被绕过（iframe 用 sandbox 禁止脚本），只能作为补充。

## 4. 使用 iframe sandbox 安全属性（如果你自己要用 iframe）

当我们需要嵌入第三方页面时，限制其权限：

      <iframe src="..." sandbox="allow-same-origin allow-scripts"></iframe>

常用限制：
- 禁止表单提交
- 禁止弹窗
- 禁止顶层导航
- 减少嵌入页面被利用的风险。

## 5. 关键操作增加二次验证
转账、改密、授权等敏感操作，必须：
- 验证码
- 短信 / 邮箱验证
- 密码二次确认
- 即使被点击劫持，也无法完成危害操作。

# 跨站脚本（XSS）

跨站脚本（XSS）是一种安全漏洞，**允许攻击者向网站注入恶意客户端代码。**该代码由受害者执行从而让攻击者绕过访问控制并冒充用户

**如果 Web 应用程序没有充足的校验或加密，这些攻击就会成功。**
用户的浏览器无法检测到恶意脚本是否不可信，因此会授予其访问任何 cookie、会话令牌或其他敏感站点特定信息的权限，或者让恶意脚本重写 HTML 内容。

跨站脚本攻击通常在以下情况中发生：
- 1) 数据通过不受信任的来源（通常是 Web 请求）进入 Web 应用程序，或者 
- 2) 动态内容未经恶意内容验证就发送给 Web 用户。

**恶意内容通常包括 JavaScript，但有时也包括 HTML、Flash 或浏览器可以执行的任何其他代码。**基于 XSS 的攻击种类几乎是无限的
**但它们通常包括向攻击者传输 Cookie 等隐私数据或其他会话信息、将受害者重定向到攻击者控制的网页，或者以易受攻击的站点为幌子在用户的计算机上执行其他恶意操作。**

XSS 攻击可以分为三类：存储（也称为持久）、反射（也称为非持久）或基于 DOM。

### 存储型 XSS 攻击
- 注入的脚本永久存储在目标服务器上。当浏览器发送数据请求时，受害者会从服务器接收到该恶意脚本。

### 反射型 XSS 攻击
- 当用户被诱骗点击恶意链接、提交特制表单或浏览恶意网站时，注入的代码就会传输到易受攻击的网站。Web 服务器将注入的脚本传回用户的浏览器，例如在错误消息、搜索结果或包含作为请求的一部分发送到服务器的数据的任何其他响应中。浏览器执行恶意代码是因为它假设来自用户已经与之交互的服务器的响应是“可信”的。

### 基于 DOM 的 XSS 攻击
- 其是指通过修改原始客户端脚本所使用的 DOM 环境（在受害者浏览器中）而执行的。也就是说，页面本身没有改变，但是页面中包含的客户端代码由于对 DOM 环境的恶意修改而以期望之外的方式运行。

# 总结
XSS（Cross-Site Scripting） 全称跨站脚本攻击

攻击者往网页里注入恶意 JavaScript 代码，让浏览器在用户端执行，从而窃取信息、伪造操作、劫持账号。

核心原理是: 

1.  网站没有对用户输入做过滤 / 转义
2.  用户提交的内容（评论、昵称、搜索框等）直接被当成 HTML 渲染
3.  浏览器把攻击者写的 <script>...</script> 当成正常代码执行

危害:
窃取 Cookie、Session，直接盗号
劫持用户账号，发私信、发帖、转账
窃取页面敏感信息（手机号、地址、银行卡）
挂马、挖矿、弹窗广告、钓鱼
控制整个页面 DOM，伪造登录框

# 如何防范

## 1. 对所有用户输入进行 HTML 转义（最基础、最重要）
**把特殊字符转成实体，浏览器就不会当成标签执行：**
原字符	转义后
<	&lt;
>	&gt;
"	&quot;
'	&#x27;
&	&amp;
原则：不信任任何用户输入，全部转义后再输出。

## 2. 使用 CSP（内容安全策略） 强力拦截

CSP 是浏览器安全机制，告诉浏览器只允许加载哪些来源的脚本。

典型配置（Nginx）：

  Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://trusted.cdn.com;
  style-src 'self';
  img-src 'self' data:;
  object-src 'none';

##  设置 Cookie 为 HttpOnly

攻击者最想偷的就是 Cookie。

只要给 Cookie 加上 HttpOnly，JS 就无法读取 document.cookie(JavaScript api)。

示例（后端）：

    Set-Cookie: session=xxx; HttpOnly; Secure; SameSite=Strict

## 4. 开启 SameSite Cookie 防止 CSRF + XSS 组合攻击

    SameSite=Strict / Lax

防止跨站请求自动携带 Cookie，减少被利用空间。

## 5. 对富文本特殊处理

如果必须允许用户输入 HTML（如富文本编辑器）：

    使用白名单过滤，只允许安全标签（p, b, i, img…）
    禁止：script, iframe, onload, onclick, javascript: 等
    成熟库：JSoup（Java）、DOMPurify（前端）

千万不要自己写正则过滤，很容易被绕过。

## 6. 前端避免危险 DOM 操作

不要直接把不可信数据塞进：

    innerHTML
    document.write
    eval()
    setTimeout("字符串代码")
    location.href 等可执行代码的地方

尽量用：

    textContent 代替 innerHTML
    前端库（React/Vue）默认自动转义，可大幅降低 XSS

## 7. 输入校验与长度限制

对输入做格式校验（邮箱、手机号、用户名规则）
限制长度，减少注入空间

# 跨站请求伪造（CSRF）

CSRF（有时也称为 XSRF）是一类相关的攻击。攻击者使用户的浏览器在用户不知情的情况下向网站的后端发送请求。攻击者可以使用 XSS 载荷发起 CSRF 攻击。

维基百科提到了一个很好的 CSRF 示例。在这种情况下，某人访问了一个实际上并不是图像的图像（例如在未经过滤的聊天或论坛中），而是向银行服务器发出取款请求：

    <img
      src="https://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory" />

现在如果你登录银行账户并且你的 cookie 仍然有效（并且没有其他验证），那么在加载包含此图像的 HTML 后你将立即转账。对于需要 POST 请求的端点，可以在加载页面时以编程方式触发 <form> 提交（可能在不可见的 <iframe> 中）：

      <form action="https://bank.example.com/withdraw" method="POST">
      <input type="hidden" name="account" value="bob" />
      <input type="hidden" name="amount" value="1000000" />
      <input type="hidden" name="for" value="mallory" />
      </form>
      <script>
      window.addEventListener("DOMContentLoaded", () => {
          document.querySelector("form").submit();
      });
      </script>

# 大白话版

核心一句话：黑客利用浏览器 “跨域访问时自动带上 Cookie” 的机制，在用户不知情的情况下，替用户发起操作请求。
关键点：

    用户已经登录目标网站（会话有效，Cookie 存在）
    黑客诱导用户打开一个恶意页面
    恶意页面里的代码自动向目标网站发请求
    浏览器会自动带上目标网站的 Cookie
    服务器以为是用户本人操作，就执行了
重要区分
你说：

    执行其中的脚本，然后脚本就会带用户 cookie 向网站发送请求

这里要注意：CSRF 不一定需要 JavaScript 脚本！
最简单的 CSRF 甚至只需要一个 图片标签：
html
预览

<img src="https://bank.com/transfer?to=hacker&amount=10000" width="0" height="0">

用户一打开页面，浏览器就会自动请求这个 URL，并且自动带上 bank.com 的 Cookie。
不需要 JS，不需要执行代码，浏览器默认行为就会完成攻击。
3. 所以 CSRF 的本质不是 “执行脚本”，而是：
浏览器的 Cookie 自动携带机制
浏览器规则：

    你访问 A 网站，登录后得到 Cookie
    你在 B 网站访问 A 网站的接口
    浏览器仍然会自动带上 A 网站的 Cookie

这就是 CSRF 能成功的根本原因。
4. 那 CSRF 和 XSS 的区别是什么？（非常关键）

    XSS：攻击者在目标网站注入 JS，在目标网站域下执行→ 能偷 Cookie、能操作页面、能做任何事
    CSRF：攻击者不在目标网站注入代码，只是利用你已登录的会话，伪造请求→ 不能偷 Cookie，只能 “替你点按钮”

一句话区分：

    XSS = 劫持你的账号
    CSRF = 冒充你的身份发请求

5. 为什么 CSRF 不能偷 Cookie？
**因为恶意页面是在黑客自己的域名下，浏览器遵循同源策略，恶意 JS 根本读不到目标网站的 Cookie。**
CSRF 不需要读 Cookie，它只需要浏览器自动带上 Cookie就行。
6. 你总结的流程修正版（最标准）

    用户登录银行网站，服务器种下 Cookie，会话保持
    用户在未退出登录的情况下，打开黑客的恶意页面
    恶意页面里有一个请求（img/script/form/JS 发起）
    浏览器自动带上银行网站的 Cookie去访问银行接口
    银行服务器校验 Cookie 有效，认为是用户本人操作
    转账 / 删帖 / 改密 等操作被执行

完全正确。
7. 如何防御 CSRF？（最经典三板斧）

    Cookie 设置 SameSite
    plaintext

    SameSite=Lax / Strict

    跨站请求不自动带 Cookie，这是现代最有效防御。
    使用 CSRF Token后端生成随机 token，前端提交时必须带上，黑客无法伪造。
    验证 Referer / Origin判断请求来源是否合法。
