---
title: BOM
published: 2026-03-04
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---

#  灵魂三问: BOM是什么? BOM有什么用? 我可以使用BOM做哪些事情?

## 1.  BOM是什么? 

**JavaScript的实现**

**完整的JavaScript实现包含以下几个部分:**

1.  核心(ECMAScript)
2.  文档对象模型(DOM)
3.  浏览器对象模型(BOM)

JS高级程序设计开发一书中对BOM的描述为:*"IE3 和 Netscape Navigator 3 提供了浏览器对象模型（BOM） API，用于支持访问和操作浏览器的窗口。使用 BOM，开发者可以操控浏览器显示页面之外的部分"*

简单的理解: **BOM就是JavaScript操作"整个浏览器窗口的"工具箱,它是使用 JavaScript 开发 Web 应用程序的核心。**

**浏览器中的BOM对象:**

| 对应的 BOM 对象 | 能用 JS 做什么？ |
|------------------|------------------|
| `window` | 调整大小、移动位置、弹出新窗口 |
| `location` | 获取当前网址、跳转到新页面 |
| `history` | 前进、后退、查看访问记录 |
| `navigator` | 知道用户用什么浏览器、操作系统 |
| `screen` | 获取用户显示器的分辨率 |
| `localStorage` / `sessionStorage` | 存放数据（比如记住用户名） |

常见的BOM操作示例:

**1. window(核心对象)---核心对象**

BOM的核心是window对象, window对象表示浏览器的实例.

window对象在浏览器中具有两重身份:

1.  ECMAScript中的 Global 对象: **所有全局变量、函数都挂在这个对象上**
2.  浏览器窗口中的JS接口: **可以控制窗口大小、弹出新窗口、跳转页面等**

**这意味着网页中定义的所有对象、变量和函数都以window作为其Global对象，都可以访问其上定义的parseInt()等全局方法。** 

相当于在浏览器window这个家里, 用户编写的所有对象、变量和函数 都在这个家里生成
且例如parseInt()这类全局方法也在这个家里, 你也可以直接调用

这体现在平时写JS代码上:

    let numStr = "123";
    let num = parseInt(numStr); // 直接用，不需要 window.
    console.log(num); // 123

等价与:

    let numStr = "123";
    let num = window.parseInt(numStr); // 和上面一样！
    console.log(num); // 123


2.  **location对象----控制网址**

location对象提供了当前窗口中加载文档的信息，以及通常的导航功能。
而且这个对象独特的地方在于，**它既是 window 的属性，也是 document 的属性。**
也就是说，window.location 和 document.location 指向同一个对象。

并且location 对象不仅保存着当前加载文档的信息，也保存着把 URL解析为离散片段后能够通过属性访问的信息。

其中location的属性值有:
| 属性 |   返回值  |
|-----|----------|
|location.host|服务器名及端口号|
|location.hostname|服务器名|
|location.href|当前加载页面的完整URL。location的toString()方法返回这个值 |
|location.port|请求的端口。如果URL中没有端口，则返回空字符串 |
|location.protocol|页面使用的协议。通常是"http:"或"https:" |
|location.search  |URL的查询字符串。这个字符串以问号开头 |
|location.username/password|域名前指定的用户名和密码|
|location.origin|URL的原地址|

一些简单的location对象的使用:

    // 获取当前完整网址
    console.log(location.href); 
    // 输出：https://example.com/page?id=123

    // 跳转到新页面（会刷新）
    location.href = "https://google.com";

    // 只改查询参数（不刷新，用于 SPA）
    location.search = "?tab=settings";

3.  **navigator对象---获取浏览器信息**

navigator对象作为最早引入的BOM标准对象,只要浏览器启用JavaScript，navigator对象就一定存在。
| 属性 |   返回值  |
|-----|----------|
|appName| 浏览器全名 |
|appVersion |浏览器版本。通常与实际的浏览器版本不一致
|cookieEnabled |返回布尔值，表示是否启用了cookie 
|deviceMemory |返回单位为GB的设备内存容量
|getUserMedia() |返回与可用媒体设备硬件关联的流 
|hardwareConcurrency |返回设备的处理器核心数量 
|javaEnabled 返回布尔值，|表示浏览器是否启用了Java 
|language 返回浏览器的主语言 |languages 返回浏览器偏好的语言数组 
4. **screen对象**

这个对象在实际编程中很少使用;

**这个对象中保存的纯粹是客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度和像素高度**

5. **history对象**

**history 对象表示当前窗口首次使用以来用户的导航历史记录。**

因为 history 是 window 的属性，所以每个 window 都有自己的 history 对象。
出于安全因素的考虑，这个对象不会暴露用户访问过的URL,但是可以通过它在不知道实际URL的情况下前进和后退

*go()方法的简单使用*

go()方法可以在用户历史记录中沿任何方向导航，可以前进也可以后退。
这个方法只接收一个参数，
这个参数可以是一个整数，表示前进或后退多少步。负值表示在历史记录中后退（类似点击浏览器的“后
退”按钮），而正值表示在历史记录中前进（类似点击浏览器的“前进”按钮）。

