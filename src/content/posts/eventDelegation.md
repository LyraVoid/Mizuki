---
title: 事件委托
published: 2026-04-02
description: ''
image: ''
tags: []
category: 'JavaScript'
draft: false 
lang: ''
---


# DOM事件流的概念

DOM事件流,指的是**事件在HTML元素之间触发和传播的完整流程**

它分为三个顺序阶段:


## 捕获阶段

事件会从最顶层的根节点（window） 开始，从上往下 传播，直到目标元素。

**window → document → html → body → 父元素 → 目标元素**

## 目标阶段

事件到达你真正点击 / 操作的元素（触发目标元素的事件）。

## 冒泡阶段

事件从目标元素开始，从下往上 传回根节点。

**目标元素 → 父元素 → body → html → document → window**

为父元素div和子元素button 都绑定点击事件,查看执行顺序:

      <div id="parent">
      父元素
      <button id="child">子元素（点击）</button>
      </div>
      
      <script>
      const parent = document.getElementById('parent');
      const child = document.getElementById('child');
      
      // 【冒泡阶段】执行（默认，第三个参数不传/写 false）
      parent.addEventListener('click', () => {
          console.log('父元素 - 冒泡触发');
      });
      
      child.addEventListener('click', () => {
          console.log('子元素 - 冒泡触发');
      });
      </script>

输出结果为:
    子元素 - 冒泡触发
    父元素 - 冒泡触发


**默认所有事件都会在冒泡阶段执行,所以会先触发子元素,再向上冒泡触发父元素**

# 捕获阶段如何是使用
**addEventListener** 第三个参数设为 **true**，事件就会在捕获阶段执行
：

    // 【捕获阶段】执行
    parent.addEventListener('click', () => {
      console.log('父元素 - 捕获触发');
    }, true); // 第三个参数 = true
    
    child.addEventListener('click', () => {
      console.log('子元素 - 冒泡触发');
    });

点击子元素, 输出结果为:

    父元素 - 捕获触发
    子元素 - 冒泡触发

捕获是从上往下执行的, 所以父元素会先执行

## 如何阻止冒泡

实际开发中我们经常不希望事件向上传播,会使用**event.stopPropagation()** 来阻止:

    child.addEventListener('click', (e) => {
      e.stopPropagation(); // 阻止事件继续冒泡/捕获
      console.log('子元素触发');
    });

此时我们点击子元素,父元素不会触发, 事件传播就被切断了


# 事件委托(event delegation)

## 事件委托的背景

如果我们有这样一段代码:

      <ul id="parent-list">
     	<li id="post-1">Item 1</li>
     	<li id="post-2">Item 2</li>
     	<li id="post-3">Item 3</li>
     	<li id="post-4">Item 4</li>
     	<li id="post-5">Item 5</li>
     	<li id="post-6">Item 6</li>
      </ul>

假设当每一个li标签被点击时,都会触发一个特定事件, 那么我们可以为每一个li 添加addEventListener

但如果li元素经常被添加和移除呢? 那可就艹了蛋了, 我们需要经常的去添加和移除事件监听器,尤其是当添加和删除代码在应用内不同位置时。

所以,最好的解决方案就是--**给父元素添加事件监听器**

**面试官会问: 那你TM怎么知道用户点击了哪个元素啊?**

很简单,当事件冒泡到父元素的时候,我们可以通过检查**事件对象event** 的**目标属性target**,获取对点击节点的引用

    document.getElementById("parent-list").addEventListener("click", function(e) {
   	if(e.target && e.target.nodeName == "LI") {
    		console.log("List item ", e.target.id.replace("post-", ""), " was clicked!");
   	}
    });


**这样，在父元素中添加一个点击事件监听器。 当事件监听器被触发时，检查事件元素，确保它是需要响应的类型。 如果是 LI 元素，卧槽： 我们得到了那个该死的东西！ 如果不是我们想要的元素，事件可以忽略**


## 事件委托的优点

1.  不必给每个子元素都添加事件监听器,通过事件对象的target目标属性来确定触发事件的子元素,这样做大大提高了性能,内存占用就会减少
2.  无需从已删除的元素中解绑监听器, 也不必要将处理监听器添加到每一个创建的新元素上


## Element.matches API

面试官思考了一下说: 有点东西但不多, 你难道要为不同的元素编写不同的条件筛选逻辑去查找代码么? 嗯? look at my eyes!

通过使用**Element.matches API** 我们可以查看该元素是否匹配我们指定的CSS选择器

    document.getElementById("myDiv").addEventListener("click",function(e) {
   	// e.target was the clicked element
      if (e.target && e.target.matches("a.classA")) {
        console.log("Anchor element clicked!");
   	}
    });


**Element.matches API 的基本使用**

语法:

    元素.matches(选择器)

例子:

      <div class="box" id="test" data-id="100">我是盒子</div>


    const div = document.querySelector('.box')
    div.matches('.box')        // true
    div.matches('#test')       // true
    div.matches('div')         // true
    div.matches('[data-id="100"]') // true
    div.matches('.red')        // false


    三、支持哪些选择器？
    
    所有 CSS 选择器都支持：
    1.  类 .box
    2.  ID #header
    3.  标签 div
    4.  属性 [disabled]、[data-type]
    5.  伪类 :first-child、:not()、:hover（不生效）
    6.  组合选择器 div.item.active
    
    四、注意点:
    
    1.  只判断自己，不判断子元素matches 只看当前元素本身，不看里面的子元素。
    2.  参数必须是合法选择器写错会直接报错。
    3.  没有兼容性问题所有现代浏览器 + IE9+ 都支持。


    五、和 closest () 的区别（高频面试）
    
    1.  matches()：判断自己是否匹配选择器
    2.  closest()：从自己向上找父元素，返回匹配的最近元素

    e.target.matches('.item')    // 自己是不是？
    e.target.closest('.item')    // 自己或爸爸有没有？
