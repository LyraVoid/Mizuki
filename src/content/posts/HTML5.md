---
title: AI排泄-HTML5
published: 2026-04-07
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# 覆盖基础、语义化、存储、通信、多媒体、离线、性能、安全、新 API
一、HTML5 语义化（必考）
1. 常见语义化标签

    <header> <nav> <main> <section> <article> <aside> <footer>
    <figure> <figcaption> <time> <mark> <details> <summary>

2. 面试官必问：为什么要用语义化？

    有利于 SEO 爬虫识别页面结构
    提升 可维护性，代码结构清晰
    增强 无障碍访问（a11y）
    浏览器、设备、阅读设备更好解析

3. div 和 section/article 区别

    div：无语义，仅布局
    section：页面独立区域 / 模块
    article：可独立分发、独立存在的内容（帖子、卡片、文章）

二、HTML5 新表单特性（高频）
1. 新 input 类型

    email / tel / number / url / date / datetime-local / month / week / time / range / search / color

2. 新表单属性

    required 必填
    placeholder 提示
    autofocus 自动聚焦
    autocomplete 自动完成
    pattern 正则校验
    min / max / step 数值限制
    novalidate 关闭浏览器校验

3. 表单验证 API

    checkValidity()
    validity 对象（valueMissing/typeMismatch/patternMismatch…）

三、本地存储（超级高频）
1. localStorage /sessionStorage/cookie 对比

    localStorage：5M 左右，持久化，永不失效，仅客户端
    sessionStorage：页面会话有效，关闭标签即销毁
    cookie：4K，每次请求自动携带，可设置过期时间，服务端可读写

2. 共同点

    同源策略（协议 + 域名 + 端口）
    只能存字符串

3. 面试延伸

    如何实现 localStorage 过期？
    → 存时间戳，读取时判断
    localStorage 缺点？
    → 大小限制、同步阻塞、不能存复杂类型、不能被爬虫读取

4. indexedDB

    大型客户端数据库，异步，支持事务，可存大量数据
    大厂常问：适合什么场景？
    → PWA、离线缓存、大量结构化数据

四、多媒体 & 绘图
1. <video> / ``

    支持格式：MP4、WebM、Ogg
    常用 API：play() pause() volume currentTime duration
    事件：canplay ended timeupdate error

2. <canvas> vs <svg>

    canvas：位图，像素级操作，性能高，适合游戏 / 图表 / 复杂动画
    svg：矢量图，不失真，DOM 结构，可绑定事件，适合图标

五、HTML5 通信相关 API
1. WebSocket

    全双工、长连接、低延迟、服务端可主动推送
    对比 HTTP：HTTP 是请求 - 响应，不能主动推
    应用：聊天室、直播弹幕、实时通知

2. postMessage

    跨窗口 / 跨域通信
    window.postMessage(data, origin)
    安全要点：必须校验 origin

六、离线与 PWA（中高级必问）
1. Application Cache（已淘汰）
2. Service Worker（重点）

    代理网络请求
    实现离线可用
    缓存策略：CacheFirst / NetworkFirst / StaleWhileRevalidate
    生命周期：install → activate → fetch

3. Manifest.json

    实现添加到桌面图标
    配置启动画面、主题色

七、地理位置 API

    navigator.geolocation.getCurrentPosition()
    watchPosition()
    隐私敏感，必须用户授权
    经纬度 coords.latitude/longitude

八、拖拽 API（高频小考点）

    draggable="true"
    事件：dragstart drag dragend dragover drop
    注意：dragover 要 preventDefault() 才能触发 drop

九、Web Workers（高级）

    让 JS 在后台线程运行，不阻塞主线程
    适合大量计算：解析大文件、加密、复杂循环
    限制：不能操作 DOM、不能访问 window/document
    通信：postMessage

十、History API（路由必问）

    history.pushState()
    history.replaceState()
    popstate 事件
    前端路由实现原理（Vue Router / React Router 底层）

十一、增强的 DOM API

    querySelector / querySelectorAll
    classList：add/remove/toggle/contains
    dataset：自定义属性 data-*
    insertAdjacentHTML

十二、文件操作 API

    FileReader：读取本地文件
    File / Blob / FormData
    上传、预览图片、大文件切片上传

十三、性能与渲染
1. defer / async

    defer：顺序执行，DOMContentLoaded 之前
    async：乱序执行，下载完立即执行

2. 预加载 / 预连接

    <link rel="preload">
    <link rel="prefetch">
    <link rel="preconnect">

3. 懒加载

    loading="lazy"（img/iframe）

十四、安全相关

    iframe sandbox
    Content-Security-Policy
    referrerpolicy
    防止 XSS：textContent 而非 innerHTML，转义

十五、字节特别爱问的 HTML5 综合题

    localStorage、sessionStorage、cookie、indexedDB 区别？
    WebSocket 和 HTTP 的区别？应用场景？
    什么是语义化？为什么重要？
    前端路由原理（History API）？
    Service Worker 作用？缓存策略？
    WebWorker 解决什么问题？为什么不能操作 DOM？
    FileReader 如何实现图片预览？
    postMessage 如何实现安全跨域通信？

最后给你一句面试万能总结（背它）
HTML5 核心就是：更强语义、更好表单、本地存储、多媒体、实时通信、离线能力、线程分离、性能优化，让 Web 应用更接近原生体验。
如果你需要，我可以再给你整理一份「HTML5 面试 20 题 + 标准答案速记版」直接背完应付字节面试完全够用。
