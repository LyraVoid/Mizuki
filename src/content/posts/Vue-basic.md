---
title: Vue基础知识和核心原理
published: 2026-04-03
description: ''
image: ''
tags: []
category: 'Vue'
draft: false 
lang: ''
---

# 使用一个TodoList小案例,帮助复习Vue相关的知识:

      <script setup lang="ts">
      import { ref } from "vue";
      
      //定义物品清单类型接口
      interface Todo {
          id: number;
          content: string;
          completed: boolean;
      }
      
      //任务内容
      const todo = ref("");
      const todos = ref<Todo[]>([]);
      
      //添加任务
      
      function addTodo() {
          const value = todo.value.trim();
      
          if (!value) return;
      
          todos.value.push({
              id: Date.now(),
              content: value,
              completed: false,
          });
      
          todo.value = "";
      }
      
      //切换任务状态
      
      function handleChange(id: number) {
          //查找点击的todo
          // find 必须返回boolean 值
          const item = todos.value.find((todo) => {
              return todo.id === id;
          });
      
          if (item) {
              item.completed = !item.completed;
          }
      
          console.log(todos.value);
      }
      </script>
      
      <template>
          <div class="todoApp">
              <div>
                  <h1>Todolist</h1>
      
                  <label>
                      <input type="text" v-model="todo" />
                      <button @click="addTodo()">添加任务</button>
                  </label>
              </div>
      
              <div>
                  <div>
                      <h2>待办清单</h2>
                      <ul>
                          <li v-for="todo in todos" :key="todo.id">
                              <span :class="{ completed: todo.completed }">{{
                                  todo.content
                              }}</span>
                              <input
                                  type="checkbox"
                                  :checked="todo.completed"
                                  @change="handleChange(todo.id)"
                              />
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </template>
      
      <style lang="css" scoped>
      .completed {
          text-decoration: line-through;
      }
      
      .todoApp {
          width: 200px;
          height: 200px;
          margin: 100px auto;
          text-align: center;
      }
      button {
          margin-top: 10px;
      }
      </style>


# Vue的响应式基础

## Vue 如何做到：数据变 → 视图自动更新？

Vue3响应式 = Proxy + 依赖收集 + 触发更新

## 收集依赖 = 记录什么数据使用了我
## 触发更新 = 我的状态变了，通知使用我的个体重新变动

## 简单总结
1.  **收集依赖（track）**：读取数据时，记录**哪些函数依赖这个数据。**
2.  **触发更新（trigger）**：修改数据时，执行 **所有依赖这个数据的函数**
3.  Vue 响应式本质：**数据变 → 视图自动更新**。


## 1.什么是响应式

- 当数据变化时，**依赖该数据的代码自动重新执行**

大白话来说就是:

- 你改 count.value++
- 视图 {{ count }} 自动变
- 不需要手动操作 DOM

这TM才叫响应式

## 2.ref-把基本类型变为响应式

- ref() 接收一个值，**返回一个响应式对象**
- 有一个 .value 属性
- 适用于：**string / number / boolean / null / undefined**

### 核心原理

ref 内部就是一个对象，包含：

- value 属性
- 用 get/set 拦截读写
- **读取时收集依赖**
- **修改时触发更新**

## reactive —— 把对象 / 数组变成响应式

- 接收对象 / 数组，返回代理对象（Proxy）
- 不需要 .value
- 是深度响应式（对象内部变化都能监听到）

### 核心原理

- 底层：ES6 Proxy
- 拦截：get（读）、set（改）、deleteProperty（删）
- 读 → 收集依赖
- 改 / 删 → 触发更新

## 我们只用reactive行不行, 为什么还要有ref?

- reactive 只对**对象 / 数组**生效
- 基本类型**不是对象**，无法被 Proxy 代理
- 所以 Vue 用 ref 把基本类型**包装成对象**，再用 get/set 监听

**就寄吧一句话:**

**ref = 给基本类型用的响应式**

**reactive = 给对象 / 数组用的响应式**


## 官方重点：Proxy 是浅代理还是深代理？

官方：**reactive 是深度响应式**

内部会**递归把所有子对象也变成 Proxy**

所以嵌套对象修改也能触发更新。

## 官方重要限制:reactive不能直接赋值

    let state = reactive({ count: 1 })
    state = reactive({ count: 2 }) // 丢失响应式！

原因: 
**reactive 返回的是新代理对象，直接赋值会丢掉原来的代理。**

解决方案:
1.  不要直接替换整个对象
2.  要么修改内部属性
3.  要么用ref({...})


## 7. 依赖收集 & 触发更新（Vue 响应式灵魂）

1.  **读取数据时 → 收集依赖（track）**
记录：谁用到了这个数据（组件 / 渲染函数 /computed/watch）

2.  **修改数据时 → 触发更新（trigger）**
通知所有依赖重新执行(**依赖:使用数据的组件 / 渲染函数 /computed/watch**)

## 总结-Vue响应式原理

1.  底层使用Proxy代理实现响应式, 拦截对象的 get(),set(),delete() 等操作
2.  读取数据时,调用track,收集使用该数据的依赖, 比如组件, 渲染函数, watch,computed API
3.  修改数据时,触发trigger 执行所有依赖, 通知所有使用该数据的依赖进行更新

4. ref只针对基本类型,内部使用**class存取器**实现, 通过.value 访问.
5. reactive 针对对象,递归代理,实现深度响应式
