---
title: Promise,Pending,Fetch API
published: 2026-03-05
description: ''
image: ''
tags: ['JavaScript','Promise']
category: 'JavaScript'
draft: false 
lang: ''
---

# Promise 是一个表示“异步操作最终完成或失败”的对象。是的,它就是一个对象

它让异步代码更线性、更可读、更易管理.

Promise对象上的构造函数参数:
| 参数 | 类型 | 作用 | 传递值 |
|------|------|------|------|
| `executor` | Function | 执行器函数，立即执行 | 无 |
| `resolve` | Function | 标记 Promise 为“成功”，传入成功值 | 任意值（字符串、对象、甚至Promise）|
| `reject` | Function | 标记 Promise 为“失败”，传入失败原因（通常为 Error） | Error对象或字符串 |

当我们通过使用 **new Promise() 构造函数** 创建一个Promise时:

    const myPromise = new Promise((resolve, reject)=> {
      const ifSuccess = true;
      if (ifSuccess) {
        resolve("操作成功");
       } else {
        reject("操作失败");
       }
    })

相当于调用Promise构造函数,传入一个回调函数(executor执行器函数),
**这个executor函数会自动接受两个参数 'reslove'函数 和 'reject'函数**

那通过执行回调函数中的逻辑,myPromise对象就会有三种状态:
| 状态 | 说明 | 是否可变 |
|------|------|--------|
| pending（进行中） | 初始状态，既未成功也未失败 | → 可变 |
| fulfilled（已成功） | 操作成功完成 | ✅ 不可再变 |
| rejected（已失败） | 操作失败 | ✅ 不可再变 |

一般我们会通过Promise的实例方法去判断和处理 像myPromise这样的Promise对象

1.  **.then(onFulfilled,onRejected)**

    **参数:**
    onFulfilled: 成功时的回调（接收 resolve 的值）
    onRejected: 失败时的回调（接收 reject 的值，可选）

    **返回值: 一个新的Promise对象**

        并且　.then()　方法支持链式调用：

        myPromise.then((value)=>{
        console.log(value) //输出 "操作成功"
        })

## 这个value值是什么? 它相当于Promise对象构造函数参数中的函数的返回值, 如 resolve 返回成功值, reject 返回失败值 , 这些*成功值*或*失败值* 我们这里统一为*状态值*，例如我们可以更改返回的状态值：

    const myPromise = new Promise((resolve, reject) => {
    const success = false;
    const stateMessage1 = {
    status: "200",
    msg: "发送请求成功",
    };

    const stateMessage2 = {
    status: "404",
    msg: "发送请求失败, 无法找到目标请求资源",
    };
    if (success) {
    resolve(stateMessage1);
    } else {
    reject(stateMessage2);
    }
    });

    myPromise.then(
    (value) => {
    console.log(value);// isSuccess == true 输出 :{ status: '200', msg: '发送请求成功 }
    },
    (error) => {
    console.log(error);// isSuccess == false 输出 :{ status: '404', msg: '发送请求失败, 无法找到目标请求资源' }
    },
    );

上面的例子中, 如果我们将ifSuccess 的值设为false, 除了使用 **.catch(onRejected)** 实例方法进行捕获外, 还可以通过 **.then(null | () => null , onRejected)** 来进行捕获

2.  **.catch(onRejected)**

    **参数:**
    onRejected: 失败时的回调
    **相当于.then(null,onRejected)**,但可以捕获前面所有的.then 的错误, 所以我们不会经常使用.then的失败回调去获取错误，这样效率很低．

3.  **.finally(onFinally)**

    **参数:** onFinally 回调函数(可选)

    作用:无论失败还是成功都会执行, 常用于日志输出和清理

4.  **Promise 链（Chaining）与返回值:**

    fetch('/api/user')
    .then(response => response.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(postsResponse => postsResponse.json())
    .then(posts => console.log(posts))
    .catch(error => console.error("请求失败:", error));

---

## 返回值规则

| 在 `.then` 中 return...          | 下一个 `.then` 接收到...      |
| -------------------------------- | ----------------------------- |
| 一个普通值（如 `42`）            | `42`                          |
| 一个 Promise                     | 该 Promise 的结果（自动展开） |
| 不 return（或 return undefined） | `undefined`                   |
| throw Error                      | 触发下一个 `.catch`           |

---

5. **Promise 中的一些静态方法**

| 方法                           | 作用                                    |
| ------------------------------ | --------------------------------------- |
| `Promise.resolve(value)`       | 创建一个 resolved 状态的 Promise        |
| `Promise.reject(reason)`       | 创建一个 rejected 状态的 Promise        |
| `Promise.all(iterable)`        | 所有 Promise 成功才成功，任一失败则失败 |
| `Promise.race(iterable)`       | 返回第一个 settled 的 Promise 结果      |
| `Promise.allSettled(iterable)` | 等待所有完成，返回每个的结果（含状态）  |
