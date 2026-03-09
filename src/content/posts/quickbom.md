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

1.  BOM是什么? 
##  JavaScript的实现
**完整的JavaScript实现包含以下几个部分:**
1.  核心(ECMAScript)
2.  文档对象模型(DOM)
3.  浏览器对象模型(BOM)

JS高级程序设计开发一书中对BOM的描述为:*"IE3 和 Netscape Navigator 3 提供了浏览器对象模型（BOM） API，用于支持访问和操作浏览器的窗口。使用 BOM，开发者可以操控浏览器显示页面之外的部分"*

简单的理解: BOM就是JavaScript操作"整个浏览器窗口的"工具箱

浏览器中的BOM对象:

| 对应的 BOM 对象 | 能用 JS 做什么？ |
|------------------|------------------|
| `window` | 调整大小、移动位置、弹出新窗口 |
| `location` | 获取当前网址、跳转到新页面 |
| `history` | 前进、后退、查看访问记录 |
| `navigator` | 知道用户用什么浏览器、操作系统 |
| `screen` | 获取用户显示器的分辨率 |
| `localStorage` / `sessionStorage` | 存放数据（比如记住用户名） |

常见的BOM操作示例

1. **window(核心对象)---核心对象**

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

# 总结: BOM就像直接使用JS来操作浏览器的方方面面的一个工具, 一个接口
# 它将浏览器的功能抽象为各个BOM对象中, 用户可以通过操纵实例化这些BOM对象对浏览器本身进行编程
