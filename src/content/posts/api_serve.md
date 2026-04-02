---
title: 'Some thoughts on building a complete personal blog API service using Node.js, MongoDB, and Mongoose ODM.'
published: 2026-01-19
description: ''
image: ''
tags: ['api','serve','blog','nodejs']
category: 'Technology'
draft: false 
lang: ''
---


># 一个重要的问题：什么是API?
>官方定义(MDN+IETF):
>##  API（Application Programming Interface，应用程序编程接口） 是一组预定义的函数、协议和工>具，用于构建软件应用。它规定了不同软件组件之间如何通信。
>
>在Web开发语境下,Web API特指的是:
>## 通过 HTTP/HTTPS 协议暴露的接口，允许客户端（如浏览器、移动 App）与服务器交换数据。
>
>"可以这么说,API就像一个餐厅的服务员, 用户通过菜单提交自己想要的菜品在餐馆(客户端),服务员接到目标
>用户的菜单后,就会去后厨(服务器后台)拿出数据,提供给目标用户"

---
># API的基本格式,缺一不可:
>### 请求格式（URL、方法、参数、Header、Body）
>### 响应格式（状态码、数据结构、错误信息）
>### 行为语义（如 POST /users 表示“创建用户”）
---


---
># 使用API能够解决的问题是什么?
>### 前后端分离, API服务多端(Web,App,小程序), 每个模块微服务化独立部署维护,开放的生态发展>

>个人开发WebApi使用的架构,最多是Restful Api
># (通义ai总结)API的架构风格: 
| 风格 | 适用场景 | 代表技术 |
|------|--------|--------|
| REST | 资源操作（CRUD）、Web 应用 | Express, Fastify, Hono, Nuxt Nitro |
| GraphQL | 复杂查询、减少请求次数 | Apollo Server, Yoga |
| gRPC | 内部微服务、高性能 | Protocol Buffers + gRPC-Node |
| WebSocket | 实时通信（聊天、股票） | Socket.IO, uWebSockets |
---


---
# 个人的Web Api项目分享

1.这是一个我使用nodejs,mongodb,及monogoose(ODM)制作的用于个人博客项目的api:[MongoApiServe](https://github.com/makursi/MongoApiServe)

它的主要功能是提供了用户认证,文章管理,文件上传
关键重要的技术栈:nodejs,express,jwt(json web token),mogonoose,bcrtpt(密码加密)

# 开始制作webapi,迅速开干

### 1.在任意文件夹下,使用git init命令
使用任何你喜爱的包管理工具下载: express,jwt,bcrypt,cors,dotenv等工具
(使用TypeScript额外下载typescipt包)

### 2.选择数据库
个人认为简单解决curd操作的问题,以及进行简单的文件转发可以使用所有的数据库,无论关系性,或非关系型
推荐使用:mysql,postgresql,mongodb,sqlite等数据库

个人项目中使用mongodb数据库以及它的ODM:mongoose去进行数据模型的初始化和数据库的连接的操作
---
### 3.新建相关文件夹
新建serve主要文件,数据库文件夹,用户模型文件夹,路由routes文件夹,.env(处理环境变量),以及对于路由处理的抽象,也就是controller(handler)文件夹,新建中间件文件夹(auth)

>1. 首先要配置数据库,启动本地数据库的服务,然后将本地数据库的地址存储到.env环境变量中使用,之后再自定义模块中简单连接数据库

>2. 定义用户数据模型,user, posts等，在关系型数据库中使用数据库自己的workbench去创建表,创建字段,定义字段类型,以及创建primary index.<br>
>非关系型数据库使用ODM在本地项目中创建用户模型等, 定义它们的字段和类型

>3. 通过使用express等web开发框架,在serve文件中定义app, 在router文件夹中定义router对象并导出到app中使用

>4. 定义中间件(milldeware),并在controller中使用

# 在搭建整体的项目框架后就可保证后续开发的可维护性,和有序性,但会大大减少项目的透明度,对于抽象层工具的使用会更加方便但不知道其底层的运行逻辑,增大工具框架的学习成本.<br>
# 建议个人一定一定要熟悉自身的技术栈可实现的功能,对于问题进行步骤拆解,一步步使用工具解决问题
