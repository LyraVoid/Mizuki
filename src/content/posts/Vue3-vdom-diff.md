---
title: Vue3-vdom-diff
published: 2026-04-08
description: ''
image: ''
tags: []
category: ''
draft: false 
lang: ''
---

# 什么是虚拟DOM

## 虚拟 DOM（Virtual DOM，简称 VNode）是一份用 纯 JS 对象 描述真实 DOM 结构的轻量树状结构。

虚拟DOM会通过JS生成一个AST节点树,通过JS对象描述DOM对象,它不是真实DOM. 一个VNODE树就相当于一个文档页面的工程图纸,描述文档树真实结构.

## 虚拟DOM的核心作用

### 1.直接操纵真实DOM成本高, 风险大

- 一个空 div 就自带 几百个属性、方法。频繁创建、修改、删除真实 **DOM 非常慢、非常耗性能**。
- JS 执行极快,用 JS 计算对比 → 只在最后一步操作真实 DOM。
- 跨平台,虚拟 DOM 不依赖浏览器环境可渲染到：小程序、Web、iOS、Android、桌面端……

### 核心作用总结:
1.  减少真实 DOM 操作次数
2.  提升渲染性能
3.  实现跨平台渲染
4.  为 Diff 算法提供对比基础

## 虚拟 DOM 底层原理（Vue 3）

1.  模板 <template> → 编译 → render 函数
2. render 执行 → 生成 VNode 树（虚拟 DOM）
3. patch 函数 对比新旧 VNode
4. 只把变化的部分更新到真实 DOM

# 如何实现虚拟DOM

    // 1. 创建虚拟节点
    function h(type, props, children) {
      return { type, props, children }
    }
    
    // 2. 虚拟 DOM 转真实 DOM
    function createDOM(vnode) {
      const el = document.createElement(vnode.type)
      // 处理属性
      for (const key in vnode.props) el.setAttribute(key, vnode.props[key])
      // 处理子节点
      if (vnode.children) {
        vnode.children.forEach(child => {
          el.appendChild(createDOM(child))
        })
      }
      return el
    }
    
    // 3. 对比更新（Diff 核心）
    function patch(oldVNode, newVNode) {}

# Vue3核心diff算法及原理

## Vue 3 Diff 算法 = 高效对比两个列表（新旧子节点 VNode 数组），最小化操作真实 DOM 的算法。

它只做一件事：给我旧列表、新列表 → 我告诉你：哪些要删、哪些要增、哪些要移动、哪些不动。

Vue 3 Diff 比 Vue 2 快的核心：
**1. 双端对比（头尾指针）**
- 预处理前置节点
- 预处理后置节点
- 处理仅有新增节点
- 处理仅有卸载节点
**2. 最长递增子序列（LIS）优化移动次数**

# diff 算法五大核心流程:
B站视频: https://www.bilibili.com/video/BV1Xp4y1V7TP/?spm_id_from=333.337.search-card.all.click&vd_source=232e698751d76c87f7eb39328cddd6fa

1. 预处理新旧前置节点对比,如果相同则patch函数更新,如果不同,则直接break
2. 预处理新旧后置节点对比,如果相同则patch函数更新,如果不同,则直接break
3. 有新增节点情况, 当 指针i 在DOM唯一索引值范围 e1 < i <= e2
时, 表明此时有新增节点, 则直接挂载新增节点
4.  有卸载节点情况, 当 指针i 在DOM唯一索引值范围 e2 < i <= e1时, 表明此时有新增节点, 则直接挂载新增节点
(e1:旧节点树唯一索引值,e2:新节点唯一索引值)

# v-for 和 Diff 算法的关系（官方强制规则）

## 1. v-for 必须写 key
key 是 Diff 算法识别节点的唯一标识。

没有 key：
Diff 无法识别谁是谁
只能原地复用节点
复选框、输入框状态错乱
性能极差

有 key：
Diff 精准识别节点
DOM 可复用、可移动
状态不会乱
性能提升 10～100 倍

## 2. 官方严禁：index 作为 key
index 会随顺序变化而变化，不是稳定 ID。Diff 会完全失效，等于没有 key。
