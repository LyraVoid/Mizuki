---
title: 服务崩了？不知道啥时候崩的？Uptime Kuma监控服务运行状态
published: 2025-12-28
pinned: false
description: 本文将介绍如何通过 Docker Compose 快速部署 Uptime Kuma，让你能够轻松搭建自己的监控系统

tags: [Docker]
category: '教程'
draft: false
date: 2025-12-28
image: "./assets/uptime-kuma-install-cover.png"
---

# 前言

:::note

在管理网站和服务器时，确保服务的稳定性非常重要。Uptime Kuma 是一款开源的监控工具，可以帮助你实时监测网站或服务的状态，并在发生故障时及时通知。它支持多种监控方式（如 HTTP、Ping、TCP 等），且操作简单，适合个人或团队自托管使用。

:::

效果见本站：[服务详情](https://status.olinl.com/)

# 部署

GitHub仓库地址：

::github{repo="louislam/uptime-kuma"}

Docker-Compose.yaml文件

```yaml
services:
  uptime-kuma:
    image: louislam/uptime-kuma:2
    container_name: uptime-kuma
    volumes:
      - ./data:/app/data
    ports:
      - 3001:3001
    restart: always  
    networks:
      - app-net
networks:
  app-net:
    external: true
```

