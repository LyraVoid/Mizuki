---
title: document.write()/document.open()到底什么时候用? 做什么?
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---

# 浏览器中的默认行为

浏览器加载原始 HTML 的时:

1.  浏览器**自动调用document.open()**
2.  **一遍解析HTML,一边用document.write() 写入内容**
3.  解析结束，浏览器**自动调用 document.close()**
→ 表示：文档流关闭，页面渲染完成

**平时写的HTML,本质上就是浏览器在调用document.write()**

# document.open() 的执行原理

打开一个新的文档流，清空当前页面内容。

document.open()：清空页面 → 开始一个全新的文档流之前的 HTML/DOM 全部消失！

document.write(str)：往文档流里写入字符串（会被当成 HTML 解析）

document.close()：关闭文档流 → 停止解析，渲染写入的内容

# document.write()的两种完全不同的行为

情况一: 页面正在解析（还没渲染完）时使用正常

·浏览器还没 close 文档流
·write 直接追加内容到当前位置
·不会覆盖页面

情况二: 页面已经渲染完成后使用(x) 会覆盖整个页面

    <button onclick="test()">点击</button>
    <script>
    function test() {
      document.write("<h1>我覆盖了整个页面！</h1>");
    }
    </script>

**再调用 document.write () → 自动触发 document.open () → 清空整个 DOM！**

# document.write () 和 document.open()的历史作用

## 1. 早期 JS 加载（同步加载脚本）

老式广告联盟、统计脚本，必须同步输出 HTML 到当前位置：
js

    document.write('<script src="ads.js"><\/script>');

## 2. 动态生成全新页面（最经典用途）
比如新开页面写入内容：

    const win = window.open();
    win.document.write('<h1>新页面</h1>');
    win.document.close();

## 3.重置 / 清空页面
    
    document.open();
    document.write('全新内容');
    document.close();

浏览器默认解析html的行为就是先进行document.open()打开页面文档流,然后一遍解析HTML,一边写入字符串到文档中. 

我们在浏览器边解析边写入的过程中,调用document.write()是没有问题的. 

但是如果我们在页面渲染完成后,文档流关闭时进行调用,则会浏览器先执行 document.open() 清空文档, 然后解析html,调用document.write() 写入文档. 就会导致页面被覆盖
