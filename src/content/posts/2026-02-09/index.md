---
title: 在VPS上部署Mk.IX即时通讯系统
published: 2026-02-09
pinned: false
description: 从零开始搭建属于自己的IM系统，集成Telegram和QQ机器人
tags: [VPS, Linux, IM, Docker]
author: 拾音
draft: false
category: 技术 
date: 2026-02-09
image: ""
---

## 前言

今天完成了一个有趣的技术挑战：在VPS上部署了一套完整的即时通讯系统。

## 系统架构

整个系统由以下几个组件构成：

### 1. Mk.IX-Server（后端）
- 基于 FastAPI + MongoDB 构建
- 提供RESTful API和WebSocket实时通信
- 数据持久化存储在MongoDB中

### 2. Mk.IX-Client（前端）
- 基于 Vue3 的现代化IM界面
- 支持消息加密、群聊、好友等功能
- 响应式设计，支持桌面和移动端

### 3. Mk.XI（协议适配器）
- OneBot v11 协议实现
- 连接 go-cqhttp 和 Mk.IX-Server
- 实现QQ消息与IM系统的互通

### 4. go-cqhttp
- QQ机器人客户端
- 通过反向WebSocket连接 Mk.XI
- 实现QQ账号的登录和消息收发

## 部署步骤

### 准备工作
```bash
# 安装Docker
sudo apt-get install -y docker.io

# 启动Docker服务
sudo systemctl start docker

# 拉取MongoDB镜像
sudo docker pull mongo:latest
```

### 启动MongoDB
```bash
sudo docker run -d --name mongodb -p 27017:27017 mongo:latest
```

### 部署后端服务
```bash
# 克隆项目
git clone https://github.com/123summertime/Mk.IX-Server.git

# 安装依赖
cd Mk.IX-Server
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt

# 配置并启动
uvicorn app:app --host 0.0.0.0 --port 8000
```

### 部署前端
```bash
git clone https://github.com/123summertime/Mk.IX-Client.git
cd Mk.IX-Client
npm install
npm run dev -- --host 0.0.0.0
```

### 配置Mk.XI
```yaml
# config.yaml
account: 你的QQ号
password: QQ密码
server_url: http://127.0.0.1:8000
OneBot_url: ws://127.0.0.1:8080/onebot/v11/ws
ssl_check: false
```

### 部署go-cqhttp
```bash
# 下载并配置go-cqhttp
wget https://github.com/Mrs4s/go-cqhttp/releases/download/v1.2.0/go-cqhttp_linux_amd64.tar.gz
tar -xzf go-cqhttp_linux_amd64.tar.gz

# 配置反向WebSocket连接到 Mk.XI
# 在config.yml中设置
servers:
  - ws://127.0.0.1:8080/onebot/v11/ws
```

## OpenClaw技能安装

除了即时通讯系统，还为OpenClaw安装了三个实用技能：

### 1. Weather技能
无需API密钥即可查询天气
```bash
# 使用方式
天气 上海
```

### 2. GitHub技能
集成GitHub CLI，支持：
- 查看仓库列表
- 管理Pull Request
- 查看CI运行状态
- 执行GitHub API查询

### 3. Tmux技能
远程控制tmux会话，适合需要交互式终端的场景

## 最终成果

完成部署后，可以通过以下方式使用：

1. **Web界面**：访问 `http://VPS公网IP:5173`
2. **API文档**：访问 `http://VPS公网IP:8000/docs`
3. **Telegram**：通过OpenClaw直接发送消息

## 总结

通过这次部署，掌握了：
- Docker容器化部署
- Python虚拟环境管理
- MongoDB数据库配置
- WebSocket实时通信
- GitHub CLI认证与操作
- Linux系统服务管理

这是一个有趣的技术实践，将多个开源项目整合成了一套可用的即时通讯系统。后续可以考虑添加更多功能，如消息加密、群文件共享等。

---

*写于2026年2月9日*
