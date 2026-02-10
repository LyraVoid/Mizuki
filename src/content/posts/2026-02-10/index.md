---
title: NapCat Docker + NoneBot 部署历险记
published: 2026-02-10
pinned: false
description: 从反复扫码到最终成功，NapCat Docker 与 NoneBot 完整配置指南
tags: [NapCat, NoneBot, Docker, QQ机器人, WebSocket]
author: 拾音
draft: false
category: 技术
date: 2026-02-10
image: ""
---

## 前言

经过一天的艰苦奋斗，终于在下班前成功让 **NapCat Docker** + **NoneBot** 跑通了！这篇文章记录了遇到的坑和最终解决方案。

## 背景

目标：在 VPS 上部署完整的 QQ 机器人系统
- **NapCat Docker**: QQ 协议客户端
- **NoneBot**: Python 机器人框架
- 需要通过 WebSocket 实现两者互联

## 遇到的坑

### 坑一：配置格式冲突

最初同时存在两种配置格式：
- `.env.prod` (dotenv)
- `pyproject.toml` (pyproject)

**症状**: NoneBot 启动后适配器注册失败

**解决**: 统一使用 `.env.prod` 格式

### 坑二：WebSocket 服务不启动

NapCat Docker 镜像配置了 WebSocket 但服务显示 **"未启动"**

**症状**:
```
WebSocket服务: 0.0.0.0:3001, : 未启动
```

**原因**: `mlikiowa/napcat-docker` 镜像需要使用 `MODE=ws` 环境变量来启用正向 WebSocket 服务

**解决**: 启动时添加环境变量
```bash
docker run -d \
  --network host \
  --name napcat \
  -e MODE=ws \
  -e NAPCAT_UID=1000 \
  -e NAPCAT_GID=1000 \
  -e WEBUI_TOKEN=your_token \
  mlikiowa/napcat-docker:latest
```

### 坑三：登录态丢失

每次重启容器后都需要重新扫码登录

**原因**: Docker 容器重启后 QQ 登录态丢失

**解决方案**:
1. 使用 `-q` 参数尝试快速登录（但发现不生效）
2. 最终方案：登录后**不再重启容器**
3. 固化配置文件路径到宿主机

### 坑四：NoneBot 连接被拒绝

WebSocket 连接返回 403 Forbidden

**原因**: NapCat Docker 镜像使用的是 `ws.json` 模板，配置正确但服务未启用

**解决**: 使用正确的模板配置
```bash
# 启动时指定 MODE
docker run -e MODE=ws ...
```

### 坑五：Docker 网络隔离

宿主机上的 NoneBot 无法连接 Docker 内的 NapCat

**症状**: 连接超时或被拒绝

**解决**: 使用 `--network host` 模式
```bash
docker run --network host ...
```

## 最终配置

### NapCat Docker 启动命令

```bash
sudo docker run -d \
  --network host \
  --name napcat \
  --restart=always \
  -e MODE=ws \
  -e NAPCAT_UID=1000 \
  -e NAPCAT_GID=1000 \
  -e WEBUI_TOKEN=ec81eb5539f5 \
  mlikiowa/napcat-docker:latest
```

### NoneBot 配置 (.env.prod)

```bash
DRIVER=~fastapi+~websockets
SUPERUSERS=["1466102526"]
NICKNAME=["机器人"]
COMMAND_START=["/"]
ONEBOT_V11_WS_URLS=["ws://127.0.0.1:3001/onebot/v11/ws"]
```

### NoneBot 代码 (main.py)

```python
import nonebot
from nonebot.adapters.onebot.v11 import Adapter

nonebot.init()
driver = nonebot.get_driver()
driver.register_adapter(Adapter)

nonebot.load_plugins("plugins")
```

## 验证步骤

### 1. 检查 NapCat WebSocket 是否启动

```bash
docker logs napcat | grep -E "WebSocket|3001"
```

成功输出:
```
WebSocket服务: 0.0.0.0:3001, : 已启动
[OneBot] [WebSocket Server] Server Started :::3001
```

### 2. 测试 WebSocket 连接

```python
import asyncio
import websockets

async def test():
    async with websockets.connect('ws://127.0.0.1:3001/onebot/v11/ws') as ws:
        print('✅ Connected!')
        msg = await ws.recv()
        print('Received:', msg)

asyncio.run(test())
```

### 3. 发送测试消息

```python
import asyncio
import websockets
import json

async def send_test():
    async with websockets.connect('ws://127.0.0.1:3001/onebot/v11/ws') as ws:
        await ws.send(json.dumps({
            "action": "send_private_msg",
            "params": {
                "user_id": 703764479,
                "message": [{"type": "text", "data": {"text": "测试消息"}}]
            }
        }))
        print('✅ Message sent!')

asyncio.run(send_test())
```

## 关键配置文件模板

### NapCat Docker ws.json 模板

```json
{
  "network": {
    "websocketServers": [
      {
        "enable": true,
        "name": "ws",
        "host": "0.0.0.0",
        "port": 3001,
        "reportSelfMessage": false,
        "enableForcePushEvent": true,
        "messagePostFormat": "array",
        "token": "",
        "debug": false,
        "heartInterval": 30000
      }
    ],
    "websocketClients": []
  }
}
```

## 重要发现

1. **Docker 镜像限制**: `mlikiowa/napcat-docker` 镜像需要 `MODE=ws` 才会启动正向 WebSocket 服务

2. **快速登录**: 使用 `-q` 参数尝试快速登录，但实测不生效，需要扫码

3. **网络模式**: 必须使用 `--network host` 才能让宿主机连接容器内的服务

4. **配置文件**: NapCat Docker 使用 `/app/templates/` 下的模板文件，通过 `MODE` 环境变量选择

## 总结

 NapCat Docker + NoneBot 部署成功 ✓

- ✓ NapCat WebSocket 服务启动 (端口 3001)
- ✓ NoneBot 连接成功
- ✓ 消息收发测试通过

**经验教训**:
1. 先看文档再动手，特别是 Docker 镜像的启动参数
2. 配置格式要统一，不要混用
3. 网络模式选择 host 模式最简单
4. 登录后尽量不重启容器

## 参考资料

- [NapCat-Docker GitHub](https://github.com/NapNeko/NapCat-Docker)
- [NoneBot 官方文档](https://nonebot.dev/docs/)
- [OneBot v11 协议](https://onebot.adapters.nonebot.dev/)

---

*写于2026年2月10日*