例如: 
    //后退一页
    history.go(-1);

    //前进一页
    history.go(1);

    //后退两页
    history.go(-2);

同时我们也可以使用back() , forward()方法来进行浏览器的前进和后退

history对象还有一个length属性,该属性表示历史记录中有多个条目。

这个属性反映了历史记录的数量，包括可以前进和后退的页面。对于窗口或标签页中加载的第一个页面，history.length 等于 1。



# 2.  BOM有什么用?

 如果没有 BOM (Browser Object Model，浏览器对象模型)，JavaScript 在 Web 开发中将失去与浏览器窗口本身交互的能力。
 通过 DOM (Document Object Model) 用户可以更好的操作页面内容（如修改文本、样式、结构）
 BOM 提供了操作浏览器窗口、导航历史、屏幕属性、定时器以及本地存储等核心功能。
 
**可以这么说 ,没有 BOM,那么现代 Web 应用程序将退化为静态文档，几乎无法实现任何动态交互或复杂逻辑。就会变成纯一张白纸,而不是一个电子屏幕!!!**

以下是缺乏 BOM 会给开发带来的具体困难和挑战：

**1.  无法控制页面导航与历史记录**

缺失对象: *window.location, window.history*

后果:
    无法跳转页面: 开发者无法通过代码让用户跳转到新 URL (location.href) 或重定向用户。
    无法实现单页应用 (SPA): 现代框架（React, Vue, Angular）依赖 history.pushState 和 popstate 事件来管理前端路由。没有 BOM，SPA 架构将不复存在，每次交互都必须强制刷新整个页面。
    无法控制后退/前进: 无法编程式地控制浏览器的“后退”或“前进”按钮行为。

**2.  无法执行定时任务与异步延迟**

缺失对象: *window.setTimeout, window.setInterval*

后果:
    无延迟执行: 无法实现“点击后 3 秒提示”、“轮播图自动切换”、“防抖/节流”等基础逻辑。
    无轮询机制: 无法定期向服务器请求最新数据（如聊天室消息更新、股票价格刷新），实时应用将无法构建。
    动画受限: 虽然 CSS 可以处理部分动画，但复杂的 JS 驱动动画（依赖于时间戳计算）将变得极其困难甚至不可能。


**3.  无法与用户进行基础交互反馈**

缺失对象: *window.alert, window.confirm, window.prompt*

后果:
    虽然现代开发倾向于使用自定义模态框（基于 DOM），但在没有 BOM 的情况下，连最基础的浏览器原生警告、确认对话框都无法触发。这意味着如果 DOM 尚未加载或出错，开发者没有任何原生的手段阻断流程或通知用户。

**4.  无法获取环境与屏幕信息 (响应式设计受阻)**

缺失对象: *window.screen, window.navigator, window.innerWidth/innerHeight*

后果:
    自适应布局困难: 无法通过 JS 获取视口大小 (innerWidth) 来动态调整布局或加载不同资源。
    设备检测失效: 无法获取 User-Agent (navigator.userAgent) 来判断设备类型（手机/PC）、操作系统或浏览器版本，导致无法做兼容性处理。
    全屏功能缺失: 无法调用全屏 API（通常挂载在 window 或 document 但由 BOM 环境支持）。

**5.  无法进行本地数据存储**

缺失对象: *window.localStorage, window.sessionStorage*

后果:
    状态无法持久化: 用户刷新页面后，所有临时数据（如购物车内容、表单草稿、主题设置、登录 Token）都会丢失。
    离线应用不可行: 无法利用本地存储构建 PWA (Progressive Web Apps) 或离线优先的应用。
    性能下降: 为了保持状态，所有数据必须存储在服务器端，导致频繁的网络请求，增加服务器负载和延迟。

**6.  无法处理多窗口与框架通信**

缺失对象: *window.open, window.frames, window.postMessage*

后果:
    无法打开弹窗: 无法打开新窗口或标签页进行辅助操作（如支付网关、第三方登录）。
    跨域通信断裂: postMessage 是不同源窗口/iframe 之间通信的唯一安全标准。没有它，微前端架构、嵌入第三方插件（如 YouTube 视频播放器控制）将无法实现。

**7.  全局作用域与事件根节点的缺失**

核心概念: **在浏览器中，window 对象是全局对象 (Global Object)。**

后果:
    变量挂载无处安放: 所有在全局 scope 声明的变量和函数实际上都是 window 的属性。没有 BOM，JS 的全局上下文将变得模糊或未定义。
    事件监听根节点丢失: 许多全局事件（如 resize, scroll, load, error）是绑定在 window 对象上的。没有它，开发者无法监听窗口大小变化或页面加载完成事件。


# 总结: BOM就像直接使用JS来操作浏览器的方方面面的一个工具, 一个接口
# 它将浏览器的功能抽象为各个BOM对象中, 用户可以通过操纵实例化这些BOM对象对浏览器本身进行编程
